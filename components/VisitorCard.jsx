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

.card-wrapper{
  border-radius:24px;
  overflow:hidden;
  aspect-ratio:362 / 235;
  transition:transform .35s cubic-bezier(.22,.61,.36,1),
             box-shadow .35s ease;
}

.card-wrapper:hover{
  transform:translateY(-8px) scale(1.02);
  box-shadow:0 30px 60px rgba(0,0,0,.35);
}

.card{
  width:100%;
  height:100%;
  background-size:cover;
  background-position:center;
  position:relative;
  display:flex;
  flex-direction:column;
  padding:6% 6%;
  box-sizing:border-box;
  overflow:hidden;
}

/* Sparkle effect */

.card::after{
  content:"";
  position:absolute;
  inset:0;

  background:linear-gradient(
    120deg,
    transparent 30%,
    rgba(255,255,255,0.35) 50%,
    transparent 70%
  );

  transform:translateX(-120%);
  transition:transform .9s ease;
}

.card-wrapper:hover .card::after{
  transform:translateX(120%);
}

  background-image:
    radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,.7), transparent),
    radial-gradient(2px 2px at 80% 40%, rgba(255,255,255,.6), transparent),
    radial-gradient(2px 2px at 60% 70%, rgba(255,255,255,.7), transparent),
    radial-gradient(2px 2px at 40% 80%, rgba(255,255,255,.6), transparent);

  opacity:0;
  transition:opacity .4s ease;
}

.card-wrapper:hover .card::after{
  opacity:.6;
}


        .card {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 6% 6%;
          box-sizing: border-box;
        }

        .card-title {
          font-family: var(--font-serif);
          font-size: 20px;
          color: #fff;
          text-align: left;
        
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
          font-family: var(--font-inter);
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .val {
          font-family: var(--font-inter);
          font-size: 13px;
          color: #fff;
          font-weight: 500;
          letter-spacing: 0.2px;
        }

        .val-name {
          font-size: 14px;
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
          font-size: 12px;
          color: rgba(0,0,0,0.3);
        }

.sig-img {
  position: absolute;
  left: 35px;
  bottom: 9px;

  width: 150%;
  max-width: 2000px;

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
