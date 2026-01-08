/**
 * Health check endpoint
 * GET /api/v1/health
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'arena-api-mock',
      api: '/api/v1',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'ok',
        redis: 'ok',
        storage: 'ok',
      },
    },
    { status: 200 }
  );
}

