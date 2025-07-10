# SureDrive Backend

A professional Node.js backend for SureDrive, built with TypeScript, Express, MongoDB, and JWT authentication.

## Features
- User, Driver, Inspector, Vehicle, and Inspection management
- JWT authentication
- Role-based access control
- Clean, modular code structure

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment:**
   - Copy `.env.example` to `.env` and set your variables
3. **Run in development:**
   ```bash
   npm run dev
   ```
4. **Build and run in production:**
   ```bash
   npm run build
   npm start
   ```

## Folder Structure
```
src/
  models/         # Mongoose models
  controllers/    # Express route handlers
  services/       # Business logic
  routes/         # Express routers
  middlewares/    # Auth, error handling, etc.
  utils/          # Helpers
  app.ts          # Express app setup
  server.ts       # Entry point
```

## API Overview
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `GET /api/users` — List users (admin only)
- `GET /api/vehicles` — List vehicles
- `POST /api/inspections` — Create inspection

...and more. See code for details.

---
MIT License 