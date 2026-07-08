# Playtest 基线报告（100 局）

种子 1-100，uniform 随机选 choice，模拟无偏见玩家。

```text

===== Playtest Report (100 局) =====

属性终值 (min / avg / max):
  智力: 48 / 75 / 100
  魅力: 37 / 58 / 79
  体质: 0 / 13 / 48
  运气: 25 / 40 / 50
  财富: 0 / 48 / 100
  快乐: 30 / 70 / 100

评分分布:
  S: 0 (0%)
  A: 0 (0%)
  B: 0 (0%)
  C: 2 (2%)
  D: 98 (98%)

结局分布 (出现次数):
  ending_lifelong_learner: 29 (29%)
  ending_monk: 29 (29%)
  default_ordinary: 29 (29%)
  ending_early_death: 5 (5%)
  ending_dying_alone: 2 (2%)
  ending_happy_family: 2 (2%)
  ending_global_traveler: 2 (2%)
  ending_debt_ridden: 1 (1%)
  ending_reborn_as_gaokao: 1 (1%)

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
  threshold_low_constitution: 62%
  school_talent_show: 61%
  foreshadow_writer_dream: 55%
  retirement_pension: 53%
  retirement_hobby: 53%
  school_sports_tryout: 52%
  school_class_monitor: 51%
  childhood_first_friend: 50%
  school_rebellion: 50%
  childhood_family_poor: 50%
  childhood_grandparent: 49%
  college_first_love: 47%
  college_club_join: 43%
  retirement_old_friends: 43%
  college_internship: 41%
  college_failed_course: 39%
  college_grad_school: 36%
  college_part_time_job: 33%
  college_roommate_conflict: 32%
  college_first_job_hunt: 32%
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
  retirement_legacy: 18%
  career_marriage: 17%
  retirement_hospital: 17%
  career_side_hustle: 15%
  career_emigration_offer: 15%
  career_layoff: 15%
  career_house_loan: 13%
  career_first_promotion: 12%
  career_temptation: 12%
  career_health_warning: 12%
  career_startup: 12%
  career_office_politics: 11%
  career_class_reunion: 9% ⚠️
  career_parents_aging: 9% ⚠️
  career_job_hopping: 9% ⚠️
  career_investment: 8% ⚠️
  retirement_nursing_home: 6% ⚠️
  retirement_late_love: 5% ⚠️
  retirement_grandchild: 2% ⚠️
  threshold_low_happiness: 1% ⚠️

其他:
  平均死亡年龄: 58
  平均选择数/局: 25
```

## 诊断（基于上述 100 局基线）

| 问题 | 数据证据 | 调整方向 |
|------|----------|----------|
| 评分严重塌陷至 D | D 占 98%，C 仅 2%，S/A/B 全为 0%——评分曲线几乎只有一档 | 大幅下调 `RATING_THRESHOLDS`（Task 5 核心目标）；现阈值对所有 build 都过高 |
| 体质崩盘导致平均死亡年龄偏低 | 体质 avg 13（min 0），平均死亡年龄 58 < 60；`threshold_low_constitution` 触发率高达 62% | 削弱体质惩罚（年度衰减幅度 / 阈值事件损耗）；或提高体质相关 outcome 的正向 apply |
| 结局严重同质化（三足鼎立） | `ending_lifelong_learner` / `ending_monk` / `default_ordinary` 各 29%，合计 87%；其余结局合计仅 13% | 放宽非常规结局 condition；提高 career/retirement 事件 baseWeight 让 milestone_* flag 更易达成 |
| 中后期事件触达率断崖下跌 | career_* 事件普遍 9-17%，retirement_* 普遍 2-53%（grandchild 仅 2%、late_love 5%、nursing_home 6%） | 提高 career/retirement 事件 baseWeight；检查 career 入场 condition（如 milestone_has_job 是否过严） |
| 招牌反转链结局几乎不触发 | `ending_reborn_as_gaokao` 仅 1%（铺垫 `foreshadow_dream_gaokao` 触发率 21%——铺垫 OK，但反转层 condition 过严） | 放宽招牌链结局的属性门控；或提高反转 outcome 的权重 |
| 快乐过度膨胀 | 快乐 avg 70（max 100），与 D 评分占 98% 形成强烈反差——评分公式可能过度惩罚某些属性 | 复核评分权重（快乐权重 10% 是否合理），或快乐上限易达导致其"无意义" |

