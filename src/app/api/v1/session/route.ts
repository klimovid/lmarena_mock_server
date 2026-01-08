/**
 * Session management endpoint
 * POST /api/v1/session
 */

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  // Check if session already exists
  const existingSession = request.cookies.get('session_id');

  if (existingSession) {
    // Session already exists (idempotent)
    return new NextResponse(null, { status: 204 });
  }

  // Create new session
  const sessionId = uuidv4();
  const response = NextResponse.json(
    { session_id: sessionId },
    { status: 201 }
  );

  // Set session cookie
  response.cookies.set('session_id', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return response;
}

