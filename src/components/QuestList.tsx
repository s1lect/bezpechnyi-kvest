import { Link } from 'react-router-dom';
import { worldById } from '../data/worlds';
import { loadProgress } from '../lib/progress';
import type { Quest } from '../types';
import './QuestList.css';

export function QuestList({ quests, showWorld = true }: { quests: Quest[]; showWorld?: boolean }) {
  const progress = loadProgress();
  return (
    <ul className="qlist">
      {quests.map((q) => {
        const w = worldById(q.world);
        const r = progress[q.id];
        return (
          <li key={q.id} className="qrow reveal" style={{ ['--c' as string]: w.color }}>
            <div className="qrow__main">
              {showWorld && <span className="qrow__world">{w.title}</span>}
              <h3 style={{ viewTransitionName: `quest-title-${q.id}` }}>
                <Link viewTransition to={`/quest/${q.id}`}>
                  {q.title}
                </Link>
              </h3>
              <p>{q.tagline}</p>
            </div>
            <div className="qrow__meta">
              <span className="tag">{q.grades} кл.</span>
              <span className="tag">≈ {q.minutes} хв</span>
              {r && (
                <span className="tag qrow__done">
                  Пройдено: {r.score}/{r.total}
                </span>
              )}
            </div>
            <Link viewTransition to={`/quest/${q.id}`} className="btn btn--ghost btn--small qrow__go" aria-hidden="true" tabIndex={-1}>
              {r ? 'Ще раз' : 'Грати'}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
