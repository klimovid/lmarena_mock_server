# Arena Mock API Server

Mock API server for Arena frontend development and testing. Built with Next.js 14 and optimized for Vercel deployment.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Server will run on http://localhost:8080
```

### Production Build

```bash
# Build for production
yarn build

# Start production server
yarn start
```

## 📦 Deployment to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd arena_mock_server
vercel

# For production
vercel --prod
```

### Option 2: GitHub Integration

1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel auto-detects Next.js → zero config needed
5. Deploy!

Your API will be available at: `https://your-project.vercel.app/api/v1`

## 🔌 API Endpoints

All endpoints are prefixed with `/api/v1`

### Health Check
- `GET /health` - Server health status

### Session Management
- `POST /session` - Create or validate session

### User Management
- `POST /users` - Create anonymous user
- `GET /users/{id}/chats` - Get user's chats

### Chat Management
- `POST /chats` - Create new chat
- `GET /chats/{id}` - Get chat history
- `POST /chats/{id}/messages/stream` - Send message (SSE streaming)

### Voting
- `POST /turns/{id}/vote` - Submit vote and reveal models

### Leaderboard
- `GET /categories` - Get all categories with tags
- `GET /leaderboard?category={slug}&tags={tags}&limit={n}` - Get leaderboard

### Suggestions
- `GET /prompt-suggestions?limit={n}` - Get random prompt suggestions

## 📖 Example Usage

### Create User and Start Chat

```bash
# Create user
curl -X POST http://localhost:8080/api/v1/users

# Response: { "id": "user-uuid" }

# Create chat
curl -X POST http://localhost:8080/api/v1/chats \
  -H "Content-Type: application/json" \
  -d '{"user_id": "user-uuid", "mode": "battle"}'

# Response: { "id": "chat-uuid", "turn_id": "turn-uuid", ... }
```

### Send Message with Streaming

```bash
curl -X POST http://localhost:8080/api/v1/chats/{chat-id}/messages/stream \
  -H "Content-Type: application/json" \
  -d '{"content": "Write an SEO-friendly title"}' \
  --no-buffer

# SSE Response:
# event: chunk
# data: {"model_id":"model_a","content":"Here's...","sequence":1}
#
# event: chunk
# data: {"model_id":"model_b","content":"Here's...","sequence":1}
#
# event: done
# data: {"turn_id":"turn-uuid","status":"completed"}
```

### Submit Vote

```bash
curl -X POST http://localhost:8080/api/v1/turns/{turn-id}/vote \
  -H "Content-Type: application/json" \
  -d '{"winner": "model_a"}'

# Response includes revealed models and new turn ID
```

### Get Leaderboard

```bash
curl http://localhost:8080/api/v1/leaderboard?category=seo&tags=meta-descriptions&limit=10

# Response: { "category": "seo", "entries": [...] }
```

## 🔧 Configuration

### Environment Variables

Create `.env.local` file:

```env
NODE_ENV=development
PORT=8080
```

### CORS Configuration

CORS is configured in:
- `src/middleware.ts` - Global middleware
- `vercel.json` - Vercel-specific headers

Default: Allows all origins (`*`)

For production, update `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/api/v1/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "https://yourdomain.com" }
      ]
    }
  ]
}
```

## 🗄️ Data Storage

**In-Memory Storage**: Data resets on deployment (perfect for mocking)

Storage managed in `src/lib/storage.ts`:
- Users
- Chats
- Turns
- Messages
- User-Chat mappings

## 🎯 Mock Data

Mock data generators in `src/lib/mock-data.ts`:

- **10 LLM Models**: GPT-4o, Claude 3.5, Gemini, Llama, etc.
- **4 Categories**: SEO, SMM, Content, PPC with tags
- **8 Prompt Suggestions**: Ready-to-use examples
- **Dynamic Leaderboards**: Generated per category

## 📝 API Response Examples

### Create Chat Response

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "mode": "battle",
  "name": "Untitled Chat",
  "status": "active",
  "turn_id": "550e8400-e29b-41d4-a716-446655440001"
}
```

### Vote Response

```json
{
  "id": "turn-uuid",
  "revealed_models": {
    "model_a": {
      "id": "gpt-4o",
      "name": "GPT-4o",
      "provider": "OpenAI"
    },
    "model_b": {
      "id": "claude-3.5-sonnet",
      "name": "Claude 3.5 Sonnet",
      "provider": "Anthropic"
    }
  },
  "new_turn_id": "new-turn-uuid",
  "category": "seo",
  "tags": ["meta-descriptions", "title-tags"]
}
```

### Leaderboard Entry

```json
{
  "model_id": "gpt-4o",
  "model_name": "GPT-4o",
  "provider": "OpenAI",
  "rank": 1,
  "score": 45.0,
  "wins": 42,
  "losses": 10,
  "ties": 3,
  "total_battles": 55,
  "win_rate": 0.7636,
  "quality_score": 0.95,
  "is_provisional": false
}
```

## 🧪 Testing

Use the mock server with your frontend:

```bash
# In frontend .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1

# Or with deployed Vercel URL
NEXT_PUBLIC_API_BASE_URL=https://your-mock-server.vercel.app/api/v1
```

## 🏗️ Project Structure

```
arena_mock_server/
├── src/
│   ├── app/
│   │   └── api/
│   │       └── v1/
│   │           ├── health/
│   │           ├── session/
│   │           ├── users/
│   │           ├── chats/
│   │           ├── turns/
│   │           ├── leaderboard/
│   │           ├── categories/
│   │           └── prompt-suggestions/
│   ├── lib/
│   │   ├── types.ts          # TypeScript types
│   │   ├── storage.ts        # In-memory data storage
│   │   ├── mock-data.ts      # Mock data generators
│   │   └── sse.ts            # SSE streaming utilities
│   └── middleware.ts         # CORS & session middleware
├── package.json
├── tsconfig.json
├── next.config.ts
├── vercel.json              # Vercel configuration
└── README.md
```

## 🔍 Debugging

### Check Health

```bash
curl http://localhost:8080/api/v1/health
```

### View Logs

```bash
# Vercel deployment logs
vercel logs

# Local development logs
# Check terminal running `yarn dev`
```

### Common Issues

**CORS Errors**: 
- Check `src/middleware.ts`
- Update `Access-Control-Allow-Origin` in `vercel.json`

**SSE Streaming Not Working**:
- Ensure client uses `credentials: 'include'`
- Check for proxy/nginx buffering (`X-Accel-Buffering: no`)

**Session Not Persisting**:
- Check cookie settings in browser DevTools
- Ensure `credentials: 'include'` in fetch options

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)

## 🤝 Contributing

This is a development mock server. To add new endpoints:

1. Create route file in `src/app/api/v1/{endpoint}/route.ts`
2. Implement GET/POST/PUT/DELETE methods
3. Use storage helpers from `src/lib/storage.ts`
4. Add mock data to `src/lib/mock-data.ts` if needed

## 📄 License

MIT License - Use freely for development and testing.

# lmarena_mock_server
# lmarena_mock_server
# lmarena_mock_server
