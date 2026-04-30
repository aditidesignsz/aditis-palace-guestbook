// components/VisitorCard.jsx
// ─────────────────────────────────────────────────────────
// This is the card component shown in the gallery.
//
// ✦ HOW TO SWAP IN YOUR FIGMA DESIGNS LATER ✦
// Each color theme has its own clearly labeled section below.
// When your Figma assets are ready, you can:
//   1. Export each card design as an image (PNG/SVG) from Figma
//   2. Place the exported files in /public/cards/
//   3. Replace the placeholder <div> for that color with:
//        <Image src="/cards/card-pink.png" alt="..." fill />
//      using Next.js <Image> component.
//   OR if you export as a React/JSX component from Figma:
//      just replace the entire PLACEHOLDER CARD block with your component.
// ─────────────────────────────────────────────────────────

'use client';

// ── Color definitions ──────────────────────────────────────
// These match your 4 Figma card themes.
// Change these hex values here if your Figma colors differ.
const CARD_THEMES = {
  blue: {
    background: '#2C8C9C',
    label:      'Blue',
  },
  green: {
    background: '#2F7D49',
    label:      'Green',
  },
  orange: {
    background: '#C8753A',
    label:      'Orange',
  },
  pink: {
    background: '#C45C74',
    label:      'Pink',
  },
};

// ── Helper: format date nicely ─────────────────────────────
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  });
}

// ── Main card component ────────────────────────────────────
export default function VisitorCard({ visitor }) {
  const { name, card_color, signature, created_at } = visitor;
  const theme = CARD_THEMES[card_color] || CARD_THEMES.pink;

  return (
    // ┌─────────────────────────────────────────────────────┐
    // │  PLACEHOLDER CARD                                   │
    // │  Replace everything inside this outer <div> with    │
    // │  your Figma design when ready.                      │
    // │  Keep the outer <article> wrapper — it handles      │
    // │  sizing and hover animation for the grid.           │
    // └─────────────────────────────────────────────────────┘
    <article className="card-wrapper">
      <div
        className="card-placeholder"
        style={{ backgroundColor: theme.background }}
      >
        {/* ── Card header ── */}
        <div className="card-header">
          <span className="card-title">Aditi's Palace</span>
        </div>

        {/* ── Guest name ── */}
        <div className="card-field">
          <span className="card-label">GUEST</span>
          <span className="card-value card-name">{name}</span>
        </div>

        {/* ── Date ── */}
        <div className="card-field">
          <span className="card-label">SIGNED ON</span>
          <span className="card-value">{formatDate(created_at)}</span>
        </div>

        {/* ── Signature ── */}
        <div className="card-sig-area">
          {signature && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={signature}
              alt={`${name}'s signature`}
              className="card-sig-image"
            />
          )}
          <div className="card-sig-line">
            <span>X</span>
            <hr />
          </div>
        </div>
      </div>

      {/* ── Styles scoped to this component ── */}
      <style jsx>{`
        .card-wrapper {
          border-radius: 14px;
          overflow: hidden;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .card-wrapper:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.14);
        }

        /* ─── PLACEHOLDER CARD STYLES ───────────────────────
           These styles are only for the placeholder design.
           Delete or ignore them when you swap in Figma assets. */
        .card-placeholder {
          padding: 22px 20px 16px;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          /* Subtle dot-grid texture */
          background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.15) 1px,
            transparent 1px
          );
          background-size: 12px 12px;
        }

        .card-header {
          margin-bottom: 4px;
        }

        .card-title {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.92);
        }

        .card-field {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .card-label {
          font-size: 8px;
          letter-spacing: 1.2px;
          color: rgba(255, 255, 255, 0.55);
          text-transform: uppercase;
        }

        .card-value {
          font-size: 13px;
          color: #fff;
          font-weight: 600;
        }

        .card-name {
          font-size: 15px;
          word-break: break-word;
        }

        .card-sig-area {
          margin-top: auto;
          position: relative;
          height: 70px;
        }

        .card-sig-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center bottom;
        }

        .card-sig-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.45);
        }

        .card-sig-line hr {
          flex: 1;
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.3);
          margin: 0;
        }
      `}</style>
    </article>
  );
}
