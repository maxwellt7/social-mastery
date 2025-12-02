# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose installed
- API keys for:
  - Creatify
  - Kodey.ai
  - Instagram Graph API
  - OpenAI or Anthropic

## Local Development Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 2. Set Up Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend `.env`:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_content_creator?schema=public"
REDIS_URL="redis://localhost:6379"

OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."

CREATIFY_API_ID="your-api-id"
CREATIFY_API_KEY="your-api-key"
CREATIFY_BASE_URL="https://api.creatify.ai"

KODEY_API_KEY="your-kodey-api-key"
KODEY_BASE_URL="https://api.kodey.ai"

INSTAGRAM_APP_ID="your-app-id"
INSTAGRAM_APP_SECRET="your-app-secret"
INSTAGRAM_ACCESS_TOKEN="your-access-token"
INSTAGRAM_USER_ID="your-ig-user-id"

PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"

JWT_SECRET="your-jwt-secret-change-in-production"
```

### 3. Start Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Run database migrations
cd backend
npx prisma generate
npx prisma migrate dev --name init

# Start backend (in one terminal)
cd backend
npm run dev

# Start frontend (in another terminal)
cd frontend
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Prisma Studio: `npx prisma studio` (from backend directory)

## Production Deployment

### Option 1: Traditional VPS (DigitalOcean, AWS EC2, etc.)

1. **Set up server with Docker**
2. **Clone repository**
3. **Configure environment variables**
4. **Build and run:**

```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd ../backend && npm run build

# Start services with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Separate Hosting

**Frontend (Vercel/Netlify):**
- Connect GitHub repository
- Set build command: `cd frontend && npm run build`
- Set output directory: `frontend/dist`
- Add environment variables

**Backend (Railway/Render/Fly.io):**
- Connect GitHub repository
- Set start command: `cd backend && npm start`
- Add environment variables
- Provision PostgreSQL and Redis add-ons

### Option 3: Kubernetes

Use the provided Kubernetes manifests in `/k8s` directory (if created).

## Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## Background Jobs

The application uses BullMQ for background jobs. Ensure Redis is running and accessible.

Jobs include:
- Video generation polling
- Instagram post scheduling
- Metrics collection

## Monitoring

### Health Check Endpoints

- Backend: `GET /health`

### Logs

- Backend logs are stored in `backend/logs/`
- Use `tail -f backend/logs/combined.log` to monitor

### Metrics Collection

Instagram metrics are collected every 6 hours automatically for all published posts.

## Scaling

### Horizontal Scaling

- Frontend: Deploy to CDN (Vercel, Netlify)
- Backend: Run multiple instances behind a load balancer
- Database: Use managed PostgreSQL with read replicas
- Redis: Use Redis Cluster or managed Redis

### Vertical Scaling

- Increase server resources for database and Redis
- Adjust BullMQ concurrency settings in job workers

## Security

1. **API Keys**: Never commit API keys. Use environment variables.
2. **CORS**: Configure CORS properly for production domain.
3. **Rate Limiting**: Express rate limiting is enabled by default.
4. **HTTPS**: Use SSL certificates (Let's Encrypt with Certbot).
5. **Database**: Ensure PostgreSQL is not publicly accessible.
6. **Redis**: Secure Redis with password and firewall rules.

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check DATABASE_URL is correct
   - Ensure PostgreSQL is running: `docker ps`

2. **Redis connection failed**
   - Check REDIS_URL is correct
   - Ensure Redis is running: `docker ps`

3. **Job queue not processing**
   - Check Redis connection
   - Verify worker processes are running
   - Check logs for errors

4. **API rate limits**
   - Monitor API usage
   - Implement exponential backoff
   - Cache responses when possible

## Backup

### Database Backup

```bash
# Backup
docker exec ai-content-creator-db pg_dump -U postgres ai_content_creator > backup.sql

# Restore
docker exec -i ai-content-creator-db psql -U postgres ai_content_creator < backup.sql
```

### File Backup

Backup the `uploads/` directory regularly.

## Support

For issues and questions, refer to:
- API Documentation: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Project README: [README.md](./README.md)

