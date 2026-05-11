# SolarWise BG

SolarWise BG is a full-stack web app for estimating solar panel system needs, battery size, consumption patterns, and saved user scenarios.

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Browser localStorage for auth, profile, saved systems, appliances, and assistant usage
- Optional backend scaffold: Laravel 11 in `backend-laravel/`

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

4. Create your environment file if you want to customize local settings:

   ```bash
   copy .env.example .env
   ```

   On macOS/Linux, use:

   ```bash
   cp .env.example .env
   ```

5. Start the app:

   ```bash
   npm run dev
   ```

6. Open the app in your browser:

   ```text
   http://localhost:5173
   ```

Auth, saved systems, custom appliances, and assistant usage now persist in the browser, so the app works without a running backend for those flows.

## Useful Commands

Run the full app in development mode:

```bash
npm run dev
```

Run only the frontend:

```bash
npm run dev:frontend
```

Check TypeScript:

```bash
npm run typecheck
```

Build the project:

```bash
npm run build
```

The Laravel scaffold in [backend-laravel](backend-laravel) is optional and no longer required for the main browser-local app flow.

## Environment Variables

The `.env.example` file contains the default local setup:

```env
VITE_API_URL=
```

For local development, copying `.env.example` to `.env` is enough.

## Notes

- Profile data and saved app data live in browser localStorage.
- The optional Laravel scaffold remains in `backend-laravel/` if you want a server-backed version later.
- `node_modules` and build folders are ignored by Git.
