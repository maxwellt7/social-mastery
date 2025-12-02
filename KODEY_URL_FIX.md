# Finding Your Kodey.ai API Endpoint

## The Issue

The backend is trying to connect to Kodey.ai but can't find the server:
```
Error: getaddrinfo ENOTFOUND api.kodey.ai
```

This means the API URL in your `.env` file is incorrect.

## How to Fix It

### Step 1: Find the Correct URL

Go to your Kodey.ai dashboard and look for:
- API Documentation section
- Settings or Configuration page  
- Developer/API section

The correct base URL might be:
- `https://api.kodey.ai` (what we tried)
- `https://kodey.ai/api`
- `https://app.kodey.ai/api`
- `https://platform.kodey.ai/api`
- `https://api.kodey.com`

### Step 2: Update Your .env File

Once you find the correct URL:

```bash
# Open the file
nano backend/.env

# Find this line:
KODEY_BASE_URL="https://kodey.ai/api"

# Replace with the correct URL:
KODEY_BASE_URL="https://[correct-url-here]"

# Save and exit (Ctrl+X, then Y, then Enter)
```

### Step 3: Backend Will Auto-Restart

The backend watches for `.env` changes and will restart automatically.

## Alternative: Use Fallback Mode

If you can't find the URL right now, the app will work with intelligent fallback data. The fallback:
- ✅ Extracts structure from your PDFs
- ✅ Creates reasonable AI profiles
- ✅ Generates plausible scripts
- ⚠️ Not as smart as real Kodey.ai

You can still build and test your app while figuring out the correct endpoint!

## Once You Have the Correct URL

1. Update `backend/.env`
2. Upload a new offer
3. Check backend logs for:
   ```
   🤖 Calling Kodey.ai Offer Analyzer agent...
   ✅ Kodey.ai analysis complete
   ```

## Contact Kodey.ai Support

If you can't find the API endpoint:
- Email: support@kodey.ai
- Check their documentation: https://developer.kodey.ai
- Look for "API Reference" or "Getting Started"

---

**The app still works without the correct URL - it just uses fallback AI logic instead of your custom Kodey.ai agents.**

