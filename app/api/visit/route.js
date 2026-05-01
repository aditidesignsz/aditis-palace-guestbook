import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request) {

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const body = await request.json();
  const { name, card_color, signature } = body;

  // ── Basic validation ─────────────────────────────

  if (!name || name.trim() === "") {
    return NextResponse.json(
      { error: "Name is required." },
      { status: 400 }
    );
  }

  if (!card_color) {
    return NextResponse.json(
      { error: "Please choose a card color." },
      { status: 400 }
    );
  }

  if (!signature) {
    return NextResponse.json(
      { error: "Please draw your signature." },
      { status: 400 }
    );
  }

  // ── Allowed card colours (now includes yellow) ──

  const VALID_COLORS = [
    "blue",
    "green",
    "orange",
    "pink",
    "yellow"
  ];

  if (!VALID_COLORS.includes(card_color)) {
    return NextResponse.json(
      { error: "Invalid card color." },
      { status: 400 }
    );
  }

  // ── Save visitor ────────────────────────────────

  const { data, error } = await supabase
    .from("visitors")
    .insert([
      {
        name: name.trim(),
        card_color,
        signature
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error saving visitor:", error.message);

    return NextResponse.json(
      { error: "Failed to save your entry." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { visitor: data },
    { status: 201 }
  );
}
