# TravelTales – Secure Travel Blog with Country API Integration

## Project Overview

TravelTales is a full-stack travel blogging platform that lets users share travel experiences while securely searching for country data. It integrates with a custom middleware API that filters data from RestCountries.com, providing essential details like country name, currency, capital, languages, and flag.

## Features

### Core Functionalities
- User registration and login with hashed passwords
- Secure API key generation and usage tracking
- RESTful API to fetch country information
- Protected routes using JWT and CSRF tokens
- Create, like, dislike, and comment on posts
- Admin dashboard with usage analytics and user management
- Fully containerized using Docker

## Security Features

- JWT Authentication stored in HttpOnly cookies
- CSRF Protection via the Double Submit Cookie pattern
- Passwords securely hashed with bcrypt
- Login lockout after multiple failed attempts
- Role-based access control (admin/user)
- Rate limiting and validation on API endpoints

## Tech Stack

- Backend: Node.js, Express.js, SQLite, JWT, CSRF
- Frontend: Angular
- Database: SQLite with Sequelize ORM
- Containerization: Docker and Docker Compose

## Docker Setup

1. Make sure Docker is installed.
2. From the project root directory, run:

   docker-compose up --build

3. Access the application:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:49100/api

## Project Structure

/frontend
  - Angular UI for users and admin
/backend
  - Express API with routes, services, middleware
  - SQLite DB and authentication logic
/docker-compose.yml

## API Endpoints

### Auth
- POST /auth/register
- POST /auth/login

### Posts
- GET /api/posts
- POST /api/posts

### Country API
- GET /api/countries?name={country} (Requires API Key)

### Like/Dislike
- POST /api/like
- POST /api/dislike

### Admin (Protected)
- GET /admin/stats
- GET /users/with-usage

## Usage Notes

- After login, JWT and CSRF token are stored in cookies.
- Use withCredentials: true when making frontend requests.
- CSRF token must be sent in a custom header, typically x-csrf-token.

## Admin Panel

- View user list and API key usage
- Analytics: total users, active users, API keys issued, plan types
- Modify user plans (free/paid)

## License

All content and source code are protected. Unauthorized reuse or distribution is prohibited.
