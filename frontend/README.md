# Frontend – URL Shortener App

This is the frontend for the URL Shortener application, built with [React](https://react.dev/) and [Material UI](https://mui.com/).

## Features

- Submit a long URL to get a short link
- Clickable short links open the original URL in a new tab
- Displays history of shortened URLs
- Robust error handling and user feedback
- Full test coverage with React Testing Library

## Requirements

- Node.js (>=18)
- npm
- Docker (optional, recommended)

## Getting Started

### 1. Environment Setup

Copy the example environment file and adjust as needed:

```bash
cp .env.example .env
```

Set `REACT_APP_API_URL` to the backend API endpoint (e.g., `/api/url` or `http://backend:3001/api/url` in Docker).

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Application

```bash
npm start
```

The app will be available at `http://localhost:3000`.

## Testing

```bash
npm test
```

## Environment Variables

See `.env.example` for all configuration options.

## License

MIT
