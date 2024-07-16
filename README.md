```markdown
# Health Check Monitoring Service

This project is a health check monitoring service built with Node.js, Express, and React.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/KUCHANGHEO/Health_Check_Project.git
   ```

2. Install backend dependencies:
   ```sh
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```sh
   cd ../client
   npm install
   ```

## Running the Application

1. Start the backend server:
   ```sh
   cd backend
   npm start
   ```

2. Start the frontend server:
   ```sh
   cd ../client
   npm start
   ```

## Configuration

Ensure you have a `.env` file in the `backend` directory with the following variables:
```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=your_database_name
```

## Docker

To run the application using Docker:

1. Build the Docker images:
   ```sh
   docker-compose build
   ```

2. Start the services:
   ```sh
   docker-compose up
   ```

## Contributing

Feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License.
```
