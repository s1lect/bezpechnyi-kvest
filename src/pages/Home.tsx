import { Link } from 'react-router-dom';
import { CityMap } from '../components/CityMap';
import { QuestList } from '../components/QuestList';
import { QUESTS } from '../data/quests';
import './pages.css';

export function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero__text">
          <h1>Тренуємо безпеку, поки все спокійно</h1>
          <p className="lead">
            Інтерактивні квести з безпеки життєдіяльності, кібер- і фінансової безпеки, протидії булінгу та першої допомоги. Для уроків
            «Здоров'я, безпека та добробут» за програмою НУШ.
          </p>
          <div className="hero__actions">
            <Link to={`/quest/${QUESTS[1].id}`} className="btn btn--signal">
              Пройти перший квест
            </Link>
            <Link to="/teacher" className="btn btn--ghost">
              Я вчитель
            </Link>
          </div>
        </div>
        <div className="hero__map">
          <CityMap />
          <p className="hero__caption">Оберіть район міста, щоб побачити його квести.</p>
        </div>
      </section>

      <section className="container band" aria-labelledby="how">
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

      <section className="container band" aria-labelledby="all">
        <div className="band__head">
          <h2 id="all">Усі квести</h2>
          <p>
            {QUESTS.length} квестів у пілотній версії. Озвучення українською, спокійний режим для дітей з травматичним досвідом, робота без
            реєстрації.
          </p>
        </div>
        <QuestList quests={QUESTS} />
      </section>
    </>
  );
}
