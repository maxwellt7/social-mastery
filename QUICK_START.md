# Quick Start Guide

Get your AI Content Creator platform running in 30 minutes.

## Prerequisites ✅

Before starting, have these ready:
- [ ] Node.js 18+ installed
- [ ] Docker Desktop installed and running
- [ ] API Keys ready (or know where to get them)

## Step 1: Install (5 minutes)

```bash
# Clone/navigate to project
cd "AI Content Creator"

# Install all dependencies
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
```

## Step 2: Configure Environment (10 minutes)

### Backend Configuration

```bash
# Copy environment template
cp backend/.env.example backend/.env
```

Edit `backend/.env` - **Required minimums**:
```env
# Required for development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_content_creator?schema=public"
REDIS_URL="redis://localhost:6379"
OPENAI_API_KEY="sk-your-key-here"

# Optional (app works with mock data)
CREATIFY_API_ID=""
CREATIFY_API_KEY=""
KODEY_API_KEY=""
INSTAGRAM_ACCESS_TOKEN=""
```

### Frontend Configuration

```bash
# Create frontend env
echo 'VITE_API_URL=http://localhost:3001/api' > frontend/.env
```

## Step 3: Start Services (5 minutes)

```bash
# Start PostgreSQL and Redis
npm run docker:up

# Wait 10 seconds for services to be ready, then:
# Set up database
cd backend
npx prisma generate
npx prisma migrate dev --name init
cd ..
```

## Step 4: Launch Application (2 minutes)

```bash
# Start both frontend and backend
npm run dev
```

**Open your browser**: http://localhost:5173

You should see the dashboard! 🎉

## Step 5: Test Basic Flow (8 minutes)

### Create Your First Offer

1. Click **"Offers"** in sidebar
2. Enter offer name: "Test Offer"
3. Upload a PDF (any marketing document)
4. Click **"Upload and Analyze"**

**Note**: Without Kodey.ai configured, this will create a basic profile with mock data.

### Explore the Interface

- ✅ **Dashboard**: See overview stats
- ✅ **Discovery**: Instagram search interface (needs IG API)
- ✅ **Templates**: View content templates
- ✅ **Campaigns**: Campaign management
- ✅ **Analytics**: Performance tracking
- ✅ **Settings**: API configuration

## What Works Without API Keys?

| Feature | Status | Notes |
|---------|--------|-------|
| Frontend UI | ✅ Fully Functional | All pages and components work |
| Backend API | ✅ Fully Functional | All endpoints respond |
| Database | ✅ Fully Functional | Data persists correctly |
| Job Queue | ✅ Fully Functional | Background jobs queue |
| PDF Upload | ✅ Fully Functional | Files upload and parse |
| Offer Creation | ⚠️ Mock Data | Creates offer with placeholder profile |
| IG Discovery | ⚠️ Empty | Needs Instagram API |
| Script Generation | ⚠️ Mock Data | Returns placeholder scripts |
| Video Generation | ⚠️ Unavailable | Needs Creatify API |
| Instagram Posting | ⚠️ Unavailable | Needs Instagram API |
| Analytics | ⚠️ Empty | Needs published posts first |

## Getting Real API Keys

### Priority 1: Kodey.ai (Most Important)

**This is the brain of your system** - get this first!

1. Sign up at https://kodey.ai
2. Get API key from Settings
3. Follow instructions in `KODEY_AI_SETUP_PROMPT.md`
4. See `KODEY_INTEGRATION_GUIDE.md` for integration

**Time estimate**: 1-2 hours to set up all agents

### Priority 2: Instagram

1. Create Facebook App at https://developers.facebook.com
2. Add Instagram Graph API product
3. Connect Instagram Business Account
4. Generate User Access Token
5. Add to `backend/.env`

**Time estimate**: 30-60 minutes (Facebook app approval can take longer)

### Priority 3: Creatify

1. Sign up at https://creatify.ai
2. Navigate to API settings
3. Generate credentials
4. Add to `backend/.env`

**Time estimate**: 10 minutes

### Priority 4: OpenAI (For Embeddings)

1. Go to https://platform.openai.com/api-keys
2. Create new API key
3. Add to `backend/.env`

**Time estimate**: 5 minutes

## Development Workflow

### Running Services

```bash
# Start everything
npm run dev

# Or separately:
npm run dev:frontend  # Port 5173
npm run dev:backend   # Port 3001

# Docker services
npm run docker:up     # Start
npm run docker:down   # Stop
```

### Database Management

```bash
# View/edit data
npm run db:studio     # Opens Prisma Studio at localhost:5555

# Create migration
cd backend
npx prisma migrate dev --name your_migration_name

# Reset database (caution: deletes data)
npx prisma migrate reset
```

### Useful Commands

```bash
# Run tests
npm test

# Check types
cd frontend && npm run lint
cd backend && tsc --noEmit

# Build for production
npm run build
```

## Troubleshooting

### Port Already in Use

**Frontend (5173)**:
```bash
# Find and kill process
lsof -ti:5173 | xargs kill -9
```

**Backend (3001)**:
```bash
# Find and kill process
lsof -ti:3001 | xargs kill -9
```

### Database Connection Failed

```bash
# Check Docker is running
docker ps

# Restart services
npm run docker:down
npm run docker:up

# Wait 10 seconds, then retry
```

### Module Not Found

```bash
# Clean reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
npm install
cd frontend && npm install
cd ../backend && npm install
```

### Prisma Client Not Generated

```bash
cd backend
npx prisma generate
cd ..
```

## File Structure Quick Reference

```
📁 Your most important files:
├── backend/
│   ├── .env                          ← Add API keys here
│   ├── src/
│   │   ├── server.ts                 ← Backend entry point
│   │   ├── routes/                   ← API endpoints
│   │   ├── services/                 ← Business logic
│   │   ├── integrations/             ← API clients
│   │   └── controllers/              ← Request handlers
│   └── prisma/
│       └── schema.prisma             ← Database schema
│
├── frontend/
│   ├── src/
│   │   ├── routes/                   ← Page components
│   │   ├── components/               ← UI components
│   │   ├── hooks/                    ← React hooks
│   │   ├── api/                      ← API functions
│   │   └── types/                    ← TypeScript types
│   └── .env                          ← API URL config
│
└── 📚 Documentation:
    ├── README.md                     ← Project overview
    ├── SETUP_GUIDE.md               ← Detailed setup
    ├── API_DOCUMENTATION.md         ← API integration specs
    ├── KODEY_AI_SETUP_PROMPT.md    ← Kodey.ai agent setup
    ├── KODEY_INTEGRATION_GUIDE.md  ← Kodey.ai integration
    ├── IMPLEMENTATION_NOTES.md      ← Technical details
    └── PROJECT_SUMMARY.md           ← Complete overview
```

## Next Steps Roadmap

### Week 1: Get Core Working
- [ ] Set up Kodey.ai agents (use prompt file)
- [ ] Test offer analysis with real PDFs
- [ ] Verify all agents return proper data

### Week 2: Instagram Integration
- [ ] Set up Facebook App and Instagram API
- [ ] Test content discovery
- [ ] Create first templates

### Week 3: Content Generation
- [ ] Set up Creatify account
- [ ] Generate first video from script
- [ ] Test complete flow: PDF → Template → Script → Video

### Week 4: Publishing & Analytics
- [ ] Publish first test post to Instagram
- [ ] Set up metrics collection
- [ ] Test learning loop

## Common Questions

**Q: Can I use this without Kodey.ai?**
A: The app works, but you'll get mock data. Kodey.ai provides the intelligence layer.

**Q: Do I need Instagram API right away?**
A: No. You can develop locally and add IG integration later.

**Q: How much do the API services cost?**
A: Varies by usage. Budget $50-200/month for moderate use.

**Q: Can I deploy this to production?**
A: Yes! See `IMPLEMENTATION_NOTES.md` for deployment checklist.

**Q: Where do I get help?**
A: Check the documentation files first, then reach out to API service support.

## Key URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/health
- **Prisma Studio**: http://localhost:5555 (run `npm run db:studio`)

## Success Checklist ✅

You're ready to build when:
- [ ] All dependencies installed
- [ ] Docker services running
- [ ] Database migrated successfully
- [ ] Both dev servers running
- [ ] Can access frontend in browser
- [ ] Can create test offer
- [ ] Understand which APIs you need

## Need Help?

1. Check `SETUP_GUIDE.md` for detailed instructions
2. Review `IMPLEMENTATION_NOTES.md` for technical details
3. Consult `API_DOCUMENTATION.md` for integration help
4. See `KODEY_INTEGRATION_GUIDE.md` for Kodey.ai setup

---

**You're all set!** Start with the basic flow, then gradually add API integrations. The system is designed to work in stages. 🚀

