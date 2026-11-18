import { useEffect, useMemo, useRef, useState } from 'react';
import { Scene } from '../components/Scene';
import { useSettings } from '../lib/settings';
import { sfx } from '../lib/sound';
import type {
  ChatStep,
  ChoiceStep,
  LineStep,
  PackStep,
  PasswordStep,
  RhythmStep,
  RuleStep,
  SortStep,
  SpotStep,
} from '../types';
import { Feedback, Frame, useSay } from './Frame';

export type Done = (firstTry: boolean | null) => void;

function useSfx() {
  const { settings } = useSettings();
  const on = settings.sound && !settings.calm;
  return {
    correct: () => on && sfx.correct(),
    wrong: () => on && sfx.wrong(),
    tap: () => on && sfx.tap(),
    beat: () => on && sfx.beat(),
  };
}

function NextButton({ onClick, label = 'Далі' }: { onClick: () => void; label?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);
  return (
    <div className="dialog__actions">
      <button ref={ref} className="btn btn--signal" onClick={onClick}>
        {label}
      </button>
    </div>
  );
}

/* ---------------- Репліка ---------------- */
export function LineView({ step, onDone }: { step: LineStep; onDone: Done }) {
  return (
    <Frame scene={step.scene} speaker={step.speaker} text={step.text} audio={step.audio}>
      <NextButton onClick={() => onDone(null)} />
    </Frame>
  );
}

/* ---------------- Вибір ---------------- */
/** Стабільне перемішування за id кроку: позиція правильної відповіді різна, але однакова для всього класу. */
function seededOrder(seed: string, n: number): number[] {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export function ChoiceView({ step: raw, onDone, classMode }: { step: ChoiceStep; onDone: Done; classMode: boolean }) {
  const step = useMemo(() => ({ ...raw, options: seededOrder(raw.id + raw.text, raw.options.length).map((i) => raw.options[i]) }), [raw]);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<Set<number>>(new Set());
  const [solved, setSolved] = useState(false);
  const [votes, setVotes] = useState<number[]>(() => step.options.map(() => 0));
  const say = useSay();
  const fx = useSfx();
  const correctIndex = step.options.findIndex((o) => o.correct);

  const choose = (i: number) => {
    if (solved) return;
    setPicked(i);
    const opt = step.options[i];
    if (opt.correct) {
      fx.correct();
      setSolved(true);
    } else {
      fx.wrong();
      setWrong((w) => new Set(w).add(i));
    }
    say(opt.feedback, step.speaker === 'stranger' ? 'narrator' : (step.speaker ?? 'narrator'));
  };

  const reveal = () => {
    setPicked(correctIndex);
    setSolved(true);
    fx.correct();
    say(step.options[correctIndex].feedback);
  };

  useEffect(() => {
    if (classMode) return;
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (n >= 1 && n <= step.options.length) choose(n - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const maxVotes = Math.max(...votes);
  const classRight = votes[correctIndex] > 0 && votes[correctIndex] === maxVotes;

  return (
    <Frame scene={step.scene} speaker={step.speaker} text={step.text} audio={step.audio}>
      <ol className="options">
        {step.options.map((o, i) => {
          const state = solved && i === correctIndex ? 'ok' : wrong.has(i) ? 'bad' : '';
          return (
            <li key={i} className="option-row">
              <button
                className={`option ${state ? `option--${state}` : ''}`}
                onClick={() => (classMode ? undefined : choose(i))}
                aria-disabled={solved || classMode}
                tabIndex={classMode ? -1 : 0}
              >
                <span className="option__key" aria-hidden="true">
                  {i + 1}
                </span>
                <span>{o.text}</span>
              </button>
              {classMode && (
                <div className="votes" aria-label={`Голоси за варіант ${i + 1}`}>
                  <button className="icon-btn" onClick={() => setVotes((v) => v.map((x, j) => (j === i ? Math.max(0, x - 1) : x)))} aria-label="Мінус голос" disabled={solved}>
                    −
                  </button>
                  <output>{votes[i]}</output>
                  <button className="icon-btn" onClick={() => setVotes((v) => v.map((x, j) => (j === i ? x + 1 : x)))} aria-label="Плюс голос" disabled={solved}>
                    +
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {picked !== null && <Feedback ok={step.options[picked].correct} text={step.options[picked].feedback} />}
      {classMode && !solved && (
        <div className="dialog__actions">
          <button className="btn btn--rescue" onClick={reveal}>
            Відкрити відповідь
          </button>
        </div>
      )}
      {solved && <NextButton onClick={() => onDone(classMode ? classRight : wrong.size === 0)} />}
    </Frame>
  );
}

/* ---------------- Знайди небезпеку ---------------- */
export function SpotView({ step, onDone }: { step: SpotStep; onDone: Done }) {
  const [found, setFound] = useState<string[]>([]);
  const [misses, setMisses] = useState(0);
  const [last, setLast] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const say = useSay();
  const fx = useSfx();
  const all = found.length === step.hotspots.length;
  const lastSpot = step.hotspots.find((h) => h.id === last);
  const remaining = step.hotspots.filter((h) => !found.includes(h.id));

  const hit = (id: string) => {
    if (found.includes(id)) return;
    const h = step.hotspots.find((x) => x.id === id)!;
    fx.correct();
    setFound((f) => [...f, id]);
    setLast(id);
    setHint(false);
    say(`${h.label}. ${h.explain}`, step.speaker);
  };

  return (
    <Frame
      scene={step.scene}
      speaker={step.speaker}
      text={step.text}
      bareStage
      stage={
        <Scene id={step.scene} fit="meet" className="spot">
          <rect
            width="1000"
            height="600"
            fill="transparent"
            onClick={() => {
              if (all) return;
              fx.wrong();
              setMisses((m) => m + 1);
            }}
          />
          {step.hotspots.map((h) => {
            const isFound = found.includes(h.id);
            const pulse = hint && remaining[0]?.id === h.id;
            return (
              <g key={h.id}>
                <circle
                  cx={h.x * 10}
                  cy={h.y * 6}
                  r={h.r * 10}
                  className={`hotspot ${isFound ? 'hotspot--found' : ''} ${pulse ? 'hotspot--hint' : ''}`}
                  role="button"
                  tabIndex={isFound ? -1 : 0}
                  aria-label={isFound ? `Знайдено: ${h.label}` : 'Можлива небезпека'}
                  onClick={(e) => {
                    e.stopPropagation();
                    hit(h.id);
                  }}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), hit(h.id))}
                />
                {isFound && (
                  <g transform={`translate(${h.x * 10 + h.r * 7} ${h.y * 6 - h.r * 7})`} pointerEvents="none">
                    <circle r="18" fill="#1fa97a" stroke="#172b4d" strokeWidth="3" />
                    <path d="M-8 0l5 6 11-12" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                )}
              </g>
            );
          })}
        </Scene>
      }
    >
      <div className="counter">
        <span className="counter__big">
          {found.length}/{step.hotspots.length}
        </span>
        знайдено
        {!all && misses >= 2 && !hint && (
          <button className="btn btn--ghost btn--small" onClick={() => setHint(true)}>
            Підказка
          </button>
        )}
      </div>
      {lastSpot && <Feedback ok title={lastSpot.label + '.'} text={lastSpot.explain} />}
      {all && <NextButton onClick={() => onDone(misses <= 3)} />}
    </Frame>
  );
}

/* ---------------- Сортування ---------------- */
export function SortView({ step, onDone }: { step: SortStep; onDone: Done }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<0 | 1 | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [placed, setPlaced] = useState<{ text: string; bucket: 0 | 1 }[]>([]);
  const say = useSay();
  const fx = useSfx();
  const item = step.items[index];
  const finished = index >= step.items.length;

  const pick = (b: 0 | 1) => {
    if (answer !== null) return;
    setAnswer(b);
    if (b === item.bucket) fx.correct();
    else {
      fx.wrong();
      setMistakes((m) => m + 1);
    }
    say(item.explain, step.speaker);
  };

  const next = () => {
    setPlaced((p) => [...p, { text: item.text, bucket: item.bucket }]);
    setAnswer(null);
    setIndex((i) => i + 1);
  };

  return (
    <Frame
      scene={step.scene}
      speaker={step.speaker}
      text={step.text}
      stage={
        <div className="sort">
          {step.buckets.map((b, bi) => (
            <div key={b} className={`bucket bucket--${bi}`}>
              <h3>{b}</h3>
              {!placed.some((p) => p.bucket === bi) && <p className="bucket__empty">Тут з'являться ситуації</p>}
              <ul>
                {placed
                  .filter((p) => p.bucket === bi)
                  .map((p) => (
                    <li key={p.text}>{p.text}</li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      }
    >
      {!finished ? (
        <>
          <div className="sort-card">
            <span className="sort-card__count">
              {index + 1} з {step.items.length}
            </span>
            {item.text}
          </div>
          <div className="sort-actions">
            {step.buckets.map((b, bi) => (
              <button
                key={b}
                className={`btn ${answer === bi ? (bi === item.bucket ? 'btn--ok' : 'btn--bad') : 'btn--ghost'}`}
                onClick={() => pick(bi as 0 | 1)}
                aria-disabled={answer !== null}
              >
                {b}
              </button>
            ))}
          </div>
          {answer !== null && <Feedback ok={answer === item.bucket} text={item.explain} />}
          {answer !== null && <NextButton onClick={next} label={index + 1 === step.items.length ? 'Готово' : 'Наступне'} />}
        </>
      ) : (
        <>
          <Feedback ok={mistakes === 0} title={mistakes === 0 ? 'Без жодної помилки!' : `Помилок: ${mistakes}.`} text="Подивись, як розподілилися ситуації." />
          <NextButton onClick={() => onDone(mistakes <= 1)} />
        </>
      )}
    </Frame>
  );
}

/* ---------------- Тривожна валіза ---------------- */
export function PackView({ step, onDone }: { step: PackStep; onDone: Done }) {
  const [chosen, setChosen] = useState<Set<number>>(new Set());
  const [checked, setChecked] = useState<null | { ok: boolean; text: string }>(null);
  const [attempts, setAttempts] = useState(0);
  const say = useSay();
  const fx = useSfx();
  const weight = [...chosen].reduce((s, i) => s + step.items[i].weight, 0);
  const over = weight > step.capacity;

  const toggle = (i: number) => {
    fx.tap();
    setChecked(null);
    setChosen((c) => {
      const n = new Set(c);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  };

  const check = () => {
    setAttempts((a) => a + 1);
    const missing = step.items.filter((it, i) => it.essential && !chosen.has(i));
    let result: { ok: boolean; text: string };
    if (over) result = { ok: false, text: `Валіза важить ${weight} кг при ліміті ${step.capacity}. Прибери щось важке й не обов'язкове.` };
    else if (missing.length)
      result = { ok: false, text: `Бракує важливого: ${missing.map((m) => m.name.toLowerCase()).join(', ')}. ${missing[0].note}` };
    else {
      const extras = step.items.filter((it, i) => !it.essential && chosen.has(i));
      result = { ok: true, text: extras.length ? `Усе необхідне є. ${extras[0].note}` : 'Усе необхідне є, і валіза легка. Ідеально!' };
    }
    if (result.ok) fx.correct();
    else fx.wrong();
    setChecked(result);
    say(result.text, step.speaker);
  };

  return (
    <Frame
      scene={step.scene}
      speaker={step.speaker}
      text={step.text}
      stage={
        <div className="pack">
          <div className="pack__meter" role="meter" aria-valuemin={0} aria-valuemax={step.capacity} aria-valuenow={weight} aria-label="Вага валізи">
            <div className="pack__fill" style={{ width: `${Math.min(100, (weight / step.capacity) * 100)}%` }} data-over={over} />
            <span>
              {weight} / {step.capacity} кг
            </span>
          </div>
          <ul className="pack__grid">
            {step.items.map((it, i) => (
              <li key={it.name}>
                <button className="pack__item" aria-pressed={chosen.has(i)} onClick={() => toggle(i)}>
                  <span className="pack__name">{it.name}</span>
                  <span className="pack__w">{it.weight} кг</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      {checked && <Feedback ok={checked.ok} text={checked.text} />}
      {checked?.ok ? (
        <NextButton onClick={() => onDone(attempts <= 1)} />
      ) : (
        <div className="dialog__actions">
          <button className="btn btn--signal" onClick={check} disabled={chosen.size === 0}>
            Перевірити валізу
          </button>
        </div>
      )}
    </Frame>
  );
}

/* ---------------- Підозрілий чат ---------------- */
function splitByFlags(text: string, flags: string[]) {
  const parts: { text: string; flag?: string }[] = [];
  let rest = text;
  while (rest.length) {
    let first = -1;
    let flag = '';
    for (const f of flags) {
      const i = rest.indexOf(f);
      if (i !== -1 && (first === -1 || i < first)) {
        first = i;
        flag = f;
      }
    }
    if (first === -1) {
      parts.push({ text: rest });
      break;
    }
    if (first > 0) parts.push({ text: rest.slice(0, first) });
    parts.push({ text: flag, flag });
    rest = rest.slice(first + flag.length);
  }
  return parts;
}

export function ChatView({ step, onDone }: { step: ChatStep; onDone: Done }) {
  const allFlags = useMemo(() => step.messages.flatMap((m) => m.flags ?? []), [step]);
  const [found, setFound] = useState<string[]>([]);
  const [misses, setMisses] = useState(0);
  const [last, setLast] = useState<string | null>(null);
  const say = useSay();
  const fx = useSfx();
  const done = found.length === allFlags.length;
  const lastFlag = allFlags.find((f) => f.fragment === last);

  const hit = (fragment: string) => {
    if (found.includes(fragment)) return;
    const f = allFlags.find((x) => x.fragment === fragment)!;
    fx.correct();
    setFound((x) => [...x, fragment]);
    setLast(fragment);
    say(f.explain, step.speaker);
  };

  return (
    <Frame
      scene="phone"
      speaker={step.speaker}
      text={step.text}
      stage={
        <div className="phone">
          <div className="phone__head">
            <div className="phone__avatar" aria-hidden="true">
              {step.contact[0]}
            </div>
            <div>
              <strong>{step.contact}</strong>
              <small>{step.contactNote}</small>
            </div>
          </div>
          <div className="phone__body">
            {step.messages.map((m, i) => (
              <div
                key={i}
                className={`bubble bubble--${m.from}`}
                onClick={() => {
                  if (done) return;
                  fx.wrong();
                  setMisses((x) => x + 1);
                }}
              >
                {splitByFlags(
                  m.text,
                  (m.flags ?? []).map((f) => f.fragment),
                ).map((p, j) =>
                  p.flag ? (
                    <button
                      key={j}
                      className={`flag ${found.includes(p.flag) ? 'flag--found' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        hit(p.flag!);
                      }}
                    >
                      {p.text}
                    </button>
                  ) : (
                    <span key={j}>{p.text}</span>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div className="counter">
        <span className="counter__big">
          {found.length}/{allFlags.length}
        </span>
        підозрілих місць
      </div>
      {lastFlag && <Feedback ok title={`«${lastFlag.fragment}».`} text={lastFlag.explain} />}
      {done && <NextButton onClick={() => onDone(misses <= 2)} />}
    </Frame>
  );
}

/* ---------------- Ритм серця ---------------- */
export function RhythmView({ step, onDone }: { step: RhythmStep; onDone: Done }) {
  const [taps, setTaps] = useState<number[]>([]);
  const [good, setGood] = useState(0);
  const [metronome, setMetronome] = useState(false);
  const [pressed, setPressed] = useState(false);
  const fx = useSfx();
  const { settings } = useSettings();

  const bpm = useMemo(() => {
    if (taps.length < 3) return 0;
    const recent = taps.slice(-5);
    const intervals = recent.slice(1).map((t, i) => t - recent[i]);
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    return Math.round(60000 / avg);
  }, [taps]);

  const inZone = bpm >= step.min && bpm <= step.max;
  const done = good >= step.beats;

  const tap = () => {
    if (done) return;
    setPressed(true);
    setTimeout(() => setPressed(false), 90);
    fx.beat();
    const now = performance.now();
    setTaps((t) => {
      const next = [...t, now].slice(-8);
      if (next.length >= 3) {
        const recent = next.slice(-5);
        const iv = recent.slice(1).map((x, i) => x - recent[i]);
        const b = 60000 / (iv.reduce((a, c) => a + c, 0) / iv.length);
        if (b >= step.min && b <= step.max) setGood((g) => g + 1);
      }
      return next;
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !done) {
        e.preventDefault();
        tap();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    if (!metronome || done) return;
    const id = setInterval(() => settings.sound && sfx.beat(), 60000 / 110);
    return () => clearInterval(id);
  }, [metronome, done, settings.sound]);

  // позиція стрілки: 60–160 уд/хв
  const angle = bpm ? Math.max(-90, Math.min(90, ((bpm - 110) / 50) * 90)) : -90;

  return (
    <Frame
      scene={step.scene}
      speaker={step.speaker}
      text={step.text}
      stage={
        <div className="rhythm">
          <svg viewBox="0 0 240 140" className="gauge" aria-hidden="true">
            <path d="M20 120a100 100 0 0 1 200 0" fill="none" stroke="#e6eefc" strokeWidth="22" />
            <path d="M20 120a100 100 0 0 1 200 0" fill="none" stroke="#1fa97a" strokeWidth="22" pathLength="100" strokeDasharray="20 100" strokeDashoffset="-40" />
            <g transform={`rotate(${angle} 120 120)`} style={{ transition: 'transform .25s' }}>
              <path d="M120 120V34" stroke="#172b4d" strokeWidth="6" strokeLinecap="round" />
            </g>
            <circle cx="120" cy="120" r="10" fill="#172b4d" />
          </svg>
          <div className="rhythm__bpm" data-zone={bpm ? (inZone ? 'ok' : 'bad') : ''}>
            {bpm ? `${bpm} натискань/хв` : 'Почни натискати'}
          </div>
          <button className={`heart ${pressed ? 'heart--down' : ''}`} onClick={tap} disabled={done} aria-label="Натиснути на грудну клітку">
            <svg viewBox="0 0 24 24" width="64" height="64" aria-hidden="true">
              <path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" fill="currentColor" />
            </svg>
          </button>
        </div>
      }
    >
      <div className="counter">
        <span className="counter__big">
          {Math.min(good, step.beats)}/{step.beats}
        </span>
        натискань у правильному темпі
        <button className="btn btn--ghost btn--small" onClick={() => setMetronome((m) => !m)} aria-pressed={metronome}>
          {metronome ? 'Вимкнути метроном' : 'Метроном-підказка'}
        </button>
      </div>
      {bpm > 0 && !done && (
        <Feedback ok={inZone} title={inZone ? 'Так тримати.' : bpm < step.min ? 'Повільно.' : 'Швидко.'} text={`Потрібно ${step.min}–${step.max} натискань за хвилину.`} />
      )}
      {done && (
        <>
          <Feedback ok title="Чудовий ритм!" text="Саме в такому темпі натискають на грудну клітку до приїзду медиків." />
          <NextButton onClick={() => onDone(true)} />
        </>
      )}
    </Frame>
  );
}

/* ---------------- Кузня паролів ---------------- */
const COMMON = ['password', 'qwerty', '1234', '12345', '123456', '1111', '0000', 'admin', 'ukraine', 'україна', 'пароль', 'love', 'iloveyou', 'abc'];

function crackTime(pw: string) {
  if (!pw) return { seconds: 0, label: '', level: 0 };
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[а-яіїєґ]/.test(pw)) pool += 33;
  if (/[А-ЯІЇЄҐ]/.test(pw)) pool += 33;
  if (/\d/.test(pw)) pool += 10;
  if (/[^\wа-яіїєґА-ЯІЇЄҐ]/.test(pw)) pool += 30;
  let entropy = pw.length * Math.log2(Math.max(pool, 1));
  const lower = pw.toLowerCase();
  if (COMMON.some((c) => lower.includes(c))) entropy = Math.min(entropy, 20);
  if (/(.)\1{2,}/.test(pw)) entropy -= 10;
  const seconds = Math.pow(2, Math.max(entropy, 0)) / 1e10; // 10 млрд спроб/с
  const units: [number, string][] = [
    [3.15e9 * 1000, 'тисячі століть'],
    [3.15e9, 'століття'],
    [3.15e7, 'роки'],
    [2.6e6, 'місяці'],
    [86400, 'дні'],
    [3600, 'години'],
    [60, 'хвилини'],
    [1, 'секунди'],
  ];
  let label = 'миттєво';
  for (const [s, l] of units) {
    if (seconds >= s) {
      label = l;
      break;
    }
  }
  const level = seconds < 3600 ? 0 : seconds < 3.15e7 ? 1 : seconds < 3.15e9 ? 2 : 3;
  return { seconds, label, level };
}

export function PasswordView({ step, onDone }: { step: PasswordStep; onDone: Done }) {
  const [pw, setPw] = useState('');
  const { label, level } = crackTime(pw);
  const tips: string[] = [];
  if (pw && pw.length < 12) tips.push('Зроби пароль довшим: від 12 символів.');
  if (pw && !/\s|-/.test(pw) && pw.length < 16) tips.push('Спробуй фразу з кількох слів: «зелений-кіт-їсть-кавун».');
  if (pw && COMMON.some((c) => pw.toLowerCase().includes(c))) tips.push('Прибери популярні слова й послідовності на кшталт 1234 чи qwerty.');
  const levels = ['Ненадійний', 'Слабкий', 'Добрий', 'Дуже надійний'];

  return (
    <Frame
      scene="phone"
      speaker={step.speaker}
      text={step.text}
      stage={
        <div className="forge">
          <label htmlFor="forge-input" className="forge__label">
            Пароль для тренування
          </label>
          <input
            id="forge-input"
            className="forge__input"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            placeholder="наприклад, зелений-кіт-їсть-кавун"
          />
          <div className="forge__bar" data-level={pw ? level : -1}>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} />
            ))}
          </div>
          {pw && (
            <p className="forge__result">
              <strong>{levels[level]}.</strong> Комп&apos;ютеру знадобиться: <strong>{label}</strong>
            </p>
          )}
        </div>
      }
    >
      {tips.length > 0 && (
        <ul className="tips">
          {tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
      {pw && level >= 2 && <Feedback ok text="Такий пароль витримає атаку перебором. А двофакторна автентифікація додасть ще один замок." />}
      <NextButton onClick={() => onDone(null)} label={pw ? 'Далі' : 'Пропустити'} />
    </Frame>
  );
}

/* ---------------- Підсумок правил ---------------- */
export function RuleView({ step, onDone }: { step: RuleStep; onDone: Done }) {
  const text = `${step.title}. ${step.points.join(' ')}`;
  return (
    <Frame
      scene={step.scene ?? 'classroom'}
      speaker={step.speaker}
      text={step.title + ': головні правила'}
      speech={text}
      stage={
        <div className="rules">
          <h3>{step.title}</h3>
          <ol>
            {step.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </div>
      }
    >
      <NextButton onClick={() => onDone(null)} label="Завершити квест" />
    </Frame>
  );
}
