# Kodey.ai Agent Architecture Setup Prompt

Use this prompt with Kodey.ai to build the AI agent system for the AI Content Creator platform.

---

## System Overview

I'm building an AI-powered Instagram content creation platform that needs intelligent agents to handle various content analysis, generation, and optimization tasks. The system follows this workflow:

1. **Analyze offer documents** (PDFs) to extract marketing strategy
2. **Analyze Instagram posts** to identify winning patterns
3. **Generate video scripts** adapted to specific offers
4. **Provide performance insights** and optimize strategy over time

## Required Agents

Please help me create the following specialized AI agents and workflows:

---

### Agent 1: **Offer Document Analyzer**

**Purpose**: Extract marketing strategy from offer launch documents (PDFs)

**Input**:
- Raw text extracted from PDF offer document (5-50 pages)
- Document may include: sales copy, target audience details, offer mechanics, pricing, testimonials, FAQs

**Required Outputs** (as JSON):
```json
{
  "bigIdea": "The core transformational promise (1 sentence)",
  "mechanism": "The unique method/system that delivers the promise (2-3 sentences)",
  "avatar": {
    "demographics": {
      "age": "Age range or description",
      "gender": "Target gender or 'any'",
      "location": "Geographic targeting",
      "income": "Income level or range"
    },
    "psychographics": {
      "values": ["List of 3-5 core values"],
      "interests": ["List of 5-10 interests/hobbies"],
      "painPoints": ["List of 5-10 specific problems they face"],
      "desires": ["List of 5-10 aspirations/desired outcomes"]
    },
    "awareness": {
      "problemAware": true/false,
      "solutionAware": true/false,
      "productAware": true/false
    }
  },
  "voiceAndTone": "Description of brand voice (conversational/professional/edgy/etc)",
  "constraints": ["List of content rules: length limits, taboo topics, brand guidelines"],
  "summaryText": "2-3 paragraph executive summary of the offer",
  "initialInstructions": "Instructions for an AI Marketing Director on how to promote this offer"
}
```

**Context to Understand**:
- Focus on extracting the EMOTIONAL core, not just features
- Identify the "before state" vs "after state" transformation
- Look for language patterns that resonate with the audience
- Extract any specific hooks, angles, or messaging frameworks mentioned
- Identify objections addressed in the document

**Agent Instructions**:
Create an agent that reads marketing documents like a seasoned copywriter. Extract not just what's written, but the strategic decisions behind it. If information is missing, make intelligent inferences based on context, but note uncertainty in the output.

---

### Agent 2: **Instagram Post Analyzer**

**Purpose**: Reverse-engineer successful Instagram content to identify reusable structures

**Input**:
- Post caption (text)
- Video transcript (if available)
- Performance metrics: likes, comments, shares, saves
- Source account context (niche, audience size)

**Required Outputs** (as JSON):
```json
{
  "structuralDescription": "High-level description of content structure (e.g., 'Pattern-interrupt hook + 3-part story + soft CTA')",
  "hookType": "Category of opening (e.g., 'Question', 'Shocking statement', 'Pattern interrupt', 'Story opening', 'Bold claim')",
  "bodyStructure": {
    "sections": [
      {
        "type": "problem_agitation",
        "purpose": "What this section accomplishes",
        "length": "Approximate word count or time"
      }
    ]
  },
  "ctaStyle": "Description of how the CTA is delivered (hard/soft/question/command)",
  "placeholders": [
    {
      "key": "PROBLEM",
      "description": "The specific problem being addressed",
      "example": "Example from this post",
      "category": "problem/solution/mechanism/proof/emotion/cta"
    }
  ],
  "emotionalJourney": "How emotions shift through the content (e.g., 'Frustration → Hope → Empowerment')",
  "funnelStage": "cold/warm/hot - Based on assumed audience awareness",
  "pillar": "Content category (e.g., 'Education', 'Authority', 'Entertainment', 'Inspiration', 'Social Proof')",
  "keyPatterns": ["List of notable patterns: specific words, pacing, formatting tricks"],
  "suggestedUseCases": ["When to use this template"]
}
```

**Context to Understand**:
- Templates should be STRUCTURAL, not content-specific
- Identify the "architecture" of the content, not the specifics
- Look for: pacing, emotional beats, pattern interrupts, formatting techniques
- High-performing content usually has a psychological strategy - identify it
- The goal is to make this reusable for ANY offer in a similar awareness stage

**Agent Instructions**:
Analyze like a content strategist, not a content copier. Identify WHY this content works, not just WHAT it says. Extract the underlying structure so it can be reapplied to different offers while maintaining the psychological impact.

---

### Agent 3: **Script Generator**

**Purpose**: Generate video scripts by combining template structures with specific offer details

**Input**:
- Template structure (from Agent 2)
- Offer profile (from Agent 1)
- Director playbook (current strategy preferences, pattern weights)
- Generation parameters:
  - `numVariants`: Number of script variations to create
  - `angles`: Array of psychological angles (e.g., ["pain", "pleasure", "authority"])
  - `variableMappings`: Pre-mapped placeholder values (may be incomplete)

**Required Outputs** (as JSON array):
```json
[
  {
    "scriptText": "Complete video script (30-60 seconds when spoken)",
    "angle": "The psychological angle used",
    "hookType": "Type of hook employed",
    "targetAvatarSegment": "Which audience sub-segment this targets",
    "rationale": "Why this script should perform well (2-3 sentences)",
    "estimatedPerformance": {
      "awareness_level": "Which awareness stage this targets",
      "emotional_trigger": "Primary emotion triggered",
      "predicted_strength": "strong/medium/experimental"
    }
  }
]
```

**Context to Understand**:
- Scripts should be 30-60 seconds when read naturally
- First 3 seconds are CRITICAL - must hook immediately
- Write for SPOKEN delivery (conversational, not written)
- Each variant should test a different angle but maintain brand voice
- Use the template structure but adapt all specifics to the offer
- Incorporate current playbook preferences (hook weights, angle weights)
- Scripts should feel native to Instagram Reels (fast-paced, visual, mobile-first)

**Generation Guidelines**:
1. **Hook (3 seconds)**: Pattern interrupt or compelling question
2. **Problem/Desire Agitation (10-15 seconds)**: Make them feel it
3. **Mechanism Introduction (15-20 seconds)**: Present the unique solution
4. **Proof/Authority (10-15 seconds)**: Why this works/why trust you
5. **CTA (5-10 seconds)**: Clear next step

**Agent Instructions**:
Generate scripts that sound human, not AI. Use the template as a skeleton but add personality. Each variant should feel fresh while maintaining the proven structure. Think like a direct response copywriter creating video sales letters, not a content creator making entertainment.

---

### Agent 4: **Variable Mapper**

**Purpose**: Intelligently map template placeholders to specific offer details

**Input**:
- Template placeholders array
- Offer profile (full context)
- Optionally: Example from source post for context

**Required Outputs** (as JSON):
```json
{
  "PROBLEM": "Specific problem from offer that matches template context",
  "SOLUTION": "The offer's unique solution",
  "MECHANISM": "The offer's unique mechanism/method",
  "RESULT": "Specific outcome promise",
  "PROOF": "Credibility element from offer",
  "OBJECTION": "Common objection and pre-frame",
  "CTA": "Specific call-to-action"
}
```

**Context to Understand**:
- Match the INTENT of the placeholder, not just the category
- Consider the template's original context when mapping
- Maintain consistency in specificity (if original was specific, be specific)
- Some placeholders may need creative interpretation
- Preserve the emotional weight of the original

**Agent Instructions**:
Map intelligently, not literally. If a template says "I went from X to Y", don't just find any transformation - find the one that matches the emotional and contextual weight of the original. Use the offer profile's language and voice.

---

### Agent 5: **Performance Insights Analyzer**

**Purpose**: Analyze content performance data and generate actionable strategic insights

**Input**:
- Performance metrics aggregated by:
  - Template (which structures performed best)
  - Angle (which psychological approaches worked)
  - Hook type (which opening styles got attention)
  - Time/day posted
- Current offer profile
- Current playbook configuration

**Required Outputs** (as JSON):
```json
{
  "offerId": "ID reference",
  "generatedAt": "ISO timestamp",
  "insights": {
    "winningPatterns": [
      "Specific observation about what's working (e.g., 'Hook type: Questions outperforming statements by 40%')"
    ],
    "underperformingPatterns": [
      "Specific observation about what's not working"
    ],
    "recommendations": [
      "Actionable strategic recommendation (e.g., 'Increase pain-angle content from 20% to 35% of output')"
    ],
    "nextActions": [
      "Specific tactical steps (e.g., 'Create 5 new scripts using Template #3 with pain angle')"
    ],
    "audienceInsights": [
      "What we're learning about the audience"
    ],
    "contentGaps": [
      "What content pillars or angles are under-tested"
    ]
  },
  "confidenceScore": 0.0-1.0,
  "dataQuality": "Description of data sufficiency",
  "updatedWeights": {
    "hookWeights": {"question": 1.3, "statement": 0.8},
    "angleWeights": {"pain": 1.4, "pleasure": 0.9}
  }
}
```

**Context to Understand**:
- Look for PATTERNS, not individual post success
- Consider statistical significance (more data = higher confidence)
- Identify correlations: time of day, post frequency, content combinations
- Think like a growth marketer, not just an analyst
- Provide strategic recommendations, not just observations
- Balance "double down on winners" vs "test new approaches"

**Agent Instructions**:
Analyze like a performance marketer running a $100k/month ad account. Every insight should be actionable. Every recommendation should have a clear hypothesis. Use data to inform strategy, but also consider qualitative factors (brand positioning, market timing, competitive landscape).

---

### Agent 6: **Playbook Optimizer**

**Purpose**: Update the AI Marketing Director's strategy based on performance learnings

**Input**:
- Current playbook (instructions + config)
- Performance insights (from Agent 5)
- Offer profile (for context)
- Historical playbook versions (for trend analysis)

**Required Outputs** (as JSON):
```json
{
  "version": "Incremented version number",
  "instructions": "Updated instructions for AI Marketing Director - how to approach this offer going forward",
  "config": {
    "hookWeights": {"type": weight},
    "angleWeights": {"type": weight},
    "preferredPillars": ["Prioritized content pillars"],
    "riskLevel": "safe/moderate/aggressive",
    "avoidPatterns": ["Patterns to reduce or avoid"],
    "doubleDownPatterns": ["Patterns to emphasize"]
  },
  "changeLog": ["List of strategic changes made and why"],
  "hypothesis": "What we're testing with this update"
}
```

**Context to Understand**:
- Balance exploitation (do more of what works) vs exploration (test new approaches)
- Consider diminishing returns (a pattern that worked may saturate)
- Think about audience fatigue and content variety
- Maintain brand consistency while optimizing performance
- Update weights gradually, not dramatically (unless data is overwhelming)

**Agent Instructions**:
Optimize like a machine learning algorithm with strategic thinking. Don't just chase short-term metrics - consider long-term brand building and audience relationship. Make bold moves when data is clear, but maintain brand voice and strategic positioning. Think 3 months ahead, not just next week.

---

## Workflow Integration

**Workflow 1: New Offer Onboarding**
```
Input: PDF file
Step 1: Upload to Kodey.ai knowledge base
Step 2: Execute Agent 1 (Offer Analyzer)
Step 3: Generate initial playbook config
Output: Offer profile + Initial Director Playbook
```

**Workflow 2: Template Creation**
```
Input: Instagram post data (caption, transcript, metrics)
Step 1: Execute Agent 2 (IG Analyzer)
Step 2: Execute Agent 4 (Variable Mapper) with offer context
Output: Template with pre-mapped variables
```

**Workflow 3: Script Generation**
```
Input: Template ID, Offer ID, Generation params
Step 1: Retrieve template + offer profile + current playbook
Step 2: Execute Agent 4 (Variable Mapper) if mappings incomplete
Step 3: Execute Agent 3 (Script Generator)
Output: Array of script variants
```

**Workflow 4: Performance Review & Optimization**
```
Input: Offer ID, Performance data (last 30 days)
Step 1: Execute Agent 5 (Performance Analyzer)
Step 2: Execute Agent 6 (Playbook Optimizer)
Output: Updated playbook + Actionable insights
```

---

## Technical Integration Points

Our backend will integrate with Kodey.ai via REST API:

```typescript
// Example: Analyzing an offer document
const response = await kodeyClient.executeAgent(
  'offer-analyzer-agent-id',
  {
    pdfText: extractedText,
    offerName: "Product Launch Name"
  }
)

// Example: Generating scripts
const scripts = await kodeyClient.executeWorkflow(
  'script-generation-workflow-id',
  {
    templateId: 'template-123',
    offerId: 'offer-456',
    numVariants: 5,
    angles: ['pain', 'authority', 'contrarian']
  }
)
```

---

## Success Criteria

The agent system should:
1. ✅ Extract accurate marketing strategy from varied offer documents
2. ✅ Identify reusable structural patterns from successful content
3. ✅ Generate scripts that feel human and on-brand
4. ✅ Provide insights that actually improve performance over time
5. ✅ Maintain consistency while enabling experimentation
6. ✅ Scale to handle 10+ offers with distinct strategies simultaneously

---

## Domain-Specific Knowledge to Incorporate

**Direct Response Marketing Principles**:
- Awareness stages (unaware → most aware)
- PAS framework (Problem-Agitate-Solve)
- AIDA (Attention-Interest-Desire-Action)
- Unique Mechanism importance
- Social proof and authority building

**Instagram Reels Best Practices**:
- Hook in first 3 seconds (critical)
- Fast pacing (3-5 second cuts in visual content)
- Vertical format (9:16)
- Captions for sound-off viewing
- Pattern interrupts to stop scrolling
- Strong CTA (comment, share, follow, link in bio)

**Content Strategy**:
- Content pillars (education, entertainment, inspiration, social proof)
- Rule of thirds (entertainment:education:promotion)
- Funnel alignment (cold/warm/hot traffic)
- Authority building before selling
- Variety to prevent audience fatigue

---

## Additional Notes

- **Voice Consistency**: All outputs should match the offer's brand voice
- **Scalability**: Agents should handle multiple offers simultaneously without context bleed
- **Learning Loop**: System should improve over time, not just execute templates
- **Explainability**: Include rationale for decisions (helps with debugging and trust)
- **Graceful Degradation**: If data is insufficient, acknowledge uncertainty rather than guessing confidently

---

## Request

Please help me:
1. Set up these 6 specialized agents in Kodey.ai
2. Configure the 4 workflows described above
3. Provide agent IDs and workflow IDs for backend integration
4. Recommend any improvements to this architecture
5. Suggest additional agents or workflows that would enhance the system

Thank you! This agent system is the intelligence layer of our content creation platform.


