# 内容扩充第二轮设计（运气事件 + 6 人生分支 + 密度 + followUp）

> 日期：2026-07-10
> 前置：playtest 平衡打磨完成（`docs/superpowers/playtest/final-report.md`），模拟器工具就绪
> 基线：66 事件 + 20 结局 → 目标 ~128 事件 + ~38 结局

## 背景与动机

playtest 数据暴露两个问题：

1. **评分结构性塌陷**：运气属性只有 1 个 +2 增长点 vs 3 个 -5 消耗点，永远卡在起手 30-50，把评分公式的 attrAvg 死死压住。B+ 评级仅 2%（目标 ≥50%）。
2. **"选了没用、感觉不丰富"**：选择反馈弱（followUp 仅 3 条试点链），中后期事件稀疏（career 9-17%、retirement 2-53%），人生路径单一（全是上学→工作→退休线性轨道）。

本轮用 ~60 新事件 + ~18 新结局一次性解决这四个维度。

## 四条工作线

| 线 | 内容 | 事件 | 结局 | 机制 |
|----|------|------|------|------|
| W1 运气遭遇 | 小型幸运事件，散布 all stages | 8 | 0 | 普通加权抽签，baseWeight 2-3 |
| W2 人生分支 | 6 条 mini 招牌链 | 30 | 18 | 铺垫→入口→3分支事件→3结局（每支 5 事件）|
| W3 中后期密度 | career/retirement 流程事件 | 12 | 0 | 普通加权抽签 |
| W4 followUp 扩展 | 给现有事件挂选择回响 | 10 改动 | 0 | 现有 outcome 加 followUp 字段 |

---

## W1：运气遭遇事件（8 个）

**目的**：机械地修评分缺口。运气 avg 从 40 拉到 55+，解锁 B+ 评分天花板。

**设计纪律**：
- 每个事件 +2~5 运气，搭一些小副作用（财富/快乐/魅力微调）
- baseWeight 2-3（跟铺垫事件同级，不会每局都刷）
- spread 在 all 5 stages（childhood 1, school 2, college 2, career 2, retirement 1）
- 文案内核："善意/冒险有回报"——小运气反转，呼应"出乎意料"灵魂

**事件清单**（stage / 文案概念 / 运气幅度）：

| stage | 事件概念 | 运气 | 副作用 |
|-------|----------|------|--------|
| childhood | 路边捡到钱包归还，失主是好人 | +3 | 快乐 +2 |
| school | 让座给老人，老人是退隐教授 | +4 | 智力 +2 |
| school | 学校抽奖/盲盒开出稀有款 | +3 | 财富 -2 |
| college | 雨天帮陌生人撑伞，对方成贵人 | +5 | 魅力 +2 |
| college | 选修课意外发现自己的天赋 | +3 | 智力 +3 |
| career | 堵车让了辆救护车，后来救的是自己亲人 | +5 | 快乐 -2 |
| career | 闲聊推荐的股票真涨了 | +4 | 财富 +5 |
| retirement | 散步救下一只流浪猫，猫主人是老中医 | +3 | 体质 +2 |

每个事件 2-3 个 choice，其中"善意/好奇心"选择给运气，"无视/自私"选择不给（或给微负面）。choice 设计不需要三层 outcome——这些是轻量遭遇。

---

## W2：6 条人生分支（30 事件 + 18 结局）

### 分支模板（6 条共用）

```
铺垫事件 (foreshadow_*, baseWeight 2)
  ↓ 玩家不一定遇到，1-2 行字 + 设 flag
入口事件 (baseWeight 3-4, ageRange 在对应 stage 中段)
  ↓ 有一个"踏入分支"的 choice → 设 milestone_* flag
分支事件 ×3 (requires milestone_*, baseWeight 3)
  ↓ 每个选择有 2-3 层 outcome（常规/反转/罕见反转）
分支结局 ×3 (priority 高于 default, condition 查 milestone_* + 属性)
```

**结局优先级**：分支结局 priority 设 15-25（在招牌链结局和常规结局之间），确保有 milestone flag 的玩家优先走向分支结局。

### 6 条分支详细设计

---

### 分支 1：犯罪 / 黑化

**核心叙事**：从"赚快钱"的诱惑到深陷泥潭。探讨"好人如何一步步变坏"。

| # | 事件 ID | stage | ageRange | 文案概念 |
|---|---------|-------|----------|----------|
| 铺垫 | foreshadow_crime temptation | career | 25-32 | 同事神秘兮兮说"有个路子" |
| 入口 | crime_first_taste | career | 26-35 | 第一次捞偏门（挪用公款/做假账/走私）|
| 分支1 | crime_deeper | career | 28-40 | 尝到甜头，金额越来越大 |
| 分支2 | crime_betrayal | career | 30-42 | 同伙出事 / 上线要求做更大的 |
| 分支3 | crime_crossroad | career | 35-45 | 关键抉择：收手 / 继续做 / 反咬上线 |

**入口 choice 三层 outcome**：
- 常规（拒绝）：不进分支，小快乐/道德感
- 反转（试一次，运气好没被抓）：进分支 +milestone_crime，财富 +15
- 罕见反转（试一次，结果发现是个局）：进分支 +milestone_crime + foreshadow_crime_setup，财富 -5（铺垫被背叛结局）

**结局**（priority 20）：

| 结局 ID | condition | title | rating |
|---------|-----------|-------|--------|
| ending_crime_jailed | milestone_crime + 体质 < 30 | 铁窗余生 | C |
| ending_crime_boss | milestone_crime + 财富 ≥ 70 + twist_crime_betrayal | 洗白大佬 | A |
| ending_crime_scapegoat | milestone_crime + foreshadow_crime_setup | 替罪羊 | D |

---

### 分支 2：邪教 / 极端信仰

**核心叙事**：精神空虚时的归属诱惑。探讨"信仰与控制的边界"。

| # | 事件 ID | stage | ageRange | 文案概念 |
|---|---------|-------|----------|----------|
| 铺垫 | foreshadow_cult_lecture | career | 25-35 | 街头"心灵讲座"传单 / 朋友拉你去"读书会" |
| 入口 | cult_first_gathering | career | 27-38 | 第一次聚会，氛围温暖但有点怪 |
| 分支1 | cult_commitment | career | 29-40 | 被要求"奉献"（捐钱/断绝旧社交）|
| 分支2 | cult_inner_circle | career | 32-45 | 进入核心层，看到真相 |
| 分支3 | cult_awakening | career | 35-50 | 认清真相 / 被要求殉道 |

**结局**（priority 22）：

| 结局 ID | condition | title | rating |
|---------|-----------|-------|--------|
| ending_cult_martyr | milestone_cult + 快乐 < 20 | 殉道者 | D |
| ending_cult_usurp | milestone_cult + 魅力 ≥ 70 + 智力 ≥ 60 | 新教主 | A |
| ending_cult_escape | milestone_cult + twist_cult_awakened | 劫后余生 | B |

---

### 分支 3：大病 / 残疾

**核心叙事**：人生的急转弯。健康崩塌后，"怎么活"比"活多久"更重要。

| # | 事件 ID | stage | ageRange | 文案概念 |
|---|---------|-------|----------|----------|
| 铺垫 | foreshadow_illness_sign | career | 28-38 | 体检报告有个异常指标 / 身体发出警告 |
| 入口 | illness_diagnosis | career | 30-42 | 确诊（重病/残疾），人生停摆 |
| 分支1 | illness_treatment | career | 31-45 | 治疗期：砸钱 vs 放弃 vs 试新药 |
| 分支2 | illness_recovery | career | 35-50 | 康复期或适应期：重新学走路/工作/社交 |
| 分支3 | illness_meaning | career/retirement | 40-60 | 找到意义：病友互助 / 公益 / 写书 |

**入口 choice 三层 outcome**：
- 常规（认真治疗）：进分支 +milestone_illness，体质 -10，财富 -20
- 反转（拖着不治，靠运气扛过去）：进分支 +milestone_illness，体质 -20，运气门控（运气 ≥50 有概率扛过去体质只 -5）
- 罕见反转（误诊）：不进分支，设 twist_illness_misdiagnosis，快乐 +10（需要 foreshadow_illness_sign）

**结局**（priority 25——高于其他分支，因为大病结局应优先判定）：

| 结局 ID | condition | title | rating |
|---------|-----------|-------|--------|
| ending_illness_reborn | milestone_illness + 快乐 ≥ 50 | 涅槃重生 | A |
| ending_illness_advocate | milestone_illness + 魅力 ≥ 60 + achievement_* | 病友灯塔 | B |
| ending_illness_defeated | milestone_illness + 体质 < 15 | 耗尽 | D |

---

### 分支 4：复仇执念

**核心叙事**：被人深度伤害后，用半辈子布局报复。探讨"复仇的空虚"。

| # | 事件 ID | stage | ageRange | 文案概念 |
|---|---------|-------|----------|----------|
| 铺垫 | foreshadow_revenge_betrayal | school/college | 18-25 | 被信任的人深度背叛（造谣/夺爱/顶包）|
| 入口 | revenge_decision | college/career | 22-30 | 决定：算了 vs 这笔账要算 |
| 分支1 | revenge_planning | career | 25-35 | 隐忍布局：收集证据/接近对方/等待时机 |
| 分支2 | revenge_execute | career | 30-45 | 动手：揭发/设局/正面交锋 |
| 分支3 | revenge_aftermath | career/retirement | 40-60 | 得手之后：空虚 / 被反噬 / 放下 |

**结局**（priority 20）：

| 结局 ID | condition | title | rating |
|---------|-----------|-------|--------|
| ending_revenge_empty | milestone_revenge + 快乐 < 30 | 大仇得报 | C |
| ending_revenge_letgo | milestone_revenge + 智力 ≥ 65 + twist_revenge_forgive | 放下屠刀 | B |
| ending_revenge_mutual | milestone_revenge + 体质 < 25 | 同归于尽 | D |

---

### 分支 5：艺术偏执

**核心叙事**：为了创作抛弃一切的疯狂。探讨"天才与疯子的一线之隔"。

| # | 事件 ID | stage | ageRange | 文案概念 |
|---|---------|-------|----------|----------|
| 铺垫 | foreshadow_art_spark | school/college | 16-24 | 灵感迸发的一刻（听到一段旋律/想到一个故事）|
| 入口 | art_all_in | college/career | 22-30 | 抛弃一切去追：辞职/辍学/离家 |
| 分支1 | art_struggle | career | 25-35 | 创作瓶颈 + 生计艰难 |
| 分支2 | art_breakthrough_or_breakdown | career | 30-45 | 突破 or 崩溃的分水岭 |
| 分支3 | art_legacy | career/retirement | 40-65 | 传世之作 / 江郎才尽 / 为艺术献身 |

**结局**（priority 18）：

| 结局 ID | condition | title | rating |
|---------|-----------|-------|--------|
| ending_art_masterpiece | milestone_art + 智力 ≥ 75 + twist_art_breakthrough | 传世之作 | S |
| ending_art_starving | milestone_art + 财富 < 20 | 穷困潦倒 | C |
| ending_art_sacrifice | milestone_art + 体质 < 20 + foreshadow_art_spark | 燃尽 | B |

---

### 分支 6：双面身份

**核心叙事**：表面普通人，暗地另一种人生。探讨"哪个才是真正的自己"。

| # | 事件 ID | stage | ageRange | 文案概念 |
|---|---------|-------|----------|----------|
| 铺垫 | foreshadow_double_life_portal | college/career | 20-28 | 发现一个"入口"：暗网社区/地下画室/匿名论坛 |
| 入口 | double_life_choice | career | 24-32 | 决定涉足暗面：黑客/地下作者/卧底 |
| 分支1 | double_life_balance | career | 28-40 | 维持双面：白天上班，晚上另一重身份 |
| 分支2 | double_life_suspicion | career | 35-48 | 有人开始怀疑 / 差一点暴露 |
| 分支3 | double_life_reckoning | career/retirement | 45-60 | 最终选择：公开 / 永远隐藏 / 金盆洗手 |

**结局**（priority 18）：

| 结局 ID | condition | title | rating |
|---------|-----------|-------|--------|
| ending_double_life_exposed | milestone_double_life + 快乐 < 30 | 身份暴露 | C |
| ending_double_life_forever | milestone_double_life + 智力 ≥ 70 | 永远的秘密 | B |
| ending_double_life_balance | milestone_double_life + 魅力 ≥ 65 + 快乐 ≥ 50 | 双面大师 | A |

---

## W3：中后期密度事件（12 个）

**目的**：填充 career/retirement 的叙事空白，让中后期不再"空荡"。每个事件 2-3 个 choice，不需要三层 outcome（流程事件级别）。

### Career 新增（8 个，ageRange 28-55）

| 事件概念 | stage | ageRange | 核心选择 |
|----------|-------|----------|----------|
| 中年考公/考编 | career | 30-40 | 稳定 vs 现状 |
| 孩子上学区房 | career | 32-42 | 砸钱 vs 顺其自然 |
| 同学聚会攀比 | career | 30-40 | 装富 vs 坦然 |
| 父母生病住院 | career | 35-48 | 全职照顾 vs 花钱请护工 |
| 职场PUA/被孤立 | career | 28-40 | 忍 vs 反击 vs 跳槽 |
| 副业变现 | career | 30-45 | 爱好变职业 vs 亏钱 |
| 中年出轨诱惑 | career | 35-48 | 界限 vs 越界（影响 milestone_married）|
| 提前退休计划 | career | 45-55 | FIRE vs 继续干 |

### Retirement 新增（4 个，ageRange 62-80）

| 事件概念 | stage | ageRange | 核心选择 |
|----------|-------|----------|----------|
| 孙辈教育理念冲突 | retirement | 65-75 | 干预 vs 尊重年轻人 |
| 老年大学/兴趣班 | retirement | 62-72 | 学新东西 vs 一个人待着 |
| 老友离世 | retirement | 68-80 | 如何面对死亡 |
| 遗嘱/遗产分配 | retirement | 72-85 | 公平 vs 偏心 |

---

## W4：followUp 扩展（10 个现有事件改动）

**目的**：给现有"选了似乎没用"的 choice 挂上即时回响。不改事件本身，只在特定 choice 的 outcome 上加 `followUp` 字段。

**选择标准**：
- 该 choice 有明确的"后果应该立刻显现"的叙事逻辑
- 不是所有 choice 都加——只加"重选择"（选了应该有回响的那种）
- followUp 事件用 baseWeight 0（只靠 followUp 触发，跟 Task 7 的试点一致）

**10 个改动清单**：

| 现有事件 | 触发 choice | followUp 事件 | 回响内容 |
|----------|-------------|---------------|----------|
| school_gaokao | 复读 | gaokao_retake_consequence | 复读一年的煎熬 + 体质/快乐代价 |
| college_failed_course | 挂科后摆烂 | college_academic_warning | 收到退学警告 |
| career_overwork_critical | 继续加班 | overwork_hospital | 猝死边缘住院（跟 health_warning 分支不同，这是加班直接后果）|
| career_layoff | 跟 HR 硬刚 | layoff_lawsuit | 劳动仲裁 |
| career_house_loan | 断供 | house_auction | 房子被法拍 |
| career_marriage | 婚后冷暴力 | marriage_counseling | 婚姻咨询/离婚危机 |
| retirement_pension | 养老金被骗 | pension_fraud_aftermath | 报警/自认倒霉 |
| childhood_snack_thief | 勒索同学要钱 | childhood_bully_escalation | 霸凌升级，老师找家长 |
| school_first_crush | 死缠烂打 | crush_rejection_trauma | 被当众羞辱 |
| college_roommate_conflict | 动手 | roommate_violence_aftermath | 留校察看/记过 |

每个 followUp 事件 1-2 个 choice（轻量），apply 删除触发 flag，不改 outcome 结构。

---

## Flag 命名规范

```
foreshadow_crime_temptation, foreshadow_cult_lecture, foreshadow_illness_sign,
foreshadow_revenge_betrayal, foreshadow_art_spark, foreshadow_double_life_portal

milestone_crime, milestone_cult, milestone_illness, milestone_revenge, milestone_art, milestone_double_life

twist_crime_betrayal, twist_cult_awakened, twist_cult_usurp, twist_illness_misdiagnosis,
twist_revenge_forgive, twist_art_breakthrough, twist_double_life_exposed

choice_crime_first_taste, choice_cult_first_gathering, ...
```

遵守 CLAUDE.md 的前缀规范（foreshadow_*, twist_*, milestone_*, choice_*）。

---

## 实施分期

| 期 | 内容 | 事件 | 验证 |
|----|------|------|------|
| **P1** | W1 运气遭遇 ×8 | 8 | `npm run playtest -- 200`，运气 avg ≥ 50 |
| **P2** | W2 分支 ×6（每条：铺垫+入口+3分支事件+3结局） | 30+18 | 结局多样性：default_ordinary < 30%，6 种新分支结局各 > 1% |
| **P3** | W3 密度 ×12 + W4 followUp ×10 | 12+10改动 | career 事件 avg 触达 ≥ 25%，followUp 回响 > 0% |
| **P4** | playtest 终验 + 微调 | 0 | B+ ≥ 30%（运气修复后应显著提升）|

---

## 验证标准（P4 终验）

| 指标 | 当前（final-report） | 目标 |
|------|---------------------|------|
| B+ 评级占比 | 2% | ≥ 30% |
| 运气 avg | 40 | ≥ 55 |
| default_ordinary 占比 | 32% | < 25% |
| 结局种类数 | 10 | ≥ 20 |
| career 事件 avg 触达 | ~15% | ≥ 25% |
| 平均选择数/局 | 26 | ≥ 30 |

---

## 不做的事（YAGNI 红线）

- **不加玄幻/科幻/魔幻内容**（C2 方向，用户明确选择 C1，留到下一轮）
- **不改评分公式或 RATING_WEIGHTS**（playtest 轮已调，这轮靠内容修运气）
- **不加新引擎机制**（followUp 已有，这轮只是多用它）
- **不做事件编辑器**（CLAUDE.md MVP 红线）
- **不改结局评分逻辑**（Ending.rating 是静态函数，保持现状）
