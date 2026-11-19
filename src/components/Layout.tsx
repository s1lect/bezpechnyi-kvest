import { Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { HelpButton } from './HelpButton';
import { Loading } from './Loading';
import { NavPill } from './NavPill';
import { Splash } from './Splash';
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
      <Splash />
      <a className="skip" href="#main">
        Перейти до змісту
      </a>
      <header className="topbar no-print">
        <div className="container topbar__inner">
          <Link viewTransition to="/" className="brand">
            <Logo />
            <span className="brand__name">Безпечний квест</span>
          </Link>
          <NavPill label="Головна навігація" watch={pathname}>
            <NavLink to="/" end viewTransition>
              Карта
            </NavLink>
            <NavLink to="/teacher" viewTransition>
              Вчителю
            </NavLink>
            <NavLink to="/parents" viewTransition>
              Батькам
            </NavLink>
            <NavLink to="/progress" viewTransition>
              <span className="label-long">Мої досягнення</span>
              <span className="label-short">Досягнення</span>
            </NavLink>
          </NavPill>
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
            <div className="footer__brand">
              <Link viewTransition to="/" className="brand">
                <Logo />
                <span className="brand__name">Безпечний квест</span>
              </Link>
              <p>
                Відкритий освітній проєкт для закладів загальної середньої освіти. Зміст узгоджено з модельними програмами НУШ і потребує
                фахового рецензування перед офіційним використанням.
              </p>
              <p className="footer__sos">
                Екстрені служби: <a href="tel:112">112</a>. Дитяча лінія: <a href="tel:116111">116 111</a>.
              </p>
            </div>
            <nav className="footer__col" aria-label="Учням">
              <h2>Учням</h2>
              <Link viewTransition to="/">
                Карта квестів
              </Link>
              <Link viewTransition to="/progress">
                Мої досягнення
              </Link>
            </nav>
            <nav className="footer__col" aria-label="Дорослим">
              <h2>Дорослим</h2>
              <Link viewTransition to="/teacher">
                Кабінет вчителя
              </Link>
              <Link viewTransition to="/teacher/curriculum">
                Відповідність програмі НУШ
              </Link>
              <Link viewTransition to="/parents">
                Батькам
              </Link>
            </nav>
            <nav className="footer__col" aria-label="Проєкт">
              <h2>Проєкт</h2>
              <Link viewTransition to="/about">
                Про проєкт
              </Link>
              <a href="https://github.com/s1lect/bezpechnyi-kvest">Код на GitHub</a>
              <a href="https://github.com/s1lect/bezpechnyi-kvest/blob/main/docs/CONTENT_GUIDE.md">Як додати квест</a>
            </nav>
          </div>
          <div className="container footer__bottom">
            <span>Код — MIT, навчальний зміст — CC BY 4.0</span>
            <span>Тренуємо безпеку, поки все спокійно</span>
          </div>
        </footer>
      )}

      <HelpButton />
    </div>
  );
}
