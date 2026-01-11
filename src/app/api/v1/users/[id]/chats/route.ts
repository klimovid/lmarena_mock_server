/**
 * User chats endpoint
 * GET /api/v1/users/{id}/chats
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserChats, initializeSeedData } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Initialize seed data
    initializeSeedData();
    
    const userId = params.id;
    const url = new URL(request.url);
    
    // Parse query params
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    // Validate limits
    const validLimit = Math.min(Math.max(1, limit), 100);
    const validOffset = Math.max(0, offset);

    // Get user's chats
    const allChats = getUserChats(userId);
    
    // Apply pagination
    const paginatedChats = allChats.slice(validOffset, validOffset + validLimit);

    // Map to response format
    const chats = paginatedChats.map((chat) => ({
      id: chat.id,
      mode: chat.mode,
      status: chat.status,
      name: chat.name,
      created_at: chat.createdAt,
      updated_at: chat.updatedAt,
    }));

    return NextResponse.json({ chats }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user chats' },
      { status: 500 }
    );
  }
}

