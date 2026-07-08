# Playtest 调参后报告（100 局）

种子 1-100，uniform 随机选 choice，模拟无偏见玩家。
调参内容：RATING_THRESHOLDS 下调 + CONSTITUTION_DECAY_AGE 35→45 + 体质正向 apply +50% + RATING_WEIGHTS.attrAvg 0.6→0.55。

```text

===== Playtest Report (100 局) =====

属性终值 (min / avg / max):
  智力: 48 / 75 / 100
  魅力: 37 / 58 / 79
  体质: 0 / 21 / 60
  运气: 25 / 40 / 50
  财富: 0 / 47 / 94
  快乐: 31 / 71 / 100

评分分布:
  S: 0 (0%)
  A: 0 (0%)
  B: 1 (1%)
  C: 91 (91%)
  D: 8 (8%)

结局分布 (出现次数):
  default_ordinary: 32 (32%)
  ending_monk: 29 (29%)
  ending_lifelong_learner: 29 (29%)
  ending_happy_family: 3 (3%)
  ending_early_death: 2 (2%)
  ending_dying_alone: 2 (2%)
  ending_debt_ridden: 1 (1%)
  ending_reborn_as_gaokao: 1 (1%)
  ending_global_traveler: 1 (1%)

事件触达率 (按比例排序，<10% 标记):
  childhood_family_rich: 100%
  school_gaokao: 100%
  threshold_midlife_crisis: 97%
  school_deskmate_conflict: 84%
  school_bullying: 83%
  childhood_snack_thief: 81%
  school_favorite_teacher: 79%
  school_exam_pressure: 78%
  school_study_group: 75%
  school_first_crush: 70%
  school_internet_cafe: 70%
  school_cheat_temption: 69%
  childhood_talent_music: 69%
  school_talent_show: 61%
  retirement_pension: 61%
  retirement_hobby: 61%
  foreshadow_writer_dream: 55%
  school_sports_tryout: 52%
  school_class_monitor: 51%
  childhood_first_friend: 50%
  school_rebellion: 50%
  childhood_family_poor: 50%
  retirement_old_friends: 50%
  childhood_grandparent: 49%
  college_first_love: 47%
  threshold_low_constitution: 46%
  college_club_join: 43%
  college_internship: 41%
  college_failed_course: 39%
  college_grad_school: 36%
  college_part_time_job: 33%
  college_roommate_conflict: 32%
  college_first_job_hunt: 32%
  retirement_legacy: 32%
  retirement_hospital: 31%
  career_overwork_critical: 29%
  childhood_nature_explore: 29%
  college_breakup: 27%
  college_startup_try: 26%
  career_slacker_writing: 23%
  foreshadow_internet_dream: 23%
  foreshadow_emigration_dream: 23%
  childhood_pet: 22%
  foreshadow_dream_gaokao: 21%
  career_internet_viral: 20%
  threshold_peak_high: 20%
  career_marriage: 17%
  career_side_hustle: 15%
  career_emigration_offer: 15%
  career_layoff: 15%
  career_house_loan: 14%
  career_startup: 13%
  career_first_promotion: 12%
  career_temptation: 12%
  career_health_warning: 12%
  retirement_nursing_home: 12%
  career_office_politics: 11%
  career_class_reunion: 9% ⚠️
  career_parents_aging: 9% ⚠️
  career_job_hopping: 9% ⚠️
  career_investment: 8% ⚠️
  retirement_late_love: 3% ⚠️
  retirement_grandchild: 2% ⚠️
  threshold_low_happiness: 1% ⚠️

其他:
  平均死亡年龄: 61
  平均选择数/局: 26
```

## 诊断（调参后）

| 问题 | 数据 | 评估 |
|------|------|------|
| 评分分布改善但仍集中 | D 从 98% → 8%，C 从 2% → 91%，B+ 仍仅 1% | **显著改善**但未达 B+ ≥ 50% 验收线。根本原因：评分公式 attrAvg(0.55) 权重仍最大，而运气（avg 40，无增长事件）+ 体质（avg 21）结构性拉低 attrAvg |
| 体质有改善但仍偏低 | avg 体质 13→21（+62%），min 仍为 0；死亡年龄 58→61 | 改善但未达 ≥ 35 验收线。CONSTITUTION_DECAY_AGE 45+体质 apply +50% 缓解了衰减，但总量不够 |
| 结局分布基本不变 | 三足鼎立（32/29/29%）维持 | 长寿改善未能有效传导到结局多样性——career/retirement milestone 触发率不变 |
| 招牌链仍不触发 | reborn_as_gaokao 仍 1% | 未在本轮处理（结构性问题，需 content 层调整） |

## 改善对比（vs baseline）

| 维度 | Baseline | After | 变化 |
|------|----------|-------|------|
| S 评级占比 | 0% | 0% | - |
| A 评级占比 | 0% | 0% | - |
| B 评级占比 | 0% | 1% | ↑ 出现 |
| C 评级占比 | 2% | 91% | ↑ 大幅上升 |
| D 评级占比 | 98% | 8% | ↓ 大幅下降 |
| B+ 占比合计 | 0% | 1% | ↑ 微弱改善（未达 ≥50%） |
| C+D 占比合计 | 100% | 99% | ↓ 1pp |
| 平均体质 | 13 | 21 | ↑ 62% |
| 体质 min | 0 | 0 | - |
| 体质 max | 48 | 60 | ↑ 25% |
| 平均死亡年龄 | 58 | 61 | ↑ 3 年（未达 65-75 目标） |
| 平均选择数/局 | 25 | 26 | ↑ 1 |
| 平均智力 | 75 | 75 | - |
| 平均快乐 | 70 | 71 | ↑ 1 |
| 结局种类数 | 9 | 9 | - |

## 未达验收的分析

**B+ ≥ 50% 未达成**。根因：评分公式 `attrAvg * 0.55` 占最大权重，而运气（avg=40，无任何事件增加）和体质（avg=21，虽有提升但结构性偏低）将 attrAvg 锁在 ~44.7，导致 score 集中在 38-44 区间——正好卡在 C 档（30-45）。

**体质 ≥ 35 未达成**。根因：虽然 CONSTITUTION_DECAY_AGE 延迟了 10 年（45→55 减少约 10 点衰减），体质 apply +50% 也增加了每事件收益，但：
1. 运气属性无任何增长事件，永远是起始值 25-50——这个结构性短板拉低 attrAvg
2. 每年 -1 体质衰减在 45-61 岁仍有 16 年 = -16 点
3. 多数 career/college 事件的体质惩罚（-3 到 -8）仍然存在

**死亡年龄 65-75 未达成**（61 vs 目标 65-75）。体质 avg=21 导致部分角色体质触底（=0）死亡。

## 后续建议（留给 content/数值后续迭代）

1. **运气增长事件**：添加 2-3 个增加运气的事件（如"中彩票小奖"、"偶遇贵人"），或在现有事件 outcome 中加 `运气 += N`
2. **进一步降低 B 阈值** 或调整 RATING_WEIGHTS.attrAvg 至 0.5 以下
3. **减少 career/college 事件体质惩罚**：-3~-8 的惩罚对 avg 体质 21 的角色过于致命
4. **提高 career/retirement 事件 baseWeight**：让 milestone_* flag 更易达成，自然提升结局多样性和 achievement 评分加成
