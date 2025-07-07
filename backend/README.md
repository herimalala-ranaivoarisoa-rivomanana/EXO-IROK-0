# Backend – URL Shortener API

This is the backend service for the URL Shortener application, built with [NestJS](https://nestjs.com/) and [TypeORM](https://typeorm.io/) using PostgreSQL.

## Features

- Create short URLs from long URLs
- Retrieve the original URL from a short code (JSON response)
- Comprehensive unit and integration tests
- Dockerized for development and production

## Requirements

- Node.js (>=18)
- npm
- PostgreSQL
- Docker (optional, recommended)

## Getting Started

### 1. Environment Setup

Copy the example environment file and adjust as needed:

```bash
cp .env.example .env
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database

Ensure PostgreSQL is running and credentials match your `.env` file.

To start with Docker Compose (recommended):

```bash
docker-compose up --build
```

### 4. Run the Application

```bash
npm run start:dev
```

The API will be available at `http://localhost:3001/api/url`.

## API Endpoints

- `POST /api/url` — Create a short URL
- `GET /api/url/:shortCode` — Retrieve the original URL (JSON response)

## Testing

```bash
npm test
```

## Environment Variables

See `.env.example` for all configuration options.

## License

MIT
