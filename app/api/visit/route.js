// app/api/visit/route.js
// ─────────────────────────────────────────────────────────
// POST /api/visit
// Saves a new visitor entry to Supabase.
// ─────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';
import { supabase }     from '@/lib/supabase';

export async function POST(request) {
  const body = await request.json();

  const { name, card_color, signature } = body;

  // ── Basic validation ──────────────────────────────────
  if (!name || name.trim() === '') {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  }

  if (!card_color) {
    return NextResponse.json({ error: 'Please choose a card color.' }, { status: 400 });
  }

  if (!signature) {
    return NextResponse.json({ error: 'Please draw your signature.' }, { status: 400 });
  }

  const VALID_COLORS = ['blue', 'green', 'orange', 'pink'];
  if (!VALID_COLORS.includes(card_color)) {
    return NextResponse.json({ error: 'Invalid card color.' }, { status: 400 });
  }

  // ── Save to Supabase ──────────────────────────────────
  const { data, error } = await supabase
    .from('visitors')
    .insert([
      {
        name:       name.trim(),
        card_color,
        signature,
        // created_at is set automatically by Supabase
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error saving visitor:', error.message);
    return NextResponse.json({ error: 'Failed to save your entry.' }, { status: 500 });
  }

  return NextResponse.json({ visitor: data }, { status: 201 });
}
