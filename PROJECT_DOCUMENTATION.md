# Project Documentation

## 1. Project Overview

This project is a **Student Result Portal** with:

- a **React + TypeScript frontend**
- an **ASP.NET Core Web API backend**
- a **SQL Server database** accessed through **Entity Framework Core**

The application supports three main roles:

- `Admin`
- `Teacher`
- `Student`

Main features:

- login for admin, teachers, and students
- class management
- student management
- teacher management
- mark entry and mark viewing
- audit logging
- OTP/email verification for some admin actions

## 2. High-Level Architecture

### Frontend

The frontend lives in `src/`.

It is responsible for:

- rendering pages and dialogs
- collecting user input
- calling backend APIs through `CrudService`
- storing the current logged-in user in `localStorage`
- displaying audit history and API debug information

### Backend

The backend lives in `src/api/asp-api/SchoolManagementAPI/`.

It is responsible for:

- exposing REST endpoints under `/api/...`
- validating and shaping data with DTOs
- reading and writing SQL Server data through `AppDbContext`
- managing classes, students, teachers, marks, assignments, and audit logs
- handling login logic

### Database

The backend uses SQL Server through Entity Framework Core.

Main entities:

- `Student`
- `Teacher`
- `Class`
- `Subject`
- `Mark`
- `TeacherAssignment`
- `AuditLog`

## 3. How Frontend and Backend Connect

### Main connection file

The frontend talks to the backend through:

- [src/api/CrudService.ts](/abs/path/c:/Users/ebine/OneDrive/Documents/Desktop/Student%20res/stu/src/api/CrudService.ts)

This file builds API URLs using:

- `REACT_APP_API_URL`
- fallback: `http://localhost:5062/api` in development
- fallback: `/api` in production

### Request flow

The normal flow is:

1. A page or component calls a `CrudService` method.
2. `CrudService` sends an HTTP request using `axios`.
3. The ASP.NET controller receives the request.
4. The controller uses `AppDbContext` to query or update SQL Server.
5. The controller returns JSON.
6. React updates component state and re-renders the UI.

### Example

For class students:

1. `ClassStudentsPage.tsx` calls `CrudService.getClasses()`
2. then calls `CrudService.getStudentsByClass(classId)`
3. frontend sends:
   - `GET /api/classes`
   - `GET /api/students?classId=...`
4. backend receives these in:
   - `ClassesController.cs`
   - `StudentsController.cs`
5. data comes back and is shown in `StudentTable.tsx`

## 4. Core Services and Utilities

### Frontend service layer

- `CrudService.ts`
  Wraps all main HTTP requests.
- `AuditService.ts`
  Sends and fetches audit logs using `/audit`.

### Frontend utility layer

- `auditlog.ts`
  Builds audit payloads and adds timestamps.
- `currentUser.ts`
  Reads the logged-in user from `localStorage`.
- `validators.ts`
  Contains regex validation rules for names, roll numbers, email, phone, password, and marks.
- `apiTest.ts`
  Debug utility that calls backend endpoints and shows pass/fail results in the UI.
- `auditFormatter.ts`
  Formats audit log data for display.

### Backend infrastructure layer

- `AppDbContext.cs`
  Main EF Core database context and relationship setup.
- `ApiDbHelpers.cs`
  Shared helper logic, including subject syncing and system teacher creation.
- `ApiDtos.cs`
  DTO definitions used by the API.
- `ApiMappings.cs`
  Maps backend entities into DTOs returned to the frontend.

## 5. Login and Role Flow

### Frontend

Login happens in:

- [src/pages/LoginPage.tsx](/abs/path/c:/Users/ebine/OneDrive/Documents/Desktop/Student%20res/stu/src/pages/LoginPage.tsx)

Flow:

1. user enters username and password
2. `CrudService.login()` sends `POST /api/auth/login`
3. if successful, the frontend stores a `currentUser` object in `localStorage`
4. the app navigates based on role:
   - admin -> `/admin`
   - teacher -> `/teacher/dashboard`
   - student -> `/student/:rollNo`
5. an audit log is also written for login

### Backend

Login is handled by:

- [AuthController.cs](/abs/path/c:/Users/ebine/OneDrive/Documents/Desktop/Student%20res/stu/src/api/asp-api/SchoolManagementAPI/Controllers/AuthController.cs)

Rules:

- `admin / admin123` returns admin
- matching `TeacherNo + Password` returns teacher
- matching `RollNo + Password` returns student
- otherwise returns `401 Unauthorized`

## 6. Audit Logging Flow

Audit logging exists on both frontend and backend.

### Frontend side

- `auditlog.ts` creates the payload
- `AuditService.ts` sends it to `/api/audit`
- multiple UI actions call `auditLog(...)`

Examples:

- login
- delete class
- download marks

### Backend side

- `AuditController.cs` stores and returns audit records
- `AuditLog` and `AuditChange` models store the data

## 7. OTP / Email Flow

OTP is handled in:

- [src/components/common/OTP.tsx](/abs/path/c:/Users/ebine/OneDrive/Documents/Desktop/Student%20res/stu/src/components/common/OTP.tsx)

Flow:

1. component opens
2. `emailjs.send(...)` sends an OTP email
3. user types the OTP
4. if the OTP matches and is not expired, `onSuccess()` runs

This is a **frontend-only flow**. The backend is not involved in OTP generation or sending.

Used by:

- `AdminProfile.tsx`
- `ClassManager.tsx`
- `AddClassDialog.tsx`

## 8. Frontend File-by-File Explanation

### Root frontend files

| File | Purpose |
| --- | --- |
| `src/index.tsx` | React entry point that mounts the app. |
| `src/App.tsx` | Main router and top-level theme/snackbar wiring. |
| `src/App.css` | General app styling. |
| `src/index.css` | Global CSS rules. |
| `src/theme.ts` | Defines light and dark Material UI themes. |
| `src/App.test.tsx` | Basic React test scaffold. |
| `src/setupTests.ts` | Test environment setup for React Testing Library. |
| `src/reportWebVitals.ts` | Optional performance reporting helper. |
| `src/react-app-env.d.ts` | CRA TypeScript environment declarations. |
| `src/declarations.d.ts` | Extra project TypeScript declarations. |
| `src/logo.svg` | Default SVG asset. |

### API / frontend data access

| File | Purpose |
| --- | --- |
| `src/api/CrudService.ts` | Main HTTP wrapper for CRUD actions and login. This is the primary frontend-to-backend bridge. |

### Models

| File | Purpose |
| --- | --- |
| `src/models/Student.ts` | Frontend shape of a student object. |
| `src/models/Teacher.ts` | Frontend shape of a teacher object. |
| `src/models/Class.ts` | Frontend shape of class data and class creation payloads. |
| `src/models/Marks.ts` | Frontend marks model. |
| `src/models/AuditLog.ts` | Audit log model used by audit pages/tables. |
| `src/models/TeacherAssignment.ts` | Teacher assignment model. |
| `src/models/User.ts` | Generic user model where needed. |

### Pages

| File | Purpose |
| --- | --- |
| `src/pages/WelcomPage.tsx` | Public landing/welcome experience. |
| `src/pages/LandingPage.tsx` | Shows animated login entry after a short delay. |
| `src/pages/LoginPage.tsx` | Handles credential input, validation, login, role-based navigation, and login audit logging. |
| `src/pages/AdminPage.tsx` | Admin layout wrapper with `Navbar` and nested routes. |
| `src/pages/StudentPage.tsx` | Student route wrapper that passes `rollNo` into the student dashboard. |
| `src/pages/ClassStudentsPage.tsx` | Loads one class and its students, supports add/edit/delete student actions. |
| `src/pages/ClassMarksPage.tsx` | Shows class marks, filtering, and Excel export with audit logging. |

### Admin pages

| File | Purpose |
| --- | --- |
| `src/pages/admin/AdminDashboard.tsx` | Main admin landing screen with navigation buttons and API debug panel. |
| `src/pages/admin/TeacherPage.tsx` | Teacher management page. |
| `src/pages/admin/AuditPage.tsx` | Audit log page with filters and grouped tables. |

### Teacher pages

| File | Purpose |
| --- | --- |
| `src/pages/teacher/TeacherDashboard.tsx` | Teacher landing page that shows assigned classes and profile drawer. |
| `src/pages/teacher/AssignedClasses.tsx` | Loads teacher assignments and available classes for the teacher. |
| `src/pages/teacher/EnterMarksPage.tsx` | Teacher mark entry page for a specific class and subject. |

### Student components

| File | Purpose |
| --- | --- |
| `src/components/student/StudentDashboard.tsx` | Loads a student by roll number, fetches classes and marks, and shows result details. |
| `src/components/student/StudentDetailsDrawer.tsx` | Drawer with detailed student information. |

### Teacher components

| File | Purpose |
| --- | --- |
| `src/components/teacher/TeacherProfileDrawer.tsx` | Drawer for viewing/updating teacher details. |
| `src/components/teacher/MarkEntryTable.tsx` | Editable table for entering or updating marks. |

### Admin components

| File | Purpose |
| --- | --- |
| `src/components/admin/ClassManager.tsx` | Class listing, add/edit/delete class actions, admin profile drawer, OTP-protected delete flow. |
| `src/components/admin/AddClassDialog.tsx` | Dialog for creating new classes and assigning subjects. |
| `src/components/admin/EditClassDialog.tsx` | Dialog for editing a class and related data. |
| `src/components/admin/AddStudentDialog.tsx` | Dialog for adding a student to a class and generating roll number/password. |
| `src/components/admin/EditStudentDialog.tsx` | Dialog for editing student details and marks. |
| `src/components/admin/AddTeacherDialog.tsx` | Dialog for creating teachers. |
| `src/components/admin/EditTeacherDialog.tsx` | Dialog for editing teachers. |
| `src/components/admin/TeacherTable.tsx` | Teacher list UI with actions. |
| `src/components/admin/StudentTable.tsx` | Student list UI with edit/delete/details actions. |
| `src/components/admin/AssignClassSubjectDialog.tsx` | Assigns a class and subject to a teacher. |
| `src/components/admin/AdminProfile.tsx` | Admin email profile and OTP verification flow. |

### Audit components

| File | Purpose |
| --- | --- |
| `src/components/audit/AuditFilters.tsx` | Filter UI for audit log searches. |
| `src/components/audit/CreateAuditTable.tsx` | Renders create-type audit rows. |
| `src/components/audit/UpdateAuditTable.tsx` | Renders update-type audit rows. |
| `src/components/audit/DeleteAuditTable.tsx` | Renders delete-type audit rows. |
| `src/components/audit/LoginAuditTable.tsx` | Renders login audit rows. |
| `src/components/audit/DownloadAuditTable.tsx` | Renders download audit rows. |

### Common components

| File | Purpose |
| --- | --- |
| `src/components/common/Navbar.tsx` | Top navigation bar with title, dark mode, and logout. |
| `src/components/common/OTP.tsx` | OTP dialog using EmailJS. |
| `src/components/common/ConfirmDialog.tsx` | Reusable confirmation modal. |
| `src/components/common/CommonSnackbar.tsx` | Shared snackbar for success/error/info messages. |
| `src/components/common/CommonLoader.tsx` | Shared loader component. |
| `src/components/common/PageLoader.tsx` | Full-page loading UI. |
| `src/components/common/TableSkeleton.tsx` | Skeleton placeholder while table data loads. |
| `src/components/common/ApiDebugPanel.tsx` | Frontend debug panel for backend reachability and endpoint tests. |

### Services

| File | Purpose |
| --- | --- |
| `src/services/AuditService.ts` | Dedicated audit log service built on top of `CrudService`. |

### Utilities

| File | Purpose |
| --- | --- |
| `src/utils/validators.ts` | Shared regex and validation helper logic. |
| `src/utils/currentUser.ts` | Reads current user data from browser storage. |
| `src/utils/auditlog.ts` | Helper for sending audit records with timestamps. |
| `src/utils/auditFormatter.ts` | Formats audit changes for display. |
| `src/utils/apiTest.ts` | Quick health check and endpoint test runner for the debug panel. |

### Styles

| File | Purpose |
| --- | --- |
| `src/styles/landing.css` | Main landing/admin background and layout styling. |
| `src/styles/login.css` | Login page styling. |
| `src/styles/welcome.css` | Teacher and welcome-related styling. |
| `src/styles/admin.css` | Admin-specific styles. |
| `src/styles/audit-table.css` | Audit table formatting. |
| `src/styles/StudentDashboard.css` | Student dashboard styles. |
| `src/styles/studentDetailsDrawer.css` | Student detail drawer styles. |
| `src/styles/StudentDialog.css` | Student dialog styles. |
| `src/styles/scorebar.css` | Marks or score visual styling. |
| `src/styles/responsive.css` | Responsive layout helpers. |

### Assets

| File | Purpose |
| --- | --- |
| `src/assets/bg.jpg` | Background image asset. |

## 9. Backend File-by-File Explanation

### Startup and configuration

| File | Purpose |
| --- | --- |
| `src/api/asp-api/SchoolManagementAPI/Program.cs` | Backend startup: registers EF Core, controllers, Swagger, CORS, runs migrations, and seeds system teacher data. |
| `src/api/asp-api/SchoolManagementAPI/appsettings.json` | Base app configuration including the default SQL Server connection string. |
| `src/api/asp-api/SchoolManagementAPI/appsettings.Development.json` | Development-specific override configuration. |
| `src/api/asp-api/SchoolManagementAPI/Properties/launchSettings.json` | Local run profiles and backend URLs such as `http://localhost:5062`. |
| `src/api/asp-api/SchoolManagementAPI/SchoolManagementAPI.csproj` | .NET project file and NuGet dependencies. |
| `src/api/asp-api/SchoolManagementAPI/SchoolManagementAPI.http` | Simple HTTP request file for manual endpoint testing. |

### Data layer

| File | Purpose |
| --- | --- |
| `src/api/asp-api/SchoolManagementAPI/Data/AppDbContext.cs` | EF Core DbContext containing entity sets and relationship rules. |

### DTOs and mapping

| File | Purpose |
| --- | --- |
| `src/api/asp-api/SchoolManagementAPI/Dtos/ApiDtos.cs` | DTO classes sent to and from the frontend. |
| `src/api/asp-api/SchoolManagementAPI/Dtos/ApiMappings.cs` | Extension/helper mapping methods from entities to DTOs. |

### Infrastructure

| File | Purpose |
| --- | --- |
| `src/api/asp-api/SchoolManagementAPI/Infrastructure/ApiDbHelpers.cs` | Shared DB helper functions like syncing class subjects and ensuring the system teacher exists. |

### Controllers

| File | Purpose |
| --- | --- |
| `src/api/asp-api/SchoolManagementAPI/Controllers/AuthController.cs` | Login endpoint for admin, teacher, and student. |
| `src/api/asp-api/SchoolManagementAPI/Controllers/AuditController.cs` | Create and read audit logs. |
| `src/api/asp-api/SchoolManagementAPI/Controllers/ClassesController.cs` | Main class CRUD controller used by the frontend. |
| `src/api/asp-api/SchoolManagementAPI/Controllers/StudentsController.cs` | Main student CRUD controller used by the frontend, including filtering by class, roll number, and password. |
| `src/api/asp-api/SchoolManagementAPI/Controllers/TeachersController.cs` | Teacher CRUD controller used by the frontend. |
| `src/api/asp-api/SchoolManagementAPI/Controllers/MarksController.cs` | Marks CRUD controller, including subject lookup/creation. |
| `src/api/asp-api/SchoolManagementAPI/Controllers/TeacherAssignmentsController.cs` | CRUD for assigning teachers to classes/subjects. |
| `src/api/asp-api/SchoolManagementAPI/Controllers/ClassController.cs` | Older singular controller exposing `/api/class`; appears to be a legacy/simple version. |
| `src/api/asp-api/SchoolManagementAPI/Controllers/StudentController.cs` | Older singular controller exposing `/api/student`; appears to be a legacy/simple version. |

### Domain models

| File | Purpose |
| --- | --- |
| `src/api/asp-api/SchoolManagementAPI/Models/Class.cs` | Class entity. |
| `src/api/asp-api/SchoolManagementAPI/Models/Student.cs` | Student entity. |
| `src/api/asp-api/SchoolManagementAPI/Models/Teacher.cs` | Teacher entity. |
| `src/api/asp-api/SchoolManagementAPI/Models/Subject.cs` | Subject entity. |
| `src/api/asp-api/SchoolManagementAPI/Models/ClassSubject.cs` | Join entity between class and subject. |
| `src/api/asp-api/SchoolManagementAPI/Models/Mark.cs` | Mark entity storing student/class/subject/teacher marks. |
| `src/api/asp-api/SchoolManagementAPI/Models/TeacherAssignment.cs` | Teacher assignment entity. |
| `src/api/asp-api/SchoolManagementAPI/Models/StudentSection.cs` | Student section entity for multi-section storage. |
| `src/api/asp-api/SchoolManagementAPI/Models/AuditLog.cs` | Audit log parent entity. |
| `src/api/asp-api/SchoolManagementAPI/Models/AuditChange.cs` | Audit log child entity for per-field changes. |

### Migrations

| File | Purpose |
| --- | --- |
| `src/api/asp-api/SchoolManagementAPI/Migrations/20260414104430_InitialCreate.cs` | Initial EF Core schema migration. |
| `src/api/asp-api/SchoolManagementAPI/Migrations/20260414104430_InitialCreate.Designer.cs` | Designer snapshot for the initial migration. |
| `src/api/asp-api/SchoolManagementAPI/Migrations/20260502113647_InitialCreate1.cs` | Later migration updating the schema. |
| `src/api/asp-api/SchoolManagementAPI/Migrations/20260502113647_InitialCreate1.Designer.cs` | Designer snapshot for the later migration. |
| `src/api/asp-api/SchoolManagementAPI/Migrations/AppDbContextModelSnapshot.cs` | Latest EF Core model snapshot. |

## 10. Important Backend Endpoints Used by the Frontend

| Method | Endpoint | Used for |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Login |
| `GET` | `/api/classes` | Load classes |
| `POST` | `/api/classes` | Create class |
| `PUT` | `/api/classes/{id}` | Update class |
| `DELETE` | `/api/classes/{id}` | Delete class |
| `GET` | `/api/students` | Load all students or filter by query |
| `GET` | `/api/students?classId={id}` | Load students in one class |
| `POST` | `/api/students` | Create student |
| `PUT` | `/api/students/{id}` | Update student |
| `DELETE` | `/api/students/{id}` | Delete student |
| `GET` | `/api/teachers` | Load teachers |
| `POST` | `/api/teachers` | Create teacher |
| `PUT` | `/api/teachers/{id}` | Update teacher |
| `DELETE` | `/api/teachers/{id}` | Delete teacher |
| `GET` | `/api/marks` | Load marks |
| `POST` | `/api/marks` | Create mark |
| `PUT` | `/api/marks/{id}` | Update mark |
| `DELETE` | `/api/marks/{id}` | Delete mark |
| `GET` | `/api/teacherAssignments` | Load teacher assignments |
| `POST` | `/api/teacherAssignments` | Create teacher assignment |
| `DELETE` | `/api/teacherAssignments/{id}` | Delete teacher assignment |
| `GET` | `/api/audit` | Read audit logs |
| `POST` | `/api/audit` | Write audit logs |

## 11. End-to-End Example Flows

### Add student flow

1. admin opens `ClassStudentsPage`
2. clicks `Add Student`
3. `AddStudentDialog.tsx` collects data
4. frontend sends `POST /api/students`
5. backend `StudentsController.cs` creates the student
6. frontend refreshes the student list

### Update student flow

1. admin clicks edit in `StudentTable.tsx`
2. `EditStudentDialog.tsx` opens with student data
3. frontend sends `PUT /api/students/{id}`
4. for marks, frontend also checks `/api/marks` and sends `PUT` or `POST` as needed
5. backend updates both the student and related marks
6. frontend reloads the page data

### Delete class flow

1. admin clicks delete in `ClassManager.tsx`
2. app checks admin email and OTP
3. after OTP success, frontend loads class students
4. frontend writes an audit log
5. frontend deletes students, then deletes the class
6. list is refreshed

### Teacher mark entry flow

1. teacher opens dashboard
2. `AssignedClasses.tsx` loads assigned classes
3. teacher opens `EnterMarksPage.tsx`
4. marks are entered in `MarkEntryTable.tsx`
5. frontend sends mark create/update requests to `/api/marks`

## 12. Observations and Maintenance Notes

- `ClassesController.cs` and `StudentsController.cs` are the main active REST controllers used by the frontend.
- `ClassController.cs` and `StudentController.cs` look like older, simpler versions and may cause confusion if both stay in the project.
- OTP email sending is handled by EmailJS on the frontend, not by the backend.
- `ApiDebugPanel.tsx` is helpful during development but is admin-facing UI, so you may want to remove or hide it in production.
- The project uses `localStorage` for current-user tracking instead of JWT/session authentication.
- The backend runs `db.Database.Migrate()` during startup, so database connectivity must be working before the API can serve requests.

## 13. Suggested Reading Order for a New Developer

If someone is new to this project, the best order is:

1. `src/App.tsx`
2. `src/api/CrudService.ts`
3. `src/pages/LoginPage.tsx`
4. `src/pages/admin/AdminDashboard.tsx`
5. `src/components/admin/ClassManager.tsx`
6. `src/pages/ClassStudentsPage.tsx`
7. `src/components/admin/EditStudentDialog.tsx`
8. `src/pages/teacher/TeacherDashboard.tsx`
9. `src/components/student/StudentDashboard.tsx`
10. `src/api/asp-api/SchoolManagementAPI/Program.cs`
11. `src/api/asp-api/SchoolManagementAPI/Data/AppDbContext.cs`
12. `src/api/asp-api/SchoolManagementAPI/Controllers/*.cs`

## 14. Summary

This project is a full-stack student management and result system.

- The **frontend** is React + TypeScript + Material UI.
- The **backend** is ASP.NET Core + EF Core + SQL Server.
- The connection between them is mostly centered around `CrudService.ts` on the frontend and the REST controllers on the backend.
- Audit logging is built into user actions.
- OTP/email verification uses EmailJS from the frontend.

This document is meant to be the starting point for understanding how the project is structured and how data moves through it.
