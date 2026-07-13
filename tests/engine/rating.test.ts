// tests/engine/rating.test.ts
import { describe, it, expect } from 'vitest';
import { calcRating } from '../../src/engine/rating';
import { makeState } from '../fixtures';

describe('calcRating', () => {
  // 注：公式 + 当前权重 (55/20/15/10) 对此输入算出 ~71.75 分。
  // playtest 调整后 S 阈值 58 → 71.75 >= 58 → S。
  it('returns S for high stats and long life (score ~71.75, S threshold=58)', () => {
    const s = makeState({
      age: 80,
      attrs: { 智力: 90, 魅力: 90, 体质: 90, 运气: 90, 财富: 90, 快乐: 90 },
      skills: { 硬: 90, 软: 90, 摸: 90 },
    });
    s.flags.add('achievement_x'); s.flags.add('achievement_y');
    s.flags.add('twist_x');
    expect(calcRating(s)).toBe('S');
  });

  it('returns D for low everything', () => {
    const s = makeState({
      age: 30,
      attrs: { 智力: 20, 魅力: 20, 体质: 20, 运气: 20, 财富: 20, 快乐: 20 },
      skills: { 硬: 20, 软: 20, 摸: 20 },
    });
    expect(calcRating(s)).toBe('D');
  });

  // 注：默认 makeState（attrs=50, skills=30）+ age=60 在权威公式下得 38.58 分。
  // playtest 调整后 B 阈值 34 → 38.58 >= 34 → B。
  it('returns B for default makeState at age 60 (score 38.58, B threshold=34)', () => {
    const s = makeState({ age: 60 });
    expect(calcRating(s)).toBe('B');
  });
});
