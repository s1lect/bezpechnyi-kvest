import { lazy } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SettingsProvider } from './lib/settings';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';

// Головна завантажується одразу, решта — за потреби.
const WorldPage = lazy(() => import('./pages/WorldPage').then((m) => ({ default: m.WorldPage })));
const QuestPage = lazy(() => import('./pages/QuestPage').then((m) => ({ default: m.QuestPage })));
const TeacherPage = lazy(() => import('./pages/Teacher').then((m) => ({ default: m.TeacherPage })));
const LessonPage = lazy(() => import('./pages/Teacher').then((m) => ({ default: m.LessonPage })));
const CurriculumPage = lazy(() => import('./pages/Teacher').then((m) => ({ default: m.CurriculumPage })));
const ParentsPage = lazy(() => import('./pages/Parents').then((m) => ({ default: m.ParentsPage })));
const ProgressPage = lazy(() => import('./pages/Progress').then((m) => ({ default: m.ProgressPage })));
const AboutPage = lazy(() => import('./pages/About').then((m) => ({ default: m.AboutPage })));

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
