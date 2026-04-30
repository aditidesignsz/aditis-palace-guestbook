// components/SignatureCanvas.jsx
// ─────────────────────────────────────────────────────────
// A drawing canvas for visitor signatures.
// Passes the base64 image string back to the parent via onChange().
// ─────────────────────────────────────────────────────────

'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

export default function SignatureCanvas({ onChange }) {
  const canvasRef   = useRef(null);
  const isDrawing   = useRef(false);
  const lastPos     = useRef({ x: 0, y: 0 });
  const [isEmpty, setIsEmpty] = useState(true);

  // ── Set up canvas size ─────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      // Save current drawing before resize
      const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      // Restore drawing after resize
      canvas.getContext('2d').putImageData(imageData, 0, 0);
    };

    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // ── Get mouse or touch position relative to canvas ────
  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width  / rect.width),
      y: (clientY - rect.top)  * (canvas.height / rect.height),
    };
  }

  // ── Notify parent of the current drawing ──────────────
  const notifyChange = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataURL = canvas.toDataURL('image/png');
    onChange(dataURL);
  }, [onChange]);

  // ── Drawing logic ──────────────────────────────────────
  function startDraw(e) {
    e.preventDefault();
    const canvas = canvasRef.current;
    isDrawing.current = true;
    lastPos.current = getPos(e, canvas);
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
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth   = 2.4;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.stroke();

    lastPos.current = pos;
    setIsEmpty(false);
    notifyChange();
  }

  function stopDraw(e) {
    e?.preventDefault();
    isDrawing.current = false;
  }

  // ── Clear the canvas ───────────────────────────────────
  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    onChange(null); // tell parent the signature was cleared
  }

  return (
    <div className="sig-wrap">
      <canvas
        ref={canvasRef}
        className="sig-canvas"
        // Mouse events
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        // Touch events (mobile)
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />

      {/* Placeholder text shown when canvas is empty */}
      {isEmpty && (
        <p className="sig-placeholder">Draw your signature here…</p>
      )}

      <button type="button" className="sig-clear-btn" onClick={clearCanvas}>
        Clear
      </button>

      <style jsx>{`
        .sig-wrap {
          position: relative;
          width: 100%;
          height: 160px;
          border: 1.5px solid #d4cfc8;
          border-radius: 10px;
          background: #fff;
          overflow: hidden;
        }

        .sig-canvas {
          width: 100%;
          height: 100%;
          display: block;
          cursor: crosshair;
          touch-action: none; /* prevents scroll while drawing on mobile */
        }

        .sig-placeholder {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #c2bbb1;
          font-size: 13px;
          pointer-events: none;
          white-space: nowrap;
          letter-spacing: 0.2px;
        }

        .sig-clear-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 5px 12px;
          border-radius: 20px;
          border: 1px solid #d4cfc8;
          background: #f5f2ee;
          font-size: 11px;
          cursor: pointer;
          color: #7a7068;
          font-family: inherit;
          transition: background 0.15s;
        }

        .sig-clear-btn:hover {
          background: #ede9e3;
        }
      `}</style>
    </div>
  );
}
