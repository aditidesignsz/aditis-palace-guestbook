// app/page.jsx
// ─────────────────────────────────────────────────────────
// PAGE 1 — Guestbook Gallery
// Shows all visitor cards in a grid.
// This is the first page visitors see.
// ─────────────────────────────────────────────────────────

'use client';

import { useState, useEffect } from 'react';
import Link                    from 'next/link';
import VisitorCard             from '@/components/VisitorCard';

export default function GalleryPage() {
  const [visitors, setVisitors] = useState([]);
  const [status,   setStatus]   = useState('loading'); // 'loading' | 'success' | 'error'

  // ── Fetch cards from the API ──────────────────────────
  useEffect(() => {
    async function fetchVisitors() {
      try {
        const res  = await fetch('/api/visitors');
        const json = await res.json();

        if (!res.ok) throw new Error(json.error || 'Failed to load.');

        setVisitors(json.visitors);
        setStatus('success');
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    }

    fetchVisitors();
  }, []);

  return (
    <main className="page-container">

      {/* ── Header ──────────────────────────────────────── */}
      <header className="gallery-header">
        <div className="gallery-header-text">
          <h1 className="page-heading">Aditi's Palace<br />Guestbook</h1>
          <p className="page-sub" style={{ marginTop: '10px' }}>
            {status === 'success' && visitors.length > 0
              ? `${visitors.length} visitor${visitors.length !== 1 ? 's' : ''} have signed`
              : 'Leave your mark ✦'}
          </p>
        </div>

        {/* Sign the guestbook button */}
        <Link href="/sign" className="btn-primary">
          Sign the Guestbook ✦
        </Link>
      </header>

      {/* ── Cards grid ──────────────────────────────────── */}
      <section className="cards-grid" aria-label="Visitor cards">

        {/* Loading state */}
        {status === 'loading' && (
          <div className="state-message">Loading cards…</div>
        )}

        {/* Error state */}
        {status === 'error' && (
          <div className="state-message">
            Couldn't load the guestbook.<br />
            Please refresh the page.
          </div>
        )}

        {/* Empty state */}
        {status === 'success' && visitors.length === 0 && (
          <div className="state-message">
            No visitors yet.<br />
            Be the first to sign! ✦
          </div>
        )}

        {/* Cards */}
        {status === 'success' &&
          visitors.map((visitor) => (
            <VisitorCard key={visitor.id} visitor={visitor} />
          ))
        }

      </section>

      {/* ── Styles ──────────────────────────────────────── */}
      <style jsx>{`
        .gallery-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
          margin-bottom: 36px;
        }

        .gallery-header-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
      `}</style>
    </main>
  );
}
