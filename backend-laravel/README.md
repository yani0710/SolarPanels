# SolarWise Laravel API

This folder contains a Laravel-compatible API scaffold that mirrors the current Node/Express backend routes:

- `/api/health`
- `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`
- `/api/appliances`, `/api/appliances/saved`, `/api/appliances/add`, `/api/appliances/{id}`
- `/api/systems`, `/api/systems/{id}`
- `/api/assistant/usage`, `/api/assistant/ask`

The code is structured for a normal Laravel 11 application using SQLite, Eloquent models, and Bearer-token auth.

To run it in a real Laravel install:

1. Install PHP 8.2+ and Composer.
2. Install Laravel dependencies with Composer.
3. Copy `.env.example` to `.env` and set your database path and secrets.
4. Run the migrations in `database/migrations`.
5. Point the frontend `VITE_API_URL` at the Laravel server if it is not served from the same origin.
