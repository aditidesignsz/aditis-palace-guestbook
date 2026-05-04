'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const CARD_COLORS = [
  { name: 'blue',   color: '#2D7DA8' },
  { name: 'green',  color: '#2E9C57' },
  { name: 'orange', color: '#D67F39' },
  { name: 'pink',   color: '#B54E6F' },
];

function formatDate(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  return dd + '/' + mm + '/' + yy;
}

export default function SignPage() {
  const [name,     setName]     = useState('');
  const [cardColor,setCardColor]= useState('blue');
  const [error,    setError]    = useState('');
  const [saving,   setSaving]   = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos   = useRef({ x: 0, y: 0 });
  const today     = formatDate(new Date());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width  = canvas.offsetWidth  * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d').scale(ratio, ratio);
  }, []);

  function getPos(e, canvas) {
    const rect    = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function startDraw(e) {
    e.preventDefault();
    isDrawing.current = true;
    lastPos.current   = getPos(e, canvasRef.current);
  }

  function draw(e) {
    e.preventDefault();
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const pos    = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = 'rgba(255,255,255,0.95)';
    ctx.lineWidth   = 2.5;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.stroke();
    lastPos.current = pos;
    setHasDrawn(true);
  }

  function stopDraw() { isDrawing.current = false; }

  function clearCanvas() {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!hasDrawn)    { setError('Please draw your signature on the card!'); return; }

    const signature = canvasRef.current.toDataURL('image/png');
    setSaving(true);
    try {
      const res  = await fetch('/api/visit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: name.trim(), card_color: cardColor, signature }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong.');
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <main className="sign-page">

      {/* ── Top greeting ── */}
      <div className="greeting">
        <p className="greet-line">WELCOME, VISITOR.</p>
        <p className="greet-sub">I HOPE YOU ENJOY YOUR TIME HERE.</p>
      </div>

      <form onSubmit={handleSubmit} className="sign-form" noValidate>

        {/* ── Name row: label + input inline ── */}
        <div className="name-row">
          <span className="name-lbl">NAME:</span>
          <input
            type="text"
            className="name-input"
            placeholder=""
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            disabled={saving}
          />
        </div>

        {/* ── Card with drawing canvas ── */}
        <div className="card-container">

          {/* Background image */}
          <div
            className="card-bg"
            style={{ backgroundImage: 'url(/cards/card-' + cardColor + '.png)' }}
          />

          {/* Text overlay */}
          <div className="card-overlay">
            <div className="card-title-text">Aditi's palace</div>
            <div className="card-info">
              <div className="ov-lbl">GUEST</div>
              <div className="ov-name">
                {name ? name.toUpperCase() : <span className="ov-ph">YOUR NAME</span>}
              </div>
              <div className="ov-lbl" style={{ marginTop: '6px' }}>ISSUED ON</div>
              <div className="ov-val">{today}</div>
            </div>
            <div className="sign-row">
              <span className="sign-label">SIGN</span>
              <span className="sign-x">X</span>
              <div className="sign-line" />
            </div>
          </div>

          {/* Drawing canvas */}
          <canvas
            ref={canvasRef}
            className="draw-canvas"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />

          {/* Clear button */}
          <button type="button" className="clear-btn" onClick={clearCanvas}>
            CLEAR
          </button>
        </div>

        {/* ── Color dots BELOW card ── */}
        <div className="color-row">
          {CARD_COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              className={'color-dot' + (cardColor === c.name ? ' selected' : '')}
              style={{ backgroundColor: c.color }}
              onClick={() => setCardColor(c.name)}
              title={c.name}
            />
          ))}
        </div>

        {error && <div className="error-banner">{error}</div>}

        {/* ── Submit ── */}
        <button type="submit" className="enter-btn" disabled={saving}>
          {saving ? 'SAVING…' : 'ENTER →'}
        </button>

        <p className="disclaimer">
          Your card will appear in the visitor gallery after signing.
        </p>

      </form>

      <style jsx>{`

        .sign-page {
          min-height: 100vh;
          background: var(--color-bg);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 24px 80px;
        }

        /* ── Greeting ── */
        .greeting {
          text-align: center;
          margin-bottom: 32px;
        }
        .greet-line {
          font-family: var(--font-mono);
          font-size: 13px;
          letter-spacing: 2.5px;
          color: var(--color-text);
          margin-bottom: 4px;
        }
        .greet-sub {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 2px;
          color: var(--color-muted);
        }

        /* ── Form ── */
        .sign-form {
          width: 100%;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        /* ── Name row ── */
        .name-row {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .name-lbl {
          font-family: var(--font-mono);
          font-size: 16px;
          color: #ffffff;
          white-space: nowrap;
          letter-spacing: 0.5px;
        }
        .name-input {
          flex: 1;
          background: #fff;
          border: none;
          border-radius: 8px;
          padding: 11px 14px;
          font-family: var(--font-mono);
          font-size: 14px;
          color: var(--color-text);
          outline: none;
        }
        .name-input::placeholder { color: #c2bbb1; }

        /* ── Card ── */
        .card-container {
          position: relative;
          width: 100%;
          aspect-ratio: 362 / 235;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          cursor: crosshair;
        }
        .card-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
        }
        .card-overlay {
          position: absolute;
          inset: 0;
          padding: 5% 6%;
          display: flex;
          flex-direction: column;
          pointer-events: none;
          z-index: 1;
        }
        .card-title-text {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: clamp(14px, 3vw, 20px);
          color: #fff;
          text-align: center;
          width: 55%;
          text-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        .card-info {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          width: 52%;
          gap: 2px;
        }
        .ov-lbl {
          font-family: var(--font-mono);
          font-size: clamp(6px, 1vw, 8px);
          letter-spacing: 1.2px;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
        }
        .ov-name {
          font-family: var(--font-mono);
          font-size: clamp(10px, 1.8vw, 14px);
          color: #fff;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        .ov-ph { color: rgba(255,255,255,0.3); font-weight: 400; }
        .ov-val {
          font-family: var(--font-mono);
          font-size: clamp(10px, 1.8vw, 14px);
          color: #fff;
        }
        .sign-row {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 8px;
          width: 52%;
        }
        .sign-label {
          font-family: var(--font-mono);
          font-size: clamp(6px, 1vw, 8px);
          color: rgba(255,255,255,0.55);
          letter-spacing: 1px;
        }
        .sign-x {
          font-family: var(--font-mono);
          font-size: clamp(8px, 1.2vw, 10px);
          color: rgba(255,255,255,0.75);
        }
        .sign-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.35);
        }
        .draw-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          touch-action: none;
        }
        .clear-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 3;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          color: rgba(255,255,255,0.9);
          font-family: var(--font-mono);
          font-size: 8px;
          letter-spacing: 0.8px;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
          backdrop-filter: blur(4px);
        }
        .clear-btn:hover { background: rgba(255,255,255,0.25); }

        /* ── Color dots below card ── */
        .color-row {
          display: flex;
          justify-content: center;
          gap: 14px;
        }
        .color-dot {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2.5px solid transparent;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .color-dot:hover { transform: scale(1.15); }
        .color-dot.selected {
          transform: scale(1.15);
          box-shadow: 0 0 0 3px #fff, 0 0 0 5px rgba(255,255,255,0.3);
        }

        /* ── Enter button ── */
        .enter-btn {
          padding: 14px 52px;
          border-radius: 40px;
          border: none;
          background: var(--color-text);
          color: #fff;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .enter-btn:hover    { opacity: 0.82; }
        .enter-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .disclaimer {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--color-muted);
          letter-spacing: 0.3px;
          text-align: center;
        }

        .error-banner {
          width: 100%;
          padding: 10px 14px;
          border-radius: 8px;
          background: #fde8ec;
          border: 1px solid #f5c2cc;
          color: #8c3045;
          font-size: 12px;
          font-family: var(--font-mono);
        }
      `}</style>
    </main>
  );
}
