import { Fragment } from 'react';

/**
 * Заголовок, слова якого по черзі виринають з-під лінії.
 * Екранні читачі отримують цілий текст через aria-label.
 */
export function KineticTitle({
  text,
  as: Tag = 'h1',
  className,
  delay = 0,
}: {
  text: string;
  as?: 'h1' | 'h2';
  className?: string;
  delay?: number;
}) {
  const words = text.split(' ');
  return (
    <Tag className={['kinetic', className].filter(Boolean).join(' ')} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="kinetic__mask" aria-hidden="true">
            <span className="kinetic__word" style={{ animationDelay: `${delay + i * 0.08}s` }}>
              {w}
            </span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  );
}
