import type { Quest, WorldId } from '../../types';
import { airRaid } from './air-raid';
import { anxiety } from './anxiety';
import { boundaries } from './boundaries';
import { bullying } from './bullying';
import { cpr } from './cpr';
import { fakes } from './fakes';
import { fire } from './fire';
import { marketplace } from './marketplace';
import { mines } from './mines';
import { phishing } from './phishing';
import { recruitment } from './recruitment';
import { road } from './road';
import { scamCall } from './scam-call';

/** Порядок задає послідовність «Далі» після квесту: райони йдуть так само, як на карті. */
export const QUESTS: Quest[] = [
  fire,
  road,
  bullying,
  boundaries,
  phishing,
  fakes,
  airRaid,
  mines,
  recruitment,
  scamCall,
  marketplace,
  cpr,
  anxiety,
];

export const questById = (id: string): Quest | undefined => QUESTS.find((q) => q.id === id);

export const questsByWorld = (world: WorldId): Quest[] => QUESTS.filter((q) => q.world === world);
