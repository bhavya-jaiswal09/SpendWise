# SpendWise

SpendWise is a personal expense and budget management application built with
the MERN stack (MongoDB, Express, React, Node.js).

This repository is currently in **Phase 1: Project Foundation & Setup**.
Only the base project structure, Express server, MongoDB connection, and a
minimal React shell exist so far — authentication and financial features
will be added in later phases.

## Tech Stack

**Frontend:** React (Vite), React Router, Redux Toolkit, Tailwind CSS
**Backend:** Node.js, Express.js
**Database:** MongoDB, Mongoose
**Auth (upcoming):** JWT, bcrypt

## Project Structure

```text
SpendWise/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── hooks/
│       ├── services/
│       ├── store/
│       ├── utils/
│       └── assets/
│
├── server/          # Express backend
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── app.js
│       └── server.js
│
└── README.md
```

## Setup Instructions

### 1. Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/` (an `.env.example` is provided):

```text
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Run in development mode:

```bash
npm run dev
```

Run in production mode:

```bash
npm start
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Environment Variables (server/.env)

| Variable      | Description                          |
|---------------|---------------------------------------|
| `PORT`        | Port the Express server runs on       |
| `MONGODB_URI` | MongoDB connection string             |

## Verifying the Setup

- Frontend: visit `http://localhost:5173` — you should see the SpendWise welcome screen.
- Backend: visit `http://localhost:5000/api/health` — you should see:
  ```json
  { "success": true, "message": "SpendWise API is running" }
  ```
- MongoDB: check the backend terminal log for `MongoDB connected: <host>`.

More documentation will be added as new phases are implemented.
