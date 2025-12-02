export interface PerformanceMetric {
  id: string
  igPostId: string
  timestamp: string
  metrics: {
    views?: number
    plays?: number
    watchTime?: number
    saves: number
    shares: number
    comments: number
    likes: number
    profileVisits?: number
    follows?: number
    reach: number
    impressions: number
    engagement: number
  }
}

export interface AnalyticsSummary {
  offerId: string
  dateFrom: string
  dateTo: string
  totalPosts: number
  totalReach: number
  totalEngagement: number
  avgEngagementRate: number
  topPerformers: TopPerformer[]
  byTemplate: TemplatePerformance[]
  byAngle: AnglePerformance[]
  byHookType: HookPerformance[]
}

export interface TopPerformer {
  postId: string
  scriptId: string
  templateId: string
  caption: string
  videoUrl: string
  metrics: PerformanceMetric['metrics']
  engagementRate: number
  rank: number
}

export interface TemplatePerformance {
  templateId: string
  templateName: string
  postsCount: number
  avgEngagementRate: number
  totalReach: number
  performance: 'winner' | 'test' | 'loser'
}

export interface AnglePerformance {
  angle: string
  postsCount: number
  avgEngagementRate: number
  totalReach: number
  trend: 'up' | 'down' | 'stable'
}

export interface HookPerformance {
  hookType: string
  postsCount: number
  avgEngagementRate: number
  totalReach: number
  trend: 'up' | 'down' | 'stable'
}

export interface AIInsights {
  offerId: string
  generatedAt: string
  insights: {
    winningPatterns: string[]
    underperformingPatterns: string[]
    recommendations: string[]
    nextActions: string[]
  }
  confidenceScore: number
}

export interface AnalyticsRequest {
  offerId: string
  dateFrom?: string
  dateTo?: string
  groupBy?: 'template' | 'angle' | 'hook' | 'day'
}

