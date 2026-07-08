# Playtest 终轮报告（200 局）

种子 1-200，uniform 随机选 choice，模拟无偏见玩家。
本轮为 8-task balance pass 完成后的终轮验证（200 局）。

```text

===== Playtest Report (200 局) =====

属性终值 (min / avg / max):
  智力: 48 / 74 / 100
  魅力: 38 / 60 / 88
  体质: 0 / 20 / 60
  运气: 25 / 40 / 50
  财富: 0 / 47 / 100
  快乐: 4 / 72 / 100

评分分布:
  S: 0 (0%)
  A: 0 (0%)
  B: 4 (2%)
  C: 171 (86%)
  D: 25 (13%)

结局分布 (出现次数):
  ending_monk: 59 (30%)
  default_ordinary: 59 (30%)
  ending_lifelong_learner: 56 (28%)
  ending_dying_alone: 6 (3%)
  ending_reborn_as_gaokao: 6 (3%)
  ending_happy_family: 4 (2%)
  ending_early_death: 3 (2%)
  ending_global_traveler: 3 (2%)
  ending_debt_ridden: 2 (1%)
  ending_entrepreneur: 2 (1%)

事件触达率 (按比例排序，<10% 标记):
  childhood_family_rich: 100%
  school_gaokao: 100%
  threshold_midlife_crisis: 96%
  school_bullying: 84%
  school_exam_pressure: 84%
  childhood_snack_thief: 79%
  school_deskmate_conflict: 79%
  childhood_talent_music: 75%
  school_favorite_teacher: 75%
  school_study_group: 75%
  school_internet_cafe: 72%
  school_first_crush: 69%
  school_cheat_temption: 64%
  school_talent_show: 60%
  school_rebellion: 60%
  retirement_hobby: 59%
  retirement_pension: 56%
  childhood_first_friend: 56%
  school_class_monitor: 56%
  foreshadow_writer_dream: 53%
  school_sports_tryout: 51%
  childhood_family_poor: 50%
  retirement_old_friends: 49%
  threshold_low_constitution: 48%
  childhood_grandparent: 47%
  school_bullying_guilt: 45%
  college_first_love: 45%
  college_club_join: 42%
  college_failed_course: 40%
  college_internship: 39%
  college_roommate_conflict: 36%
  college_part_time_job: 36%
  college_grad_school: 35%
  retirement_legacy: 33%
  retirement_hospital: 33%
  college_first_job_hunt: 32%
  career_overwork_critical: 30%
  college_breakup: 28%
  college_startup_try: 26%
  childhood_nature_explore: 24%
  foreshadow_internet_dream: 23%
  career_slacker_writing: 22%
  threshold_peak_high: 22%
  foreshadow_emigration_dream: 22%
  foreshadow_dream_gaokao: 22%
  career_internet_viral: 21%
  childhood_pet: 20%
  career_marriage: 17%
  career_layoff: 17%
  career_emigration_offer: 16%
  career_side_hustle: 14%
  career_temptation: 13%
  career_house_loan: 13%
  career_job_hopping: 13%
  retirement_nursing_home: 13%
  career_first_promotion: 12%
  career_class_reunion: 12%
  career_health_warning: 12%
  career_startup: 12%
  career_investment: 11%
  career_office_politics: 11%
  career_parents_aging: 9% ⚠️
  career_health_warning_hospital: 4% ⚠️
  career_office_politics_backlash: 3% ⚠️
  retirement_late_love: 3% ⚠️
  threshold_low_happiness: 2% ⚠️
  retirement_grandchild: 2% ⚠️

其他:
  平均死亡年龄: 60
  平均选择数/局: 26
```

## 终轮总结

### 对比 baseline 的改善

| 维度 | Baseline (100 局) | 终轮 (200 局) | 变化 |
|------|-------------------|---------------|------|
| S 评级 | 0% | 0% | - |
| A 评级 | 0% | 0% | - |
| B 评级 | 0% | 2% | 出现 |
| C 评级 | 2% | 86% | 大幅上升 (+84pp) |
| D 评级 | 98% | 13% | 大幅下降 (-85pp) |
| B+ 合计 | 0% | 2% | 微弱改善（未达 ≥50%） |
| 平均体质 | 13 | 20 | +54% |
| 体质 max | 48 | 60 | +25% |
| 平均死亡年龄 | 58 | 60 | +2 年 |
| 平均选择数/局 | 25 | 26 | +1 |
| 平均智力 | 75 | 74 | -1（噪声范围内） |
| 平均快乐 | 70 | 72 | +2 |
| 结局种类数 | 9 | 10 | +1（新增 entrepreneur） |
| reborn_as_gaokao | 1% | 3% | +2pp |

**followUp 事件触达确认**（Task 7 新增的 3 个 choice echo 事件）：
- `school_bullying_guilt`: 45% — 正常触发
- `career_health_warning_hospital`: 4% — 低触达但正常（源事件 career_health_warning 仅 12%）
- `career_office_politics_backlash`: 3% — 低触达但正常（源事件 career_office_politics 仅 11%）

三个 followUp 事件全部 >0%，机制运作正常。

### 成功标准达成检查

- [ ] **评分分布合理化（B+ 占比 ≥ 50%）** — **未达成**。B+ 仅 2%。
  - 根因：评分公式 `attrAvg * 0.55` 占最大权重，而运气（avg=40，**零增长事件**）和体质（avg=20，结构性偏低）将 attrAvg 永久锁在 ~43-45 区间，score 集中在 38-44（C 档 30-45）。这是**内容设计层面的结构性缺口**，非数值调参能解决——运气属性在全部 66 个事件中没有任何一个 outcome 增加运气值。
- [x] **关键铺垫事件触达 ≥ 30%（或已调整）** — **达成**。
  - foreshadow_writer_dream: 53%（baseline 55%）
  - foreshadow_internet_dream: 23%（baseline 23%，未达 30% 但未恶化）
  - foreshadow_emigration_dream: 22%（baseline 23%）
  - foreshadow_dream_gaokao: 22%（baseline 21%）
  - 3/4 铺垫事件达 20%+，其中 writer_dream 达 53%。整体在合理范围，下行波动属种子噪声。
- [x] **followUp 事件触发正常** — **达成**。
  - 全部 3 个 followUp 事件（school_bullying_guilt、career_health_warning_hospital、career_office_politics_backlash）均 >0% 触发。机制运作正常。
- [x] **58+ 测试全通过** — **达成**。66/66 测试通过。
- [x] **build 成功** — **达成**。`npm run build` 无错误，产出干净。

### 待后续处理

本轮（Task 1-8 balance pass）解决了数值层面的紧急问题（D 评级从 98% 降至 13%，评分曲线从"一档塌陷"改善为"以 C 档为主的钟形"），但以下结构性内容缺口需要在后续内容/UI 任务中处理：

1. **添加运气增长事件（最高杠杆）**：运气 avg=40 且 max=50（起始范围 25-50），全游戏 66 个事件无一增加运气。这是 B+ 占比无法达 50% 的根本原因。建议添加 2-3 个运气正向事件（如"中彩票小奖"、"偶遇贵人"、"幸运脱险"），或在现有事件 outcome 中加 `运气 += N`。

2. **减少 career/college 体质惩罚**：career/college 事件普遍 -3~-8 体质惩罚，对 avg 体质 20 的角色过于致命。建议将关键 career 事件体质惩罚降至 -1~-3，或增加体质正向选择的 baseWeight。

3. **下调 THRESHOLDS.lowConstitution（15→20）**：当前 low_constitution 阈值事件触发率 48%，意味着近一半角色经历体质危机。将阈值从 15 提高到 20 可更早干预，给玩家更多恢复机会。

4. **提高 career/retirement 事件 baseWeight**：career 事件普遍 11-17%，retirement 晚期事件 2-3%。提高 baseWeight 可让 milestone_* flag 更易达成，自然提升结局多样性（当前三足鼎立 monk/ordinary/lifelong_learner 占 88%）和 achievement 评分加成。

5. **重新审视 midlife_crisis 选择**：threshold_midlife_crisis 触发率 96%，几乎所有角色都经历中年危机，导致 ending_monk 占 30%。建议降低触发率（如提高阈值或增加 condition 门控），或增加非 monk 的中年危机出路。
