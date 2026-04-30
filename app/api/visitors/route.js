// app/api/visitors/route.js
// ─────────────────────────────────────────────────────────
// GET /api/visitors
// Returns all visitor cards, newest first.
// ─────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';
import { supabase }     from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('visitors')
    .select('id, name, card_color, signature, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching visitors:', error.message);
    return NextResponse.json({ error: 'Failed to load visitors.' }, { status: 500 });
  }

  return NextResponse.json({ visitors: data });
}
