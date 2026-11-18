import { Link, useParams } from 'react-router-dom';
import { Portrait } from '../components/Portrait';
import { QuestList } from '../components/QuestList';
import { questsByWorld } from '../data/quests';
import { SPEAKERS, WORLDS } from '../data/worlds';
import { NotFound } from './NotFound';
import './pages.css';

export function WorldPage() {
  const { id } = useParams();
  const world = WORLDS.find((w) => w.id === id);
  if (!world) return <NotFound />;
  const quests = questsByWorld(world.id);
  const guide = SPEAKERS[world.guide];

  return (
    <div className="container page">
      <Link to="/" className="back">
        До карти міста
      </Link>
      <header className="world-head" style={{ ['--c' as string]: world.color }}>
        <Portrait id={world.guide} size={96} />
        <div>
          <span className="world-head__short">{world.short}</span>
          <h1>{world.title}</h1>
          <p className="lead">{world.description}</p>
          <p className="world-head__guide">
            Провідник: {guide.name}, {guide.role}
          </p>
        </div>
      </header>
      {quests.length ? (
        <QuestList quests={quests} showWorld={false} />
      ) : (
        <p className="empty">Квести для цього району зараз готуються. Тим часом загляньте в інші райони міста.</p>
      )}
      <nav className="world-nav" aria-label="Інші райони">
        {WORLDS.filter((w) => w.id !== world.id).map((w) => (
          <Link key={w.id} to={`/world/${w.id}`} className="world-chip" style={{ ['--c' as string]: w.color }}>
            {w.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
