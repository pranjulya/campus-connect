# Frontend Analysis for Campus Connect

## Backend Analysis for Frontend Design

Before diving into the frontend design and tech stack, let's thoroughly analyze the backend based on the codebase structure and features. This ensures the frontend integrates seamlessly with the API.

### Key Backend Features and API Endpoints
The backend is a RESTful API built with Node.js, Express, and MongoDB (via Mongoose). It follows a modular architecture with repositories, services, controllers, and middleware for auth/validation/errors. Here's a summary of implemented features relevant to the frontend:

- **Authentication & Authorization**:
  - Endpoints: `POST /api/auth/register`, `POST /api/auth/login` (returns JWT token).
  - Roles: Student, Professor, Admin (enforced via middleware like `protect` and `authorizeRoles`).
  - Security: JWT tokens in `x-auth-token` header, rate limiting, input validation (Joi via Celebrate), sanitization (xss-clean, mongo-sanitize).
  - Frontend implication: All protected routes require token storage (e.g., localStorage) and header inclusion. Role-based UI (e.g., hide professor tools for students).

- **Courses**:
  - Endpoints: `GET /api/courses` (list all), `POST /api/courses` (create, professor only), `GET/PUT/DELETE /api/courses/:id` (CRUD, professor only), `POST /api/courses/:id/enroll` (student only).
  - Models: Courses have name, description, professor (ref User), students array (ref User).
  - Pagination support via mongoose-paginate-v2.
  - Frontend implication: Dashboard for listing/enrolling courses; professor dashboard for management.

- **Assignments**:
  - Endpoints: `GET/POST /api/courses/:courseId/assignments` (list/create, professor create), `GET/PUT/DELETE /api/courses/:courseId/assignments/:assignmentId` (CRUD, professor only).
  - Models: Assignments have title, description, dueDate, course ref.
  - Nested under courses for logical routing.
  - Frontend implication: Course detail page shows assignments; professor view for editing.

- **Submissions**:
  - Endpoints: `POST/GET /api/courses/:courseId/assignments/:assignmentId/submissions` (submit/list), `GET /api/courses/:courseId/assignments/:assignmentId/submissions/:submissionId` (view), `PUT /api/courses/:courseId/assignments/:assignmentId/submissions/:submissionId` (update, student), `PATCH /api/courses/:courseId/assignments/:assignmentId/submissions/:submissionId/review` (grade, professor).
  - Models: Submissions have content, attachments array, grade, feedback, status (submitted/graded/reviewed), refs to assignment/student.
  - Unique per student-assignment; validation ensures enrollment.
  - Frontend implication: Assignment detail page with submission form (text + file upload); professor grading interface.

- **Notifications**:
  - Endpoints: `GET /api/notifications` (user's notifications), `PATCH /api/notifications/:notificationId/read` (mark read).
  - Models: Notifications have title, message, type (course/assignment/update), refs to course/assignment, isRead, isGlobal.
  - Services for triggering (e.g., on new course/assignment), but not fully integrated into other services yet (e.g., no auto-notify on submit).
  - Frontend implication: Bell icon with dropdown list; real-time feel via polling or WebSockets (future).

- **General**:
  - Error Handling: Centralized `AppError` class and global middleware for consistent JSON responses (status, message).
  - Testing: Jest/Supertest with in-memory MongoDB; covers auth, courses, middleware, submissions.
  - Docs: OpenAPI YAML for endpoints; README with setup.
  - Limitations: No file upload handling (attachments are strings, likely URLs); no real-time (e.g., Socket.io); pagination on courses/assignments but not enforced in all queries.

The API is solid for an MVP, with role-based access and validation. Frontend must handle JWT auth, nested routing (e.g., /courses/:id/assignments/:aid/submissions), and error states gracefully. Focus on student MVP: login → dashboard (courses/notifications) → enroll/view courses → submit assignments.

## Proposed Tech Stack
To build a modern, responsive, and maintainable frontend, I recommend a stack that's performant, developer-friendly, and easy to customize for a "beautiful and unique" UI. It aligns with the backend's JS ecosystem for shared knowledge.

- **Framework: Next.js 14 (with React 18)**  
  Reasons: Server-side rendering (SSR) for fast initial loads and SEO (useful for course discovery). App Router for nested layouts/routing (perfect for /courses/:id/assignments). Built-in API routes if needed for proxying backend calls. Handles auth guards easily. Scalable for future features like SSG for static course pages.

- **Styling: Tailwind CSS + Shadcn/ui**  
  Reasons: Tailwind for utility-first, rapid prototyping with custom designs (unique aesthetics via easy theming). Shadcn/ui provides accessible, copy-paste components (buttons, modals, cards) built on Tailwind/Radix UI—customizable without vendor lock-in. Enables "beautiful" UI like gradient cards for courses or animated notifications. No bloat like full Material UI.

- **State Management: Zustand**  
  Reasons: Lightweight alternative to Redux for global state (e.g., user auth, notifications). Simple API for storing JWT, user role, and app-wide data. Pairs well with React Query for API state.

- **Data Fetching & Caching: TanStack Query (React Query)**  
  Reasons: Handles API calls, optimistic updates (e.g., submit assignment), caching, and error retries. Integrates with auth (auto-add token to headers). Better than SWR for complex queries like paginated courses or submission lists.

- **UI Components & Icons: Lucide React (icons) + Headless UI/Radix (primitives)**  
  Reasons: Lucide for clean, customizable icons. Radix for unstyled primitives (e.g., dropdowns for notifications) to keep UI unique.

- **Other Tools**:
  - **Auth: NextAuth.js or Custom JWT Hook** – Simple token-based auth with protected routes.
  - **File Upload: React Dropzone** – For assignment attachments (upload to backend or cloud like Cloudinary; backend needs multer integration later).
  - **Forms: React Hook Form + Zod** – Validation synced with backend Joi schemas.
  - **Testing: Jest + React Testing Library** – Unit/integration tests for components.
  - **Deployment: Vercel** – Free, optimized for Next.js, auto-deploys from Git.
  - **TypeScript** – Strongly typed for safety (e.g., API responses).

This stack is lightweight (no heavy bundles), mobile-first (Tailwind responsive), and allows unique designs (e.g., dark mode, custom animations via Framer Motion if needed). Total setup time: ~1-2 hours. Cost: Free for MVP.

## High-Level Frontend Design
Focus on **student MVP journey**: Login → Dashboard → Courses → Assignments → Submit. Use a clean, modern aesthetic: Soft blues/greens for education theme, card-based layouts, subtle animations.

### Layout Structure (Using Next.js App Router)
- **Root Layout** (`/app/layout.tsx`): Header (logo, notifications bell, profile dropdown), Sidebar (Dashboard, Courses, Profile—collapsible on mobile), Footer.
- **Protected Route Wrapper**: Middleware or HOC to check JWT/role; redirect to login if unauth.

### Pages
- `/login` & `/register`: Centered forms with validation; role selector on register.
- `/dashboard`: Overview cards (enrolled courses, upcoming deadlines from assignments, unread notifications count).
- `/courses`: Paginated list/grid of course cards (name, desc, enroll button). Search/filter bar.
- `/courses/[id]`: Detail view (professor info, enrolled students count, assignments list as cards with due dates/status).
- `/courses/[id]/assignments/[aid]`: Assignment view (description, submit form with textarea + file dropzone). For professors: Grade submissions table (student list, grade/feedback inputs).
- `/notifications`: Full list with mark-read buttons; filter by type (course/assignment).
- `/profile`: User settings (update name/email, logout).

### Key Components (Reusable with Shadcn/ui)
- **CourseCard**: Image placeholder, title, desc, enroll button (disabled if enrolled).
- **AssignmentCard**: Title, due date (color-coded: red if overdue), status badge (submitted/pending).
- **SubmissionForm**: Textarea, file upload, submit button; shows success/error toasts (via Sonner).
- **NotificationDropdown**: Bell icon with badge; dropdown list (title, message, timestamp, read/unread toggle).
- **GradingTable** (Professor-only): Data table with student submissions, editable grade/feedback cells.

### User Flows & UX
- **Student**: Login → Dashboard (quick overview) → Browse/Enroll Courses → View Assignment → Submit (with progress bar for uploads) → Notification on grade.
- **Professor**: Similar, but + create course/assignment, review submissions (modal for feedback).
- Responsiveness: Mobile-first (sidebar → hamburger menu).
- Accessibility: ARIA labels, keyboard nav (Radix handles this).
- Performance: Infinite scroll for lists (TanStack Query), lazy-load images.
- Error Handling: Global toast for API errors (e.g., "Not enrolled"); loading spinners.

### Integration with Backend
- Base URL: `http://localhost:3000/api` (env var for prod).
- Auth: Store token on login; attach to Axios/Fetch interceptor.
- Queries: Use TanStack Query hooks like `useQuery({ queryKey: ['courses'], queryFn: fetchCourses })`.
- Mutations: `useMutation` for submits/enrolls, invalidate queries on success (e.g., refetch assignments).
- File Uploads: Frontend handles multi-file; backend needs endpoint update (future: add multer).

This design delivers a polished MVP in 1-2 weeks (student focus). Start with project setup: `npx create-next-app@latest campus-connect-frontend --typescript --tailwind --eslint`.