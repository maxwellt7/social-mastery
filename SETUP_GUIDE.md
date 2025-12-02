# AI Content Creator - Setup Guide

This guide will help you set up and run the AI Content Creator platform locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) and npm
- **Docker** and Docker Compose
- **Git**

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd "AI Content Creator"
```

## Step 2: Install Dependencies

Install dependencies for both frontend and backend:

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

cd ..
```

## Step 3: Set Up Environment Variables

### Backend Environment

1. Copy the example environment file:
```bash
cp backend/.env.example backend/.env
```

2. Edit `backend/.env` and fill in your API keys:

```env
# Database (leave as-is for local development)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_content_creator?schema=public"

# Redis (leave as-is for local development)
REDIS_URL="redis://localhost:6379"

# OpenAI API Key (REQUIRED)
OPENAI_API_KEY="sk-your-openai-key-here"

# Creatify API (REQUIRED for video generation)
CREATIFY_API_ID="your-creatify-api-id"
CREATIFY_API_KEY="your-creatify-api-key"

# Kodey.ai API (REQUIRED for AI agents)
KODEY_API_KEY="your-kodey-api-key"

# Instagram (REQUIRED for IG integration)
INSTAGRAM_APP_ID="your-instagram-app-id"
INSTAGRAM_APP_SECRET="your-instagram-app-secret"
INSTAGRAM_ACCESS_TOKEN="your-instagram-access-token"
INSTAGRAM_BUSINESS_ACCOUNT_ID="your-instagram-business-account-id"
```

### Frontend Environment

1. Create frontend environment file:
```bash
cp .env.example frontend/.env
```

2. Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

## Step 4: Start Docker Services

Start PostgreSQL and Redis using Docker Compose:

```bash
npm run docker:up
```

This will start:
- PostgreSQL with pgvector extension (port 5432)
- Redis (port 6379)

Verify services are running:
```bash
docker ps
```

## Step 5: Set Up the Database

Run Prisma migrations to create the database schema:

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
cd ..
```

## Step 6: Start the Development Servers

### Option 1: Run Both Servers Simultaneously

```bash
npm run dev
```

This starts:
- Frontend at http://localhost:5173
- Backend at http://localhost:3001

### Option 2: Run Servers Separately

In one terminal:
```bash
npm run dev:frontend
```

In another terminal:
```bash
npm run dev:backend
```

## Step 7: Verify the Setup

1. Open your browser to http://localhost:5173
2. You should see the AI Content Creator dashboard
3. Try creating an offer by uploading a PDF

## API Keys Setup Guide

### OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy and paste into your `.env` file

### Creatify API

1. Sign up at https://creatify.ai
2. Navigate to API settings in your dashboard
3. Generate API credentials
4. Copy API ID and API Key to your `.env` file

### Kodey.ai API

1. Sign up at https://kodey.ai
2. Go to Settings → API Keys
3. Generate a new API key
4. Copy to your `.env` file

### Instagram Business Account

1. Create a Facebook App at https://developers.facebook.com
2. Add Instagram Graph API product
3. Set up Instagram Business Account connection
4. Generate User Access Token with required permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `instagram_manage_insights`
   - `pages_read_engagement`
   - `pages_manage_metadata`
5. Copy credentials to your `.env` file

## Troubleshooting

### Database Connection Issues

If you see database connection errors:

```bash
# Stop and restart Docker containers
npm run docker:down
npm run docker:up

# Recreate the database
cd backend
npx prisma migrate reset
cd ..
```

### Port Already in Use

If ports 3001 or 5173 are already in use:

1. Stop the conflicting process
2. Or change the ports in:
   - Backend: `backend/.env` (PORT variable)
   - Frontend: `frontend/vite.config.ts` (server.port)

### Missing Dependencies

If you encounter module not found errors:

```bash
# Clean install
rm -rf node_modules frontend/node_modules backend/node_modules
npm install
cd frontend && npm install
cd ../backend && npm install
```

### Prisma Client Errors

If Prisma client is not generated:

```bash
cd backend
npx prisma generate
cd ..
```

## Development Tools

### Prisma Studio

View and edit your database with Prisma Studio:

```bash
npm run db:studio
```

Opens at http://localhost:5555

### Database Migrations

Create a new migration:

```bash
cd backend
npx prisma migrate dev --name your_migration_name
cd ..
```

### Testing

Run tests:

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## Production Deployment

For production deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Support

For issues or questions:

1. Check the [API Documentation](./API_DOCUMENTATION.md)
2. Review the [README](./README.md)
3. Contact the development team

## Next Steps

1. Upload your first offer PDF
2. Configure your AI Marketing Director profile
3. Discover Instagram content
4. Create templates and generate scripts
5. Generate videos with Creatify
6. Publish to Instagram
7. Track performance and iterate!

