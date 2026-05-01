'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import VisitorCard from '@/components/VisitorCard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function GalleryPage() {
  const [visitors, setVisitors] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    async function fetchVisitors() {
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        setStatus('error');
        return;
      }
      setVisitors(data);
      setStatus('success');
    }
    fetchVisitors();
  }, []);

  return (
    <main className="page-container">
      <header className="gallery-header">
        <div className="gallery-header-text">
          <h1 className="page-heading">Aditi's Palace<br />Guestbook</h1>
          <p className="page-sub" style={{ marginTop: '10px' }}>
            {status === 'success' && visitors.length > 0
              ? `${visitors.length} visitor${visitors.length !== 1 ? 's' : ''} have signed`
              : 'Leave your mark ✦'}
          </p>
        </div>
        <Link href="/sign" className="btn-primary">
          Sign the Guestbook ✦
        </Link>
      </header>

      <section className="cards-grid" aria-label="Visitor cards">
        {status === 'loading' && (
          <div className="state-message">Loading cards…</div>
        )}
        {status === 'error' && (
          <div className="state-message">
            Couldn't load the guestbook.<br />Please refresh the page.
          </div>
        )}
        {status === 'success' && visitors.length === 0 && (
          <div className="state-message">
            No visitors yet.<br />Be the first to sign! ✦
          </div>
        )}
        {status === 'success' &&
          visitors.map((visitor) => (
            <VisitorCard key={visitor.id} visitor={visitor} />
          ))
        }
      </section>

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
