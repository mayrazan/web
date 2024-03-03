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

#### For the frontend, you need to set the following environment variable:

- `REACT_APP_API_URL`: Set this to `https://web-2xdz.onrender.com/api`

*Note: The backend is deployed on the above service. If you want to test running locally, replace the URL with your backend localhost. It would probably be `http://localhost:3001/api`.*


The frontend is also deployed for testing. You can access it at the following link: [https://web-mayrazan.vercel.app/](https://web-mayrazan.vercel.app/)

You can consult my repository at [https://github.com/mayrazan/web](https://github.com/mayrazan/web).


**To run the backend locally, you'll need to have PostgreSQL installed on your machine. The configuration for the database is provided in the section for creating an `.env` file.**
