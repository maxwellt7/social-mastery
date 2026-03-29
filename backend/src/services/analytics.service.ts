import { Request, Response } from 'express'
import prisma from '../utils/prisma.js'
import { instagramClient } from '../integrations/instagram.client.js'
import { kodeyClient } from '../integrations/kodey.client.js'
import { AppError } from '../middleware/errorHandler.js'
import { logger } from '../utils/logger.js'

export async function getSummary(req: Request, res: Response) {
  const { offerId, startDate, endDate } = req.query

  if (!offerId) {
    throw new AppError('Offer ID is required', 400)
  }

  try {
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate as string) : new Date()

    // Get all posts for the offer within date range
    const posts = await prisma.instagramPost.findMany({
      where: {
        campaignScript: {
          campaign: {
            offerId: offerId as string,
          },
        },
        postedAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        performanceMetrics: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
        campaignScript: {
          include: {
            script: {
              include: {
                template: true,
              },
            },
          },
        },
      },
    })

    // Aggregate metrics
    const aggregated = {
      totalPosts: posts.length,
      totalImpressions: 0,
      totalReach: 0,
      totalLikes: 0,
      totalComments: 0,
      totalSaves: 0,
      totalShares: 0,
      totalPlays: 0,
      byTemplate: {} as any,
      byAngle: {} as any,
      byHookType: {} as any,
      topPerformers: [] as any[],
    }

    posts.forEach((post: any) => {
      const latestMetrics = post.performanceMetrics[0]?.metricsJson as any

      if (latestMetrics) {
        aggregated.totalImpressions += latestMetrics.impressions || 0
        aggregated.totalReach += latestMetrics.reach || 0
        aggregated.totalLikes += latestMetrics.likes || 0
        aggregated.totalComments += latestMetrics.comments || 0
        aggregated.totalSaves += latestMetrics.saves || 0
        aggregated.totalShares += latestMetrics.shares || 0
        aggregated.totalPlays += latestMetrics.plays || 0

        // Aggregate by template
        const templateId = post.campaignScript.script.templateId
        if (!aggregated.byTemplate[templateId]) {
          aggregated.byTemplate[templateId] = {
            templateId,
            templateDescription: post.campaignScript.script.template.structuralDescription,
            count: 0,
            totalEngagement: 0,
          }
        }
        aggregated.byTemplate[templateId].count++
        aggregated.byTemplate[templateId].totalEngagement +=
          (latestMetrics.likes || 0) + (latestMetrics.comments || 0) + (latestMetrics.saves || 0)

        // Aggregate by angle
        const angle = post.campaignScript.script.angle
        if (!aggregated.byAngle[angle]) {
          aggregated.byAngle[angle] = { angle, count: 0, totalEngagement: 0 }
        }
        aggregated.byAngle[angle].count++
        aggregated.byAngle[angle].totalEngagement +=
          (latestMetrics.likes || 0) + (latestMetrics.comments || 0) + (latestMetrics.saves || 0)

        // Aggregate by hook type
        const hookType = post.campaignScript.script.hookType
        if (hookType) {
          if (!aggregated.byHookType[hookType]) {
            aggregated.byHookType[hookType] = { hookType, count: 0, totalEngagement: 0 }
          }
          aggregated.byHookType[hookType].count++
          aggregated.byHookType[hookType].totalEngagement +=
            (latestMetrics.likes || 0) + (latestMetrics.comments || 0) + (latestMetrics.saves || 0)
        }
      }
    })

    // Calculate top performers
    aggregated.topPerformers = posts
      .map((post: any) => {
        const metrics = post.performanceMetrics[0]?.metricsJson as any
        const engagement = (metrics?.likes || 0) + (metrics?.comments || 0) + (metrics?.saves || 0)
        return {
          postId: post.id,
          igPostId: post.igPostId,
          permalink: post.igPermalink,
          engagement,
          metrics,
          scriptAngle: post.campaignScript.script.angle,
          templateDescription: post.campaignScript.script.template.structuralDescription,
        }
      })
      .sort((a: any, b: any) => b.engagement - a.engagement)
      .slice(0, 10)

    res.json({
      success: true,
      data: aggregated,
    })
  } catch (error) {
    logger.error('Error getting analytics summary:', error)
    throw new AppError('Failed to get analytics summary', 500)
  }
}

export async function generateInsights(req: Request, res: Response) {
  const { offerId } = req.body

  if (!offerId) {
    throw new AppError('Offer ID is required', 400)
  }

  try {
    // Get performance summary
    const summary = await getPerformanceData(offerId)

    // Get insights agent
    const insightsAgent = await getOrCreateInsightsAgent()

    // Generate insights
    const agentResponse = await kodeyClient.executeAgent(insightsAgent.agent_id, {
      input: summary,
      context: {
        task: 'generate_performance_insights',
        offerId,
      },
    })

    const insights = JSON.parse(agentResponse.output as string)

    res.json({
      success: true,
      data: insights,
      message: 'Insights generated successfully',
    })
  } catch (error) {
    logger.error('Error generating insights:', error)
    throw new AppError('Failed to generate insights', 500)
  }
}

async function getPerformanceData(offerId: string) {
  const posts = await prisma.instagramPost.findMany({
    where: {
      campaignScript: {
        campaign: {
          offerId,
        },
      },
    },
    include: {
      performanceMetrics: {
        orderBy: { timestamp: 'desc' },
        take: 1,
      },
      campaignScript: {
        include: {
          script: {
            include: {
              template: true,
            },
          },
        },
      },
    },
  })

  return {
    totalPosts: posts.length,
    posts: posts.map((post: any) => ({
      metrics: post.performanceMetrics[0]?.metricsJson,
      angle: post.campaignScript.script.angle,
      hookType: post.campaignScript.script.hookType,
      templateDescription: post.campaignScript.script.template.structuralDescription,
      pillar: post.campaignScript.script.template.pillar,
    })),
  }
}

async function getOrCreateInsightsAgent() {
  const existingAgent = await prisma.aIAgent.findFirst({
    where: { type: 'insights', name: 'Performance Insights Agent' },
  })

  if (existingAgent && existingAgent.kodeyAgentId) {
    return { agent_id: existingAgent.kodeyAgentId }
  }

  const agent = await kodeyClient.createAgent({
    name: 'Performance Insights Agent',
    type: 'insights',
    instructions: `Analyze content performance data and generate actionable insights.

Given performance data with posts, angles, hooks, templates, and metrics, identify:
1. Winning Patterns: What's performing best and why
2. Losing Patterns: What's underperforming
3. Recommendations: Specific actions to improve future content
4. Hook Insights: Which hook types work best
5. Angle Insights: Which angles resonate most
6. Template Insights: Which template structures perform best

Return JSON:
{
  "summary": "Overall performance summary",
  "winningPatterns": ["pattern 1", "pattern 2"],
  "losingPatterns": ["pattern 1", "pattern 2"],
  "recommendations": ["action 1", "action 2"],
  "hookInsights": "insights about hooks",
  "angleInsights": "insights about angles",
  "templateInsights": "insights about templates"
}`,
    model: 'gpt-4',
    temperature: 0.7,
  })

  await prisma.aIAgent.create({
    data: {
      name: agent.name,
      type: agent.type,
      kodeyAgentId: agent.agent_id,
      instructions: agent.type,
      model: 'gpt-4',
      temperature: 0.7,
      status: 'active',
    },
  })

  return agent
}

export async function getPostPerformance(req: Request, res: Response) {
  const { postId } = req.params

  const post = await prisma.instagramPost.findUnique({
    where: { id: postId },
    include: {
      performanceMetrics: {
        orderBy: { timestamp: 'desc' },
      },
      campaignScript: {
        include: {
          script: {
            include: {
              template: true,
            },
          },
          campaign: true,
        },
      },
    },
  })

  if (!post) {
    throw new AppError('Post not found', 404)
  }

  res.json({
    success: true,
    data: post,
  })
}

