/**
 * Categories endpoint
 * GET /api/v1/categories
 */

import { NextResponse } from 'next/server';
import { mockCategories } from '@/lib/mock-data';

export async function GET() {
  try {
    // Return all categories with tags
    return NextResponse.json(
      {
        categories: mockCategories,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

