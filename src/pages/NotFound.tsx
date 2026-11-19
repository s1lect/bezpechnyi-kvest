import { Link } from 'react-router-dom';
import { Portrait } from '../components/Portrait';
import { WORLDS } from '../data/worlds';
import './pages.css';

export function NotFound() {
  return (
    <div className="container page notfound">
      <div className="notfound__art" aria-hidden="true">
        <span className="notfound__code">404</span>
        <div className="notfound__kit">
          <Portrait id="kit" size={150} />
        </div>
      </div>
      <div>
        <h1>Схоже, ми заблукали</h1>
        <p className="lead">Такої сторінки немає. Можливо, посилання застаріло. Кібер-Кіт допоможе повернутися до міста.</p>
        <div className="hero__actions">
          <Link viewTransition to="/" className="btn btn--signal">
            До карти міста
          </Link>
        </div>
        <nav className="world-nav" aria-label="Райони міста">
          {WORLDS.map((w) => (
            <Link viewTransition key={w.id} to={`/world/${w.id}`} className="world-chip" style={{ ['--c' as string]: w.color }}>
              {w.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
