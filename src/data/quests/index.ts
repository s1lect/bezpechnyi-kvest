import type { Quest, WorldId } from '../../types';
import { airRaid } from './air-raid';
import { bullying } from './bullying';
import { cpr } from './cpr';
import { fire } from './fire';
import { mines } from './mines';
import { phishing } from './phishing';
import { scamCall } from './scam-call';

export const QUESTS: Quest[] = [fire, airRaid, mines, phishing, scamCall, bullying, cpr];

export const questById = (id: string): Quest | undefined => QUESTS.find((q) => q.id === id);

export const questsByWorld = (world: WorldId): Quest[] => QUESTS.filter((q) => q.world === world);
