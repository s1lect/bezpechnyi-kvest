import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="container page">
      <h1>Такої сторінки немає</h1>
      <p className="lead">Можливо, посилання застаріло. Поверніться на карту міста й оберіть квест.</p>
      <Link viewTransition to="/" className="btn btn--signal">
        До карти
      </Link>
    </div>
  );
}
