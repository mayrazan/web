const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const path = require('path');
const multer = require('multer');
const knexfile = require('../knexfile.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

const knexInstance = require('knex')(knexfile.development);

// Multer configuration
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const title = req.body.title;
    callback(
      null,
      title + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// create table
async function createMoviesTable() {
  const tableExists = await knexInstance.schema.hasTable('movies');

  if (!tableExists) {
    await knexInstance.schema.createTable('movies', (table) => {
      table.increments('id').primary();
      table.string('title');
      table.string('genre');
      table.integer('year');
      table.string('poster_image', 1000000);
      table.timestamps(true, true);
    });
    console.log('Movies table created!');
  } else {
    console.log('Movies table already exists!');
  }
}

createMoviesTable();

// Routes

// Get all movies
app.get('/api/movies', async (req, res) => {
  try {
    const result = await knexInstance.select('*').from('movies');
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get movie by id
app.get('/api/movies/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await knexInstance.select('*').from('movies').where({ id });
    if (result.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add movie
app.post('/api/movies', upload.single('posterImage'), async (req, res) => {
  const { title, genre, year } = req.body;
  const requiredFields = { title, genre, year };

  for (const [key, value] of Object.entries(requiredFields)) {
    if (value === undefined || value === '') {
      return res.status(400).json({ error: `${key} is required` });
    }
  }

  const posterImagePath = req.file ? req.file.path : null;

  try {
    const result = await knexInstance
      .insert({
        title,
        genre,
        year,
        poster_image: posterImagePath,
      })
      .into('movies')
      .returning('*');
    res.status(201).json(result[0]); // Access the first element of result directly
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete movie
app.delete('/api/movies/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await knexInstance.select('*').from('movies').where({ id }).del();
    if (result.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
