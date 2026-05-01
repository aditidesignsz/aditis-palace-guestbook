'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const CARD_COLORS = [
  { value: 'blue',   label: 'Blue'   },
  { value: 'green',  label: 'Green'  },
  { value: 'orange', label: 'Orange' },
  { value: 'pink',   label: 'Pink'   },
];

function formatDate(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  return dd + '/' + mm + '/' + yy;
}

export default function SignPage() {
  const [name,      setName]      = useState('');
  const [cardColor, setCardColor] = useState('blue');
  const [error,     setError]     = useState('');
  const [saving,    setSaving]    = useState(false);
  const [hasDrawn,  setHasDrawn]  = useState(false);

  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos   = useRef({ x: 0, y: 0 });
  const today     = formatDate(new Date());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }, []);

  function getPos(e, canvas) {
    const rect    = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width  / rect.width),
      y: (clientY - rect.top)  * (canvas.height / rect.height),
    };
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
    if (!name.trim())  { setError('Please enter your name.');              return; }
    if (!cardColor)    { setError('Please choose a card.');                return; }
    if (!hasDrawn)     { setError('Please draw your signature on the card!'); return; }

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
    <main className="page-container">
      <Link href="/" className="back-link">← Back to gallery</Link>

      <div className="sign-header">
        <h1 className="page-heading">Sign the<br />Guestbook</h1>
        <p className="page-sub" style={{ marginTop: '10px' }}>
          Draw your signature directly on the card ✦
        </p>
      </div>

      <form onSubmit={handleSubmit} className="sign-form" noValidate>

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

        <div className="field-group">
          <span className="field-label">Choose your card</span>
          <div className="color-picker">
            {CARD_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                className={'color-option' + (cardColor === color.value ? ' selected' : '')}
                onClick={() => setCardColor(color.value)}
                disabled={saving}
                title={color.label}
              >
                <div
                  className="card-thumb"
                  style={{ backgroundImage: 'url(/cards/card-' + color.value + '.png)' }}
                />
                <span className="color-label">{color.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="field-group">
          <span className="field-label">
            Sign on your card&nbsp;
            <span className="hint">draw anywhere on the card with white ink</span>
          </span>

          <div className="card-container">
            <div
              className="card-bg"
              style={{ backgroundImage: 'url(/cards/card-' + cardColor + '.png)' }}
            />

            <div className="card-overlay">
              <div className="card-title-text">Aditi's palace</div>
              <div className="card-info">
                <div className="ov-lbl">GUEST</div>
                <div className="ov-name">
                  {name
                    ? name.toUpperCase()
                    : <span className="ov-ph">YOUR NAME</span>}
                </div>
                <div className="ov-lbl" style={{ marginTop: '6px' }}>ISSUED ON</div>
                <div className="ov-val">{today}</div>
              </div>
              <div className="sign-area">
                <span className="ov-lbl">SIGN</span>
                <span className="sx">X</span>
                <div className="sline" />
              </div>
            </div>

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

            <button type="button" className="clear-btn" onClick={clearCanvas}>
              CLEAR
            </button>

            {!hasDrawn && (
              <div className="draw-hint">✦ Draw your signature here</div>
            )}
          </div>
        </div>

        {error && <div className="error-banner" role="alert">{error}</div>}

        <button type="submit" className="btn-primary submit-btn" disabled={saving}>
          {saving ? 'Saving…' : 'Sign & Add to Gallery →'}
        </button>

      </form>

      <style jsx>{`
        .back-link {
          display: inline-block;
          font-size: 11px;
          color: var(--color-muted);
          text-decoration: none;
          margin-bottom: 32px;
        }
        .back-link:hover { color: var(--color-text); }

        .sign-header { margin-bottom: 32px; }

        .sign-form {
          max-width: 560px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .color-picker {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .color-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 6px;
          border-radius: 10px;
          border: 2.5px solid transparent;
          background: transparent;
          cursor: pointer;
          transition: border-color 0.14s, transform 0.13s;
          font-family: inherit;
        }
        .color-option:hover { transform: translateY(-2px); }
        .color-option.selected { border-color: var(--color-text); }

        .card-thumb {
          width: 90px;
          height: 58px;
          border-radius: 8px;
          background-size: cover;
          background-position: center;
        }

        .color-label {
          font-size: 10px;
          letter-spacing: 0.5px;
          color: var(--color-muted);
          font-family: var(--font-mono);
        }

        .card-container {
          position: relative;
          width: 100%;
          aspect-ratio: 362 / 235;
          border-radius: 18px;
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
          color: #fff;
          font-size: clamp(13px, 3vw, 20px);
          text-align: center;
          width: 55%;
          margin-bottom: auto;
          text-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }

        .card-info {
          display: flex;
          flex-direction: column;
          width: 52%;
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
          margin-bottom: 2px;
        }

        .ov-ph { color: rgba(255,255,255,0.3); font-weight: 400; }

        .ov-val {
          font-family: var(--font-mono);
          font-size: clamp(10px, 1.8vw, 14px);
          color: #fff;
        }

        .sign-area {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 4%;
          width: 52%;
          position: relative;
          height: 20px;
        }

        .sx {
          font-family: var(--font-mono);
          font-size: clamp(8px, 1.2vw, 10px);
          color: rgba(255,255,255,0.75);
        }

        .sline {
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

        .draw-hint {
          position: absolute;
          bottom: 18%;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.45);
          font-size: clamp(9px, 1.5vw, 11px);
          letter-spacing: 0.5px;
          pointer-events: none;
          z-index: 1;
          white-space: nowrap;
          font-family: var(--font-mono);
        }

        .hint {
          font-size: 9px;
          color: #b0a89f;
          text-transform: none;
          letter-spacing: 0;
        }

        .submit-btn { align-self: flex-start; }
      `}</style>
    </main>
  );
}
