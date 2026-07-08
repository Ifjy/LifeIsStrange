// src/engine/loop.ts
import type { GameState, GameEvent, Outcome } from './types';
import { filterEligible } from './trigger';
import { evaluateCondition } from './condition';
import { STAGE_OF_AGE, CONSTITUTION_DECAY_AGE, clampAttr, THRESHOLDS } from './constants';

/**
 * Select 0 or 1 event ID for the current year (weighted draw).
 *
 * Priority:
 * 1. If state.nextEvent is set (招牌链强制触发), return [nextEvent] only.
 * 2. Otherwise, filter eligible events and draw ONE by weight.
 *    baseWeight acts as relative weight (not independent probability).
 *    baseWeight=0 events (threshold events) never get drawn here —— they are
 *    handled separately by detectThresholdEvents.
 *
 * Rationale: one event per year keeps narrative coherent (避免一年塞三件大事
 * 导致叙事断裂). Threshold events are layered on top via startYear logic.
 */
export function selectEventsForYear(
  events: ReadonlyArray<GameEvent>,
  state: GameState,
  rng: () => number,
): string[] {
  // 招牌链强制触发
  if (state.nextEvent) return [state.nextEvent];

  const eligible = filterEligible(events, state);
  if (eligible.length === 0) return [];

  // 加权抽签：baseWeight 作为相对权重
  // baseWeight=0 的事件权重为 0，永远不会被抽中（阈值事件由 detectThresholdEvents 处理）
  const totalWeight = eligible.reduce((sum, e) => sum + Math.max(0, e.trigger.baseWeight), 0);
  if (totalWeight <= 0) return [];

  const roll = rng() * totalWeight;
  let acc = 0;
  for (const ev of eligible) {
    acc += Math.max(0, ev.trigger.baseWeight);
    if (roll < acc) return [ev.id];
  }
  // 浮点兜底
  return [eligible[eligible.length - 1].id];
}

/**
 * Advance the state by one year:
 * - age += 1
 * - stage updated to match new age
 * - 体质 -1 when post-tick age > 35 (i.e. decay starts at age 36)
 * - clamp all attrs to [0, 100] defensively
 */
export function applyYearlyTick(state: GameState): void {
  state.age += 1;
  state.stage = STAGE_OF_AGE(state.age);
  if (state.age > CONSTITUTION_DECAY_AGE) {
    state.attrs.体质 = clampAttr(state.attrs.体质 - 1);
  }
  // 防御性 clamp：保证所有属性都在 [0, 100]
  (Object.keys(state.attrs) as Array<keyof typeof state.attrs>).forEach((k) => {
    state.attrs[k] = clampAttr(state.attrs[k]);
  });
}

/**
 * Check whether the player has died / reached an ending.
 * Returns true if:
 * - age >= lifespan, OR
 * - 体质 <= 0, OR
 * - nextEvent points at an ending_* id
 */
export function checkDeath(state: GameState, lifespan: number): boolean {
  if (state.age >= lifespan) return true;
  if (state.attrs.体质 <= 0) return true;
  if (state.nextEvent?.startsWith('ending_')) return true;
  return false;
}

/**
 * Apply an outcome to the state:
 * - run outcome.apply(state)
 * - push eventId to history if not already present (dedup)
 * - set state.nextEvent = outcome.nextEvent (clears if undefined)
 * - clamp all attrs at the end
 */
export function applyOutcomeToState(state: GameState, outcome: Outcome, eventId: string): void {
  outcome.apply(state);
  if (!state.history.includes(eventId)) state.history.push(eventId);
  state.nextEvent = outcome.nextEvent;
  // clamp apply 后可能越界的属性
  (Object.keys(state.attrs) as Array<keyof typeof state.attrs>).forEach((k) => {
    state.attrs[k] = clampAttr(state.attrs[k]);
  });
}

/**
 * Detect threshold events (baseWeight === 0) whose conditions are met.
 *
 * Unlike regular events sampled by baseWeight probability, threshold events
 * fire deterministically whenever their `requires` conditions evaluate true.
 * Compound conditions (e.g. 快乐+财富>150, age in [40,50]) that cannot be
 * expressed in a single Condition are handled via special-case branches here.
 *
 * `pendingQueue` excludes IDs already waiting in the event queue (detected but
 * not yet processed). Without this, a threshold event detected at startYear
 * would be re-detected by selectChoice and inserted again —— causing the
 * "四十不惑/财富巅峰 重复出现" bug.
 *
 * Returns an array of event IDs to append to the event queue.
 */
export function detectThresholdEvents(
  thresholdEvents: ReadonlyArray<GameEvent>,
  state: GameState,
  pendingQueue: ReadonlyArray<string> = [],
): string[] {
  const queued = new Set(pendingQueue);
  const triggered: string[] = [];
  for (const ev of thresholdEvents) {
    if (ev.trigger.baseWeight > 0) continue; // 只看 baseWeight=0 的阈值事件
    if (state.history.includes(ev.id)) continue; // 已处理过
    if (queued.has(ev.id)) continue; // 已在待处理队列里，不重复检测
    if (!ev.trigger.requires?.every((c) => evaluateCondition(c, state))) continue;
    // 复合条件（如快乐+财富>150）在这里手动判断
    if (ev.id === 'threshold_peak_high') {
      if (state.attrs.快乐 + state.attrs.财富 <= THRESHOLDS.peakCombined) continue;
    }
    if (ev.id === 'threshold_midlife_crisis') {
      const [min, max] = THRESHOLDS.midlifeAgeRange;
      if (state.age < min || state.age > max) continue;
    }
    triggered.push(ev.id);
  }
  return triggered;
}
