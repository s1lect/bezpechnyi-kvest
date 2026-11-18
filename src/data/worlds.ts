import type { SpeakerId, World, WorldId } from '../types';

export const WORLDS: World[] = [
  {
    id: 'home',
    title: 'Дім і вулиця',
    short: 'БЖД',
    description: 'Пожежа, газ, електрика, дорога, вода й лід. Що робити, щоб побутова дрібниця не стала бідою.',
    color: 'var(--w-home)',
    hex: '#ff8a3d',
    guide: 'olya',
  },
  {
    id: 'war',
    title: 'Воєнний час',
    short: 'Укриття',
    description: 'Повітряна тривога, укриття, тривожна валіза, вибухонебезпечні предмети, вербування в месенджерах.',
    color: 'var(--w-war)',
    hex: '#5b6cff',
    guide: 'olya',
  },
  {
    id: 'cyber',
    title: 'Інтернет',
    short: 'Кібербезпека',
    description: 'Фішинг, паролі, приватність, фейки й діпфейки, безпечне спілкування з незнайомцями.',
    color: 'var(--w-cyber)',
    hex: '#12a4c9',
    guide: 'kit',
  },
  {
    id: 'money',
    title: 'Гроші',
    short: 'Фінансова безпека',
    description: 'Шахрайські дзвінки, «виграші», дропери, кишенькові гроші та платіжна картка.',
    color: 'var(--w-money)',
    hex: '#20a36b',
    guide: 'sova',
  },
  {
    id: 'people',
    title: 'Стосунки',
    short: 'Без булінгу',
    description: 'Булінг і кібербулінг, роль свідка, особисті межі, як вирішувати конфлікти й просити допомоги.',
    color: 'var(--w-people)',
    hex: '#d9488f',
    guide: 'taras',
  },
  {
    id: 'health',
    title: "Здоров'я",
    short: 'Перша допомога',
    description: 'Серцево-легенева реанімація, кровотеча, дихальні вправи від тривоги, турбота про себе.',
    color: 'var(--w-health)',
    hex: '#e5484d',
    guide: 'olya',
  },
];

export const worldById = (id: WorldId): World => WORLDS.find((w) => w.id === id)!;

export const SPEAKERS: Record<SpeakerId, { name: string; role: string; pitch: number; rate: number }> = {
  narrator: { name: 'Оповідач', role: '', pitch: 1, rate: 1 },
  olya: { name: 'Оля', role: 'рятувальниця', pitch: 1.1, rate: 1 },
  kit: { name: 'Кібер-Кіт', role: 'провідник Інтернетом', pitch: 1.25, rate: 1.05 },
  sova: { name: 'Сова Гривня', role: 'фінансова радниця', pitch: 0.95, rate: 0.95 },
  taras: { name: 'Тарас', role: 'однокласник', pitch: 1.15, rate: 1.05 },
  mama: { name: 'Мама', role: '', pitch: 1.05, rate: 1 },
  stranger: { name: 'Невідомий', role: '', pitch: 0.8, rate: 1.1 },
  student: { name: 'Ти', role: '', pitch: 1.2, rate: 1 },
};
