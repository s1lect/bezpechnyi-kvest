export interface TextPart {
  text: string;
  /** Якщо задано — ця частина є «підозрілим фрагментом», на який треба натиснути. */
  flag?: string;
}

/** Розбиває текст повідомлення на звичайні частини та підозрілі фрагменти (за першим входженням кожного). */
export function splitByFlags(text: string, flags: readonly string[]): TextPart[] {
  const parts: TextPart[] = [];
  let rest = text;
  const pending = flags.filter(Boolean);
  while (rest.length) {
    let first = -1;
    let flag = '';
    for (const f of pending) {
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
    pending.splice(pending.indexOf(flag), 1);
    rest = rest.slice(first + flag.length);
  }
  return parts;
}
