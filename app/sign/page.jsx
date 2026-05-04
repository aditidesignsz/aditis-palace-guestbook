'use client';

import { useState, useRef, useEffect } from 'react';import Link from 'next/link';

const CARD_COLORS = [{ name: 'blue', color: '#2D7DA8' },{ name: 'green', color: '#2E9C57' },{ name: 'orange', color: '#D67F39' },{ name: 'pink', color: '#B54E6F' },{ name: 'yellow', color: '#F0C123' },];

function formatDate(date) {const dd = String(date.getDate()).padStart(2, '0');const mm = String(date.getMonth() + 1).padStart(2, '0');const yy = String(date.getFullYear()).slice(-2);return dd + '/' + mm + '/' + yy;}

export default function SignPage() {

const [name, setName] = useState('');const [cardColor, setCardColor] = useState('blue');const [error, setError] = useState('');const [saving, setSaving] = useState(false);const [hasDrawn, setHasDrawn] = useState(false);

const canvasRef = useRef(null);const isDrawing = useRef(false);const lastPos = useRef({ x: 0, y: 0 });

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

function startDraw(e) {e.preventDefault();isDrawing.current = true;lastPos.current = getPos(e, canvasRef.current);}

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
ctx.lineWidth = 5;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

ctx.stroke();

lastPos.current = pos;

setHasDrawn(true);

}

function stopDraw() {isDrawing.current = false;}

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
        Choose your colour
      </span>

      <div className="color-picker">

        {CARD_COLORS.map((color) => (

          <button
            key={color.name}
            type="button"
            className={
              'color-circle ' +
              (cardColor === color.name ? 'selected' : '')
            }
            onClick={() => setCardColor(color.name)}
            style={{ backgroundColor: color.color }}
          />

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

            <div className="ov-lbl">GUEST</div>
            <div className="ov-name">{name || 'YOUR NAME'}</div>

            <div className="ov-lbl">ISSUED ON</div>
            <div className="ov-val">{today}</div>

            <div className="sign-row">
              <span className="sign-label">SIGN</span>
              <span className="sign-x">X</span>
              <div className="sign-line"></div>
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

⚠️{error}

    <button
      type="submit"
      className="btn-primary"
      disabled={saving}
    >
      {saving ? 'Saving…' : 'Sign & Add to Gallery →'}
    </button>

  </form>
