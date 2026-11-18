import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SettingsProvider } from './lib/settings';
import { AboutPage } from './pages/About';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { ParentsPage } from './pages/Parents';
import { ProgressPage } from './pages/Progress';
import { QuestPage } from './pages/QuestPage';
import { CurriculumPage, LessonPage, TeacherPage } from './pages/Teacher';
import { WorldPage } from './pages/WorldPage';

/** HashRouter: сайт працює на будь-якому статичному хостингу (GitHub Pages, шкільний сервер, флешка). */
export default function App() {
  return (
    <SettingsProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="world/:id" element={<WorldPage />} />
            <Route path="quest/:id" element={<QuestPage />} />
            <Route path="teacher" element={<TeacherPage />} />
            <Route path="teacher/lesson/:id" element={<LessonPage />} />
            <Route path="teacher/curriculum" element={<CurriculumPage />} />
            <Route path="parents" element={<ParentsPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </SettingsProvider>
  );
}
