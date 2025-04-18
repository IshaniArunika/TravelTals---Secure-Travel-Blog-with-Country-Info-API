CountryAPI Middleware Service
=============================

This project is a secure API middleware service developed for the 6COSC022W Advanced Server Side Coursework 1 (2024/25) at the University of Westminster. It acts as an intermediary between clients and the public RestCountries API by providing filtered, secured, and authenticated access to country information.

Overview
--------

The middleware retrieves data from https://restcountries.com and returns only essential information:

- Country name
- Capital city
- Currency details
- Spoken languages
- National flag

The application includes full authentication, session management, API key handling, admin dashboard, and Docker-based deployment.

Features
--------

Core API Functionality
- RESTful integration with RestCountries.com
- Endpoints to fetch filtered country data
- Consistent and well-formatted JSON responses
- Robust error handling

Security
- JWT-based authentication with HttpOnly cookies
- CSRF protection (Double Submit Cookie pattern)
- Password hashing with bcrypt
- Role-based access (admin and user)
- Input validation and secure session management

Admin Functionality
- Admin login and protected dashboard
- View all registered users and their API usage
- Modify user plans (free/paid)
- View statistics: total users, API keys issued, active users, and percentage on paid plans

API Key Management
- Generate and revoke API keys per user
- API key required for protected endpoints
- Usage tracking and rate enforcement

Database (SQLite)
- Users, API keys, and API usage stored securely
- 3NF relational structure
- Tracks daily API usage per user

Deployment
- Dockerized backend and frontend
- Single-command local deployment using Docker Compose

Technologies
------------

- Backend: Node.js, Express
- Frontend: Angular
- Database: SQLite
- Auth: JWT, bcrypt, CSRF
- Deployment: Docker

Project Structure
-----------------

project-root/
│
├── backend/
│   ├── dao/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   └── app.js
│
├── frontend/
│   ├── src/
│   └── angular.json
│
├── docker-compose.yml
├── Dockerfile
└── README.md

Setup Instructions
------------------

Prerequisites
- Docker Desktop installed

Run with Docker

1. Clone the repository:
   git clone https://github.com/your-username/Advanced-Server-Side.git
   cd Advanced-Server-Side

2. Start the application:
   docker-compose up --build

3. Access locally:
   - Backend API: http://localhost:4000
   - Frontend UI: http://localhost:3000

Authentication Flow
-------------------

- JWT token issued on login and stored in HttpOnly cookie
- CSRF token issued in readable cookie and sent via header
- API key must be sent in x-api-key header for secured endpoints

Testing
-------

- Postman used for endpoint and security validation
- Frontend includes role-based navigation and interactive components

Submission Checklist
--------------------

- Zipped source code
- Video demonstration
- README file
- Docker support for local deployment

Author
------

- Name: Ishani Arunika
- Module:Advanced Server Side
- University of Westminster
