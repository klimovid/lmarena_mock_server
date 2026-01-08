/**
 * Chat management endpoints
 * POST /api/v1/chats - Create chat
 */

import { NextRequest, NextResponse } from 'next/server';
import { createChat } from '@/lib/storage';

interface CreateChatRequest {
  user_id: string;
  mode: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateChatRequest;

    // Validate request
    if (!body.user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    // Create chat with initial turn
    const { chat, turn } = createChat(body.user_id);

    // Return response
    return NextResponse.json(
      {
        id: chat.id,
        mode: chat.mode,
        name: chat.name,
        status: chat.status,
        turn_id: turn.id,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create chat' },
      { status: 500 }
    );
  }
}

