import { useState } from 'react';
import { estimatePassword } from '../../lib/password';
import type { PasswordStep as Step } from '../../types';
import type { Done } from '../types';
import { Feedback, Frame, NextButton } from '../ui';

const LEVELS = ['Ненадійний', 'Слабкий', 'Добрий', 'Дуже надійний'];

export function PasswordStep({ step, onDone }: { step: Step; onDone: Done }) {
  const [pw, setPw] = useState('');
  const est = estimatePassword(pw);

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
            autoCapitalize="off"
            spellCheck={false}
            placeholder="наприклад, зелений-кіт-їсть-кавун"
          />
          <div className="forge__bar" data-level={pw ? est.level : -1} aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} />
            ))}
          </div>
          <p className="forge__result" aria-live="polite">
            {pw ? (
              <>
                <strong>{LEVELS[est.level]}.</strong> Комп&apos;ютеру знадобляться: <strong>{est.label}</strong>
              </>
            ) : (
              'Почни вводити, і ти побачиш, як швидко пароль можна підібрати.'
            )}
          </p>
          <p className="forge__note">Нічого не зберігається й не надсилається. Але справжній пароль сюди однаково не вводь.</p>
        </div>
      }
    >
      {pw && est.tips.length > 0 && (
        <ul className="tips">
          {est.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
      {pw && est.level >= 2 && (
        <Feedback ok text="Такий пароль витримає атаку перебором. А двофакторна автентифікація додасть ще один замок." />
      )}
      <NextButton onClick={() => onDone(null)} label={pw ? 'Далі' : 'Пропустити'} />
    </Frame>
  );
}
