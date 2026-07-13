// src/content/_registry.ts
import type { GameEvent, Ending } from '../engine/types';
import { dreamGaokao } from './college/dream-gaokao';
import { emigrationDream } from './college/emigration-dream';
import { overworkCritical } from './chains/overwork-death';
import { rebornAsGaokaoEnding } from './endings/reborn-as-gaokao';
import { underworldHrEnding } from './endings/underworld-hr';
import { secretReading } from './school/secret-reading';
import { slackerWriting } from './chains/slacker-author';
import { internetViral } from './chains/internet-star';
import { emigrationAbroad } from './chains/emigration-abroad';
import { slackerAuthorEnding } from './endings/slacker-author';
import { internetStarEnding } from './endings/internet-star';
import { globalExecutiveEnding } from './endings/global-executive';
import { homesickReturneeEnding } from './endings/homesick-returnee';
import { cyberbullyVictimEnding } from './endings/cyberbully-victim';
import { internetDream } from './school/internet-dream';
import { childhoodEvents } from './childhood/_index';
import { schoolEvents } from './school/_index';
import { collegeEvents } from './college/_index';
import { careerEvents } from './career/_index';
import { retirementEvents } from './retirement/_index';
import { healthWarningHospital } from './career/health-warning-hospital';
import { officePoliticsBacklash } from './career/office-politics-backlash';
import { bullyingGuilt } from './school/bullying-guilt';
import { crisisLowHappiness } from './thresholds/crisis-low-happiness';
import { crisisLowConstitution } from './thresholds/crisis-low-constitution';
import { peakHighCombined } from './thresholds/peak-high-combined';
import { midlifeCrisis } from './thresholds/midlife-crisis';
import { monkEnding } from './endings/monk';
import { luckEncounterEvents } from './special/luck-encounters';
import { crimeChainEvents } from './chains/crime-chain';
import { crimeJailedEnding, crimeBossEnding, crimeScapegoatEnding } from './endings/crime-endings';
import { cultChainEvents } from './chains/cult-chain';
import { cultMartyrEnding, cultUsurpEnding, cultEscapeEnding } from './endings/cult-endings';
import { illnessChainEvents } from './chains/illness-chain';
import { illnessRebornEnding, illnessAdvocateEnding, illnessDefeatedEnding } from './endings/illness-endings';
import {
  centenarianEnding,
  entrepreneurEnding,
  globalTravelerEnding,
  lifelongLearnerEnding,
  debtRiddenEnding,
  hermitEnding,
  dyingAloneEnding,
  jackOfAllTradesEnding,
} from './endings/lifestyle-endings';

// 内联结局（spec §6.1 要求，无需单独文件）
const richEnding: Ending = {
  id: 'ending_rich',
  priority: 50,
  condition: (s) => s.attrs.财富 >= 85 && s.skills.软 >= 60,
  title: '富豪',
  desc: (s) => `你以 ${s.attrs.财富} 的财富退休，儿女环绕。`,
  rating: () => 'S',
};

const happyFamilyEnding: Ending = {
  id: 'ending_happy_family',
  priority: 50,
  condition: (s) => s.attrs.快乐 >= 70 && s.flags.has('milestone_family'),
  title: '幸福家庭',
  desc: () => '你有一个温暖的家，儿女孝顺，老伴相守。',
  rating: () => 'A',
};

const earlyDeathEnding: Ending = {
  id: 'ending_early_death',
  priority: 40,
  condition: (s) => s.age < 50,
  title: '早逝',
  desc: (s) => `你在 ${s.age} 岁离世，留下太多遗憾。`,
  rating: () => 'D',
};

export const ALL_EVENTS: GameEvent[] = [
  // 铺垫
  dreamGaokao,
  secretReading,
  internetDream,
  emigrationDream,
  // 招牌链
  overworkCritical,
  slackerWriting,
  internetViral,
  emigrationAbroad,
  // 流程保底
  ...childhoodEvents,
  ...schoolEvents,
  ...collegeEvents,
  ...careerEvents,
  ...retirementEvents,
  // 运气遭遇事件
  ...luckEncounterEvents,
  // 犯罪/黑化分支链
  ...crimeChainEvents,
  // 邪教/极端信仰分支链
  ...cultChainEvents,
  // 大病/残疾分支链
  ...illnessChainEvents,
  // followUp 试点事件（baseWeight=0，靠 followUp 机制触发）
  healthWarningHospital,
  officePoliticsBacklash,
  bullyingGuilt,
  // 阈值事件（baseWeight=0，由 detectThresholdEvents 检测）
  crisisLowHappiness,
  crisisLowConstitution,
  peakHighCombined,
  midlifeCrisis,
];

export const ALL_ENDINGS: Ending[] = [
  underworldHrEnding,      // priority 100
  rebornAsGaokaoEnding,    // priority 90
  slackerAuthorEnding,     // priority 90
  internetStarEnding,      // priority 90
  globalExecutiveEnding,   // priority 90
  illnessRebornEnding,     // priority 85
  illnessAdvocateEnding,   // priority 85
  illnessDefeatedEnding,   // priority 85
  cultMartyrEnding,        // priority 75
  cultUsurpEnding,         // priority 75
  cultEscapeEnding,        // priority 75
  monkEnding,              // priority 70
  crimeScapegoatEnding,    // priority 65
  crimeJailedEnding,       // priority 62
  crimeBossEnding,         // priority 62
  cyberbullyVictimEnding,  // priority 60
  homesickReturneeEnding,  // priority 55
  richEnding,              // priority 50
  happyFamilyEnding,       // priority 50
  centenarianEnding,       // priority 45
  entrepreneurEnding,      // priority 45
  earlyDeathEnding,        // priority 40
  globalTravelerEnding,    // priority 39
  lifelongLearnerEnding,   // priority 38
  debtRiddenEnding,        // priority 37
  hermitEnding,            // priority 36
  dyingAloneEnding,        // priority 35
  jackOfAllTradesEnding,   // priority 34
  {
    id: 'default_ordinary',
    priority: 0,
    condition: () => true,
    title: '平凡打工人',
    desc: () => '你过着平凡的一生，没什么大起大落。',
    rating: () => 'C',
  },
];

export const findEvent = (id: string): GameEvent | undefined =>
  ALL_EVENTS.find((e) => e.id === id);
export const findEnding = (id: string): Ending | undefined =>
  ALL_ENDINGS.find((e) => e.id === id);
