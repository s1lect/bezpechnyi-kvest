import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { Portrait } from '../components/Portrait';
import { Scene } from '../components/Scene';
import { QUESTS } from '../data/quests';
import { worldById } from '../data/worlds';
import { saveResult } from '../lib/progress';
import { useSettings } from '../lib/settings';
import { sfx } from '../lib/sound';
import { stopSpeaking } from '../lib/voice';
import type { Quest, Step } from '../types';
import { ChatView, ChoiceView, LineView, PackView, PasswordView, RhythmView, RuleView, SortView, SpotView, type Done } from './steps';
import './Player.css';

const GRADED: Step['kind'][] = ['choice', 'spot', 'sort', 'pack', 'chat', 'rhythm'];

function StepView({ step, onDone, classMode }: { step: Step; onDone: Done; classMode: boolean }) {
  switch (step.kind) {
    case 'line':
      return <LineView step={step} onDone={onDone} />;
    case 'choice':
      return <ChoiceView step={step} onDone={onDone} classMode={classMode} />;
    case 'spot':
      return <SpotView step={step} onDone={onDone} />;
    case 'sort':
      return <SortView step={step} onDone={onDone} />;
    case 'pack':
      return <PackView step={step} onDone={onDone} />;
    case 'chat':
      return <ChatView step={step} onDone={onDone} />;
    case 'rhythm':
      return <RhythmView step={step} onDone={onDone} />;
    case 'password':
      return <PasswordView step={step} onDone={onDone} />;
    case 'rule':
      return <RuleView step={step} onDone={onDone} />;
  }
}

function QrToPhones() {
  const [src, setSrc] = useState('');
  const url = window.location.href.split('?')[0];
  useEffect(() => {
    void QRCode.toDataURL(url, { margin: 1, width: 360, color: { dark: '#172b4d', light: '#ffffff' } }).then(setSrc);
  }, [url]);
  return (
    <div className="qr">
      {src && <img src={src} alt="QR-код для відкриття квесту на телефоні" width={180} height={180} />}
      <p>Учні можуть відсканувати код і пройти квест на своїх телефонах.</p>
    </div>
  );
}

export function QuestPlayer({ quest }: { quest: Quest }) {
  const [params, setParams] = useSearchParams();
  const classMode = params.get('mode') === 'class';
  const navigate = useNavigate();
  const { settings } = useSettings();
  const world = worldById(quest.world);
  const [phase, setPhase] = useState<'intro' | 'play' | 'result'>('intro');
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showQr, setShowQr] = useState(false);
  const total = useMemo(() => quest.steps.filter((s) => GRADED.includes(s.kind)).length, [quest]);
  const nextQuest = QUESTS[(QUESTS.findIndex((q) => q.id === quest.id) + 1) % QUESTS.length];

  useEffect(() => () => stopSpeaking(), []);

  const restart = () => {
    setIndex(0);
    setScore(0);
    setPhase('play');
  };

  const onDone: Done = (firstTry) => {
    const newScore = score + (firstTry ? 1 : 0);
    setScore(newScore);
    if (index + 1 >= quest.steps.length) {
      saveResult(quest.id, { score: newScore, total, completedAt: new Date().toISOString() });
      if (settings.sound && !settings.calm) sfx.finish();
      setPhase('result');
    } else {
      setIndex(index + 1);
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
    <div className={`player ${classMode ? 'player--class' : ''}`} style={{ ['--world' as string]: world.color }}>
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
          <div className="progress" role="progressbar" aria-valuemin={1} aria-valuemax={quest.steps.length} aria-valuenow={index + 1} aria-label="Прогрес квесту">
            {quest.steps.map((s, i) => (
              <span key={s.id} data-state={i < index ? 'done' : i === index ? 'now' : ''} />
            ))}
          </div>
        )}
        {classMode && <span className="tag player__classtag">Класний режим</span>}
      </div>

      {phase === 'intro' && (
        <section className="intro">
          <Scene id={quest.steps.find((s) => s.scene)?.scene ?? 'classroom'} className="intro__bg" />
          <div className="intro__card">
            <Portrait id={world.guide} size={88} />
            <h1>{quest.title}</h1>
            <p className="intro__tagline">{quest.tagline}</p>
            <div className="intro__meta">
              <span className="tag">{quest.grades} класи</span>
              <span className="tag">≈ {quest.minutes} хв</span>
              <span className="tag">{total} завдань</span>
            </div>
            <div className="intro__actions">
              <button className="btn btn--signal" onClick={() => setPhase('play')} autoFocus>
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
            <Link to={`/teacher/lesson/${quest.id}`} className="intro__lesson">
              Конспект уроку для вчителя
            </Link>
          </div>
        </section>
      )}

      {phase === 'play' && step && <StepView key={step.id} step={step} onDone={onDone} classMode={classMode} />}

      {phase === 'result' && (
        <section className="result">
          <div className="result__card">
            <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true" className="result__badge">
              <circle cx="60" cy="60" r="54" fill={world.hex} stroke="#172b4d" strokeWidth="5" />
              <circle cx="60" cy="60" r="40" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="4 6" />
              <path d="M40 62l14 14 28-30" stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h1>Квест пройдено!</h1>
            <p className="result__score">
              З першої спроби: <strong>{score}</strong> з {total}
            </p>
            <p>
              {score === total
                ? 'Бездоганно. Ти знаєш, що робити, і можеш навчити інших.'
                : score >= total / 2
                  ? 'Добрий результат. Пройди ще раз, щоб закріпити правила.'
                  : 'Помилки на тренуванні — це нормально. Саме для цього воно й потрібне. Спробуй ще раз.'}
            </p>
            <div className="intro__actions">
              <button className="btn btn--ghost" onClick={restart}>
                Пройти ще раз
              </button>
              <Link className="btn btn--signal" to={`/quest/${nextQuest.id}`}>
                Наступний квест: {nextQuest.title}
              </Link>
              <Link className="btn btn--ghost" to="/progress">
                Мої досягнення
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
