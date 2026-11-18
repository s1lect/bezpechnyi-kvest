import { readJSON, writeJSON } from './storage';

export interface QuestResult {
  score: number;
  total: number;
  completedAt: string;
}

const KEY = 'bk.progress.v1';

export type Progress = Record<string, QuestResult>;

export const loadProgress = (): Progress => readJSON<Progress>(KEY, {});

export function saveResult(questId: string, result: QuestResult): Progress {
  const progress = loadProgress();
  const prev = progress[questId];
  // зберігаємо найкращий результат
  if (!prev || result.score / Math.max(result.total, 1) >= prev.score / Math.max(prev.total, 1)) {
    progress[questId] = result;
  }
  writeJSON(KEY, progress);
  return progress;
}

export function resetProgress(): void {
  writeJSON(KEY, {});
}
