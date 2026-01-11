/**
 * Mock data generators for Arena API
 */

import type { ModelInfo, Category, LeaderboardEntry, PromptSuggestion } from './types';

/**
 * Available LLM models
 */
export const mockModels: ModelInfo[] = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'gemini-pro-1.5', name: 'Gemini Pro 1.5', provider: 'Google' },
  { id: 'gemini-ultra', name: 'Gemini Ultra', provider: 'Google' },
  { id: 'llama-3.1-70b', name: 'Llama 3.1 70B', provider: 'Meta' },
  { id: 'llama-3.1-405b', name: 'Llama 3.1 405B', provider: 'Meta' },
  { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral AI' },
  { id: 'command-r-plus', name: 'Command R+', provider: 'Cohere' },
];

/**
 * Get random model
 */
export const getRandomModel = (): ModelInfo => {
  return mockModels[Math.floor(Math.random() * mockModels.length)];
};

/**
 * Get two different random models
 */
export const getRandomModelPair = (): [ModelInfo, ModelInfo] => {
  const modelA = getRandomModel();
  let modelB = getRandomModel();
  
  // Ensure models are different
  while (modelB.id === modelA.id) {
    modelB = getRandomModel();
  }
  
  return [modelA, modelB];
};

/**
 * Marketing categories with tags
 */
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'SEO',
    slug: 'seo',
    description: 'Search Engine Optimization',
    sort_order: 1,
    tags: [
      { id: '1', name: 'Meta Descriptions', slug: 'meta-descriptions', usage_count: 42 },
      { id: '2', name: 'Title Tags', slug: 'title-tags', usage_count: 38 },
      { id: '3', name: 'Keywords Research', slug: 'keywords-research', usage_count: 35 },
      { id: '4', name: 'Content Optimization', slug: 'content-optimization', usage_count: 31 },
    ],
  },
  {
    id: '2',
    name: 'SMM',
    slug: 'smm',
    description: 'Social Media Marketing',
    sort_order: 2,
    tags: [
      { id: '5', name: 'LinkedIn Posts', slug: 'linkedin-posts', usage_count: 28 },
      { id: '6', name: 'Instagram Captions', slug: 'instagram-captions', usage_count: 26 },
      { id: '7', name: 'Twitter Threads', slug: 'twitter-threads', usage_count: 24 },
      { id: '8', name: 'Social Strategy', slug: 'social-strategy', usage_count: 22 },
    ],
  },
  {
    id: '3',
    name: 'Content',
    slug: 'content',
    description: 'Content Marketing',
    sort_order: 3,
    tags: [
      { id: '9', name: 'Blog Posts', slug: 'blog-posts', usage_count: 45 },
      { id: '10', name: 'Email Copy', slug: 'email-copy', usage_count: 40 },
      { id: '11', name: 'Landing Pages', slug: 'landing-pages', usage_count: 38 },
    ],
  },
  {
    id: '4',
    name: 'PPC',
    slug: 'ppc',
    description: 'Pay-Per-Click Advertising',
    sort_order: 4,
    tags: [
      { id: '12', name: 'Ad Copy', slug: 'ad-copy', usage_count: 33 },
      { id: '13', name: 'Google Ads', slug: 'google-ads', usage_count: 30 },
      { id: '14', name: 'Facebook Ads', slug: 'facebook-ads', usage_count: 28 },
    ],
  },
  {
    id: '5',
    name: 'QWE',
    slug: 'qwe',
    description: 'Quick Web Engineering',
    sort_order: 5,
    tags: [
      { id: '15', name: 'Frontend Development', slug: 'frontend-dev', usage_count: 52 },
      { id: '16', name: 'Backend APIs', slug: 'backend-apis', usage_count: 48 },
      { id: '17', name: 'Database Design', slug: 'database-design', usage_count: 41 },
      { id: '18', name: 'DevOps & Deployment', slug: 'devops-deployment', usage_count: 36 },
    ],
  },
];

/**
 * Generate mock leaderboard
 */
export const generateLeaderboard = (category: string): LeaderboardEntry[] => {
  return mockModels.map((model, index) => ({
    model_id: model.id,
    model_name: model.name,
    provider: model.provider,
    rank: index + 1,
    score: 45 - index * 2.5,
    wins: Math.floor(Math.random() * 50) + 20,
    losses: Math.floor(Math.random() * 20) + 5,
    ties: Math.floor(Math.random() * 10) + 1,
    total_battles: Math.floor(Math.random() * 80) + 40,
    win_rate: 0.85 - index * 0.05,
    quality_score: 0.95 - index * 0.03,
    is_provisional: index > 5,
  }));
};

/**
 * Prompt suggestions
 */
export const mockPromptSuggestions: PromptSuggestion[] = [
  {
    id: '1',
    title: 'SEO Blog Outline',
    text: 'Create an SEO-optimized blog post outline about sustainable fashion trends for Q1 2025',
    category: 'SEO',
  },
  {
    id: '2',
    title: 'Meta Description',
    text: 'Write a compelling meta description (155 chars) for a landing page about AI-powered marketing tools',
    category: 'SEO',
  },
  {
    id: '3',
    title: 'LinkedIn Post',
    text: 'Draft an engaging LinkedIn post about the future of remote work in tech companies',
    category: 'SMM',
  },
  {
    id: '4',
    title: 'Instagram Caption',
    text: 'Create an Instagram caption for a product launch in the sustainable beauty niche',
    category: 'SMM',
  },
  {
    id: '5',
    title: 'Email Subject Lines',
    text: 'Generate 5 compelling email subject lines for a SaaS product announcement',
    category: 'Content',
  },
  {
    id: '6',
    title: 'Landing Page Copy',
    text: 'Write a persuasive hero section for a B2B marketing automation platform',
    category: 'Content',
  },
  {
    id: '7',
    title: 'Google Ads Copy',
    text: 'Create 3 variations of Google Ads copy (90 chars) for an e-commerce store selling eco-friendly products',
    category: 'PPC',
  },
  {
    id: '8',
    title: 'Facebook Ad Headline',
    text: 'Write 5 attention-grabbing Facebook ad headlines for a fitness app targeting busy professionals',
    category: 'PPC',
  },
  {
    id: '9',
    title: 'React Component',
    text: 'Create a reusable React component for a pagination control with TypeScript support and accessibility features',
    category: 'QWE',
  },
  {
    id: '10',
    title: 'REST API Endpoint',
    text: 'Design a RESTful API endpoint for user authentication with JWT tokens and refresh token rotation',
    category: 'QWE',
  },
  {
    id: '11',
    title: 'Database Schema',
    text: 'Create a PostgreSQL schema for an e-commerce platform with proper indexing and relationships',
    category: 'QWE',
  },
  {
    id: '12',
    title: 'Docker Configuration',
    text: 'Write a Dockerfile and docker-compose.yml for a Node.js microservice with MongoDB and Redis',
    category: 'QWE',
  },
];

/**
 * Generate mock AI response chunks
 */
export const generateResponseChunks = (prompt: string): string[] => {
  const responses = [
    "Here's a comprehensive response to your marketing question. ",
    "Based on current best practices and industry trends, ",
    "I recommend the following strategic approach:\n\n",
    "1. **Research & Analysis**: Start by conducting thorough market research ",
    "and analyzing your target audience's behavior patterns.\n\n",
    "2. **Content Strategy**: Develop a content plan that aligns with ",
    "your audience's needs and search intent.\n\n",
    "3. **Optimization**: Apply SEO best practices including ",
    "keyword optimization, meta tags, and structured data.\n\n",
    "4. **Engagement**: Focus on creating engaging, valuable content ",
    "that resonates with your audience.\n\n",
    "5. **Measurement**: Track performance metrics and iterate ",
    "based on data-driven insights.\n\n",
    "This approach should help you achieve your marketing objectives ",
    "while maintaining authenticity and providing real value to your audience.",
  ];
  
  return responses;
};

/**
 * Get random suggestions
 */
export const getRandomSuggestions = (limit = 10): PromptSuggestion[] => {
  const shuffled = [...mockPromptSuggestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(limit, mockPromptSuggestions.length));
};

