# Campus Connect API

Campus Connect is a platform designed to streamline communication and collaboration between students, professors, and administrators in an academic environment. This API serves as the backend for the Campus Connect application.

## Features Implemented

### Authentication
- User registration and login functionality.
- JWT-based authentication for secure access to protected routes.
- Middleware to protect routes and verify user roles.

### User Roles
- Support for different user roles: `student`, `professor`, and `admin`.

### Courses
- CRUD operations for courses.
- Students can enroll in courses.
- Professors can create and manage courses.

### Assignments
- Professors can create assignments for their courses.
- Students can view assignments for the courses they are enrolled in.

### API Documentation
- OpenAPI specification available in `openapi.yaml`.

## Project Structure
```
LICENSE
campusconnect-api/
  openapi.yaml
  package.json
  README.md
  src/
    app.js
    server.js
    config/
      db.js
    controllers/
      assignment.controller.js
      auth.controller.js
      course.controller.js
    middleware/
      auth.middleware.js
    models/
      Assignment.js
      Course.js
      User.js
    routes/
      assignment.routes.js
      auth.routes.js
      course.routes.js
  tests/
    auth.test.js
    course.test.js
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd campusconnect-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory (a template is provided in `.env.example`).
   These variables are validated at startup using [envalid](https://github.com/af/envalid):
   ```env
   NODE_ENV=development
   PORT=3000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Testing

Run the test suite using:
```bash
npm test
```

## API Endpoints

All endpoints are versioned. The current default version is available under the `/api/v1` prefix (the legacy `/api` prefix is kept as an alias for backward compatibility).

### Authentication
- `POST /api/v1/auth/register` - Register a new user.
- `POST /api/v1/auth/login` - Login and receive a JWT.

### Courses
- `GET /api/v1/courses` - Get all courses.
- `POST /api/v1/courses` - Create a new course (professors only).
- `PUT /api/v1/courses/:id` - Update a course (professors only).
- `DELETE /api/v1/courses/:id` - Delete a course (professors only).

### Assignments
- `GET /api/v1/courses/:courseId/assignments` - Get all assignments for a course.
- `POST /api/v1/courses/:courseId/assignments` - Create a new assignment (professors only).

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push to your branch.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

GitHub Copilot: Of course. Here's a step-by-step explanation of the repository in simple terms:

### How the Repository Works: A Step-by-Step Guide

1.  **Starting the Application (`server.js`)**:
    *   The application starts by running the server.js file.
    *   This file connects to the MongoDB database and starts the web server, making the API accessible.

2.  **Handling Requests (`app.js`)**:
    *   When a request comes in (e.g., from a web browser or mobile app), it first hits the app.js file.
    *   This file sets up the basic configuration, including security measures like rate limiting and sanitization to prevent common attacks.

3.  **Routing (`routes/`)**:
    *   The request is then passed to the appropriate route handler based on the URL.
    *   For example, a request to `/api/v1/auth/login` is handled by auth.routes.js, while a request to `/api/v1/courses` is handled by course.routes.js.

4.  **Controllers (`controllers/`)**:
    *   The route handler then calls a specific function in the corresponding controller file.
    *   The controller contains the main logic for the request. For example, the auth.controller.js has functions for user registration and login.

5.  **Models (`models/`)**:
    *   The controller interacts with the database through Mongoose models.
    *   These models define the structure of the data (e.g., what a `User` or `Course` looks like) and provide methods to create, read, update, and delete records.

6.  **Middleware (`middleware/`)**:
    *   Middleware functions are like checkpoints that a request passes through before reaching the controller.
    *   For example, the auth.middleware.js checks if a user is logged in before allowing them to access protected routes.

7.  **Sending a Response**:
    *   Once the controller has processed the request, it sends a response back to the client.
    *   This response can be data (e.g., a list of courses) or a confirmation message (e.g., "User registered successfully").

### Key Points

*   **Technology Stack**: The project is built with Node.js, Express (a web framework for Node.js), and MongoDB (a NoSQL database).
*   **Architecture**: It follows a standard RESTful API architecture, which is a common and effective way to build web services.
*   **Modularity**: The code is well-organized into separate folders for routes, controllers, and models, making it easy to understand and maintain.
*   **Security**: Basic security features are implemented, including authentication, rate limiting, and input sanitization.
*   **Testing**: The project includes a suite of tests to ensure that the API works as expected.

### Major Features Implemented So Far

*   **User Authentication**:
    *   Users can register for a new account and log in.
    *   The API uses JSON Web Tokens (JWT) to secure endpoints, ensuring that only authenticated users can access certain features.
*   **Role-Based Access Control**:
    *   The system supports different user roles (`student`, `professor`, `admin`), which can be used to control access to specific features.
*   **Course Management**:
    *   Professors can create, update, and delete courses.
    *   Students can view and enroll in courses.
*   **Assignment Management**:
    *   Professors can create and manage assignments for their courses.
    *   Students can view the assignments for the courses they are enrolled in.
*   **API Documentation**:
    *   The openapi.yaml file provides a detailed specification of all API endpoints, making it easy for other developers to understand and use the API.
