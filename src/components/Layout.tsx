import { Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { HelpButton } from './HelpButton';
import { Loading } from './Loading';
import { SettingsPanel } from './SettingsPanel';
import './Layout.css';

function Logo() {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M24 3l17 6v13c0 11-7.5 19-17 23C14.5 41 7 33 7 22V9z"
        fill="#ffc531"
        stroke="#172b4d"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M17 24l5 5 10-11" stroke="#172b4d" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Layout() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { pathname } = useLocation();
  const immersive = pathname.startsWith('/quest/');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={immersive ? 'shell shell--immersive' : 'shell'}>
      <a className="skip" href="#main">
        Перейти до змісту
      </a>
      <header className="topbar no-print">
        <div className="container topbar__inner">
          <Link to="/" className="brand">
            <Logo />
            <span className="brand__name">Безпечний квест</span>
          </Link>
          <nav className="topnav" aria-label="Головна навігація">
            <NavLink to="/" end>
              Карта
            </NavLink>
            <NavLink to="/teacher">Вчителю</NavLink>
            <NavLink to="/parents">Батькам</NavLink>
            <NavLink to="/progress">Мої досягнення</NavLink>
          </nav>
          <button
            className="icon-btn"
            aria-expanded={settingsOpen}
            aria-controls="settings-panel"
            onClick={() => setSettingsOpen((v) => !v)}
            title="Звук, голос і доступність"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h10M18 7h2M4 17h4M12 17h8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="16" cy="7" r="2.6" fill="none" stroke="currentColor" strokeWidth="2.2" />
              <circle cx="10" cy="17" r="2.6" fill="none" stroke="currentColor" strokeWidth="2.2" />
            </svg>
            <span className="sr-only">Налаштування</span>
          </button>
        </div>
        {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
      </header>

      <main id="main">
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      {!immersive && (
        <footer className="footer no-print">
          <div className="container footer__inner">
            <p>
              Безпечний квест — відкритий освітній проєкт для закладів загальної середньої освіти. Зміст узгоджено з модельними програмами
              НУШ і потребує фахового рецензування перед офіційним використанням.
            </p>
            <nav aria-label="Додатково">
              <Link to="/teacher/curriculum">Відповідність програмі НУШ</Link>
              <Link to="/about">Про проєкт</Link>
              <a href="https://github.com/s1lect/bezpechnyi-kvest" rel="noreferrer">
                Код на GitHub
              </a>
            </nav>
          </div>
        </footer>
      )}

      <HelpButton />
    </div>
  );
}
