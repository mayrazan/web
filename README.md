## Running the Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install the dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm run dev
   ```

## Running the Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install the dependencies:
   ```
   npm install
   ```
3. Start the application:
   ```
   npm start
   ```

### Create a `.env` file in both the backend and frontend directories:

1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Create the `.env` file:
   ```
   touch .env
   ```
3. Open the `.env` file and add your environment variables. Save and close the file.

4. Navigate to the frontend directory:
   ```
   cd ../frontend
   ```
5. Repeat steps 2 and 3.

#### For the backend, you need to set the following environment variables:

- `PORT`: This is the port where your backend server will run.
- `DB_USER`: This is the username for your database.
- `DB_PASSWORD`: This is the password for your database. Note that this must be a string.
- `DB_HOST`: This is the host of your database.
- `DB_PORT`: This is the port of your database.
- `DB_NAME`: This is the name of your database.
- `JWT_SECRET`: This is used to sign and verify JSON Web Tokens (JWTs) in your application
  _Note: use the following code on server.js to generate a key for your JWT_SECRET, then add to .env file_

  ```
  const crypto = require('crypto');
  const jwtSecret = crypto.randomBytes(32).toString('hex');
  console.log(jwtSecret); // Save this secret key
  ```

#### For the frontend, you need to set the following environment variable:

- `REACT_APP_API_URL`: Set this to `https://web-2xdz.onrender.com/api` or `http://localhost:3001/api`
- `REACT_APP_MANAGE_URL`: Set this to `https://web-2xdz.onrender.com/auth` or `http://localhost:3001/auth`

_Note: The backend is deployed on the above service. If you want to test running locally, replace the URL with your backend localhost. It would probably be `http://localhost:3001/api`._

The frontend is also deployed for testing. You can access it at the following link: [https://web-mayrazan.vercel.app/](https://web-mayrazan.vercel.app/)

You can consult my repository at [https://github.com/mayrazan/web](https://github.com/mayrazan/web).

**To run the backend locally, you'll need to have PostgreSQL installed on your machine. The configuration for the database is provided in the section for creating an `.env` file.**
