/**
 * Vote submission endpoint
 * POST /api/v1/turns/{id}/vote
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTurn, submitVote } from '@/lib/storage';
import { getRandomModelPair, mockCategories } from '@/lib/mock-data';

interface SubmitVoteRequest {
  winner: 'model_a' | 'model_b' | 'tie' | 'both_bad';
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const turnId = params.id;
    const body = (await request.json()) as SubmitVoteRequest;

    // Validate request
    if (!body.winner) {
      return NextResponse.json(
        { error: 'winner is required' },
        { status: 400 }
      );
    }

    const validWinners = ['model_a', 'model_b', 'tie', 'both_bad'];
    if (!validWinners.includes(body.winner)) {
      return NextResponse.json(
        { error: 'Invalid winner value' },
        { status: 400 }
      );
    }

    // Get turn
    const turn = getTurn(turnId);
    if (!turn) {
      return NextResponse.json(
        { error: 'Turn not found' },
        { status: 404 }
      );
    }

    // Check if already voted
    if (turn.status === 'voted') {
      return NextResponse.json(
        { error: 'Turn already voted' },
        { status: 400 }
      );
    }

    // Generate random models for reveal
    const [modelA, modelB] = getRandomModelPair();

    // Submit vote and create new turn
    const { newTurnId } = submitVote(turnId, body.winner, modelA, modelB);

    // Select random category and tags
    const category = mockCategories[Math.floor(Math.random() * mockCategories.length)];
    const tags = category.tags
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map((tag) => tag.slug);

    // Return response
    return NextResponse.json(
      {
        id: turnId,
        revealed_models: {
          model_a: {
            id: modelA.id,
            name: modelA.name,
            provider: modelA.provider,
          },
          model_b: {
            id: modelB.id,
            name: modelB.name,
            provider: modelB.provider,
          },
        },
        new_turn_id: newTurnId,
        category: category.slug,
        tags,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    );
  }
}

