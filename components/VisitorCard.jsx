'use client';

const CARD_THEMES = {
  blue:   { bg: '#2B7BB5', image: '/cards/card-blue.png' },
  green:  { bg: '#2F7D49', image: '/cards/card-green.png' },
  orange: { bg: '#C8753A', image: '/cards/card-orange.png' },
  pink:   { bg: '#C45C74', image: '/cards/card-pink.png' },
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
      <div className="card" style={{ backgroundImage: 'url(' + theme.image + ')', backgroundColor: theme.bg }}>

        <div className="card-title">Aditi's palace</div>

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
              <img src={signature} alt="signature" className="sig-img" />
            )}
            <div className="sig-line" />
          </div>
        </div>

      </div>

      <style jsx>{`
        .card-wrapper {
          border-radius: 18px;
          overflow: hidden;
          aspect-ratio: 362 / 235;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .card-wrapper:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.18);
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
          font-style: italic;
          font-size: clamp(13px, 3vw, 20px);
          color: #fff;
          text-align: center;
          width: 55%;
          margin-bottom: auto;
          text-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        .card-body {
          display: flex;
          flex-direction: column;
          gap: 3px;
          width: 54%;
        }
        .card-field {
          display: flex;
          flex-direction: column;
          gap: 1px;
          margin-bottom: 3px;
        }
        .lbl {
          font-family: var(--font-mono);
          font-size: clamp(6px, 1vw, 8px);
          letter-spacing: 1.2px;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
        }
        .val {
          font-family: var(--font-mono);
          font-size: clamp(10px, 1.8vw, 14px);
          color: #fff;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        .val-name {
          font-size: clamp(11px, 2vw, 15px);
        }
        .sign-row {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 4%;
          position: relative;
          height: 22px;
        }
        .sign-x {
          font-family: var(--font-mono);
          font-size: clamp(8px, 1.2vw, 11px);
          color: rgba(255,255,255,0.75);
        }
        .sig-img {
          position: absolute;
          left: 30px;
          top: 50%;
          transform: translateY(-50%);
          width: 65%;
          height: 40px;
          object-fit: contain;
          object-position: left center;
        }
        .sig-line {
          position: absolute;
          bottom: 0;
          left: 22px;
          right: 0;
          border-bottom: 1px solid rgba(255,255,255,0.35);
        }
      `}</style>
    </article>
  );
}
