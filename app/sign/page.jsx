'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const CARD_COLORS = [
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'orange', label: 'Orange' },
  { value: 'pink', label: 'Pink' },
  { value: 'yellow', label: 'Yellow' },
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
  const [hasDrawn, setHasDrawn] = useState(false);

  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const today = formatDate(new Date());

  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ratio = window.devicePixelRatio || 1;

    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;

    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);

  }, []);

  function getPos(e, canvas) {

    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function startDraw(e) {
    e.preventDefault();
    isDrawing.current = true;
    lastPos.current = getPos(e, canvasRef.current);
  }

  function draw(e) {

    e.preventDefault();
    if (!isDrawing.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const pos = getPos(e, canvas);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);

    ctx.strokeStyle = 'rgba(255,255,255,255)';
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.stroke();

    lastPos.current = pos;

    setHasDrawn(true);
  }

  function stopDraw() {
    isDrawing.current = false;
  }

  function clearCanvas() {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setHasDrawn(false);
  }

  async function handleSubmit(e) {

    e.preventDefault();

    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!hasDrawn) {
      setError('Please draw your signature on the card.');
      return;
    }

    const signature = canvasRef.current.toDataURL('image/png');

    setSaving(true);

    try {

      const res = await fetch('/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          card_color: cardColor,
          signature
        })
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

      <Link href="/" className="back-link">
        ← Back to gallery
      </Link>

      <div className="sign-header">

        <h1 className="page-heading">
          Sign the Guestbook
        </h1>

        <p className="page-sub">
          Draw your signature directly on the card ✦
        </p>

      </div>


      <form onSubmit={handleSubmit} className="sign-form" noValidate>

        <div className="field-group">

          <label className="field-label">
            Your name
          </label>

          <input
            type="text"
            className="field-input"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            disabled={saving}
          />

        </div>


        <div className="field-group">

          <span className="field-label">
            Choose your card
          </span>

          <div className="color-picker">

            {CARD_COLORS.map((color) => (

              <button
                key={color.value}
                type="button"
                className={
                  'color-option ' +
                  (cardColor === color.value ? 'selected' : '')
                }
                onClick={() => setCardColor(color.value)}
              >

                <div
                  className="card-thumb"
                  style={{
                    backgroundImage:
                      `url(/cards/card-${color.value}.png)`
                  }}
                />

                <span className="color-label">
                  {color.label}
                </span>

              </button>

            ))}

          </div>

        </div>


        <div className="field-group">

          <span className="field-label">
            Sign on your card
          </span>

          <div className="card-container">

            <div
              className="card-bg"
              style={{
                backgroundImage:
                  `url(/cards/card-${cardColor}.png)`
              }}
            />

            <div className="card-overlay">

              <div className="card-title-text">
                Aditi's Palace
              </div>

              <div className="card-info">

                <div className="ov-lbl">
                  GUEST
                </div>

                <div className="ov-name">
                  {name || 'YOUR NAME'}
                </div>

                <div className="ov-lbl">
                  ISSUED ON
                </div>

                <div className="ov-val">
                  {today}
                </div>

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

            <button
              type="button"
              className="clear-btn"
              onClick={clearCanvas}
            >
              CLEAR
            </button>

          </div>

        </div>


        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Sign & Add to Gallery →'}
        </button>

      </form>


    <style jsx>{`

.back-link{
  color:#ff4fa3;
  font-family:var(--font-inter);
  margin-bottom:20px;
  display:inline-block;
}

.back-link:hover{
  opacity:.7;
}

.sign-header{
  margin-bottom:36px;
}

.page-sub{
  font-size:12px;
  font-family:var(--font-inter);
  margin-top:6px;
  color:#8F8F8F;
}

.sign-form{
  max-width:1280px;
  margin:0 auto;
  display:flex;
  flex-direction:column;
  align-items:center;
  text-align:center;
  gap:24px;
}

.field-group{
  width:100%;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:10px;
}

.field-label{
  font-size:12px;
  font-family:var(--font-inter);
  color:#8F8F8F;
  white-space:nowrap;
}

.field-input{
  width:100%;
}

.color-picker{
  display:flex;
  justify-content:center;
  gap:12px;
  flex-wrap:wrap;
}

.color-option{
  border:none;
  background:none;
  cursor:pointer;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:6px;
  transition:transform .2s ease;
}

.color-option:hover{
  transform:translateY(-2px);
}

.card-thumb{
  width:90px;
  height:58px;
  border-radius:8px;
  background-size:cover;
}

.card-container{
  position:relative;
  width:100%;
  max-width:420px;
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
  padding:5% 6%;
  pointer-events:none;
}

.card-title-text{
  font-family:var(--font-serif);
  font-size:22px;
  color:#fff;
  text-align:center;
}

.card-info{
  margin-top:30px;
}

.ov-lbl{
  font-family:var(--font-inter);
  font-size:12px;
  opacity:.5;
  color:#fff;
}

.ov-name{
  font-family:var(--font-inter);
  font-size:14px;
  font-weight:400;
  color:#fff;
}

.ov-val{
  font-family:var(--font-inter);
  font-weight:400;
  color:#fff;
}

.draw-canvas{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  z-index:2;
}

.clear-btn{
  position:absolute;
  top:10px;
  right:10px;
  z-index:3;
  font-size:12px;
}

`}</style>
