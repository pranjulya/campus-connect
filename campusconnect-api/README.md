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

### Authentication
- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Login and receive a JWT.

### Courses
- `GET /api/courses` - Get all courses.
- `POST /api/courses` - Create a new course (professors only).
- `PUT /api/courses/:id` - Update a course (professors only).
- `DELETE /api/courses/:id` - Delete a course (professors only).

### Assignments
- `GET /api/assignments` - Get all assignments for a course.
- `POST /api/assignments` - Create a new assignment (professors only).

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push to your branch.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
