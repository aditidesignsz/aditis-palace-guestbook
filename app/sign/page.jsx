// app/sign/page.jsx
// ─────────────────────────────────────────────────────────
// PAGE 2 — Sign the Guestbook
// Visitors fill in their name, pick a card color,
// draw their signature, then submit.
// ─────────────────────────────────────────────────────────

'use client';

import { useState, useCallback } from 'react';
import { useRouter }             from 'next/navigation';
import Link                      from 'next/link';
import SignatureCanvas            from '@/components/SignatureCanvas';

// ── The four card color options ────────────────────────────
const CARD_COLORS = [
  { value: 'blue',   label: 'Blue',   hex: '#2C8C9C' },
  { value: 'green',  label: 'Green',  hex: '#2F7D49' },
  { value: 'orange', label: 'Orange', hex: '#C8753A' },
  { value: 'pink',   label: 'Pink',   hex: '#C45C74' },
];

export default function SignPage() {
  const router = useRouter();

  // ── Form state ─────────────────────────────────────────
  const [name,      setName]      = useState('');
  const [cardColor, setCardColor] = useState('');
  const [signature, setSignature] = useState(null);
  const [error,     setError]     = useState('');
  const [saving,    setSaving]    = useState(false);

  // Called by SignatureCanvas whenever the drawing changes
  const handleSignatureChange = useCallback((dataURL) => {
    setSignature(dataURL);
  }, []);

  // ── Validate & submit ──────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!cardColor) {
      setError('Please choose a card color.');
      return;
    }
    if (!signature) {
      setError('Please draw your signature — it can be anything!');
      return;
    }

    // Send to API
    setSaving(true);
    try {
      const res  = await fetch('/api/visit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:       name.trim(),
          card_color: cardColor,
          signature,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong.');

      // Redirect to gallery on success
      router.push('/');

    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <main className="page-container">

      {/* ── Back link ────────────────────────────────────── */}
      <Link href="/" className="back-link">
        ← Back to gallery
      </Link>

      {/* ── Page title ───────────────────────────────────── */}
      <div className="sign-header">
        <h1 className="page-heading">Sign the<br />Guestbook</h1>
        <p className="page-sub" style={{ marginTop: '10px' }}>
          Leave your mark on Aditi's Palace ✦
        </p>
      </div>

      {/* ── Form ─────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="sign-form"
        noValidate
      >

        {/* Name */}
        <div className="field-group">
          <label htmlFor="name" className="field-label">Your name</label>
          <input
            id="name"
            type="text"
            className="field-input"
            placeholder="e.g. Alex Kim"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            disabled={saving}
          />
        </div>

        {/* Card color picker */}
        <div className="field-group">
          <span className="field-label">Choose your card color</span>
          <div className="color-picker">
            {CARD_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                className={`color-option ${cardColor === color.value ? 'selected' : ''}`}
                style={{ '--swatch': color.hex }}
                onClick={() => setCardColor(color.value)}
                disabled={saving}
                aria-label={color.label}
                title={color.label}
              >
                <span className="color-swatch" />
                <span className="color-label">{color.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Signature canvas */}
        <div className="field-group">
          <span className="field-label">
            Your signature <span className="field-label-note">(required — draw anything!)</span>
          </span>
          <SignatureCanvas onChange={handleSignatureChange} />
        </div>

        {/* Error message */}
        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        {/* Submit */}
        <button type="submit" className="btn-primary submit-btn" disabled={saving}>
          {saving ? 'Saving…' : 'Sign & Add to Gallery →'}
        </button>

      </form>

      {/* ── Styles ──────────────────────────────────────── */}
      <style jsx>{`
        .back-link {
          display: inline-block;
          font-size: 11px;
          letter-spacing: 0.4px;
          color: var(--color-muted);
          text-decoration: none;
          margin-bottom: 32px;
          transition: color 0.13s;
        }
        .back-link:hover {
          color: var(--color-text);
        }

        .sign-header {
          margin-bottom: 36px;
        }

        .sign-form {
          max-width: 480px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* Color picker row */
        .color-picker {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .color-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
          padding: 10px 16px;
          border-radius: 10px;
          border: 2px solid transparent;
          background: #fff;
          cursor: pointer;
          transition: border-color 0.14s, transform 0.13s;
          font-family: inherit;
        }

        .color-option:hover {
          transform: translateY(-2px);
        }

        .color-option.selected {
          border-color: var(--color-text);
        }

        .color-swatch {
          display: block;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--swatch);
        }

        .color-label {
          font-size: 10px;
          letter-spacing: 0.5px;
          color: var(--color-muted);
        }

        /* Note inside field label */
        .field-label-note {
          font-size: 9px;
          color: #b0a89f;
          text-transform: none;
          letter-spacing: 0;
        }

        .submit-btn {
          align-self: flex-start;
        }
      `}</style>
    </main>
  );
}
