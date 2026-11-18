import { useParams } from 'react-router-dom';
import { questById } from '../data/quests';
import { QuestPlayer } from '../engine/QuestPlayer';
import { NotFound } from './NotFound';

export function QuestPage() {
  const { id = '' } = useParams();
  const quest = questById(id);
  if (!quest) return <NotFound />;
  // key скидає стан, коли переходимо до наступного квесту
  return <QuestPlayer key={quest.id} quest={quest} />;
}
