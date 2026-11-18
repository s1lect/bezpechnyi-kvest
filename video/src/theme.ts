import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

export const C = {
  paper: '#f3f7ff',
  paper2: '#e6eefc',
  ink: '#172b4d',
  inkSoft: '#4a5d7e',
  signal: '#ffc531',
  rescue: '#2b5be8',
  ok: '#1fa97a',
  okSoft: '#d6f5ea',
  alarm: '#e14b57',
  alarmSoft: '#fde3e5',
  home: '#ff8a3d',
  war: '#5b6cff',
  cyber: '#12a4c9',
  money: '#20a36b',
  people: '#d9488f',
  health: '#e5484d',
};

export const DISPLAY = 'Unbounded';
export const BODY = 'Onest';

/** Фірмові шрифти сайту: Unbounded (заголовки) і Onest (текст). */
export const fontsReady = Promise.all([
  loadFont({ family: DISPLAY, url: staticFile('fonts/unbounded-cyrillic-700-normal.woff2'), weight: '700' }),
  loadFont({ family: DISPLAY, url: staticFile('fonts/unbounded-cyrillic-800-normal.woff2'), weight: '800' }),
  loadFont({ family: DISPLAY, url: staticFile('fonts/unbounded-latin-700-normal.woff2'), weight: '700' }),
  loadFont({ family: DISPLAY, url: staticFile('fonts/unbounded-latin-800-normal.woff2'), weight: '800' }),
  loadFont({ family: BODY, url: staticFile('fonts/onest-cyrillic-wght-normal.woff2'), weight: '100 900' }),
  loadFont({ family: BODY, url: staticFile('fonts/onest-latin-wght-normal.woff2'), weight: '100 900' }),
]);
