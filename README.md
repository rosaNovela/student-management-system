Student Management System 🎓
A full-stack web application designed for students to manage their academic modules, track study hours, and organize a weekly schedule. This project demonstrates a complete React + Spring Boot integration.

📁 Project Structure
This repository is organized as a monorepo:

java-backend/: The Spring Boot REST API.

student-frontend/: The React/TypeScript dashboard.

🚀 Tech Stack
Backend
Java 17 with Spring Boot 3.4.2

Spring Data JPA: For database interactions.

Spring Security: Configured for CORS and CSRF-protected communication.

H2 Database: In-memory database for rapid development.

Frontend
React with TypeScript

Vite: For fast development and bundling.

Axios: For making API calls to the backend.

CSS-in-JS: Minimalist, responsive UI design.

🛠️ Getting Started
1. Run the Backend (Java)
Open the java-backend (or student-management-system) folder in IntelliJ IDEA.

Ensure you have Maven dependencies loaded.

Run StudentManagementSystemApplication.java.

The server will start on http://localhost:8081.

2. Run the Frontend (React)
Open your terminal in the student-frontend folder.

Install dependencies:

Bash
npm install
Start the development server:

Bash
npm run dev
The app will be available at http://localhost:5173.

✨ Key Features
Student Registration & Login: Authenticate using email-based lookup.

Module Management: Add academic modules and set weekly target hours.

Progress Tracking: Real-time progress bars showing "Actual vs. Target" study hours.

Interactive Schedule: Pin specific modules to time slots throughout the week.

📝 Configuration Notes
CORS: The backend is configured to allow requests specifically from the Vite default port (5173).

Port: The backend has been moved to port 8081 to avoid common system conflicts on 8080.
