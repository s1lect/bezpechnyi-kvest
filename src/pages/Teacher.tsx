import { Link, useParams } from 'react-router-dom';
import { QUESTS, questById } from '../data/quests';
import { worldById } from '../data/worlds';
import { NotFound } from './NotFound';
import './pages.css';

export function TeacherPage() {
  return (
    <div className="container page">
      <h1>Кабінет вчителя</h1>
      <p className="lead">
        Квести можна проводити на проєкторі для всього класу або давати учням на телефони. Реєстрація не потрібна, персональні дані дітей не
        збираються.
      </p>

      <div className="teacher-grid">
        <section className="panel">
          <h2>Класний режим</h2>
          <p>Відкрийте квест і натисніть «Класний режим». Текст стане більшим, а біля кожного варіанта з'являться лічильники голосів.</p>
          <ol>
            <li>Прочитайте ситуацію вголос або ввімкніть озвучення.</li>
            <li>Учні голосують руками, ви відмічаєте голоси кнопками «+».</li>
            <li>Обговоріть варіанти й натисніть «Відкрити відповідь».</li>
          </ol>
        </section>
        <section className="panel">
          <h2>Травмочутливий підхід</h2>
          <ul>
            <li>Не просіть дітей розповідати про власний досвід обстрілів чи втрат.</li>
            <li>Попередьте клас про тему заздалегідь і дайте можливість вийти.</li>
            <li>Увімкніть «Спокійний режим» у налаштуваннях, якщо в класі є діти з травматичним досвідом.</li>
            <li>Завершуйте урок вправою на заспокоєння й нагадуванням, де шукати підтримку.</li>
          </ul>
        </section>
      </div>

      <section className="band">
        <div className="band__head">
          <h2>Конспекти уроків</h2>
          <p>
            Кожен конспект розрахований на 45 хвилин і містить мету, етапи уроку, питання для обговорення та домашнє завдання. Повна таблиця
            відповідності — на сторінці <Link to="/teacher/curriculum">«Відповідність програмі НУШ»</Link>.
          </p>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Квест</th>
              <th scope="col">Класи</th>
              <th scope="col">Змістова лінія</th>
              <th scope="col">
                <span className="sr-only">Дії</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {QUESTS.map((q) => (
              <tr key={q.id}>
                <th scope="row">
                  <span className="dot" style={{ background: worldById(q.world).color }} />
                  {q.title}
                </th>
                <td>{q.grades}</td>
                <td>{q.curriculum}</td>
                <td className="table__actions">
                  <Link to={`/teacher/lesson/${q.id}`}>Конспект</Link>
                  <Link to={`/quest/${q.id}?mode=class`}>Провести</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export function LessonPage() {
  const { id = '' } = useParams();
  const q = questById(id);
  if (!q) return <NotFound />;
  const w = worldById(q.world);
  const totalMin = q.lesson.stages.reduce((s, x) => s + x.minutes, 0);

  return (
    <article className="container page lesson">
      <div className="no-print lesson__tools">
        <Link to="/teacher" className="back">
          Кабінет вчителя
        </Link>
        <div className="hero__actions">
          <button className="btn btn--ghost btn--small" onClick={() => window.print()}>
            Роздрукувати
          </button>
          <Link to={`/quest/${q.id}?mode=class`} className="btn btn--signal btn--small">
            Провести в класі
          </Link>
        </div>
      </div>
      <header>
        <p className="lesson__world" style={{ color: w.color }}>
          {w.title}
        </p>
        <h1>Урок: {q.title}</h1>
        <dl className="lesson__facts">
          <div>
            <dt>Класи</dt>
            <dd>{q.grades}</dd>
          </div>
          <div>
            <dt>Тривалість</dt>
            <dd>{totalMin} хв</dd>
          </div>
          <div>
            <dt>Предмет / змістова лінія</dt>
            <dd>{q.curriculum}</dd>
          </div>
        </dl>
      </header>

      <h2>Мета</h2>
      <p>{q.lesson.goal}</p>

      <h2>Очікувані результати</h2>
      <ul>
        {q.outcomes.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>

      <h2>Хід уроку</h2>
      <ol className="timeline">
        {q.lesson.stages.map((s) => (
          <li key={s.title}>
            <span className="timeline__min">{s.minutes} хв</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2>Питання для обговорення</h2>
      <ul>
        {q.lesson.discussion.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>

      <h2>Домашнє завдання</h2>
      <p>{q.lesson.homework}</p>

      <aside className="note">
        <strong>Рецензування змісту.</strong> Перед офіційним використанням зміст квесту має перевірити: {q.reviewBy}.
      </aside>
    </article>
  );
}

export function CurriculumPage() {
  return (
    <div className="container page">
      <Link to="/teacher" className="back">
        Кабінет вчителя
      </Link>
      <h1>Відповідність програмі НУШ</h1>
      <p className="lead">
        Квести підтримують соціальну і здоров'язбережувальну освітню галузь, насамперед інтегрований курс «Здоров'я, безпека та добробут»
        (модельні навчальні програми для 5–9 класів), а також предмет «Підприємництво і фінансова грамотність».
      </p>
      <p>
        Формулювання результатів нижче — робочі. Методист має звірити їх із кодами очікуваних результатів Державного стандарту базової
        середньої освіти та модельною програмою, за якою працює заклад.
      </p>
      <table className="table table--top">
        <thead>
          <tr>
            <th scope="col">Квест</th>
            <th scope="col">Предмет / змістова лінія</th>
            <th scope="col">Очікувані результати</th>
            <th scope="col">Рецензент</th>
          </tr>
        </thead>
        <tbody>
          {QUESTS.map((q) => (
            <tr key={q.id}>
              <th scope="row">
                <Link to={`/teacher/lesson/${q.id}`}>{q.title}</Link>
                <small>{q.grades} кл.</small>
              </th>
              <td>{q.curriculum}</td>
              <td>
                <ul>
                  {q.outcomes.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </td>
              <td>{q.reviewBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
