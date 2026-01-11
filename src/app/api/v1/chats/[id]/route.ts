/**
 * Chat history endpoint
 * GET /api/v1/chats/{id}
 */

import { NextRequest, NextResponse } from 'next/server';
import { getChat, getChatTurns, getTurnMessages, initializeSeedData } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Initialize seed data on first request
    initializeSeedData();
    
    const chatId = params.id;

    // Get chat
    const chat = getChat(chatId);
    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    // Get all turns for chat
    const turns = getChatTurns(chatId);

    // Build response with turns and messages
    const turnsResponse = turns.map((turn) => {
      const messages = getTurnMessages(turn.id);

      return {
        id: turn.id,
        turn_number: turn.turnNumber,
        status: turn.status,
        vote: turn.vote || null,
        model_a: turn.modelA || null,
        model_b: turn.modelB || null,
        messages: messages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          model_id: msg.modelId || null,
          sequence_number: msg.sequenceNumber,
          response_time_ms: msg.responseTimeMs || null,
          created_at: msg.createdAt,
        })),
      };
    });

    return NextResponse.json(
      {
        id: chat.id,
        mode: chat.mode,
        name: chat.name,
        status: chat.status,
        turns: turnsResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}

