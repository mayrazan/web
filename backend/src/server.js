const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const crypto = require('crypto');

const knexfile = require('../knexfile.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const knexInstance = require('knex')(knexfile.development);

// Drop and create table
async function recreateMoviesTable() {
  const tableExists = await knexInstance.schema.hasTable('movies');

  if (tableExists) {
    // drop table if it exists
    await knexInstance.schema.dropTable('movies');
    console.log('Movies table dropped!');
  }

  // create table
  await knexInstance.schema.createTable('movies', (table) => {
    table.increments('id').primary();
    table.string('title');
    table.string('genre');
    table.integer('year');
    table.timestamps(true, true);
  });
  console.log('Movies table created!');
}

recreateMoviesTable();

async function recreateUsersTable() {
  const tableExists = await knexInstance.schema.hasTable('users');

  if (tableExists) {
    // drop table if it exists
    await knexInstance.schema.dropTable('users');
    console.log('Users table dropped!');
  }

  // create table
  await knexInstance.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
    table.timestamps(true, true);
  });
  console.log('Users table created!');
}

recreateUsersTable();

// Uncomment the following line to generate a new secret key and add to .env file
// const jwtSecret = crypto.randomBytes(32).toString('hex');
// console.log(jwtSecret); // Save this secret key

// Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token === null) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    // Check if the token has expired
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (user.exp < currentTimestamp) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = user;
    next();
  });
}

// Routes

// Get all movies
app.get('/api/movies', authenticateToken, async (req, res) => {
  try {
    const result = await knexInstance.select('*').from('movies');
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get movie by id
app.get('/api/movies/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await knexInstance.select('*').from('movies').where({ id });
    if (result.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(200).json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add movie
app.post('/api/movies', authenticateToken, async (req, res) => {
  const { title, genre, year } = req.body;
  const requiredFields = { title, genre, year };

  for (const [key, value] of Object.entries(requiredFields)) {
    if (value === undefined || value === '') {
      return res.status(400).json({ error: `${key} is required` });
    }
  }

  try {
    const result = await knexInstance
      .insert({
        title,
        genre,
        year,
      })
      .into('movies')
      .returning('*');
    res.status(201).json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete movie
app.delete('/api/movies/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await knexInstance
      .select('*')
      .from('movies')
      .where({ id })
      .del();
    if (result.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// register user
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await knexInstance('users').insert({ username, password: hashedPassword });
    res.status(201).send('User created');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// login user
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await knexInstance('users').where({ username }).first();
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(401).send('Invalid password');

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all users
app.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await knexInstance('users').select('*');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get user by id
app.get('/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await knexInstance('users').where({ id }).first();
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete user
app.delete('/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await knexInstance('users').where({ id }).first();
    if (user) {
      await knexInstance('users').where({ id }).del();
      res.send('User deleted successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
