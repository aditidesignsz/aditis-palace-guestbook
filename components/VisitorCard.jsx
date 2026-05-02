'use client';

const CARD_THEMES = {
  blue:   { image: '/cards/card-blue.png' },
  green:  { image: '/cards/card-green.png' },
  orange: { image: '/cards/card-orange.png' },
  pink:   { image: '/cards/card-pink.png' },
  yellow: { image: '/cards/card-yellow.png' }
};

function formatDate(dateString) {
  const d = new Date(dateString);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return dd + '/' + mm + '/' + yy;
}

export default function VisitorCard({ visitor }) {

  const { name, card_color, signature, created_at } = visitor;

  const theme = CARD_THEMES[card_color] || CARD_THEMES.pink;

  return (

    <article className="card-wrapper">

      <div
        className="card"
        style={{ backgroundImage: `url(${theme.image})` }}
      >

        {/* Title */}

        <div className="card-title">
          Aditi's palace
        </div>

        {/* Body */}

        <div className="card-body">

          <div className="card-field">
            <span className="lbl">GUEST</span>
            <span className="val val-name">{name.toUpperCase()}</span>
          </div>

          <div className="card-field">
            <span className="lbl">ISSUED ON</span>
            <span className="val">{formatDate(created_at)}</span>
          </div>

          <div className="sign-row">

            <span className="lbl">SIGN</span>
            <span className="sign-x">X</span>

            {signature && (
              <img
                src={signature}
                alt="signature"
                className="sig-img"
              />
            )}

            <div className="sig-line" />

          </div>

        </div>

      </div>


      <style jsx>{`

        .card-wrapper {
          border-radius: 24px;
          overflow: hidden;
          aspect-ratio: 362 / 235;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }

        .card-wrapper:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 36px rgba(0,0,0,0.18);
        }

        .card {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 5% 6%;
          box-sizing: border-box;
        }

        .card-title {
          font-family: var(--font-serif);
          font-size: 24px;
          color: #fff;
          text-align: center;
          width: 55%;
          margin-bottom: auto;
          text-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }

        .card-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 54%;
        }

        .card-field {
          display: flex;
          flex-direction: column;
          gap: 1px;
          margin-bottom: 4px;
        }

        .lbl {
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 1px;
          color: rgba(0,0,0,0.3);
          text-transform: uppercase;
        }

        .val {
          font-family: var(--font-mono);
          font-size: 14px;
          color: #fff;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .val-name {
          font-size: 15px;
        }

        .sign-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 6%;
          position: relative;
          height: 24px;
        }

        .sign-x {
          font-family: var(--font-mono);
          font-size: 11px;
          color: rgba(0,0,0,0.3);
        }

        .sig-img {
  position: absolute;
  left: 45px;
  bottom: 10px;
  width: 85%;
  height: auto;
  object-fit: contain;
        }

        .sig-line {
          position: absolute;
          bottom: 0;
          left: 26px;
          right: 0;
          border-bottom: 1px solid rgba(255,255,255,0.35);
        }

      `}</style>

    </article>

  );
}
