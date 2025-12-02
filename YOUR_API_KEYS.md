# Your API Keys - Quick Reference

## ✅ Keys You've Provided

### Kodey.ai
```
KODEY_API_KEY=5PozsJrACY80eWweN0Q2UalQm6tqY3Kv2PHBz7Ef
```

### Creatify
```
CREATIFY_API_ID=3551cfa8-d986-4b30-929f-b7e74dfa4b3d
CREATIFY_API_KEY=dbbbb6d24c65666aa894dbe755691e5a19621851
```

---

## 🚀 Quick Setup

### Option 1: Use Setup Script (Recommended)

```bash
chmod +x setup-env.sh
./setup-env.sh
```

This will automatically create your `.env` files with the API keys above.

### Option 2: Manual Setup

1. **Create backend/.env file:**

```bash
# Copy the template
cp backend/.env.example backend/.env 2>/dev/null || cat > backend/.env << 'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_content_creator?schema=public"
REDIS_URL="redis://localhost:6379"
PORT=3001
NODE_ENV=development

OPENAI_API_KEY=""

CREATIFY_API_ID="3551cfa8-d986-4b30-929f-b7e74dfa4b3d"
CREATIFY_API_KEY="dbbbb6d24c65666aa894dbe755691e5a19621851"
CREATIFY_BASE_URL="https://api.creatify.ai/api/v1"

KODEY_API_KEY="5PozsJrACY80eWweN0Q2UalQm6tqY3Kv2PHBz7Ef"
KODEY_BASE_URL="https://api.kodey.ai/api/v1"

KODEY_AGENT_OFFER_ANALYZER=""
KODEY_AGENT_IG_ANALYZER=""
KODEY_AGENT_SCRIPT_GEN=""
KODEY_AGENT_VAR_MAPPER=""
KODEY_AGENT_PERF_INSIGHTS=""
KODEY_AGENT_PLAYBOOK_OPT=""

KODEY_WORKFLOW_OFFER_ONBOARD=""
KODEY_WORKFLOW_TEMPLATE_CREATE=""
KODEY_WORKFLOW_SCRIPT_GEN=""
KODEY_WORKFLOW_PERF_REVIEW=""

INSTAGRAM_APP_ID=""
INSTAGRAM_APP_SECRET=""
INSTAGRAM_ACCESS_TOKEN=""
INSTAGRAM_BUSINESS_ACCOUNT_ID=""

JWT_SECRET="change-this-to-random-string"
MAX_FILE_SIZE_MB=50
UPLOAD_DIR="./uploads"
FRONTEND_URL="http://localhost:5173"
EOF
```

2. **Create frontend/.env file:**

```bash
echo 'VITE_API_URL=http://localhost:3001/api' > frontend/.env
```

---

## ⚠️ Still Need These Keys

### 1. OpenAI API Key (Required)

**Get it from:** https://platform.openai.com/api-keys

**Used for:** Embeddings and AI processing

**Add to backend/.env:**
```
OPENAI_API_KEY=sk-your-key-here
```

### 2. Kodey.ai Agent IDs (Required for full functionality)

**How to get:**
1. Open `KODEY_AI_SETUP_PROMPT.md`
2. Use it to create agents in Kodey.ai dashboard
3. Copy each agent ID
4. Add to `backend/.env`

**Example:**
```
KODEY_AGENT_OFFER_ANALYZER=agent_abc123def456
KODEY_AGENT_IG_ANALYZER=agent_def789ghi012
# ... etc
```

**See:** `KODEY_INTEGRATION_GUIDE.md` for detailed instructions

### 3. Instagram API (Optional - can add later)

**Get it from:** https://developers.facebook.com

**Required for:**
- Instagram content discovery
- Publishing posts
- Analytics tracking

**Add to backend/.env:**
```
INSTAGRAM_APP_ID=your-app-id
INSTAGRAM_APP_SECRET=your-app-secret
INSTAGRAM_ACCESS_TOKEN=your-access-token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your-business-account-id
```

---

## 🎯 Next Steps

### Immediate (5 minutes)
1. ✅ Run setup script or create .env files manually
2. ❌ Add OpenAI API key to `backend/.env`
3. ❌ Start Docker services: `npm run docker:up`
4. ❌ Set up database: `cd backend && npx prisma generate && npx prisma migrate dev`
5. ❌ Start dev servers: `npm run dev`

### This Week (2-3 hours)
6. ❌ Use `KODEY_AI_SETUP_PROMPT.md` to create Kodey.ai agents
7. ❌ Add agent IDs to `backend/.env`
8. ❌ Test agent execution with real data

### When Ready (Optional)
9. ❌ Set up Instagram API integration
10. ❌ Test complete workflow end-to-end

---

## 🔒 Security Notes

**Important:**
- ✅ `.env` files are in `.gitignore` - they won't be committed
- ✅ Never share API keys publicly
- ✅ Rotate keys if accidentally exposed
- ✅ Use different keys for development vs production

**If you need to share this project:**
- Share `backend/.env.example` (template without real keys)
- Don't share `backend/.env` (contains real keys)

---

## 📚 Documentation Reference

- **Setup Instructions:** `QUICK_START.md`
- **Kodey.ai Setup:** `KODEY_AI_SETUP_PROMPT.md`
- **Kodey.ai Integration:** `KODEY_INTEGRATION_GUIDE.md`
- **Detailed Setup:** `SETUP_GUIDE.md`
- **API Details:** `API_DOCUMENTATION.md`

---

## ✅ Verification

After setup, verify everything works:

```bash
# Test backend connection
curl http://localhost:3001/health

# Should return: {"status":"ok","timestamp":"..."}

# Test frontend
# Open http://localhost:5173 in browser
# You should see the dashboard
```

---

## 🆘 Troubleshooting

**"Module not found" errors:**
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

**Database connection failed:**
```bash
# Make sure Docker is running
docker ps
# Should show postgres and redis containers
```

**Can't access frontend:**
- Check if port 5173 is available
- Check backend is running on port 3001
- Check browser console for errors

---

## 🎉 You're Ready!

With Kodey.ai and Creatify configured, you can now:
1. ✅ Upload offer PDFs (will use Kodey.ai once agents are set up)
2. ✅ Create video scripts
3. ✅ Generate videos with Creatify
4. ⏳ Publish to Instagram (once IG API is configured)

**Start building!** 🚀

