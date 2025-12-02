# AI Content Creator Platform

An AI-powered Instagram content creation platform that automates the entire content lifecycle from offer analysis to video generation and performance tracking.

## Features

- 📄 **PDF Offer Analysis**: Upload offer documents and create AI Marketing Director profiles
- 🔍 **Instagram Discovery**: Find high-performing content and convert to templates
- 🤖 **AI Script Generation**: Generate video scripts using adaptive templates
- 🎥 **Automated Video Creation**: Generate videos via Creatify API
- 📱 **Instagram Publishing**: Auto-post reels with scheduling
- 📊 **Performance Analytics**: Track metrics and learn from winning content
- 🔄 **Learning Loop**: Continuously improve content based on performance data

## Tech Stack

### Frontend
- Vite + React + TypeScript
- React Router
- TanStack Query
- Tailwind CSS + shadcn/ui
- Zustand (state management)

### Backend
- Node.js + Express + TypeScript
- PostgreSQL with Prisma ORM
- Redis + BullMQ (job queue)
- pgvector (vector embeddings)

### Integrations
- Creatify API (video generation)
- Kodey.ai (AI agents and workflows)
- Instagram Graph API (posting and analytics)
- OpenAI/Anthropic (AI processing)

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- API keys for: Creatify, Kodey.ai, Instagram, OpenAI/Anthropic

## Quick Start

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start Services**
   ```bash
   npm run docker:up
   ```

4. **Run Database Migrations**
   ```bash
   npm run db:migrate
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001
   - Prisma Studio: `npm run db:studio`

## Project Structure

```
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── routes/        # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── api/           # API client functions
│   │   └── types/         # TypeScript types
│   └── package.json
│
├── backend/               # Express backend API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── integrations/  # External API clients
│   │   ├── jobs/          # Background jobs
│   │   └── lib/           # Utilities
│   ├── prisma/            # Database schema
│   └── package.json
│
├── docker-compose.yml     # Docker services
├── API_DOCUMENTATION.md   # API integration docs
└── package.json           # Root workspace config
```

## Development Workflow

### Phase 1: Offer Setup
1. Upload PDF offer documents
2. AI extracts and analyzes content
3. Creates AI Marketing Director profile

### Phase 2: Content Discovery
1. Search Instagram for high-performing content
2. Analyze and convert posts to templates
3. Map template variables to your offer

### Phase 3: Script Generation
1. Generate script variants from templates
2. Apply different angles (pain/pleasure/objection)
3. Review and approve scripts

### Phase 4: Video Creation
1. Send scripts to Creatify for video generation
2. Monitor job status
3. Preview generated videos

### Phase 5: Publishing & Analytics
1. Schedule and post to Instagram
2. Track performance metrics
3. Generate insights and update AI Director

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed integration specs.

## Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both applications for production
- `npm run docker:up` - Start PostgreSQL and Redis containers
- `npm run docker:down` - Stop Docker containers
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run test` - Run all tests

## Environment Variables

See `.env.example` for all required environment variables.

## Contributing

This is a private project. For questions or support, contact the development team.

## License

Proprietary - All rights reserved
