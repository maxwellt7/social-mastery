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
  const configuredAgents: string[] = []
  
  Object.entries(KODEY_AGENT_IDS).forEach(([name, id]) => {
    if (!id) {
      missingAgents.push(name)
    } else {
      configuredAgents.push(name)
    }
  })
  
  if (missingAgents.length > 0) {
    console.warn('⚠️  Missing Kodey.ai agent IDs:', missingAgents.join(', '))
    console.warn('   Add them to your .env file or agents will use mock data')
  }
  
  if (configuredAgents.length > 0) {
    console.log('✅ Kodey.ai agents configured:', configuredAgents.length, 'of', Object.keys(KODEY_AGENT_IDS).length)
  }
  
  return configuredAgents.length === Object.keys(KODEY_AGENT_IDS).length
}

