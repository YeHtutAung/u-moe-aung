# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Q&A Web Application - A full-stack app where users can ask questions and admins can reply.

**Tech Stack:**
- Backend: Express.js with SQLite (better-sqlite3), JWT authentication
- Frontend: React with Vite, react-router-dom

## Project Structure

```
u-moe-aung/
├── backend/           # Express API server
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # JWT auth middleware
│   │   ├── models/        # Database setup
│   │   └── routes/        # API routes
│   └── package.json
├── frontend/          # React SPA
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── api.js         # API client
│   │   └── App.jsx        # Main app with routing
│   └── package.json
└── CLAUDE.md
```

## Common Commands

```bash
# Backend
cd backend && npm run dev     # Start backend dev server (port 3000)

# Frontend
cd frontend && npm run dev    # Start frontend dev server (port 5173)
cd frontend && npm run build  # Build for production
```

## API Endpoints

- `POST /api/auth/admin/register` - Register admin
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/user/register` - Register user
- `POST /api/auth/user/login` - User login
- `POST /api/questions` - Submit question (user)
- `GET /api/questions` - Get user's questions (user)
- `GET /api/admin/questions` - Get all questions (admin)
- `POST /api/admin/questions/:id/reply` - Reply to question (admin)

## Database

SQLite database stored at `backend/database.sqlite`. Tables: admins, users, questions, replies.
