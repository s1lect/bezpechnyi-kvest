import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QUESTS } from '../data/quests';
import { WORLDS } from '../data/worlds';
import { loadProgress, resetProgress } from '../lib/progress';
import './pages.css';

export function ProgressPage() {
  const [progress, setProgress] = useState(loadProgress);
  const [name, setName] = useState('');
  const [today] = useState(() => new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }));
  const done = QUESTS.filter((q) => progress[q.id]);
  const all = done.length === QUESTS.length;

  return (
    <div className="container page">
      <h1 className="no-print">Мої досягнення</h1>
      <p className="lead no-print">
        Прогрес зберігається лише в цьому браузері. Ми не збираємо імен і не створюємо акаунтів.
      </p>

      <ul className="badges no-print">
        {WORLDS.map((w) => {
          const qs = QUESTS.filter((q) => q.world === w.id);
          const n = qs.filter((q) => progress[q.id]).length;
          const complete = qs.length > 0 && n === qs.length;
          return (
            <li key={w.id} className={complete ? 'badge badge--on' : 'badge'} style={{ ['--c' as string]: w.color }}>
              <svg viewBox="0 0 80 80" width="72" height="72" aria-hidden="true">
                <path d="M40 4l30 11v22c0 20-13 33-30 39C23 70 10 57 10 37V15z" fill={complete ? w.hex : '#e6eefc'} stroke="#172b4d" strokeWidth="4" strokeLinejoin="round" />
                {complete && <path d="M27 40l9 9 18-20" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
              </svg>
              <strong>{w.title}</strong>
              <span>
                {n} з {qs.length}
              </span>
            </li>
          );
        })}
      </ul>

      {done.length === 0 ? (
        <p className="empty no-print">
          Тут з'являться твої значки. <Link to="/">Обери перший квест на карті</Link>.
        </p>
      ) : (
        <section className="band no-print">
          <h2>Сертифікат</h2>
          <p>
            Пройдено {done.length} з {QUESTS.length} квестів.{' '}
            {all ? 'Можна роздрукувати сертифікат рятувальника!' : 'Сертифікат стане доступним після всіх квестів. Але переглянути його вже можна.'}
          </p>
          <label className="field">
            Ім'я для сертифіката (не зберігається)
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ім'я та прізвище" />
          </label>
          <div className="hero__actions">
            <button className="btn btn--signal" onClick={() => window.print()} disabled={!all}>
              Роздрукувати сертифікат
            </button>
            <button
              className="btn btn--ghost"
              onClick={() => {
                if (window.confirm('Скинути весь прогрес у цьому браузері?')) {
                  resetProgress();
                  setProgress({});
                }
              }}
            >
              Скинути прогрес
            </button>
          </div>
        </section>
      )}

      {done.length > 0 && (
        <div className="certificate" aria-label="Попередній перегляд сертифіката">
          <svg viewBox="0 0 48 48" width="72" height="72" aria-hidden="true">
            <path d="M24 3l17 6v13c0 11-7.5 19-17 23C14.5 41 7 33 7 22V9z" fill="#ffc531" stroke="#172b4d" strokeWidth="3" strokeLinejoin="round" />
            <path d="M17 24l5 5 10-11" stroke="#172b4d" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="certificate__kicker">Сертифікат</p>
          <h2>{name || 'Ім’я учня'}</h2>
          <p>
            пройшов(-ла) тренування «Безпечний квест» і знає, як діяти під час повітряної тривоги, пожежі, зустрічі з вибухонебезпечними
            предметами, шахрайством і булінгом, а також як надати першу допомогу.
          </p>
          <p className="certificate__date">{today}</p>
        </div>
      )}
    </div>
  );
}
