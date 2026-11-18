import { Link } from 'react-router-dom';
import { QUESTS } from '../data/quests';
import './pages.css';

export function AboutPage() {
  return (
    <div className="container page prose">
      <h1>Про проєкт</h1>
      <p className="lead">
        «Безпечний квест» — відкрита вебплатформа, де учні тренують безпечну поведінку в інтерактивних історіях, а вчителі отримують готові
        уроки за програмою НУШ.
      </p>
      <h2>Принципи</h2>
      <ul>
        <li>
          <strong>Діяльнісний підхід.</strong> Учень не читає правила, а ухвалює рішення й бачить наслідки.
        </li>
        <li>
          <strong>Помилка — частина навчання.</strong> Неправильна відповідь пояснюється без покарання, і можна спробувати знову.
        </li>
        <li>
          <strong>Травмочутливість.</strong> Без сирен, вибухів і страшних сцен. Є спокійний режим.
        </li>
        <li>
          <strong>Доступність.</strong> Озвучення, керування з клавіатури, великий текст, контрастні кольори.
        </li>
        <li>
          <strong>Приватність.</strong> Без реєстрації, реклами й трекерів. Прогрес зберігається лише на пристрої.
        </li>
      </ul>
      <h2>Статус</h2>
      <p>
        Це пілотна версія з {QUESTS.length} квестами. Зміст підготовлено на основі відкритих рекомендацій ДСНС, МОЗ, НБУ та модельних програм МОН і
        потребує фахового рецензування перед офіційним використанням у закладах освіти.
      </p>
      <h2>Для розробників і методистів</h2>
      <p>
        Квести описані як дані (TypeScript-об'єкти), тому новий квест можна додати без зміни рушія. Інструкція — у файлі{' '}
        <a href="https://github.com/s1lect/bezpechnyi-kvest/blob/main/docs/CONTENT_GUIDE.md">CONTENT_GUIDE.md</a> у репозиторії.
      </p>
      <div className="hero__actions">
        <Link to="/teacher" className="btn btn--ghost btn--small">
          Кабінет вчителя
        </Link>
        <Link to="/teacher/curriculum" className="btn btn--ghost btn--small">
          Відповідність програмі
        </Link>
      </div>
    </div>
  );
}
