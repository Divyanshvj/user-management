# Full-Stack User Management System

A full-stack user management system built with **Node.js**, **Express**, and **MySQL** on the backend, and **React.js** on the frontend. It provides secure user authentication, email verification, password reset, role-based access control, profile management with image uploads, and integrates Redis for efficient session management and caching.

---

## Features

- User Registration with Email Verification
- Secure Login with JWT (access & refresh tokens)
- Password Reset via Email
- Role-Based Access Control (Admin/User)
- User List with Pagination and Search (Admin only)
- View and Edit Profile with Image Upload and Preview
- Frontend Validation using React Hook Form
- Responsive UI using Material-UI
- Backend caching and session support with Redis

---

## Tech Stack

| Layer     | Technology                                     |
| --------- | ----------------------------------------------|
| Backend   | Node.js, Express.js, MySQL, Sequelize ORM, Redis |
| Frontend  | React.js, React Hook Form, Axios, Material-UI |
| Authentication | JWT (JSON Web Tokens), Google OAuth2          |
| Development Tools | Nodemon, dotenv, Multer (file uploads)     |


## Getting Started

### Prerequisites

- Node.js (v16+)
- MySQL (local or cloud instance)
- Redis Server (local or Docker container)
- Git

### Installation

1. Clone the repository using git clone
2. Setup backend -> cd backend -> npm install
3. Setup frontend -> cd frontend -> nom install

## Configuration

### Backend

- Create a `.env` file in `backend/` directory with variables:
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=user_management
    JWT_SECRET=your_jwt_secret
    JWT_REFRESH_SECRET=your_refresh_jwt_secret
    REDIS_HOST=127.0.0.1
    REDIS_PORT=6379
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_password
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    CLIENT_URL=http://localhost:3000

  ### Frontend

- Create a `.env` file in `frontend/` directory with:
    REACT_APP_API_URL=http://localhost:5000/api

 ## Running the Application

### Start Redis (if not already running)
### Backend
  cd backend
  npm run dev
  Server will start on port 5000 by default.
### Frontend
  cd frontend
  npm start  
  React app will open at `http://localhost:3000`.
  
