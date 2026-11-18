import { useEffect, useRef, useState } from 'react';
import { EMERGENCY, SUPPORT } from '../data/hotlines';
import './HelpButton.css';

export function HelpButton() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <button className="help-fab no-print" onClick={() => setOpen(true)}>
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" fill="currentColor" />
        </svg>
        Потрібна допомога
      </button>
      <dialog ref={dialog} className="help-dialog" onClose={() => setOpen(false)} aria-labelledby="help-title">
        <div className="help-dialog__head">
          <h2 id="help-title">Тобі не мусить бути важко самому</h2>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Закрити">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p>
          Якщо тобі загрожує небезпека зараз — телефонуй <a href="tel:112">112</a>. Якщо тобі страшно, сумно чи тебе ображають — розкажи
          дорослому, якому довіряєш, або зателефонуй на безкоштовну лінію.
        </p>
        <h3>Екстрені служби</h3>
        <ul className="hotlines hotlines--emergency">
          {EMERGENCY.map((h) => (
            <li key={h.number}>
              <a href={`tel:${h.tel}`} className="hotline">
                <span className="hotline__num">{h.number}</span>
                <span>
                  <strong>{h.title}</strong>
                  <small>{h.note}</small>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <h3>Підтримка</h3>
        <ul className="hotlines">
          {SUPPORT.map((h) => (
            <li key={h.number}>
              <a href={`tel:${h.tel}`} className="hotline">
                <span className="hotline__num">{h.number}</span>
                <span>
                  <strong>{h.title}</strong>
                  <small>{h.note}</small>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="help-dialog__note">Також можна звернутися до психолога чи соціального педагога своєї школи.</p>
      </dialog>
    </>
  );
}
