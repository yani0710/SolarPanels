# SolarWise BG

SolarWise BG is a full-stack web app for estimating solar panel system needs, battery size, consumption patterns, and saved user scenarios.

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: SQLite through Prisma Client
- Authentication: JWT and bcrypt

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

3. Install all dependencies:

   ```bash
   npm install
   ```

4. Create your environment file:

   ```bash
   copy .env.example .env
   ```

   On macOS/Linux, use:

   ```bash
   cp .env.example .env
   ```

5. Start the frontend and backend:

   ```bash
   npm run dev
   ```

6. Open the app in your browser:

   ```text
   http://localhost:5173
   ```

The backend API runs at:

```text
http://localhost:4000/api
```

## Useful Commands

Run the full app in development mode:

```bash
npm run dev
```

Run only the frontend:

```bash
npm run dev:frontend
```

Run only the backend:

```bash
npm run dev:backend
```

Check TypeScript:

```bash
npm run typecheck
```

Build the project:

```bash
npm run build
```

Start the built backend:

```bash
npm --workspace backend run start
```

## Environment Variables

The `.env.example` file contains the default local setup:

```env
VITE_API_URL=http://localhost:4000/api
PORT=4000
JWT_SECRET=change-me-in-production
DATABASE_PATH=./data/solarwise.sqlite
DATABASE_URL=file:./backend/data/solarwise.sqlite
OPENAI_API_KEY=
OPENAI_MODEL=
```

For local development, copying `.env.example` to `.env` is enough.

## Notes

- The SQLite database is created automatically when the backend starts.
- Local database files are ignored by Git.
- `node_modules` and build folders are ignored by Git.
