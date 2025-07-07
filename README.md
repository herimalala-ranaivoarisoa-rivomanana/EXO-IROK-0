# URL Shortener Project

A professional full-stack URL shortener application built with NestJS (TypeScript, PostgreSQL) for the backend and React (Material UI) for the frontend.

## Features
- Shorten long URLs and generate unique short links
- Retrieve original URLs from short codes
- Full test coverage (unit, integration, frontend)
- Dockerized for easy deployment

## Project Structure
- `/backend` — NestJS API (TypeScript, PostgreSQL)
- `/frontend` — React web application (Material UI)

## Prerequisites
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- (Optional for local dev) Node.js (>=18), npm, PostgreSQL

## Quick Start (Recommended)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <project-root>
```

### 2. Start with Docker Compose
```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/url
- Database: exposed only to backend

### 3. Run all tests
```bash
npm test
```

## Manual Development Setup

### Backend
```bash
cd backend
cp .env.example .env # Edit DB credentials if needed
npm install
npm run start:dev
```

### Frontend
```bash
cd frontend
cp .env.example .env # Edit API URL if needed
npm install
npm start
```

## API Endpoints
- `POST /api/url` — Create a short URL
- `GET /api/url/:shortCode` — Retrieve the original URL (JSON)

## Environment Variables
See `/backend/.env.example` and `/frontend/.env.example` for configuration.

## License
MIT
