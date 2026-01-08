/**
 * Type definitions for Arena Mock API
 * Based on OpenAPI specification
 */

export interface User {
  id: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  userId: string;
  mode: 'battle' | 'direct';
  status: 'active' | 'completed' | 'archived';
  name: string;
  currentTurnId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Turn {
  id: string;
  chatId: string;
  turnNumber: number;
  status: 'waiting' | 'streaming' | 'completed' | 'voted';
  vote?: 'model_a' | 'model_b' | 'tie' | 'both_bad';
  modelA?: ModelInfo;
  modelB?: ModelInfo;
}

export interface Message {
  id: string;
  turnId: string;
  role: 'user' | 'assistant';
  content: string;
  modelId?: string;
  sequenceNumber: number;
  responseTimeMs?: number;
  createdAt: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  tags: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  usage_count: number;
}

export interface LeaderboardEntry {
  model_id: string;
  model_name: string;
  provider: string;
  rank: number;
  score: number;
  wins: number;
  losses: number;
  ties: number;
  total_battles: number;
  win_rate: number;
  quality_score: number;
  is_provisional: boolean;
}

export interface PromptSuggestion {
  id: string;
  title: string;
  text: string;
  category: string;
}

