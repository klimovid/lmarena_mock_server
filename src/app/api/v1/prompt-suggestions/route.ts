/**
 * Prompt suggestions endpoint
 * GET /api/v1/prompt-suggestions?limit=10
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRandomSuggestions } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    
    // Parse query params
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), 50) : 10;

    // Get random suggestions
    const suggestions = getRandomSuggestions(limit);

    return NextResponse.json(
      { suggestions },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch prompt suggestions' },
      { status: 500 }
    );
  }
}

