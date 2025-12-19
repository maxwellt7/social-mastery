#!/bin/bash

# AI Content Creator - Environment Setup Script
# This script will create your .env file with your API credentials

echo "🚀 Setting up AI Content Creator environment..."

# Create backend .env file
cat > backend/.env << 'EOF'
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_content_creator?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# Server
PORT=3001
NODE_ENV=development

# OpenAI (Add your key from https://platform.openai.com/api-keys)
OPENAI_API_KEY=""

# Anthropic (Optional alternative)
ANTHROPIC_API_KEY=""

# Creatify API (add your keys from Creatify dashboard)
CREATIFY_API_ID=""
CREATIFY_API_KEY=""
CREATIFY_BASE_URL="https://api.creatify.ai/api/v1"

# Kodey.ai API (add your keys from Kodey.ai dashboard)
KODEY_API_KEY=""
KODEY_PUBLISHABLE_KEY=""
KODEY_BASE_URL="https://api.kodey.ai/api/v1"

# Kodey.ai Agent IDs (You'll add these after creating agents)
KODEY_AGENT_OFFER_ANALYZER=""
KODEY_AGENT_IG_ANALYZER=""
KODEY_AGENT_SCRIPT_GEN=""
KODEY_AGENT_VAR_MAPPER=""
KODEY_AGENT_PERF_INSIGHTS=""
KODEY_AGENT_PLAYBOOK_OPT=""

# Kodey.ai Workflow IDs (You'll add these after creating workflows)
KODEY_WORKFLOW_OFFER_ONBOARD=""
KODEY_WORKFLOW_TEMPLATE_CREATE=""
KODEY_WORKFLOW_SCRIPT_GEN=""
KODEY_WORKFLOW_PERF_REVIEW=""

# Instagram Graph API (Add when ready)
INSTAGRAM_APP_ID=""
INSTAGRAM_APP_SECRET=""
INSTAGRAM_ACCESS_TOKEN=""
INSTAGRAM_BUSINESS_ACCOUNT_ID=""

# JWT Secret
JWT_SECRET="change-this-in-production-$(openssl rand -hex 32 2>/dev/null || echo 'random-string-here')"

# File Upload
MAX_FILE_SIZE_MB=50
UPLOAD_DIR="./uploads"

# Frontend URL
FRONTEND_URL="http://localhost:5173"
EOF

# Create frontend .env file
cat > frontend/.env << 'EOF'
VITE_API_URL=http://localhost:3001/api
EOF

echo ""
echo "✅ Environment files created!"
echo ""
echo "⚠️  Add your API keys to backend/.env:"
echo "   ❌ Kodey.ai API Key (from Kodey.ai dashboard)"
echo "   ❌ Creatify API credentials (from Creatify dashboard)"
echo "   ❌ OpenAI API Key (for embeddings)"
echo "   ❌ Kodey.ai Agent IDs (create agents first)"
echo "   ❌ Instagram API credentials (optional for now)"
echo ""
echo "📚 Next Steps:"
echo "   1. Add your OpenAI API key to backend/.env"
echo "   2. Follow KODEY_AI_SETUP_PROMPT.md to create Kodey.ai agents"
echo "   3. Add agent IDs to backend/.env as you create them"
echo "   4. Run: npm run docker:up"
echo "   5. Run: cd backend && npx prisma generate && npx prisma migrate dev"
echo "   6. Run: npm run dev"
echo ""
echo "🎉 Ready to build!"

