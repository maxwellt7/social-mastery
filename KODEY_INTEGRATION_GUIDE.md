# Kodey.ai Integration Guide

This guide explains how to use the `KODEY_AI_SETUP_PROMPT.md` and integrate Kodey.ai agents into your AI Content Creator platform.

## Step 1: Set Up Kodey.ai Agents

### 1.1 Create an Account
1. Go to https://kodey.ai and sign up
2. Navigate to your dashboard
3. Go to Settings → API Keys and generate an API key
4. Add it to your `backend/.env`:
   ```
   KODEY_API_KEY=your_api_key_here
   ```

### 1.2 Use the Setup Prompt

1. Open `KODEY_AI_SETUP_PROMPT.md`
2. Copy the entire prompt or specific agent sections
3. Use it in one of these ways:
   - **Kodey.ai Dashboard**: Paste into the agent builder UI
   - **Kodey.ai API**: Use the API to create agents programmatically
   - **Chat with Kodey.ai Support**: Share the prompt with their team for setup assistance

### 1.3 Record Agent IDs

As you create each agent in Kodey.ai, you'll receive agent IDs. Record them:

```typescript
// backend/src/config/kodeyAgents.ts
export const KODEY_AGENT_IDS = {
  OFFER_ANALYZER: 'agent_xxx_offer_analyzer',
  IG_POST_ANALYZER: 'agent_xxx_ig_analyzer',
  SCRIPT_GENERATOR: 'agent_xxx_script_gen',
  VARIABLE_MAPPER: 'agent_xxx_var_mapper',
  PERFORMANCE_INSIGHTS: 'agent_xxx_perf_insights',
  PLAYBOOK_OPTIMIZER: 'agent_xxx_playbook_opt',
}

export const KODEY_WORKFLOW_IDS = {
  OFFER_ONBOARDING: 'workflow_xxx_offer_onboard',
  TEMPLATE_CREATION: 'workflow_xxx_template_create',
  SCRIPT_GENERATION: 'workflow_xxx_script_gen',
  PERFORMANCE_REVIEW: 'workflow_xxx_perf_review',
}
```

## Step 2: Update Kodey Service Implementation

Replace the mock implementations in `backend/src/services/kodeyService.ts`:

```typescript
import kodeyClient from '../integrations/kodeyClient'
import { KODEY_AGENT_IDS, KODEY_WORKFLOW_IDS } from '../config/kodeyAgents'

export async function analyzeOfferDocument(pdfText: string) {
  const response = await kodeyClient.executeAgent(
    KODEY_AGENT_IDS.OFFER_ANALYZER,
    {
      pdfText,
      offerName: 'Extracted from document'
    }
  )

  return response.data
}

export async function analyzeIGPost(caption: string, transcript?: string) {
  const response = await kodeyClient.executeAgent(
    KODEY_AGENT_IDS.IG_POST_ANALYZER,
    {
      caption,
      transcript,
      includeMetrics: true
    }
  )

  return response.data
}

export async function generateScriptsFromTemplate(
  template: any,
  profile: any,
  playbook: any,
  request: any
) {
  const response = await kodeyClient.executeWorkflow(
    KODEY_WORKFLOW_IDS.SCRIPT_GENERATION,
    {
      template,
      offerProfile: profile,
      directorPlaybook: playbook,
      numVariants: request.numVariants,
      angles: request.angles,
      variableMappings: request.variableMappings
    }
  )

  return response.data.scripts
}

export async function mapTemplatePlaceholders(profile: any, placeholders: string[]) {
  const response = await kodeyClient.executeAgent(
    KODEY_AGENT_IDS.VARIABLE_MAPPER,
    {
      offerProfile: profile,
      placeholders: placeholders.map(key => ({
        key,
        description: `Map ${key} to offer details`
      }))
    }
  )

  return response.data.mappings
}

export async function generateInsights(offerId: string, performanceData: any) {
  const response = await kodeyClient.executeAgent(
    KODEY_AGENT_IDS.PERFORMANCE_INSIGHTS,
    {
      offerId,
      performanceData,
      timeRange: '30days'
    }
  )

  return response.data
}

export async function updatePlaybookFromPerformance(
  profile: any,
  playbook: any,
  performanceData: any
) {
  const response = await kodeyClient.executeAgent(
    KODEY_AGENT_IDS.PLAYBOOK_OPTIMIZER,
    {
      currentPlaybook: playbook,
      offerProfile: profile,
      performanceData
    }
  )

  return response.data
}
```

## Step 3: Add Agent Configuration File

Create `backend/src/config/kodeyAgents.ts`:

```typescript
export const KODEY_AGENT_IDS = {
  OFFER_ANALYZER: process.env.KODEY_AGENT_OFFER_ANALYZER || '',
  IG_POST_ANALYZER: process.env.KODEY_AGENT_IG_ANALYZER || '',
  SCRIPT_GENERATOR: process.env.KODEY_AGENT_SCRIPT_GEN || '',
  VARIABLE_MAPPER: process.env.KODEY_AGENT_VAR_MAPPER || '',
  PERFORMANCE_INSIGHTS: process.env.KODEY_AGENT_PERF_INSIGHTS || '',
  PLAYBOOK_OPTIMIZER: process.env.KODEY_AGENT_PLAYBOOK_OPT || '',
}

export const KODEY_WORKFLOW_IDS = {
  OFFER_ONBOARDING: process.env.KODEY_WORKFLOW_OFFER_ONBOARD || '',
  TEMPLATE_CREATION: process.env.KODEY_WORKFLOW_TEMPLATE_CREATE || '',
  SCRIPT_GENERATION: process.env.KODEY_WORKFLOW_SCRIPT_GEN || '',
  PERFORMANCE_REVIEW: process.env.KODEY_WORKFLOW_PERF_REVIEW || '',
}

// Validate configuration on startup
export function validateKodeyConfig() {
  const missingAgents: string[] = []
  
  Object.entries(KODEY_AGENT_IDS).forEach(([name, id]) => {
    if (!id) missingAgents.push(name)
  })
  
  if (missingAgents.length > 0) {
    console.warn('⚠️  Missing Kodey.ai agent IDs:', missingAgents.join(', '))
    console.warn('   Add them to your .env file or agents will use mock data')
  } else {
    console.log('✅ All Kodey.ai agents configured')
  }
}
```

## Step 4: Update Environment Variables

Add to `backend/.env`:

```env
# Kodey.ai Configuration
KODEY_API_KEY=your_api_key_here
KODEY_BASE_URL=https://api.kodey.ai/api/v1

# Agent IDs (get these from Kodey.ai dashboard after creating agents)
KODEY_AGENT_OFFER_ANALYZER=agent_xxx
KODEY_AGENT_IG_ANALYZER=agent_xxx
KODEY_AGENT_SCRIPT_GEN=agent_xxx
KODEY_AGENT_VAR_MAPPER=agent_xxx
KODEY_AGENT_PERF_INSIGHTS=agent_xxx
KODEY_AGENT_PLAYBOOK_OPT=agent_xxx

# Workflow IDs (get these from Kodey.ai dashboard after creating workflows)
KODEY_WORKFLOW_OFFER_ONBOARD=workflow_xxx
KODEY_WORKFLOW_TEMPLATE_CREATE=workflow_xxx
KODEY_WORKFLOW_SCRIPT_GEN=workflow_xxx
KODEY_WORKFLOW_PERF_REVIEW=workflow_xxx
```

## Step 5: Add Validation to Server Startup

Update `backend/src/server.ts`:

```typescript
import { validateKodeyConfig } from './config/kodeyAgents'

// After other imports...

// Validate Kodey.ai configuration
validateKodeyConfig()

// Start server...
```

## Step 6: Test Each Agent

Create test scripts to verify each agent works:

### Test Offer Analyzer

```typescript
// backend/src/scripts/testOfferAnalyzer.ts
import * as kodeyService from '../services/kodeyService'
import * as pdfService from '../services/pdfService'

async function testOfferAnalyzer() {
  const samplePdfText = `
    Introducing the Zenith Launch System...
    [Your sample offer text here]
  `
  
  console.log('Testing Offer Analyzer...')
  const result = await kodeyService.analyzeOfferDocument(samplePdfText)
  console.log('Result:', JSON.stringify(result, null, 2))
}

testOfferAnalyzer().catch(console.error)
```

Run with: `npx tsx backend/src/scripts/testOfferAnalyzer.ts`

### Test IG Post Analyzer

```typescript
// backend/src/scripts/testIGAnalyzer.ts
import * as kodeyService from '../services/kodeyService'

async function testIGAnalyzer() {
  const sampleCaption = `
    Here's the problem nobody talks about...
    [Sample IG post caption]
  `
  
  console.log('Testing IG Post Analyzer...')
  const result = await kodeyService.analyzeIGPost(sampleCaption)
  console.log('Result:', JSON.stringify(result, null, 2))
}

testIGAnalyzer().catch(console.error)
```

### Test Script Generator

```typescript
// backend/src/scripts/testScriptGenerator.ts
import prisma from '../lib/prisma'
import * as kodeyService from '../services/kodeyService'

async function testScriptGenerator() {
  // Get a real template and offer from your database
  const template = await prisma.template.findFirst()
  const profile = await prisma.offerProfile.findFirst()
  const playbook = await prisma.directorPlaybook.findFirst()
  
  if (!template || !profile || !playbook) {
    console.log('Create an offer and template first')
    return
  }
  
  console.log('Testing Script Generator...')
  const scripts = await kodeyService.generateScriptsFromTemplate(
    template,
    profile,
    playbook,
    {
      numVariants: 3,
      angles: ['pain', 'authority', 'contrarian'],
      variableMappings: {}
    }
  )
  
  console.log('Generated Scripts:', JSON.stringify(scripts, null, 2))
}

testScriptGenerator().catch(console.error)
```

## Step 7: Handle Agent Errors Gracefully

Add error handling with fallbacks:

```typescript
// backend/src/services/kodeyService.ts

async function executeWithFallback<T>(
  agentFn: () => Promise<T>,
  fallbackData: T,
  agentName: string
): Promise<T> {
  try {
    return await agentFn()
  } catch (error) {
    console.error(`Error executing ${agentName}:`, error)
    console.log(`Using fallback data for ${agentName}`)
    return fallbackData
  }
}

// Use it:
export async function analyzeOfferDocument(pdfText: string) {
  return executeWithFallback(
    () => kodeyClient.executeAgent(KODEY_AGENT_IDS.OFFER_ANALYZER, { pdfText }),
    getMockOfferAnalysis(), // Your existing mock
    'Offer Analyzer'
  )
}
```

## Step 8: Monitor Agent Performance

Add logging and metrics:

```typescript
// backend/src/lib/agentMonitor.ts
import prisma from './prisma'

export async function logAgentExecution(
  agentId: string,
  agentName: string,
  inputSize: number,
  duration: number,
  success: boolean,
  error?: string
) {
  // Log to console
  console.log(`Agent ${agentName}: ${success ? '✅' : '❌'} (${duration}ms)`)
  
  // Optionally store in database for analytics
  // await prisma.agentLog.create({ data: { ... } })
}

// Wrap agent calls
export async function executeAgentWithMonitoring<T>(
  agentId: string,
  agentName: string,
  input: any,
  executeFn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now()
  const inputSize = JSON.stringify(input).length
  
  try {
    const result = await executeFn()
    const duration = Date.now() - startTime
    
    await logAgentExecution(agentId, agentName, inputSize, duration, true)
    
    return result
  } catch (error) {
    const duration = Date.now() - startTime
    await logAgentExecution(
      agentId,
      agentName,
      inputSize,
      duration,
      false,
      error instanceof Error ? error.message : 'Unknown error'
    )
    throw error
  }
}
```

## Step 9: Optimize Agent Responses

### Cache Frequent Requests

```typescript
// backend/src/lib/agentCache.ts
import redis from './redis'

const CACHE_TTL = 60 * 60 // 1 hour

export async function getCachedAgentResponse<T>(
  cacheKey: string,
  executeFn: () => Promise<T>
): Promise<T> {
  // Check cache
  const cached = await redis.get(cacheKey)
  if (cached) {
    console.log(`Cache hit: ${cacheKey}`)
    return JSON.parse(cached)
  }
  
  // Execute agent
  const result = await executeFn()
  
  // Cache result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result))
  
  return result
}

// Use it:
export async function analyzeOfferDocument(pdfText: string) {
  const cacheKey = `offer:analysis:${hashText(pdfText)}`
  
  return getCachedAgentResponse(cacheKey, () =>
    kodeyClient.executeAgent(KODEY_AGENT_IDS.OFFER_ANALYZER, { pdfText })
  )
}
```

## Step 10: Create Admin Dashboard Endpoints

Add endpoints to monitor and test agents:

```typescript
// backend/src/routes/adminRoutes.ts
import { Router } from 'express'
import { KODEY_AGENT_IDS, KODEY_WORKFLOW_IDS } from '../config/kodeyAgents'
import kodeyClient from '../integrations/kodeyClient'

const router = Router()

// List all configured agents
router.get('/agents', (req, res) => {
  res.json({
    agents: KODEY_AGENT_IDS,
    workflows: KODEY_WORKFLOW_IDS,
  })
})

// Test an agent
router.post('/agents/:agentId/test', async (req, res) => {
  try {
    const { agentId } = req.params
    const { input } = req.body
    
    const result = await kodeyClient.executeAgent(agentId, input)
    
    res.json({
      success: true,
      result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

export default router
```

## Quick Start Checklist

- [ ] Create Kodey.ai account
- [ ] Generate API key
- [ ] Use `KODEY_AI_SETUP_PROMPT.md` to create agents
- [ ] Record all agent IDs and workflow IDs
- [ ] Add IDs to `backend/.env`
- [ ] Create `backend/src/config/kodeyAgents.ts`
- [ ] Update `backend/src/services/kodeyService.ts`
- [ ] Test each agent individually
- [ ] Test complete workflows
- [ ] Add error handling and monitoring
- [ ] Test in development environment
- [ ] Monitor performance and costs
- [ ] Deploy to production

## Troubleshooting

### Agent Returns Empty or Invalid Data
- Check agent configuration in Kodey.ai dashboard
- Verify input format matches expected structure
- Review agent logs in Kodey.ai
- Test with simpler input first

### Agent Timeouts
- Increase timeout in `kodeyClient.ts`
- Break complex tasks into smaller steps
- Use workflows instead of single agents

### High Costs
- Implement caching for repeated requests
- Use cheaper models for simpler tasks
- Batch operations when possible
- Monitor usage in Kodey.ai dashboard

### Inconsistent Results
- Add more specific instructions in agent prompts
- Provide more context in inputs
- Use structured output formats (JSON schema)
- Version your agents and track changes

## Best Practices

1. **Start Simple**: Test each agent individually before workflows
2. **Version Control**: Track agent configurations and prompt changes
3. **Monitor Costs**: Set up billing alerts in Kodey.ai
4. **Cache Aggressively**: Many requests don't need real-time results
5. **Fail Gracefully**: Always have fallback data
6. **Log Everything**: Track agent performance and errors
7. **Iterate on Prompts**: Continuously improve based on results
8. **Test with Real Data**: Use actual offer documents and IG posts

## Next Steps

Once agents are working:
1. Fine-tune prompts based on output quality
2. Optimize caching strategy
3. Add A/B testing for different prompt variations
4. Build analytics dashboard for agent performance
5. Set up automated testing for agents
6. Create documentation for your team

## Support

- Kodey.ai Documentation: https://developer.kodey.ai/docs
- Kodey.ai Support: support@kodey.ai
- Project Issues: See `IMPLEMENTATION_NOTES.md`

---

**Remember**: The agents are the brain of your content creation system. Invest time in getting the prompts right, and the rest of the system will perform much better!

