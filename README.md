# SolarWise BG

SolarWise BG is a full-stack web app for estimating solar panel system needs, battery size, consumption patterns, and saved user scenarios.

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Laravel 11 API
- Database: SQLite through Laravel migrations and Eloquent
- Authentication: Bearer-token auth

## What You Need To Install

Install these before running the project:

1. **Node.js 22 or newer**

   Download it from:

   ```text
   https://nodejs.org/
   ```

   Check that it installed correctly:

   ```bash
   node -v
   npm -v
   ```

2. **Git**

   Download it from:

   ```text
   https://git-scm.com/downloads
   ```

   Check that it installed correctly:

   ```bash
   git --version
   ```

## How To Start The Program

1. Clone the repository:

   ```bash
   git clone https://github.com/yani0710/SolarPanels.git
   ```

2. Go into the project folder:

   ```bash
   cd SolarPanels
   ```

3. Install the frontend dependencies:

   ```bash
   npm install
   ```

4. Create your environment files:

   ```bash
   copy .env.example .env
   ```

   On macOS/Linux, use:

   ```bash
   cp .env.example .env
   ```

   Then copy the Laravel example into the backend:

   ```bash
   copy backend-laravel\.env.example backend-laravel\.env
   ```

   On macOS/Linux, use:

   ```bash
   cp backend-laravel/.env.example backend-laravel/.env
   ```

5. Start the frontend and Laravel API in two terminals:

   ```bash
   npm run dev
   ```

   In a second terminal:

   ```bash
   cd backend-laravel
   php artisan serve
   ```

6. Open the app in your browser:

   ```text
   http://localhost:5173
   ```

The Laravel backend API runs at:

```text
http://localhost:8000/api
```

The Laravel backend lives in [backend-laravel](backend-laravel).

## Useful Commands

Run the full app in development mode:

```bash
npm run dev
```

Run only the frontend:

```bash
npm run dev:frontend
```

Run only the Laravel backend:

```bash
cd backend-laravel
php artisan serve
```

Check TypeScript:

```bash
npm run typecheck
```

Build the project:

```bash
npm run build
```

Laravel backend migrations:

```bash
cd backend-laravel
php artisan migrate
```

## Environment Variables

The `.env.example` file contains the default local setup:

```env
VITE_API_URL=http://localhost:8000/api
```

For local development, copying `.env.example` to `.env` is enough.

## Notes

- The Laravel backend uses SQLite and standard Laravel migrations.
- Local database files and Laravel vendor files are ignored by Git.
- `node_modules` and build folders are ignored by Git.
