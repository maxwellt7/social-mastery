# API Integration Documentation

## Creatify API

### Authentication
- **Method**: Header-based authentication
- **Headers Required**:
  - `X-API-ID`: Your API ID from Creatify dashboard
  - `X-API-KEY`: Your API key from Creatify dashboard

### Endpoints

#### Text-to-Speech
- **Endpoint**: `POST /api/v1/text-to-speech`
- **Purpose**: Convert script text to voiceover
- **Request Body**:
```json
{
  "text": "Your script text here",
  "voice_id": "voice_identifier",
  "language": "en-US"
}
```

#### Create Video (AI Avatar)
- **Endpoint**: `POST /api/v1/videos`
- **Purpose**: Generate video from script with AI avatar
- **Request Body**:
```json
{
  "script": "Video script text",
  "avatar_id": "avatar_identifier",
  "voice_id": "voice_identifier",
  "aspect_ratio": "9:16",
  "duration": "auto"
}
```

#### Get Video Status
- **Endpoint**: `GET /api/v1/videos/{job_id}`
- **Purpose**: Check video generation status
- **Response**:
```json
{
  "job_id": "uuid",
  "status": "pending|processing|completed|failed",
  "video_url": "https://...",
  "created_at": "ISO date",
  "completed_at": "ISO date"
}
```

#### URL-to-Video
- **Endpoint**: `POST /api/v1/url-to-video`
- **Purpose**: Generate video from URL content
- **Request Body**:
```json
{
  "url": "https://example.com/product",
  "style": "dynamic",
  "duration": 30
}
```

## Kodey.ai API

### Authentication
- **Method**: Bearer token authentication
- **Header**: `Authorization: Bearer {your_api_key}`

### Endpoints

#### Create Agent
- **Endpoint**: `POST /api/v1/agents`
- **Purpose**: Create a new AI agent for specific tasks
- **Request Body**:
```json
{
  "name": "PDF Analyzer Agent",
  "description": "Extracts and analyzes offer documents",
  "capabilities": ["document_analysis", "extraction"],
  "instructions": "System instructions here"
}
```

#### Execute Agent Task
- **Endpoint**: `POST /api/v1/agents/{agent_id}/execute`
- **Purpose**: Run an agent task
- **Request Body**:
```json
{
  "input": "Task input data",
  "context": {},
  "parameters": {}
}
```

#### Upload to Knowledge Base
- **Endpoint**: `POST /api/v1/knowledge-base/upload`
- **Purpose**: Add documents to agent knowledge base
- **Supported Formats**: `.pdf`, `.docx`, `.txt`, `.csv`
- **Request**: Multipart form-data with file

#### Create Workflow
- **Endpoint**: `POST /api/v1/workflows`
- **Purpose**: Create automated workflow
- **Request Body**:
```json
{
  "name": "Content Generation Pipeline",
  "steps": [
    {
      "agent_id": "agent_1",
      "action": "extract",
      "outputs": ["offer_data"]
    },
    {
      "agent_id": "agent_2",
      "action": "generate",
      "inputs": ["offer_data"]
    }
  ]
}
```

#### Execute Workflow
- **Endpoint**: `POST /api/v1/workflows/{workflow_id}/execute`
- **Purpose**: Run a workflow
- **Request Body**:
```json
{
  "inputs": {},
  "parameters": {}
}
```

## Instagram Graph API

### Authentication
- **Method**: OAuth 2.0
- **Token Type**: User Access Token with Business Account permissions
- **Required Permissions**:
  - `instagram_basic`
  - `instagram_content_publish`
  - `instagram_manage_insights`
  - `pages_read_engagement`
  - `pages_manage_metadata`

### Endpoints

#### Get Media Insights
- **Endpoint**: `GET /{media-id}/insights`
- **Purpose**: Retrieve performance metrics
- **Metrics Available**:
  - `impressions`
  - `reach`
  - `engagement`
  - `saved`
  - `shares`
  - `video_views`
  - `total_interactions`

#### Create Media Container (Video)
- **Endpoint**: `POST /{ig-user-id}/media`
- **Purpose**: Upload video for publishing
- **Parameters**:
  - `media_type`: VIDEO
  - `video_url`: Publicly accessible video URL
  - `caption`: Post caption with hashtags
  - `share_to_feed`: true/false

#### Publish Media
- **Endpoint**: `POST /{ig-user-id}/media_publish`
- **Purpose**: Publish uploaded media
- **Parameters**:
  - `creation_id`: Container ID from previous step

#### Search Hashtags
- **Endpoint**: `GET /ig_hashtag_search`
- **Purpose**: Find hashtag IDs
- **Parameters**:
  - `user_id`: IG Business User ID
  - `q`: Hashtag name (without #)

#### Get Hashtag Media
- **Endpoint**: `GET /{ig-hashtag-id}/recent_media`
- **Purpose**: Get recent posts with hashtag
- **Fields**: `id`, `caption`, `like_count`, `comments_count`, `media_url`

#### Get User Media
- **Endpoint**: `GET /{ig-user-id}/media`
- **Purpose**: Retrieve user's posts
- **Fields**: `id`, `caption`, `media_type`, `media_url`, `timestamp`, `like_count`

## Rate Limiting

### Creatify
- **Rate Limit**: Depends on plan tier
- **Recommendation**: Implement exponential backoff
- **Queue**: Use BullMQ to manage concurrent requests

### Kodey.ai
- **Rate Limit**: Standard API rate limits apply
- **Concurrent Agents**: Check plan limits
- **Workflow Execution**: Queue-based execution recommended

### Instagram Graph API
- **Rate Limit**: 200 calls per hour per user (standard)
- **Batch Requests**: Use batch API for efficiency
- **Error Codes**:
  - `4`: Rate limit exceeded
  - `17`: User request limit reached
  - `32`: Page request limit reached

## Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

### Retry Strategy
1. **Transient Errors** (5xx, rate limits): Exponential backoff
2. **Client Errors** (4xx): Log and alert, no retry
3. **Authentication Errors**: Refresh tokens if applicable
4. **Network Errors**: Retry with timeout increase

## Webhook Configuration (Optional)

### Creatify Webhooks
- **Event**: `video.completed`
- **Payload**:
```json
{
  "event": "video.completed",
  "job_id": "uuid",
  "video_url": "https://...",
  "timestamp": "ISO date"
}
```

### Instagram Webhooks
- **Subscription**: Media insights updates
- **Verification**: GET request with `hub.challenge`
- **Events**: Comments, mentions, story mentions
