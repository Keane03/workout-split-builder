# Workout Split Builder

[![Made with AI](https://img.shields.io/badge/Made_with-AI_assistance-blue)](AI-USAGE.md)

Workout Split Builder is a web application for creating, organizing, and managing weekly workout routines. The project uses a React/Vite frontend and a Node.js/Express backend with PostgreSQL for workout and exercise data.

AI tools were used during development for planning, debugging, implementation support, documentation, and code review. See [AI-USAGE.md](AI-USAGE.md) for the project AI-use record.

**Live site:** Not deployed yet

**Public API:** Not deployed yet

---

## 1. Overview

The project began with a React frontend using a browser-side mock API and `localStorage`.

During Week 2, the project was expanded with:

- PostgreSQL database storage
- Node.js and Express backend
- Exercise and workout REST API endpoints
- Server-side validation
- Parameterized SQL queries
- CORS allowlisting
- Basic Authentication
- Environment-based configuration
- Database schema and seed data

The React interface still uses the mock API by default. Direct integration between the React client and authenticated Express API is still in progress.

---

## 2. Setup and Installation

### Requirements

The project requires:

- Node.js 20 or newer
- npm
- PostgreSQL
- Git
- A modern web browser

Development has been tested using Node.js 24 and PostgreSQL 18.

### Clone the repository

```bash
git clone https://github.com/Keane03/workout-split-builder.git
cd workout-split-builder
