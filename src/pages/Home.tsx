import { Link } from 'react-router-dom';
import { CityMap } from '../components/CityMap';
import { KineticTitle } from '../components/KineticTitle';
import { PromoVideo } from '../components/PromoVideo';
import { QuestList } from '../components/QuestList';
import { Tilt } from '../components/Tilt';
import { QUESTS } from '../data/quests';
import { WORLDS } from '../data/worlds';
import './pages.css';

export function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero__text">
          <KineticTitle text="Тренуємо безпеку, поки все спокійно" />
          <p className="lead enter" style={{ ['--delay' as string]: '0.45s' }}>
            Інтерактивні квести з безпеки життєдіяльності, кібер- і фінансової безпеки, протидії булінгу та першої допомоги. Для уроків
            «Здоров'я, безпека та добробут» за програмою НУШ.
          </p>
          <div className="hero__actions enter" style={{ ['--delay' as string]: '0.6s' }}>
            <Link viewTransition to="/quest/povitriana-tryvoha" className="btn btn--signal">
              Пройти перший квест
            </Link>
            <Link viewTransition to="/teacher" className="btn btn--ghost">
              Я вчитель
            </Link>
          </div>
          <dl className="hero__facts enter" style={{ ['--delay' as string]: '0.75s' }}>
            <div>
              <dt>квестів</dt>
              <dd>{QUESTS.length}</dd>
            </div>
            <div>
              <dt>районів-тем</dt>
              <dd>{WORLDS.length}</dd>
            </div>
            <div>
              <dt>хвилин на урок</dt>
              <dd>45</dd>
            </div>
          </dl>
        </div>
        <div className="hero__map">
          <Tilt>
            <CityMap />
          </Tilt>
          <p className="hero__caption enter" style={{ ['--delay' as string]: '0.9s' }}>
            Оберіть район міста, щоб побачити його квести.
          </p>
        </div>
      </section>

      <section className="container band reveal" aria-labelledby="how">
        <h2 id="how">Як це працює на уроці</h2>
        <ol className="steps3">
          <li>
            <h3>Оберіть квест</h3>
            <p>Кожен квест прив'язаний до очікуваних результатів навчання і має готовий конспект уроку на 45 хвилин.</p>
          </li>
          <li>
            <h3>Пройдіть разом із класом</h3>
            <p>Класний режим на проєкторі: учні голосують руками, вчитель відмічає голоси. Або кожен грає на телефоні за QR-кодом.</p>
          </li>
          <li>
            <h3>Обговоріть і закріпіть</h3>
            <p>Питання для обговорення, робота в групах і домашнє завдання для всієї родини вже в конспекті.</p>
          </li>
        </ol>
      </section>

      <PromoVideo />

      <section className="container band" aria-labelledby="all">
        <div className="band__head reveal">
          <h2 id="all">Усі квести</h2>
          <p>Озвучення українською, спокійний режим для дітей з травматичним досвідом, робота без реєстрації й без інтернету.</p>
        </div>
        <QuestList quests={QUESTS} />
      </section>
    </>
  );
}
