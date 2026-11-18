export type WorldId = 'home' | 'war' | 'cyber' | 'money' | 'people' | 'health';

export type SpeakerId = 'narrator' | 'olya' | 'kit' | 'sova' | 'taras' | 'mama' | 'stranger' | 'student';

export type SceneId = 'classroom' | 'corridor' | 'home' | 'kitchen' | 'street' | 'field' | 'phone' | 'shelter' | 'park' | 'crossing';

export interface Option {
  text: string;
  correct: boolean;
  /** Пояснення, яке бачить учень після вибору. */
  feedback: string;
}

interface BaseStep {
  id: string;
  scene?: SceneId;
  speaker?: SpeakerId;
  /** Необов'язковий шлях до професійно записаного аудіо (замість синтезу мовлення). */
  audio?: string;
}

export interface LineStep extends BaseStep {
  kind: 'line';
  text: string;
}

export interface ChoiceStep extends BaseStep {
  kind: 'choice';
  text: string;
  options: Option[];
}

export interface Hotspot {
  id: string;
  /** Координати в системі 0–100 відносно ілюстрації. */
  x: number;
  y: number;
  r: number;
  label: string;
  explain: string;
}

export interface SpotStep extends BaseStep {
  kind: 'spot';
  text: string;
  scene: 'kitchen' | 'field' | 'crossing';
  hotspots: Hotspot[];
}

export interface SortItem {
  text: string;
  bucket: 0 | 1;
  explain: string;
}

export interface SortStep extends BaseStep {
  kind: 'sort';
  text: string;
  buckets: [string, string];
  items: SortItem[];
}

export interface PackItem {
  name: string;
  weight: number;
  essential: boolean;
  note: string;
}

export interface PackStep extends BaseStep {
  kind: 'pack';
  text: string;
  capacity: number;
  items: PackItem[];
}

export interface ChatFlag {
  fragment: string;
  explain: string;
}

export interface ChatMessage {
  from: 'them' | 'me';
  author?: string;
  text: string;
  flags?: ChatFlag[];
}

export interface ChatStep extends BaseStep {
  kind: 'chat';
  text: string;
  contact: string;
  contactNote: string;
  messages: ChatMessage[];
}

export interface RhythmStep extends BaseStep {
  kind: 'rhythm';
  text: string;
  /** Скільки натискань зараховувати. */
  beats: number;
  min: number;
  max: number;
}

export interface PasswordStep extends BaseStep {
  kind: 'password';
  text: string;
}

export interface BreatheStep extends BaseStep {
  kind: 'breathe';
  text: string;
  /** Тривалість фаз у секундах: вдих, затримка, видих, затримка. */
  pattern: [number, number, number, number];
  cycles: number;
}

export interface RuleStep extends BaseStep {
  kind: 'rule';
  title: string;
  points: string[];
}

export type Step = LineStep | ChoiceStep | SpotStep | SortStep | PackStep | ChatStep | RhythmStep | PasswordStep | BreatheStep | RuleStep;

export interface LessonStage {
  minutes: number;
  title: string;
  text: string;
}

export interface Quest {
  id: string;
  world: WorldId;
  title: string;
  tagline: string;
  grades: string;
  minutes: number;
  /** Змістова лінія модельної програми «Здоров'я, безпека та добробут» або іншого предмета. */
  curriculum: string;
  /** Очікувані результати навчання у формулюванні для вчителя. */
  outcomes: string[];
  /** Хто має перевірити зміст перед офіційним використанням. */
  reviewBy: string;
  lesson: {
    goal: string;
    stages: LessonStage[];
    discussion: string[];
    homework: string;
  };
  steps: Step[];
}

export interface World {
  id: WorldId;
  title: string;
  short: string;
  description: string;
  color: string;
  /** Той самий колір у hex для SVG-атрибутів. */
  hex: string;
  guide: SpeakerId;
}
