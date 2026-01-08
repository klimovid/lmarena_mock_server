/**
 * Home page
 */

export default function HomePage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>🎯 Arena Mock API Server</h1>
      <p>Mock API server for Arena frontend development and testing.</p>
      
      <h2>📖 API Documentation</h2>
      <p>All endpoints are prefixed with <code>/api/v1</code></p>
      
      <h3>Available Endpoints:</h3>
      <ul>
        <li><code>GET /api/v1/health</code> - Health check</li>
        <li><code>POST /api/v1/session</code> - Create session</li>
        <li><code>POST /api/v1/users</code> - Create user</li>
        <li><code>GET /api/v1/users/:id/chats</code> - Get user chats</li>
        <li><code>POST /api/v1/chats</code> - Create chat</li>
        <li><code>GET /api/v1/chats/:id</code> - Get chat history</li>
        <li><code>POST /api/v1/chats/:id/messages/stream</code> - Stream messages (SSE)</li>
        <li><code>POST /api/v1/turns/:id/vote</code> - Submit vote</li>
        <li><code>GET /api/v1/categories</code> - Get categories</li>
        <li><code>GET /api/v1/leaderboard</code> - Get leaderboard</li>
        <li><code>GET /api/v1/prompt-suggestions</code> - Get suggestions</li>
      </ul>
      
      <h3>Quick Test:</h3>
      <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
        {`curl ${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8080'}/api/v1/health`}
      </pre>
      
      <h3>Resources:</h3>
      <ul>
        <li><a href="https://github.com/your-repo/arena_mock_server">GitHub Repository</a></li>
        <li><a href="/api/v1/health">Health Check</a></li>
      </ul>
      
      <footer style={{ marginTop: '2rem', color: '#666' }}>
        <p>Built with Next.js 14 • Deployed on Vercel</p>
      </footer>
    </main>
  );
}

