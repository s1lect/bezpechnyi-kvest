import { Link } from 'react-router-dom';
import { Icon, type IconName } from '../components/Icon';
import { PromoVideo } from '../components/PromoVideo';
import { QUESTS } from '../data/quests';
import { WORLDS } from '../data/worlds';
import './pages.css';

const PRINCIPLES: { title: string; text: string; icon: IconName; color: string }[] = [
  {
    title: 'Діяльнісний підхід',
    text: 'Учень не читає правила, а ухвалює рішення й бачить наслідки.',
    icon: 'route',
    color: 'var(--rescue)',
  },
  {
    title: 'Помилка — частина навчання',
    text: 'Неправильна відповідь пояснюється без покарання, і можна спробувати знову.',
    icon: 'sparkle',
    color: 'var(--signal-deep)',
  },
  {
    title: 'Травмочутливість',
    text: 'Без сирен, вибухів і страшних сцен. Є спокійний режим без анімацій.',
    icon: 'heart',
    color: 'var(--w-people)',
  },
  {
    title: 'Доступність',
    text: 'Озвучення, керування з клавіатури, великий текст, контрастні кольори.',
    icon: 'eye',
    color: 'var(--w-cyber)',
  },
  {
    title: 'Приватність',
    text: 'Без реєстрації, реклами й трекерів. Прогрес зберігається лише на пристрої.',
    icon: 'lock',
    color: 'var(--w-money)',
  },
  {
    title: 'Відкритість',
    text: 'Відкритий код (MIT) і відкритий зміст (CC BY 4.0). Школи можуть адаптувати матеріали.',
    icon: 'code',
    color: 'var(--w-war)',
  },
];

export function AboutPage() {
  const steps = QUESTS.reduce((n, q) => n + q.steps.length, 0);
  return (
    <div className="container page">
      <header className="about-hero">
        <h1>Про проєкт</h1>
        <p className="lead">
          «Безпечний квест» — відкрита вебплатформа, де учні тренують безпечну поведінку в інтерактивних історіях, а вчителі отримують
          готові уроки за програмою НУШ.
        </p>
        <dl className="stat-row">
          <div>
            <dt>квестів</dt>
            <dd>{QUESTS.length}</dd>
          </div>
          <div>
            <dt>районів-тем</dt>
            <dd>{WORLDS.length}</dd>
          </div>
          <div>
            <dt>кроків і завдань</dt>
            <dd>{steps}</dd>
          </div>
          <div>
            <dt>зібраних персональних даних</dt>
            <dd>0</dd>
          </div>
        </dl>
      </header>

      <section className="band" aria-labelledby="principles">
        <h2 id="principles">Принципи</h2>
        <ul className="principle-grid">
          {PRINCIPLES.map((p) => (
            <li key={p.title} className="principle reveal" style={{ ['--c' as string]: p.color }}>
              <span className="principle__icon">
                <Icon name={p.icon} size={26} />
              </span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <PromoVideo />

      <section className="band about-split reveal" aria-label="Статус і участь">
        <div className="callout">
          <Icon name="alert" size={28} />
          <div>
            <h2>Статус: пілотна версія</h2>
            <p>
              Зміст підготовлено на основі відкритих рекомендацій ДСНС, МОЗ, НБУ та модельних програм МОН. Перед офіційним використанням у
              закладах освіти кожен квест має пройти фахове рецензування — рецензент указаний у конспекті уроку.
            </p>
          </div>
        </div>
        <div className="callout callout--plain">
          <Icon name="code" size={28} />
          <div>
            <h2>Для розробників і методистів</h2>
            <p>
              Квести описані як дані, тож новий квест можна додати без зміни рушія. Інструкція —{' '}
              <a href="https://github.com/s1lect/bezpechnyi-kvest/blob/main/docs/CONTENT_GUIDE.md">CONTENT_GUIDE.md</a>.
            </p>
            <div className="hero__actions">
              <Link viewTransition to="/teacher" className="btn btn--ghost btn--small">
                Кабінет вчителя
              </Link>
              <a href="https://github.com/s1lect/bezpechnyi-kvest" className="btn btn--ghost btn--small">
                Код на GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
