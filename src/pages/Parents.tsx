import { Link } from 'react-router-dom';
import { Icon, type IconName } from '../components/Icon';
import { Portrait } from '../components/Portrait';
import { SUPPORT } from '../data/hotlines';
import { questById } from '../data/quests';
import { worldById } from '../data/worlds';
import './pages.css';

const TOPICS: { title: string; icon: IconName; color: string; ask: string; text: string }[] = [
  {
    title: 'Про булінг',
    icon: 'users',
    color: 'var(--w-people)',
    ask: '«Як минула перерва? З ким ти сидів в їдальні?»',
    text: 'Питайте про конкретне, а не «Тебе ображають?». Якщо дитина розповіла про цькування — подякуйте за довіру й не обіцяйте «нікому не казати»: про булінг треба повідомити класного керівника.',
  },
  {
    title: 'Про шахраїв і гроші',
    icon: 'coin',
    color: 'var(--w-money)',
    ask: '«Що ти зробиш, якщо тобі напишуть з банку?»',
    text: 'Домовтеся про правило: коди з повідомлень і дані картки не повідомляємо нікому, навіть «банку». Розкажіть, що «легкий заробіток» за передачу картки — це злочинна схема.',
  },
  {
    title: 'Про незнайомців у мережі',
    icon: 'chat',
    color: 'var(--w-cyber)',
    ask: '«Тобі колись писав хтось дивний?»',
    text: 'Скажіть дитині, що вона може розповісти вам про будь-яке неприємне повідомлення, і за це їй нічого не буде. Покарання (наприклад, забрати телефон) вчить приховувати.',
  },
  {
    title: 'Про тривоги та укриття',
    icon: 'shield',
    color: 'var(--w-war)',
    ask: '«Куди ти підеш, якщо тривога застане тебе на вулиці?»',
    text: 'Складіть сімейний план: де найближче укриття, де зустрічаєтеся, якщо не можете зв’язатися, хто забирає дитину зі школи. Покладіть дитині картку з номерами рідних.',
  },
];

const TOGETHER = ['povitriana-tryvoha', 'dzvinok-z-banku', 'koly-tryvozhno'];

export function ParentsPage() {
  return (
    <div className="container page">
      <header className="page-hero">
        <div>
          <h1>Батькам</h1>
          <p className="lead">
            Квести найкраще працюють, коли розмова про безпеку продовжується вдома. Ось як говорити з дитиною спокійно, без залякування.
          </p>
        </div>
        <div className="page-hero__art" aria-hidden="true">
          <span className="page-hero__bubble page-hero__bubble--a">Як минув день?</span>
          <Portrait id="mama" size={132} />
          <Portrait id="student" size={104} />
          <span className="page-hero__bubble page-hero__bubble--b">Розкажу!</span>
        </div>
      </header>

      <div className="topic-grid">
        {TOPICS.map((t) => (
          <section key={t.title} className="topic-card reveal" style={{ ['--c' as string]: t.color }}>
            <span className="topic-card__icon">
              <Icon name={t.icon} size={28} />
            </span>
            <h2>{t.title}</h2>
            <p className="topic-card__ask">{t.ask}</p>
            <p>{t.text}</p>
          </section>
        ))}
      </div>

      <section className="band together reveal" aria-labelledby="together">
        <div className="together__text">
          <h2 id="together">Пройдіть квест разом</h2>
          <p>15 хвилин удвох — і привід для розмови. Після проходження запитайте: «Що б ти зробив інакше?»</p>
        </div>
        <ul className="together__list">
          {TOGETHER.map((id) => {
            const q = questById(id)!;
            const w = worldById(q.world);
            return (
              <li key={id}>
                <Link viewTransition to={`/quest/${id}`} className="mini-quest" style={{ ['--c' as string]: w.color }}>
                  <span className="mini-quest__world">{w.title}</span>
                  <strong>{q.title}</strong>
                  <span className="mini-quest__meta">≈ {q.minutes} хв</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="band reveal" aria-labelledby="support">
        <h2 id="support">Куди звернутися</h2>
        <ul className="hotline-grid">
          {SUPPORT.map((h) => (
            <li key={h.number}>
              <a href={`tel:${h.tel}`} className="hotline-tile">
                <Icon name="phoneCall" size={22} />
                <span className="hotline-tile__num">{h.number}</span>
                <span className="hotline-tile__title">{h.title}</span>
                <span className="hotline-tile__note">{h.note}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
