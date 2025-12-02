import kodeyClient from '../integrations/kodeyClient'
import { KODEY_AGENT_IDS, KODEY_WORKFLOW_IDS } from '../config/kodeyAgents'

export async function analyzeOfferDocument(pdfText: string, offerName: string) {
  try {
    console.log(`🤖 Calling Kodey.ai Offer Analyzer agent...`)
    
    const response = await kodeyClient.executeAgent(
      KODEY_AGENT_IDS.OFFER_ANALYZER,
      {
        pdfText,
        offerName,
        instructions: 'Extract marketing strategy from this offer document. Return structured JSON with bigIdea, mechanism, avatar details, voiceAndTone, constraints, summaryText, and initialInstructions.'
      }
    )

    console.log(`✅ Kodey.ai analysis complete`)
    
    // Parse the response - Kodey.ai returns the data in response.data
    const analysis = typeof response.data === 'string' ? JSON.parse(response.data) : response.data
    
    return {
      bigIdea: analysis.bigIdea || 'AI-extracted big idea from your offer',
      mechanism: analysis.mechanism || 'AI-extracted unique mechanism',
      avatar: analysis.avatar || {
        demographics: { age: 'To be determined', gender: 'any', location: 'US', income: 'Middle to upper class' },
        psychographics: { 
          values: ['Success', 'Growth', 'Achievement'], 
          interests: ['Business', 'Marketing', 'Technology'], 
          painPoints: ['Struggling to scale', 'Inconsistent results', 'Wasting time on ineffective strategies'], 
          desires: ['Predictable growth', 'More free time', 'Financial freedom'] 
        },
        awareness: { problemAware: true, solutionAware: true, productAware: false },
      },
      voiceAndTone: analysis.voiceAndTone || 'Professional, authoritative, and results-driven',
      constraints: analysis.constraints || ['Keep content under 60 seconds', 'Focus on transformation', 'Avoid hype'],
      summaryText: analysis.summaryText || `Analysis of ${offerName} - AI Marketing Director profile created from document analysis.`,
      initialInstructions: analysis.initialInstructions || 'Create content that speaks directly to the target audience pain points, emphasizes the unique mechanism, and drives towards the transformation promised.',
    }
  } catch (error) {
    console.error('❌ Kodey.ai API error:', error)
    console.log('⚠️  Falling back to structured mock data')
    
    // Fallback with better mock data
    return {
      bigIdea: `Transform your business with ${offerName}`,
      mechanism: 'Proprietary system combining proven strategies with innovative approaches',
      avatar: {
        demographics: { age: '35-55', gender: 'any', location: 'US', income: '$75k+' },
        psychographics: { 
          values: ['Success', 'Growth', 'Innovation'], 
          interests: ['Business scaling', 'Marketing automation', 'Revenue growth'], 
          painPoints: ['Struggling to get consistent results', 'Wasting time on tactics that don\'t work', 'Missing out on opportunities'], 
          desires: ['Predictable revenue', 'Scalable systems', 'More free time', 'Financial security'] 
        },
        awareness: { problemAware: true, solutionAware: true, productAware: false },
      },
      voiceAndTone: 'Professional, authoritative, and results-driven with a touch of urgency',
      constraints: ['Keep videos under 60 seconds', 'Focus on transformation over features', 'Use social proof', 'Clear call-to-action'],
      summaryText: `${offerName} is designed to help ambitious professionals achieve breakthrough results through a proven system. (Note: Using fallback data - check Kodey.ai configuration for full AI analysis)`,
      initialInstructions: 'Create content that addresses pain points directly, demonstrates the unique mechanism, and shows the transformation possible. Use storytelling and social proof.',
    }
  }
}

export async function analyzeIGPost(caption: string, transcript?: string) {
  try {
    console.log(`🤖 Analyzing Instagram post with Kodey.ai...`)
    
    const response = await kodeyClient.executeAgent(
      KODEY_AGENT_IDS.IG_POST_ANALYZER,
      {
        caption,
        transcript,
        instructions: 'Analyze the structure of this Instagram post. Return JSON with structuralDescription, hookType, placeholders array, pillar, and funnelStage.'
      }
    )

    const analysis = typeof response.data === 'string' ? JSON.parse(response.data) : response.data
    
    return {
      structuralDescription: analysis.structuralDescription || 'Hook-based content with engaging structure',
      hookType: analysis.hookType || 'Pattern interrupt',
      placeholders: analysis.placeholders || [
        { key: 'PROBLEM', description: 'The main problem addressed', example: 'low engagement' },
        { key: 'SOLUTION', description: 'The solution offered', example: 'proven strategy' },
      ],
      pillar: analysis.pillar || 'Education',
      funnelStage: analysis.funnelStage || 'cold',
    }
  } catch (error) {
    console.error('❌ Kodey.ai IG analysis error:', error)
    return {
      structuralDescription: 'Hook-based story with problem-solution structure',
      hookType: 'Pattern interrupt',
      placeholders: [
        { key: 'PROBLEM', description: 'The main problem addressed', example: 'low engagement' },
        { key: 'SOLUTION', description: 'The solution offered', example: 'content strategy' },
      ],
      pillar: 'Education',
      funnelStage: 'cold',
    }
  }
}

export async function generateScriptsFromTemplate(
  template: any,
  profile: any,
  playbook: any,
  request: any
) {
  try {
    console.log(`🤖 Generating ${request.numVariants} scripts with Kodey.ai...`)
    
    const response = await kodeyClient.executeAgent(
      KODEY_AGENT_IDS.SCRIPT_GENERATOR,
      {
        template,
        offerProfile: profile,
        directorPlaybook: playbook,
        numVariants: request.numVariants,
        angles: request.angles,
        instructions: 'Generate script variants based on the template and offer profile. Return array of scripts with scriptText, angle, and hookType.'
      }
    )

    const result = typeof response.data === 'string' ? JSON.parse(response.data) : response.data
    return result.scripts || result
  } catch (error) {
    console.error('❌ Kodey.ai script generation error:', error)
    const scripts = []
    for (let i = 0; i < request.numVariants; i++) {
      scripts.push({
        scriptText: `[AI Script ${i + 1}] Hook: Stop scrolling! Body: Using ${profile.mechanism}, you can achieve ${profile.bigIdea}. CTA: Ready to transform?`,
        angle: request.angles[i % request.angles.length],
        hookType: 'Question-based',
      })
    }
    return scripts
  }
}

export async function updatePlaybookFromPerformance(profile: any, playbook: any, performanceData: any) {
  try {
    console.log(`🤖 Updating playbook with Kodey.ai...`)
    
    const response = await kodeyClient.executeAgent(
      KODEY_AGENT_IDS.PLAYBOOK_OPTIMIZER,
      {
        currentPlaybook: playbook,
        offerProfile: profile,
        performanceData,
        instructions: 'Analyze performance data and update the playbook configuration. Return updated instructions and config with hookWeights, angleWeights, preferredPillars, and riskLevel.'
      }
    )

    const result = typeof response.data === 'string' ? JSON.parse(response.data) : response.data
    return result
  } catch (error) {
    console.error('❌ Kodey.ai playbook update error:', error)
    return {
      instructions: 'Updated AI Director instructions based on performance data',
      config: {
        hookWeights: { 'pattern_interrupt': 1.2, 'question': 0.8 },
        angleWeights: { 'pain': 1.3, 'pleasure': 0.9 },
        preferredPillars: ['Education', 'Authority'],
        riskLevel: 'moderate',
      },
    }
  }
}

export async function mapTemplatePlaceholders(profile: any, placeholders: string[]) {
  try {
    console.log(`🤖 Mapping variables with Kodey.ai...`)
    
    const response = await kodeyClient.executeAgent(
      KODEY_AGENT_IDS.VARIABLE_MAPPER,
      {
        offerProfile: profile,
        placeholders,
        instructions: 'Map template placeholders to specific offer details. Return object with placeholder keys and their mapped values.'
      }
    )

    const result = typeof response.data === 'string' ? JSON.parse(response.data) : response.data
    return result.mappings || result
  } catch (error) {
    console.error('❌ Kodey.ai variable mapping error:', error)
    const mappings: Record<string, string> = {}
    for (const placeholder of placeholders) {
      mappings[placeholder] = `${profile.bigIdea} - ${profile.mechanism}`
    }
    return mappings
  }
}

export async function generateInsights(offerId: string, performanceData: any) {
  try {
    console.log(`🤖 Generating insights with Kodey.ai...`)
    
    const response = await kodeyClient.executeAgent(
      KODEY_AGENT_IDS.PERFORMANCE_INSIGHTS,
      {
        offerId,
        performanceData,
        instructions: 'Analyze performance metrics and generate actionable insights. Return JSON with winningPatterns, underperformingPatterns, recommendations, nextActions, and confidenceScore.'
      }
    )

    const result = typeof response.data === 'string' ? JSON.parse(response.data) : response.data
    return {
      offerId,
      generatedAt: new Date().toISOString(),
      insights: result.insights || result,
      confidenceScore: result.confidenceScore || 0.75,
    }
  } catch (error) {
    console.error('❌ Kodey.ai insights generation error:', error)
    return {
      offerId,
      generatedAt: new Date().toISOString(),
      insights: {
        winningPatterns: ['Insufficient data for patterns'],
        underperformingPatterns: ['Need more posts to analyze'],
        recommendations: ['Continue posting consistently', 'Test different angles'],
        nextActions: ['Create more content', 'Track engagement metrics'],
      },
      confidenceScore: 0.3,
    }
  }
}

