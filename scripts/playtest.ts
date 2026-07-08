// scripts/playtest.ts
// 无头模拟器：复用引擎纯函数跑随机局，收集数值平衡数据。
// 运行：npx tsx scripts/playtest.ts
import type { GameState, Attrs, Skills, Rating, GameEvent, Choice, Outcome } from '../src/engine/types';
import {
  selectEventsForYear, detectThresholdEvents, applyOutcomeToState,
  applyYearlyTick, checkDeath, insertEventsAt, createInitialAttrs,
} from '../src/engine/loop';
import { resolveChoice } from '../src/engine/outcome';
import { resolveEnding } from '../src/engine/ending';
import { calcRating } from '../src/engine/rating';
import { mulberry32 } from '../src/engine/rng';
import { ALL_EVENTS, ALL_ENDINGS, findEvent } from '../src/content/_registry';
import { BASE_LIFESPAN, LIFESPAN_VARIANCE } from '../src/engine/constants';

const THRESHOLD_EVENTS = ALL_EVENTS.filter((e) => e.trigger.baseWeight === 0);

export interface GameResult {
  seed: number;
  endingId: string;
  rating: Rating;
  age: number;
  attrs: Attrs;
  skills: Skills;
  eventsEncountered: string[];
  choiceCount: number;
}

function makeInitialState(seed: number): GameState {
  return {
    age: 1,
    stage: 'childhood',
    attrs: createInitialAttrs(seed),
    skills: { 硬: 0, 软: 0, 摸: 0 },
    flags: new Set<string>(),
    history: [],
    meta: { seed, playthrough: 1 },
  };
}

function pickRandomChoice(choices: Choice[], rng: () => number): Choice {
  return choices[Math.floor(rng() * choices.length)];
}

/**
 * 模拟一局完整人生。uniform 随机选 choice，模拟无偏见玩家。
 * 复刻 store 的 startYear/selectChoice/advanceYear 流程，但全用纯函数。
 */
export function runOneGame(seed: number): GameResult {
  const state = makeInitialState(seed);
  const eventsEncountered: string[] = [];
  const lifespan = BASE_LIFESPAN + (((seed % 31) - 15) % LIFESPAN_VARIANCE);

  while (state.age <= lifespan) {
    // startYear：每年用 seed+age 重置 rng（与 store 一致）
    const yearRng = mulberry32(state.meta.seed + state.age * 7919);

    const thresholdIds = detectThresholdEvents(THRESHOLD_EVENTS, state, []);
    let queue: string[];
    if (thresholdIds.length > 0) {
      queue = [...thresholdIds];
    } else {
      queue = selectEventsForYear(ALL_EVENTS, state, yearRng);
    }
    let queueIndex = 0;

    // 处理当年事件队列
    while (queueIndex < queue.length) {
      const eventId = queue[queueIndex];
      const ev: GameEvent | undefined = findEvent(eventId);
      if (!ev) { queueIndex++; continue; }
      eventsEncountered.push(eventId);

      const choice = pickRandomChoice(ev.choices, yearRng);
      const outcome: Outcome | undefined = resolveChoice(choice, state, yearRng);

      if (outcome) {
        applyOutcomeToState(state, outcome, eventId);
        if (outcome.nextEvent?.startsWith('ending_')) break; // 进结局，结束当年
      }

      queueIndex++;
      // 阈值重检（与 store.selectChoice 一致：传当前 queue 防重）
      const moreThreshold = detectThresholdEvents(THRESHOLD_EVENTS, state, queue);
      if (moreThreshold.length > 0) {
        queue = insertEventsAt(queue, queueIndex, moreThreshold);
      }
    }

    // advanceYear
    applyYearlyTick(state);
    if (checkDeath(state, lifespan)) break;
    if (state.nextEvent?.startsWith('ending_')) break;
  }

  const ending = resolveEnding(ALL_ENDINGS, state);
  const rating = calcRating(state);
  return {
    seed,
    endingId: ending.id,
    rating,
    age: state.age,
    attrs: { ...state.attrs },
    skills: { ...state.skills },
    eventsEncountered,
    choiceCount: eventsEncountered.length,
  };
}

// Task 4 会在此追加 runManyGames + 报告输出 + main 入口
