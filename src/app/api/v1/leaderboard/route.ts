/**
 * Leaderboard endpoint
 * GET /api/v1/leaderboard?category=seo&tags=meta-descriptions&limit=50
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateLeaderboard, mockCategories } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    
    // Parse query params
    const category = url.searchParams.get('category');
    const tagsParam = url.searchParams.get('tags');
    const limitParam = url.searchParams.get('limit');

    // Validate category
    if (!category) {
      return NextResponse.json(
        { error: 'category parameter is required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const categoryExists = mockCategories.some((cat) => cat.slug === category);
    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Parse tags (comma-separated)
    const tags = tagsParam ? tagsParam.split(',').map((t) => t.trim()) : [];

    // Parse limit
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), 100) : 50;

    // Generate leaderboard
    let entries = generateLeaderboard(category);

    // Apply limit
    entries = entries.slice(0, limit);

    // Return response
    return NextResponse.json(
      {
        category,
        entries,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

