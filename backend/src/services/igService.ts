import axios from 'axios'
import prisma from '../lib/prisma'
import { ApiError } from '../middleware/errorHandler'

const igClient = axios.create({
  baseURL: 'https://graph.facebook.com/v18.0',
})

export async function searchHighPerformers(searchParams: any) {
  // Mock implementation - would use Instagram Graph API
  // Real implementation would search hashtags and retrieve high-performing posts
  return []
}

export async function getPublishedPosts(offerId?: string) {
  const where: any = {}
  
  if (offerId) {
    where.campaignScript = {
      campaign: {
        offerId,
      },
    }
  }

  return prisma.instagramPost.findMany({
    where,
    include: {
      campaignScript: {
        include: {
          script: true,
        },
      },
      performanceMetrics: {
        orderBy: {
          timestamp: 'desc',
        },
        take: 1,
      },
    },
    orderBy: {
      timestamp: 'desc',
    },
  })
}

export async function getPost(id: string) {
  const post = await prisma.instagramPost.findUnique({
    where: { id },
    include: {
      performanceMetrics: {
        orderBy: {
          timestamp: 'desc',
        },
        take: 1,
      },
    },
  })

  if (!post) {
    throw new ApiError(404, 'Instagram post not found')
  }

  return post
}

export async function getPostMetrics(postId: string) {
  const post = await prisma.instagramPost.findUnique({
    where: { id: postId },
  })

  if (!post) {
    throw new ApiError(404, 'Post not found')
  }

  // Fetch latest metrics from Instagram API
  const metrics = await fetchIGMetrics(post.instagramPostId)
  
  // Store metrics
  await prisma.performanceMetric.create({
    data: {
      instagramPostId: post.id,
      metrics,
    },
  })

  return metrics
}

export async function publish(publishData: any) {
  // Real implementation would use Instagram Graph API to publish
  // For now, returning mock response
  return {
    id: 'mock-publish-id',
    instagramPostId: 'mock-ig-post-id',
    permalink: 'https://instagram.com/p/mock',
    status: 'published',
  }
}

async function fetchIGMetrics(instagramPostId: string) {
  // Mock implementation - would fetch from Instagram Insights API
  return {
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    reach: 0,
    impressions: 0,
    engagement: 0,
  }
}

