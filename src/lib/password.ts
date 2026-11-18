const COMMON = [
  'password',
  'qwerty',
  'йцукен',
  '1234',
  '12345',
  '123456',
  '1111',
  '0000',
  'admin',
  'ukraine',
  'україна',
  'пароль',
  'love',
  'iloveyou',
  'abc',
  'football',
  'minecraft',
];

export type Strength = 0 | 1 | 2 | 3;

export interface CrackEstimate {
  /** Оцінка ентропії в бітах. */
  bits: number;
  seconds: number;
  label: string;
  level: Strength;
  tips: string[];
}

/** Швидкість офлайн-перебору, яку закладаємо в оцінку: 10 млрд спроб за секунду. */
const GUESSES_PER_SECOND = 1e10;

const UNITS: [number, string][] = [
  [3.15e7 * 1e5, 'тисячі століть'],
  [3.15e9, 'століття'],
  [3.15e7, 'роки'],
  [2.6e6, 'місяці'],
  [86400, 'дні'],
  [3600, 'години'],
  [60, 'хвилини'],
  [1, 'секунди'],
];

/**
 * Навчальна (спрощена) оцінка надійності пароля.
 * Не замінює повноцінні бібліотеки на кшталт zxcvbn, але чесно карає короткі паролі,
 * популярні слова й повтори — саме те, що треба показати учням.
 */
export function estimatePassword(pw: string): CrackEstimate {
  if (!pw) return { bits: 0, seconds: 0, label: '', level: 0, tips: [] };

  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[а-яіїєґ']/.test(pw)) pool += 33;
  if (/[А-ЯІЇЄҐ]/.test(pw)) pool += 33;
  if (/\d/.test(pw)) pool += 10;
  if (/[^\wа-яіїєґА-ЯІЇЄҐ']/.test(pw)) pool += 30;

  const chars = [...pw];
  let bits = chars.length * Math.log2(Math.max(pool, 2));
  const lower = pw.toLowerCase();
  const hasCommon = COMMON.some((c) => lower.includes(c));
  if (hasCommon) bits = Math.min(bits, 20);
  if (/(.)\1{2,}/u.test(pw)) bits -= 10;
  bits = Math.max(bits, 0);

  const seconds = 2 ** bits / GUESSES_PER_SECOND;
  const label = UNITS.find(([s]) => seconds >= s)?.[1] ?? 'миттєво';
  const level: Strength = seconds < 3600 ? 0 : seconds < 3.15e7 ? 1 : seconds < 3.15e9 ? 2 : 3;

  const tips: string[] = [];
  if (chars.length < 12) tips.push('Зроби пароль довшим: від 12 символів.');
  if (!/[\s-]/.test(pw) && chars.length < 16) tips.push('Спробуй фразу з кількох слів: «зелений-кіт-їсть-кавун».');
  if (hasCommon) tips.push('Прибери популярні слова й послідовності на кшталт 1234 чи qwerty.');

  return { bits, seconds, label, level, tips };
}
