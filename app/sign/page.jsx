'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const CARD_COLORS = [
  { name: 'blue', color: '#2D7DA8' },
  { name: 'green', color: '#2E9C57' },
  { name: 'orange', color: '#D67F39' },
  { name: 'pink', color: '#B54E6F' },
  { name: 'yellow', color: '#F0C123' },
];

function formatDate(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  return dd + '/' + mm + '/' + yy;
}

export default function SignPage() {

  const [name, setName] = useState('');
  const [cardColor, setCardColor] = useState('blue');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const today = formatDate(new Date());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ratio = window.devicePixelRatio || 1;

    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;

    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
  }, []);

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;

    return { x: x - rect.left, y: y - rect.top };
  }

  function startDraw(e) {
    e.preventDefault();
    isDrawing.current = true;
    lastPos.current = getPos(e, canvasRef.current);
  }

  function draw(e) {
    if (!isDrawing.current) return;

    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e, canvasRef.current);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    ctx.stroke();
    lastPos.current = pos;
  }

  function stopDraw() {
    isDrawing.current = false;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    const signature = canvasRef.current.toDataURL();

    setSaving(true);

    try {
      const res = await fetch('/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, card_color: cardColor, signature }),
      });

      if (!res.ok) throw new Error('Failed');

      window.location.href = '/';

    } catch (err) {
      setError('Something went wrong.');
      setSaving(false);
    }
  }

  return (
    <main className="page-container">

      <Link href="/" className="back-link">
        ← Back to gallery
      </Link>

      <h1 className="page-heading">Sign the Guestbook</h1>

      <form onSubmit={handleSubmit} className="sign-form">

        {/* INPUT */}
        <div className="field-group">
          <label className="field-label">Your name</label>

          <input
            className={`field-input ${error ? 'error' : ''}`}
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* CARD */}
        <div className="field-group">
          <span className="field-label">Sign on your card</span>

          <div className="card-container">

            <div
              className="card-bg"
              style={{ backgroundImage: `url(/cards/card-${cardColor}.png)` }}
            />

            <div className="card-overlay">

              <div className="card-title">Aditi's Palace</div>

              <div className="card-info">
                <span className="lbl">GUEST</span>
                <span className="val">{name || 'YOUR NAME'}</span>

                <span className="lbl">ISSUED ON</span>
                <span className="val">{today}</span>

                <div className="sign-row">
                  <span className="lbl">SIGN</span>
                  <span className="x">X</span>
                  <div className="line" />
                </div>

              </div>
            </div>

            <canvas
              ref={canvasRef}
              className="canvas"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
            />

            <button className="clear" onClick={clearCanvas}>CLEAR</button>

          </div>
        </div>

        {/* COLORS BELOW */}
        <div className="field-group">
          <span className="field-label">Choose your colour</span>

          <div className="color-row">
            {CARD_COLORS.map(c => (
              <button
                key={c.name}
                type="button"
                className={`circle ${cardColor === c.name ? 'active' : ''}`}
                style={{ background: c.color }}
                onClick={() => setCardColor(c.name)}
              />
            ))}
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="error-banner">⚠ {error}</div>
        )}

        <button className="submit">
          {saving ? 'Saving…' : 'Sign & Add to Gallery →'}
        </button>

      </form>

<style jsx>{`

.sign-form{
  max-width:420px;
  margin:auto;
  display:flex;
  flex-direction:column;
  gap:28px;
}

.field-label{
  font-size:14px;
  color:#aaa;
}

/* INPUT FIXED */
.field-input{
  padding:14px;
  border-radius:12px;
  background:#1a1a1a;
  border:1px solid rgba(255,255,255,0.1);
  color:#fff;
}

.field-input:focus{
  border-color:#fff;
  box-shadow:0 0 0 2px rgba(255,255,255,0.2);
}

.field-input.error{
  border-color:#ff6b6b;
}

/* CARD */
.card-container{
  position:relative;
  aspect-ratio:362/235;
  border-radius:14px;
  overflow:hidden;
}

.card-bg{
  position:absolute;
  inset:0;
  background-size:cover;
}

.card-overlay{
  position:absolute;
  inset:0;
  padding:20px;
}

.card-title{
  font-family:var(--font-serif);
  font-size:22px;
  color:#fff;
  text-align:center;
}

.card-info{
  margin-top:20px;
  display:flex;
  flex-direction:column;
  gap:6px;
}

.lbl{
  font-size:12px;
  color:rgba(255,255,255,.6);
}

.val{
  color:#fff;
}

.sign-row{
  display:flex;
  align-items:center;
  gap:6px;
  margin-top:10px;
}

.line{
  width:140px;
  height:2px;
  background:#fff5;
}

/* CANVAS */
.canvas{
  position:absolute;
  inset:0;
}

/* COLORS */
.color-row{
  display:flex;
  justify-content:center;
  gap:14px;
}

.circle{
  width:38px;
  height:38px;
  border-radius:50%;
  border:none;
}

.circle.active{
  box-shadow:0 0 0 3px #fff;
  transform:scale(1.1);
}

/* ERROR */
.error-banner{
  background:#ff000020;
  border:1px solid #ff6b6b;
  padding:12px;
  border-radius:10px;
  color:#ff6b6b;
}

/* BUTTON */
.submit{
  padding:14px;
  border-radius:12px;
  background:#333;
  color:#fff;
}

`}</style>

    </main>
  );
}
