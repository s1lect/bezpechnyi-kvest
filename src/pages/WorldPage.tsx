import { Link, useParams } from 'react-router-dom';
import { Portrait } from '../components/Portrait';
import { Scene } from '../components/Scene';
import { QuestList } from '../components/QuestList';
import { questsByWorld } from '../data/quests';
import { SPEAKERS, WORLDS } from '../data/worlds';
import type { SceneId, WorldId } from '../types';
import { NotFound } from './NotFound';
import './pages.css';

/** Сцена-банер, характерна для району. */
const BANNER: Record<WorldId, SceneId> = {
  home: 'crossing',
  war: 'shelter',
  cyber: 'phone',
  money: 'street',
  people: 'classroom',
  health: 'park',
};

export function WorldPage() {
  const { id } = useParams();
  const world = WORLDS.find((w) => w.id === id);
  if (!world) return <NotFound />;
  const quests = questsByWorld(world.id);
  const guide = SPEAKERS[world.guide];

  return (
    <div className="container page">
      <Link viewTransition to="/" className="back">
        До карти міста
      </Link>
      <header className="world-head" style={{ ['--c' as string]: world.color }}>
        <div className="world-head__text">
          <span className="world-head__short">{world.short}</span>
          <h1>{world.title}</h1>
          <p className="lead">{world.description}</p>
          <p className="world-head__guide">
            <Portrait id={world.guide} size={48} />
            <span>
              Провідник: <strong>{guide.name}</strong>, {guide.role}
            </span>
          </p>
        </div>
        <div className="world-head__banner" aria-hidden="true">
          <Scene id={BANNER[world.id]} className="world-head__scene" />
          <div className="world-head__badge">
            <strong>{quests.length}</strong>
            <span>{quests.length === 1 ? 'квест' : quests.length < 5 ? 'квести' : 'квестів'}</span>
          </div>
        </div>
      </header>
      <h2 className="sr-only">Квести району</h2>
      {quests.length ? (
        <QuestList quests={quests} showWorld={false} />
      ) : (
        <p className="empty">Квести для цього району зараз готуються. Тим часом загляньте в інші райони міста.</p>
      )}
      <nav className="world-nav" aria-label="Інші райони">
        {WORLDS.filter((w) => w.id !== world.id).map((w) => (
          <Link viewTransition key={w.id} to={`/world/${w.id}`} className="world-chip" style={{ ['--c' as string]: w.color }}>
            {w.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
