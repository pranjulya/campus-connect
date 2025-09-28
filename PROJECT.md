# Project Details

## Overview

This document provides a high-level overview of the Campus Connect project, including its goals, scope, and key features.

## Goals

- To create a centralized platform for communication and collaboration between students, professors, and administrators.
- To streamline academic processes such as course management, assignment submission, and grading.
- To provide a user-friendly and intuitive interface for all users.

## Scope

The project will include the following key features:

- User authentication and role-based access control.
- Course and assignment management.
- A notification system for important updates and deadlines.
- A submission system for assignments.

## Timeline

- **Phase 1 (In Progress):** Core features such as user authentication, course management, and assignment creation.
- **Phase 2 (Planned):** Assignment submission, grading, and a notification system.
- **Phase 3 (Future):** Analytics, reporting, and integration with other campus systems.

## Team

- **Project Manager:** [Pranjulya Bajpai]
- **Lead Developer:** [Pranjulya Bajpai]
- **Backend Developer:** [Pranjulya Bajpai]
- **Frontend Developer:** [N/A]
- **QA Engineer:** [N/A]
- **Database Administrator:** [N/A]


### How the Repository Works: A Step-by-Step Guide

1.  **Starting the Application (`server.js`)**:
    *   The application starts by running the server.js file.
    *   This file connects to the MongoDB database and starts the web server, making the API accessible.

2.  **Handling Requests (`app.js`)**:
    *   When a request comes in (e.g., from a web browser or mobile app), it first hits the app.js file.
    *   This file sets up the basic configuration, including security measures like rate limiting and sanitization to prevent common attacks.

3.  **Routing (`routes/`)**:
    *   The request is then passed to the appropriate route handler based on the URL.
    *   For example, a request to `/api/auth/login` is handled by auth.routes.js, while a request to `/api/courses` is handled by course.routes.js.

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