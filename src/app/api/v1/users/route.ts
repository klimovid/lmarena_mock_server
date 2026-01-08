/**
 * User management endpoints
 * POST /api/v1/users - Create user
 */

import { NextResponse } from 'next/server';
import { createUser } from '@/lib/storage';

export async function POST() {
  try {
    const user = createUser();

    return NextResponse.json(
      { id: user.id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

