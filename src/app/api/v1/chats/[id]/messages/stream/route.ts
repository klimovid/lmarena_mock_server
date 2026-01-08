/**
 * SSE Streaming endpoint for chat messages
 * POST /api/v1/chats/{id}/messages/stream
 */

import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getChat, getTurn, addMessage, updateTurnStatus } from '@/lib/storage';
import { createSSEStream, delay } from '@/lib/sse';
import { generateResponseChunks } from '@/lib/mock-data';

interface SendMessageRequest {
  content: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chatId = params.id;
    const body = (await request.json()) as SendMessageRequest;

    // Validate request
    if (!body.content || body.content.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'content is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get chat
    const chat = getChat(chatId);
    if (!chat) {
      return new Response(
        JSON.stringify({ error: 'Chat not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get current turn
    const turn = getTurn(chat.currentTurnId);
    if (!turn) {
      return new Response(
        JSON.stringify({ error: 'Turn not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create SSE stream
    const stream = createSSEStream(async (writer) => {
      try {
        // Update turn status to streaming
        updateTurnStatus(turn.id, 'streaming');

        // Add user message
        const userMessage = {
          id: uuidv4(),
          turnId: turn.id,
          role: 'user' as const,
          content: body.content,
          sequenceNumber: 1,
          createdAt: new Date().toISOString(),
        };
        addMessage(turn.id, userMessage);

        // Generate response chunks for both models
        const chunks = generateResponseChunks(body.content);

        // Stream model A responses
        let contentA = '';
        for (const chunk of chunks) {
          writer.chunk({
            model_id: 'model_a',
            content: chunk,
            sequence: 1,
          });
          contentA += chunk;
          await delay(80); // Simulate typing delay
        }

        // Add model A message to storage
        const messageA = {
          id: uuidv4(),
          turnId: turn.id,
          role: 'assistant' as const,
          content: contentA,
          modelId: 'model_a',
          sequenceNumber: 2,
          responseTimeMs: Math.floor(Math.random() * 2000) + 1000,
          createdAt: new Date().toISOString(),
        };
        addMessage(turn.id, messageA);

        // Small delay before streaming model B
        await delay(150);

        // Stream model B responses (slightly different)
        let contentB = '';
        for (const chunk of chunks) {
          // Add slight variation
          const variedChunk = Math.random() > 0.7 ? chunk + ' ' : chunk;
          writer.chunk({
            model_id: 'model_b',
            content: variedChunk,
            sequence: 1,
          });
          contentB += variedChunk;
          await delay(85); // Slightly different delay
        }

        // Add model B message to storage
        const messageB = {
          id: uuidv4(),
          turnId: turn.id,
          role: 'assistant' as const,
          content: contentB,
          modelId: 'model_b',
          sequenceNumber: 3,
          responseTimeMs: Math.floor(Math.random() * 2000) + 1000,
          createdAt: new Date().toISOString(),
        };
        addMessage(turn.id, messageB);

        // Update turn status to completed
        updateTurnStatus(turn.id, 'completed');

        // Send done event
        writer.done({
          turn_id: turn.id,
          status: 'completed',
        });
      } catch (error) {
        // Send error event
        writer.error({
          error: 'Failed to generate response',
          reason: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

    // Return SSE stream
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable nginx buffering
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to process message',
        reason: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

