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
- Professors can create, update, and delete assignments for their courses.
- Students can view assignments for the courses they are enrolled in.

### Submissions
- Students can submit (and update) work for an assignment, with optional file attachments (stored under `uploads/submissions/`).
- Professors can review submissions with a grade and/or feedback.

### Notifications
- Authenticated users can list their notifications and mark them as read.

### Analytics
- Enrollment and submission activity is recorded in an `ActivityLog` collection. A summary service/controller exists for admins and professors, but the analytics routes are **not mounted** on the HTTP app yet, so there is no public summary endpoint until that code fix lands.

### API Documentation
- OpenAPI specification available in `openapi.yaml`.

## Project Structure
```
campusconnect-api/
  .env.example
  openapi.yaml
  package.json
  README.md
  src/
    app.js
    server.js
    config/        # db, env (envalid), logger (winston), upload config
    controllers/   # analytics, assignment, auth, course, notification, submission, user
    middleware/    # auth, error, upload (multer), validation
    models/        # ActivityLog, Assignment, Course, Notification, Submission, User
    repositories/  # data access per resource
    routes/        # analytics, assignment, auth, course, notification, submission, user
    services/      # business logic per resource
    utils/         # appError, asyncHandler, constants
  tests/
    analytics.test.js
    auth.test.js
    course.test.js
    middleware.test.js
    submission.test.js
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pranjulya/campus-connect.git
   cd campus-connect/campusconnect-api
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
- `GET /api/v1/courses/:id` - Get a single course.
- `PUT /api/v1/courses/:id` - Update a course (professors only).
- `DELETE /api/v1/courses/:id` - Delete a course (professors only).
- `POST /api/v1/courses/:id/enroll` - Enroll in a course (students only).

### Assignments
- `GET /api/v1/courses/:courseId/assignments` - Get all assignments for a course.
- `POST /api/v1/courses/:courseId/assignments` - Create a new assignment (professors only).
- `GET /api/v1/courses/:courseId/assignments/:assignmentId` - Get a single assignment.
- `PUT /api/v1/courses/:courseId/assignments/:assignmentId` - Update an assignment (professors only).
- `DELETE /api/v1/courses/:courseId/assignments/:assignmentId` - Delete an assignment (professors only).

### Submissions
All submission routes require authentication.
- `GET /api/v1/courses/:courseId/assignments/:assignmentId/submissions` - List submissions for an assignment.
- `POST /api/v1/courses/:courseId/assignments/:assignmentId/submissions` - Submit work, with optional `attachments` files (students only).
- `GET /api/v1/courses/:courseId/assignments/:assignmentId/submissions/:submissionId` - Get a single submission.
- `PUT /api/v1/courses/:courseId/assignments/:assignmentId/submissions/:submissionId` - Update a submission (students only).
- `PATCH /api/v1/courses/:courseId/assignments/:assignmentId/submissions/:submissionId/review` - Grade and/or give feedback (professors only).

### Notifications
All notification routes require authentication.
- `GET /api/v1/notifications` - List the current user's notifications.
- `PATCH /api/v1/notifications/:notificationId/read` - Mark a notification as read.

### Users
- `GET /api/v1/users/me` - Get the current user's profile (authenticated).
- `GET /api/v1/users/me/courses` - Get the courses the current user is enrolled in (authenticated).

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push to your branch.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
