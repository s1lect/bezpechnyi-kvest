import { useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { Portrait } from '../components/Portrait';
import { Scene } from '../components/Scene';
import { QUESTS } from '../data/quests';
import { worldById } from '../data/worlds';
import { withViewTransition } from '../lib/motion';
import { confettiFrom } from '../lib/confetti';
import { saveResult } from '../lib/progress';
import { useCountUp } from '../lib/useCountUp';
import { stopSpeaking } from '../lib/voice';
import type { Quest } from '../types';
import { useSfx } from './hooks';
import { gradedCount, verdict } from './scoring';
import { StepView } from './steps';
import type { Done } from './types';
import './Player.css';

function QrToPhones() {
  const [src, setSrc] = useState('');
  const url = window.location.href.split('?')[0];
  useEffect(() => {
    let alive = true;
    void QRCode.toDataURL(url, { margin: 1, width: 360, color: { dark: '#172b4d', light: '#ffffff' } }).then((d) => alive && setSrc(d));
    return () => {
      alive = false;
    };
  }, [url]);
  return (
    <div className="qr">
      {src && <img src={src} alt="QR-код для відкриття квесту на телефоні" width={168} height={168} />}
      <p>Учні можуть відсканувати код і пройти квест на своїх телефонах. Порядок варіантів у них буде таким самим, як на екрані.</p>
    </div>
  );
}

function ResultScore({ score, total }: { score: number; total: number }) {
  const shown = useCountUp(score, 800, 450);
  return (
    <p className="result__score">
      З першої спроби: <strong>{shown}</strong> з {total}
    </p>
  );
}

function Badge({ color }: { color: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const t = window.setTimeout(() => confettiFrom(ref.current, { count: 150, spread: 1.4, power: 1.35 }), 250);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <svg ref={ref} viewBox="0 0 120 120" width="120" height="120" aria-hidden="true" className="result__badge">
      <circle cx="60" cy="60" r="54" fill={color} stroke="#172b4d" strokeWidth="5" />
      <circle cx="60" cy="60" r="40" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="4 6" />
      <path d="M40 62l14 14 28-30" stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function QuestPlayer({ quest }: { quest: Quest }) {
  const [params, setParams] = useSearchParams();
  const classMode = params.get('mode') === 'class';
  const navigate = useNavigate();
  const fx = useSfx();
  const world = worldById(quest.world);
  const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showQr, setShowQr] = useState(false);
  const total = useMemo(() => gradedCount(quest), [quest]);
  const nextQuest = QUESTS[(QUESTS.findIndex((q) => q.id === quest.id) + 1) % QUESTS.length];
  const introScene = quest.steps.find((s) => s.scene)?.scene ?? 'classroom';

  useEffect(() => {
    document.title = `${quest.title} — Безпечний квест`;
    return () => {
      stopSpeaking();
      document.title = 'Безпечний квест — квести з безпеки для шкіл НУШ';
    };
  }, [quest.title]);

  const restart = () =>
    transition(() => {
      setIndex(0);
      setScore(0);
      setPhase('play');
    });

  /** Зміна кроку чи екрана — через View Transition: сцена виїжджає, діалог змінюється плавно. */
  const transition = (update: () => void) => withViewTransition(() => flushSync(update));

  const onDone: Done = (firstTry) => {
    const newScore = score + (firstTry ? 1 : 0);
    if (index + 1 >= quest.steps.length) {
      saveResult(quest.id, { score: newScore, total, completedAt: new Date().toISOString() });
      fx.finish();
      transition(() => {
        setScore(newScore);
        setPhase('result');
      });
    } else {
      transition(() => {
        setScore(newScore);
        setIndex(index + 1);
      });
    }
  };

  const toggleClass = () => {
    const p = new URLSearchParams(params);
    if (classMode) p.delete('mode');
    else p.set('mode', 'class');
    setParams(p, { replace: true });
  };

  const step = quest.steps[index];

  return (
    <div className={classMode ? 'player player--class' : 'player'} style={{ ['--world' as string]: world.color }}>
      <div className="player__bar">
        <button className="icon-btn" onClick={() => navigate(`/world/${quest.world}`)} aria-label="Вийти з квесту">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="player__title">
          <span className="player__world">{world.title}</span>
          <strong>{quest.title}</strong>
        </div>
        {phase === 'play' && (
          <div
            className="progress"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={quest.steps.length}
            aria-valuenow={index + 1}
            aria-valuetext={`Крок ${index + 1} з ${quest.steps.length}`}
            aria-label="Прогрес квесту"
          >
            {quest.steps.map((s, i) => (
              <span key={s.id} data-state={i < index ? 'done' : i === index ? 'now' : ''} />
            ))}
          </div>
        )}
        {classMode && <span className="tag player__classtag">Класний режим</span>}
      </div>

      {phase === 'intro' && (
        <section className="intro" aria-labelledby="quest-title">
          <Scene id={introScene} className="intro__bg" />
          <div className="intro__card">
            <Portrait id={world.guide} size={88} />
            <h1 id="quest-title" style={{ viewTransitionName: `quest-title-${quest.id}` }}>
              {quest.title}
            </h1>
            <p className="intro__tagline">{quest.tagline}</p>
            <div className="intro__meta">
              <span className="tag">{quest.grades} класи</span>
              <span className="tag">≈ {quest.minutes} хв</span>
              <span className="tag">{total} завдань</span>
            </div>
            <div className="intro__actions">
              <button className="btn btn--signal" onClick={() => transition(() => setPhase('play'))} autoFocus>
                Почати квест
              </button>
              <button className="btn btn--ghost" onClick={toggleClass} aria-pressed={classMode}>
                {classMode ? 'Вимкнути класний режим' : 'Класний режим (проєктор)'}
              </button>
              <button className="btn btn--ghost" onClick={() => setShowQr((v) => !v)} aria-expanded={showQr}>
                QR для телефонів
              </button>
            </div>
            {classMode && (
              <p className="intro__hint">
                У класному режимі учні голосують руками, а ви відмічаєте голоси кнопками «+» і відкриваєте правильну відповідь.
              </p>
            )}
            {showQr && <QrToPhones />}
            <Link viewTransition to={`/teacher/lesson/${quest.id}`} className="intro__lesson">
              Конспект уроку для вчителя
            </Link>
          </div>
        </section>
      )}

      {phase === 'play' && step && <StepView key={step.id} step={step} onDone={onDone} classMode={classMode} />}

      {phase === 'result' && (
        <section className="result" aria-labelledby="result-title">
          <div className="result__card">
            <Badge color={world.hex} />
            <h1 id="result-title">Квест пройдено!</h1>
            {total > 0 && <ResultScore score={score} total={total} />}
            <p>{verdict(score, total)}</p>
            <div className="intro__actions">
              <button className="btn btn--ghost" onClick={restart}>
                Пройти ще раз
              </button>
              <Link viewTransition className="btn btn--signal" to={`/quest/${nextQuest.id}`}>
                Далі: {nextQuest.title}
              </Link>
              <Link viewTransition className="btn btn--ghost" to="/progress">
                Мої досягнення
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
