# 内容扩充第二轮 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增 ~60 事件 + ~18 结局，修复运气评分缺口、丰富选择反馈、填充中后期密度、加入 6 条人生分支。

**Architecture:** 纯内容层创作（TS 对象），不改引擎/状态/UI。每条分支是一条 mini 招牌链（铺垫→入口→3 分支事件→3 结局），与现有招牌链同构。followUp 链复用 Task 6 的 followUp 机制。所有新增事件注册到 `_registry.ts`，用 `npm run playtest -- N` 验证触达率。

**Tech Stack:** TypeScript, Vitest（registry 回归测试）, playtest simulator（触达率验证）

## Global Constraints

- **属性范围 0-100**：所有 apply 后由 clampAttr 收敛（ATTR_FLOOR=0, ATTR_CEIL=100）
- **三层架构**：事件是 Content 层数据（TS 对象），不能含流程逻辑。condition 用声明式 DSL，apply 用函数
- **Flag 命名**：`foreshadow_*`（铺垫）、`milestone_*`（分支入口）、`twist_*`（反转触发）、`choice_*`（选择记录）、`crisis_*`（阈值已触发）
- **结局优先级**：数字越大越先判定。分支结局 priority 55-85（**高于** lifestyle 结局 34-50，**低于** signature flagship 90-100；确保 milestone 持有者优先走向分支结局）。pre-flight 修正：原值 18-25 低于 lifestyle，会导致 A/S 分支结局几乎不触发
- **baseWeight 语义**：相对权重（非概率），每年加权抽签 1 个主事件。铺垫事件 baseWeight 2，流程事件 3-5
- **followUp 事件**：trigger 用 `{ baseWeight: 0 }`（无 requires！），只靠 followUp 机制触发——`selectEventsForYear` 不抽（weight 0），`detectThresholdEvents` 跳过（无 requires）
- **once: true**：所有分支事件和铺垫事件必须设 once，防重入
- **测试基线**：当前 66/66 测试。本轮不新增单测（事件是数据对象），靠 registry 回归测试 + playtest 验证
- **设计参考**：spec 在 `docs/superpowers/specs/2026-07-10-content-enrichment-r2-design.md`。事件结构模板参考 `src/content/chains/emigration-abroad.ts`

---

## 文件结构

### 新建文件

| 文件 | 内容 | 任务 |
|------|------|------|
| `src/content/special/luck-encounters.ts` | 8 个运气遭遇事件（数组导出） | T1 |
| `src/content/chains/crime-chain.ts` | 犯罪分支 5 事件（数组导出） | T2 |
| `src/content/endings/crime-endings.ts` | 犯罪分支 3 结局 | T2 |
| `src/content/chains/cult-chain.ts` | 邪教分支 5 事件 | T3 |
| `src/content/endings/cult-endings.ts` | 邪教分支 3 结局 | T3 |
| `src/content/chains/illness-chain.ts` | 大病分支 5 事件 | T4 |
| `src/content/endings/illness-endings.ts` | 大病分支 3 结局 | T4 |
| `src/content/chains/revenge-chain.ts` | 复仇分支 5 事件 | T5 |
| `src/content/endings/revenge-endings.ts` | 复仇分支 3 结局 | T5 |
| `src/content/chains/art-chain.ts` | 艺术分支 5 事件 | T6 |
| `src/content/endings/art-endings.ts` | 艺术分支 3 结局 | T6 |
| `src/content/chains/double-life-chain.ts` | 双面身份分支 5 事件 | T7 |
| `src/content/endings/double-life-endings.ts` | 双面身份分支 3 结局 | T7 |
| `src/content/special/followup-extensions.ts` | 10 个 followUp 回响事件 | T9 |

### 修改文件

| 文件 | 改动 | 任务 |
|------|------|------|
| `src/content/career/_index.ts` | +8 密度事件 + 3 个 followUp flag/followUp 挂载 | T8, T9 |
| `src/content/retirement/_index.ts` | +4 密度事件 + 1 个 followUp 挂载 | T8, T9 |
| `src/content/school/_index.ts` | +2 个 followUp 挂载 | T9 |
| `src/content/college/_index.ts` | +2 个 followUp 挂载 | T9 |
| `src/content/childhood/_index.ts` | +1 个 followUp 挂载 | T9 |
| `src/content/_registry.ts` | 每个任务追加 import + 注册 | T1-T9 |

---

## Task 1: W1 — 8 个运气遭遇事件

**Files:**
- Create: `src/content/special/luck-encounters.ts`
- Modify: `src/content/_registry.ts`（import + 注册）

**Interfaces:**
- Produces: `luckEncounterEvents: GameEvent[]`（8 个事件的数组导出）

**参考模板：** 读 `src/content/chains/emigration-abroad.ts` 了解 GameEvent 结构。运气事件更简单——2 个 choice，不需要三层 outcome。

### 事件规格

每个事件遵循相同模式：一个"善意/好奇心"选择（给运气），一个"无视/自私"选择（不给或微负面）。

| # | id | stage | ageRange | text 概念 | 善意 choice | 自私 choice |
|---|-----|-------|----------|-----------|------------|------------|
| 1 | `childhood_lost_wallet` | childhood | 4-8 | 路边捡到钱包 | 运气+3 快乐+2 | 运气-1 财富+5 |
| 2 | `school_give_seat` | school | 10-14 | 公交上老人没座位 | 运气+4 智力+2 | 无变化 |
| 3 | `school_blind_box` | school | 12-16 | 小卖部抽奖/盲盒 | 运气+3 财富-2 | 无变化 |
| 4 | `college_umbrella` | college | 18-22 | 雨天陌生人求撑伞 | 运气+5 魅力+2 | 无变化 |
| 5 | `college_elective` | college | 19-23 | 选修课意外发现天赋 | 运气+3 智力+3 | 运气+1（听了但没深究）|
| 6 | `career_ambulance` | career | 30-45 | 堵车让救护车 | 运气+5 快乐-2 | 运气-2 快乐+1 |
| 7 | `career_stock_tip` | career | 28-40 | 闲聊推荐的股票涨了 | 运气+4 财富+5 | 运气+1 财富+0 |
| 8 | `retirement_stray_cat` | retirement | 65-80 | 散步遇流浪猫 | 运气+3 体质+2 | 无变化 |

### 完整代码模板（事件 1，其余照此写）

```typescript
// src/content/special/luck-encounters.ts
import type { GameEvent } from '../../engine/types';

export const luckEncounterEvents: GameEvent[] = [
  {
    id: 'childhood_lost_wallet',
    stage: 'childhood',
    ageRange: [4, 8],
    once: true,
    trigger: { baseWeight: 2 },
    text: '路边有个钱包，鼓鼓的。四下无人，你蹲下来看了看。',
    choices: [
      {
        label: '交给警察叔叔',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.运气 += 3; s.attrs.快乐 += 2; },
          result: '失主是个和蔼的阿姨，摸着你的头夸你是个好孩子。你心里暖暖的。',
        }],
      },
      {
        label: '偷偷拿走里面的钱',
        outcomes: [{
          weight: 100,
          condition: { all: [] },
          apply: (s) => { s.attrs.运气 -= 1; s.attrs.财富 += 5; },
          result: '你买了好多零食。但那天晚上做噩梦了，总觉得有人在看着你。',
        }],
      },
    ],
  },
  // ... 其余 7 个事件按同样结构编写，参考上面的规格表
];
```

### 步骤

- [ ] **Step 1:** 读 spec W1 节 + `src/content/chains/emigration-abroad.ts` 了解事件结构
- [ ] **Step 2:** 创建 `src/content/special/luck-encounters.ts`，按规格表写 8 个事件
- [ ] **Step 3:** 在 `_registry.ts` 添加 import 和注册：

```typescript
// import 区（在 followUp 试点之后，阈值事件之前）
import { luckEncounterEvents } from './special/luck-encounters';

// ALL_EVENTS 数组（在 ...retirementEvents 之后）
  // 运气遭遇事件
  ...luckEncounterEvents,
```

- [ ] **Step 4:** 运行 `npm run build`，确认编译通过
- [ ] **Step 5:** 运行 `npm test`，确认 66/66 通过（registry 回归）
- [ ] **Step 6:** 运行 `npm run playtest -- 200`，检查：
  - 8 个新事件 ID 均出现在事件触达列表
  - 运气 avg ≥ 50（当前基线 40）
- [ ] **Step 7:** 提交

```bash
git add src/content/special/luck-encounters.ts src/content/_registry.ts
git commit -m "feat(content): add 8 luck encounter events across all stages"
```

---

## Task 2: 犯罪/黑化分支（5 事件 + 3 结局）

**Files:**
- Create: `src/content/chains/crime-chain.ts`
- Create: `src/content/endings/crime-endings.ts`
- Modify: `src/content/_registry.ts`

**Interfaces:**
- Produces: `crimeChainEvents: GameEvent[]`, `crimeJailedEnding/ crimeBossEnding/ crimeScapegoatEnding: Ending`

### 事件规格（spec W2 分支 1）

| # | id | ageRange | baseWeight | requires | text 概念 |
|---|-----|----------|------------|----------|-----------|
| 铺垫 | `foreshadow_crime_temptation` | 25-32 | 2 | — | 同事神秘兮兮说"有个路子来快钱" |
| 入口 | `crime_first_taste` | 26-35 | 4 | `milestone_has_job` | 第一次机会：做假账/捞偏门 |
| 分支1 | `crime_deeper` | 28-40 | 3 | `milestone_crime` | 金额越来越大，已经回不了头 |
| 分支2 | `crime_betrayal` | 30-42 | 3 | `milestone_crime` | 同伙出事了，上线要你做更大的 |
| 分支3 | `crime_crossroad` | 35-45 | 3 | `milestone_crime` | 关键抉择：收手/继续/反咬上线 |

### 入口事件三层 outcome（犯罪分支的核心）

`crime_first_taste` 的"踏入"choice 必须有三层 outcome：

```
choice: "捞一笔就走"
├── 常规层 (weight 40, all[]): 财富+15, 设 milestone_crime → "果然来钱快"
├── 反转层 (weight 15, attrLt:{运气:35}): 财富+15, 设 milestone_crime, 设 foreshadow_crime_setup → "第一次就差点被抓，但运气好蒙混过关"
└── 罕见反转层 (weight 5, all:[attrGte:{智力:60}, flag:'foreshadow_crime_temptation']): 财富-5, 设 milestone_crime, 设 twist_crime_mastermind → "你一眼看穿这是个局，将计就计"
```

另一个 choice "不碰这种事"：weight 100, 快乐+2, 不进分支。

### 分支事件 2-4 的 choice 设计

每个分支事件 2-3 个 choice，有 2 层 outcome（常规 + 反转）即可。核心 apply 效果：

- `crime_deeper`：财富大幅+（20-30），但快乐-，体质-（压力），设 `twist_crime_deep`
- `crime_betrayal`：同伙被抓/要求做更大的。选择 A（配合）财富+但设 `foreshadow_crime_setup`；选择 B（想收手）快乐+但 `milestone_crime` 仍在
- `crime_crossroad`：三选一——收手（清白结局线）/继续（大佬结局线）/反咬上线（替罪羊结局线）。各设不同 twist flag

### 结局规格

```typescript
// src/content/endings/crime-endings.ts
import type { Ending } from '../../engine/types';

export const crimeJailedEnding: Ending = {
  id: 'ending_crime_jailed',
  priority: 62,
  condition: (s) => s.flags.has('milestone_crime') && s.attrs.体质 < 30,
  title: '铁窗余生',
  desc: (s) => `你在 ${s.age} 岁那年进去了。铁窗外的月亮和当年一样圆，只是你已经老了。`,
  rating: () => 'C',
};

export const crimeBossEnding: Ending = {
  id: 'ending_crime_boss',
  priority: 62,
  condition: (s) => s.flags.has('milestone_crime') && s.attrs.财富 >= 70 && s.flags.has('twist_crime_mastermind'),
  title: '洗白大佬',
  desc: () => '几番沉浮，你把黑钱洗得干干净净。如今你是慈善晚会的常客，没人记得你的第一桶金是怎么来的。',
  rating: () => 'A',
};

export const crimeScapegoatEnding: Ending = {
  id: 'ending_crime_scapegoat',
  priority: 65,
  condition: (s) => s.flags.has('milestone_crime') && s.flags.has('foreshadow_crime_setup'),
  title: '替罪羊',
  desc: () => '上面的人全身而退，所有的证据都指向你。你成了新闻里的"主犯"，真正的玩家从不留名。',
  rating: () => 'D',
};
```

### 步骤

- [ ] **Step 1:** 读 spec W2 分支 1 + `src/content/chains/emigration-abroad.ts` 了解三层 outcome 写法
- [ ] **Step 2:** 创建 `src/content/chains/crime-chain.ts`，写 5 个事件（铺垫+入口+3 分支事件）。入口事件的三层 outcome 必须严格按规格写
- [ ] **Step 3:** 创建 `src/content/endings/crime-endings.ts`，写 3 个结局（完整代码见上）
- [ ] **Step 4:** 在 `_registry.ts` 注册：

```typescript
import { crimeChainEvents } from './chains/crime-chain';
import { crimeJailedEnding, crimeBossEnding, crimeScapegoatEnding } from './endings/crime-endings';

// ALL_EVENTS（在运气遭遇之后）
  ...crimeChainEvents,
// ALL_ENDINGS（在 priority 34 的 jackOfAllTrades 之前）
  crimeScapegoatEnding, crimeJailedEnding, crimeBossEnding,
```

- [ ] **Step 5:** `npm run build && npm test`（66/66 通过）
- [ ] **Step 6:** `npm run playtest -- 200`，检查：
  - `foreshadow_crime_temptation` 和 `crime_first_taste` 在事件触达列表
  - 至少 1 个犯罪结局出现（> 0%）
- [ ] **Step 7:** 提交

```bash
git add src/content/chains/crime-chain.ts src/content/endings/crime-endings.ts src/content/_registry.ts
git commit -m "feat(content): add crime/underworld branch (5 events + 3 endings)"
```

---

## Task 3: 邪教/极端信仰分支（5 事件 + 3 结局）

**Files:**
- Create: `src/content/chains/cult-chain.ts`
- Create: `src/content/endings/cult-endings.ts`
- Modify: `src/content/_registry.ts`

**Interfaces:**
- Produces: `cultChainEvents: GameEvent[]`, `cultMartyrEnding/ cultUsurpEnding/ cultEscapeEnding: Ending`

### 事件规格（spec W2 分支 2）

| # | id | ageRange | baseWeight | requires | text 概念 |
|---|-----|----------|------------|----------|-----------|
| 铺垫 | `foreshadow_cult_lecture` | 25-35 | 2 | — | 街头收到"心灵讲座"传单，或朋友说有个"读书会" |
| 入口 | `cult_first_gathering` | 27-38 | 4 | — | 第一次聚会，氛围温暖但有点怪 |
| 分支1 | `cult_commitment` | 29-40 | 3 | `milestone_cult` | 被要求"奉献"：捐钱/断绝旧社交 |
| 分支2 | `cult_inner_circle` | 32-45 | 3 | `milestone_cult` | 进入核心层，看到幕后真相 |
| 分支3 | `cult_awakening` | 35-50 | 3 | `milestone_cult` | 认清真相，或被要求殉道 |

### 入口事件三层 outcome

`cult_first_gathering` 的"踏入"choice：

```
choice: "留下来听听，感觉被治愈了"
├── 常规 (weight 50): 快乐+5, 设 milestone_cult → "你找到了归属感"
├── 反转 (weight 20, attrLt:{智力:40}): 快乐+10 智力-5, 设 milestone_cult → "导师说得太对了，你当场捐了一个月工资"
└── 罕见反转 (weight 5, all:[attrGte:{智力:65}, flag:'foreshadow_cult_lecture']): 设 milestone_cult, 设 twist_cult_skeptic → "温暖的氛围下，你敏锐地嗅到了控制的味道——但你决定先潜伏观察"
```

choice "不太适合我，先走了"：weight 100, 快乐+2, 不进分支。

### 分支事件核心 apply 效果

- `cult_commitment`：财富-20~30，快乐+10（短期），社交断裂。选择"全捐" vs "留个心眼"
- `cult_inner_circle`：看到真相。选择"更虔诚"（快乐- 智力-，设 twist_cult_radical）vs "开始怀疑"（设 twist_cult_awakened）
- `cult_awakening`：最终选择——殉道（快乐-，设 foreshadow_cult_martyr）/ 反杀教主（智力/魅力门控，设 twist_cult_usurp）/ 逃离（设 twist_cult_awakened）

### 结局

| id | priority | condition | title | rating |
|----|----------|-----------|-------|--------|
| `ending_cult_martyr` | 75 | milestone_cult + 快乐<20 | 殉道者 | D |
| `ending_cult_usurp` | 75 | milestone_cult + 魅力≥70 + 智力≥60 | 新教主 | A |
| `ending_cult_escape` | 75 | milestone_cult + twist_cult_awakened | 劫后余生 | B |

### 步骤

- [ ] **Step 1:** 读 spec W2 分支 2
- [ ] **Step 2:** 创建 `src/content/chains/cult-chain.ts`（5 事件）+ `src/content/endings/cult-endings.ts`（3 结局）
- [ ] **Step 3:** `_registry.ts` 注册（import + ALL_EVENTS + ALL_ENDINGS）
- [ ] **Step 4:** `npm run build && npm test`
- [ ] **Step 5:** `npm run playtest -- 200`，检查邪教结局 > 0%
- [ ] **Step 6:** 提交

---

## Task 4: 大病/残疾分支（5 事件 + 3 结局）

**Files:**
- Create: `src/content/chains/illness-chain.ts`
- Create: `src/content/endings/illness-endings.ts`
- Modify: `src/content/_registry.ts`

**Interfaces:**
- Produces: `illnessChainEvents: GameEvent[]`, `illnessRebornEnding/ illnessAdvocateEnding/ illnessDefeatedEnding: Ending`

### 事件规格（spec W2 分支 3）

| # | id | ageRange | baseWeight | requires | text 概念 |
|---|-----|----------|------------|----------|-----------|
| 铺垫 | `foreshadow_illness_sign` | 28-38 | 2 | — | 体检报告有个异常指标 / 身体发出警告信号 |
| 入口 | `illness_diagnosis` | 30-42 | 4 | — | 确诊重病或残疾，人生停摆 |
| 分支1 | `illness_treatment` | 31-45 | 3 | `milestone_illness` | 治疗期：砸钱 vs 放弃 vs 试新药 |
| 分支2 | `illness_recovery` | 35-50 | 3 | `milestone_illness` | 康复/适应期：重新学走路/工作/社交 |
| 分支3 | `illness_meaning` | 40-60 | 3 | `milestone_illness` | 找到意义：病友互助/公益/写书 |

### 入口事件三层 outcome（关键：罕见层是"误诊"——不进分支）

`illness_diagnosis` 的 choice "认真面对，去大医院查清楚"：

```
├── 常规 (weight 50): 体质-10 财富-20, 设 milestone_illness → "确诊了。医生说了很多，你只听到'积极治疗'四个字"
├── 反转 (weight 20, attrLt:{运气:40}): 体质-20 财富-20, 设 milestone_illness → "确诊时已经晚了。医生叹了口气，你听懂了那个叹气的意思"
└── 罕见反转 (weight 8, all:[attrGte:{运气:55}, flag:'foreshadow_illness_sign']): 快乐+10 体质+5, 设 twist_illness_misdiagnosis → "复查结果：误诊。你看着第二份报告，在诊室门口蹲了很久，又哭又笑"
```

choice "拖一拖，应该没事"：weight 60, 体质-5（延误治疗），不进分支。

### 结局

| id | priority | condition | title | rating |
|----|----------|-----------|-------|--------|
| `ending_illness_reborn` | 85 | milestone_illness + 快乐≥50 | 涅槃重生 | A |
| `ending_illness_advocate` | 85 | milestone_illness + 魅力≥60 | 病友灯塔 | B |
| `ending_illness_defeated` | 85 | milestone_illness + 体质<15 | 耗尽 | D |

注意 priority 85（高于其他分支），因为大病结局应优先于其他分支结局判定。

### 步骤

- [ ] **Step 1-6:** 同 Task 2 结构。创建 chain + endings，注册，build + test + playtest 验证
- [ ] **Step 7:** 提交 `feat(content): add illness/disability branch (5 events + 3 endings)`

---

## Task 5: 复仇执念分支（5 事件 + 3 结局）

**Files:**
- Create: `src/content/chains/revenge-chain.ts`
- Create: `src/content/endings/revenge-endings.ts`
- Modify: `src/content/_registry.ts`

**Interfaces:**
- Produces: `revengeChainEvents: GameEvent[]`, `revengeEmptyEnding/ revengeLetgoEnding/ revengeMutualEnding: Ending`

### 事件规格（spec W2 分支 4）

| # | id | stage | ageRange | baseWeight | requires | text 概念 |
|---|-----|-------|----------|------------|----------|-----------|
| 铺垫 | `foreshadow_revenge_betrayal` | school | 16-24 | 2 | — | 被信任的人深度背叛（造谣/夺爱/顶包）|
| 入口 | `revenge_decision` | college | 20-28 | 4 | — | 决定：算了 vs 这笔账要算 |
| 分支1 | `revenge_planning` | career | 25-35 | 3 | `milestone_revenge` | 隐忍布局：收集证据/接近对方 |
| 分支2 | `revenge_execute` | career | 30-45 | 3 | `milestone_revenge` | 动手：揭发/设局/正面交锋 |
| 分支3 | `revenge_aftermath` | career | 40-60 | 3 | `milestone_revenge` | 得手之后：空虚/被反噬/放下 |

### 入口事件三层 outcome

`revenge_decision` 的 choice "这笔账，我记下了"：

```
├── 常规 (weight 50): 智力+3 快乐-5, 设 milestone_revenge → "你把那张脸刻进了骨头里"
├── 反转 (weight 20, attrLt:{快乐:30}): 快乐-10 体质-3, 设 milestone_revenge, 设 foreshadow_revenge_obsession → "仇恨成了你活下去的唯一理由。你开始失眠"
└── 罕见反转 (weight 5, all:[attrGte:{智力:65}, flag:'foreshadow_revenge_betrayal']): 智力+8, 设 milestone_revenge, 设 twist_revenge_strategic → "你没有愤怒。你像下棋一样，开始布局"
```

choice "算了，过去就过去了"：weight 100, 快乐+5, 不进分支。

### 结局

| id | priority | condition | title | rating |
|----|----------|-----------|-------|--------|
| `ending_revenge_empty` | 62 | milestone_revenge + 快乐<30 | 大仇得报 | C |
| `ending_revenge_letgo` | 62 | milestone_revenge + 智力≥65 + twist_revenge_forgive | 放下屠刀 | B |
| `ending_revenge_mutual` | 65 | milestone_revenge + 体质<25 | 同归于尽 | D |

### 步骤

- [ ] **Step 1-6:** 同前。注意 revenge 铺垫事件 stage 是 school（ageRange 16-24），入口是 college（ageRange 20-28），分支事件是 career
- [ ] **Step 7:** 提交 `feat(content): add revenge/obsession branch (5 events + 3 endings)`

---

## Task 6: 艺术偏执分支（5 事件 + 3 结局）

**Files:**
- Create: `src/content/chains/art-chain.ts`
- Create: `src/content/endings/art-endings.ts`
- Modify: `src/content/_registry.ts`

**Interfaces:**
- Produces: `artChainEvents: GameEvent[]`, `artMasterpieceEnding/ artStarvingEnding/ artSacrificeEnding: Ending`

### 事件规格（spec W2 分支 5）

| # | id | stage | ageRange | baseWeight | requires | text 概念 |
|---|-----|-------|----------|------------|----------|-----------|
| 铺垫 | `foreshadow_art_spark` | school | 15-22 | 2 | — | 灵感迸发的一刻（听到旋律/想到故事/看到画面）|
| 入口 | `art_all_in` | college | 20-28 | 4 | — | 抛弃一切去追创作：辍学/辞职/离家 |
| 分支1 | `art_struggle` | career | 25-35 | 3 | `milestone_art` | 创作瓶颈 + 生计艰难 |
| 分支2 | `art_crossroad` | career | 30-45 | 3 | `milestone_art` | 突破 or 崩溃的分水岭 |
| 分支3 | `art_legacy` | career | 40-65 | 3 | `milestone_art` | 传世之作 / 江郎才尽 / 燃尽 |

### 入口事件三层 outcome

`art_all_in` 的 choice "豁出去了，全职搞创作"：

```
├── 常规 (weight 45): 智力+5 快乐+10 财富-15, 设 milestone_art → "你交了辞职信。走出大楼时阳光刺眼，你觉得自己终于活了"
├── 反转 (weight 20, attrLt:{体质:30}): 体质-10 财富-20, 设 milestone_art → "理想很丰满，现实很骨感。你开始一天只吃一顿"
└── 罕见反转 (weight 5, all:[attrGte:{智力:70}, flag:'foreshadow_art_spark']): 智力+10 快乐+15, 设 milestone_art, 设 twist_art_vision → "你看到了别人看不到的东西。手在发抖，但方向无比清晰"
```

choice "还是先找个稳当的工作"：weight 100, 快乐-3, 不进分支。

### 结局

| id | priority | condition | title | rating |
|----|----------|-----------|-------|--------|
| `ending_art_masterpiece` | 55 | milestone_art + 智力≥75 + twist_art_breakthrough | 传世之作 | S |
| `ending_art_starving` | 55 | milestone_art + 财富<20 | 穷困潦倒 | C |
| `ending_art_sacrifice` | 58 | milestone_art + 体质<20 + flag:foreshadow_art_spark | 燃尽 | B |

### 步骤

- [ ] **Step 1-7:** 同前。提交 `feat(content): add art obsession branch (5 events + 3 endings)`

---

## Task 7: 双面身份分支（5 事件 + 3 结局）

**Files:**
- Create: `src/content/chains/double-life-chain.ts`
- Create: `src/content/endings/double-life-endings.ts`
- Modify: `src/content/_registry.ts`

**Interfaces:**
- Produces: `doubleLifeChainEvents: GameEvent[]`, `doubleLifeExposedEnding/ doubleLifeForeverEnding/ doubleLifeBalanceEnding: Ending`

### 事件规格（spec W2 分支 6）

| # | id | stage | ageRange | baseWeight | requires | text 概念 |
|---|-----|-------|----------|------------|----------|-----------|
| 铺垫 | `foreshadow_double_life_portal` | college | 20-28 | 2 | — | 发现一个"入口"：暗网/地下画室/匿名论坛 |
| 入口 | `double_life_choice` | career | 24-32 | 4 | — | 决定涉足暗面：黑客/地下作者/卧底 |
| 分支1 | `double_life_balance` | career | 28-40 | 3 | `milestone_double_life` | 维持双面：白天上班，晚上另一重身份 |
| 分支2 | `double_life_suspicion` | career | 35-48 | 3 | `milestone_double_life` | 有人开始怀疑 / 差一点暴露 |
| 分支3 | `double_life_reckoning` | career | 45-60 | 3 | `milestone_double_life` | 最终选择：公开/永远隐藏/金盆洗手 |

### 入口事件三层 outcome

`double_life_choice` 的 choice "我有另一个身份"：

```
├── 常规 (weight 45): 智力+5 快乐+5, 设 milestone_double_life → "白天你是普通职员，晚上你是论坛传说中的'幽灵'"
├── 反转 (weight 20, attrLt:{魅力:30}): 快乐-5 智力+3, 设 milestone_double_life → "你在暗面找到了存在感，但现实里越来越沉默"
└── 罕见反转 (weight 5, all:[attrGte:{智力:70}, flag:'foreshadow_double_life_portal']): 智力+8 魅力+5, 设 milestone_double_life, 设 twist_double_life_vision → "你意识到两个身份可以互相利用——明面提供掩护，暗面提供情报"
```

choice "算了，看看就好"：weight 100, 不进分支。

### 结局

| id | priority | condition | title | rating |
|----|----------|-----------|-------|--------|
| `ending_double_life_exposed` | 55 | milestone_double_life + 快乐<30 | 身份暴露 | C |
| `ending_double_life_forever` | 55 | milestone_double_life + 智力≥70 | 永远的秘密 | B |
| `ending_double_life_balance` | 55 | milestone_double_life + 魅力≥65 + 快乐≥50 | 双面大师 | A |

### 步骤

- [ ] **Step 1-7:** 同前。提交 `feat(content): add double-life branch (5 events + 3 endings)`

---

## Task 8: W3 — 12 个中后期密度事件

**Files:**
- Modify: `src/content/career/_index.ts`（+8 事件）
- Modify: `src/content/retirement/_index.ts`（+4 事件）
- Modify: `src/content/_registry.ts`（无需改——_index.ts 数组已注册，只追加内容）

**Interfaces:**
- Consumes: `careerEvents` / `retirementEvents` 数组（已有，追加新事件到数组末尾）

### 事件规格

每个事件 2-3 个 choice，2 层 outcome（常规+反转），baseWeight 3-4。不需要三层 outcome。

#### Career 新增 8 个

| # | id | ageRange | text 概念 | 核心选择 | apply 效果 |
|---|-----|----------|-----------|----------|------------|
| 1 | `career_civil_service` | 30-40 | 中年考公/考编热潮 | 备考 vs 算了 | 备考：智力+3 快乐-5，反转(智力≥60)上岸：财富+10 快乐+8 |
| 2 | `career_school_district` | 32-42 | 孩子上学区房 | 砸钱买 vs 顺其自然 | 砸钱：财富-25 智力+3(孩子教育)；顺其自然：快乐+3 |
| 3 | `career_reunion_compare` | 30-40 | 同学聚会攀比 | 装富 vs 坦然 | 装富：财富-10 快乐-5；坦然：快乐+5 魅力+2 |
| 4 | `career_parents_hospital` | 35-48 | 父母生病住院 | 全职照顾 vs 花钱请护工 | 全职：财富-15 快乐-5 体质-3；护工：财富-25 快乐-2 |
| 5 | `career_office_pua` | 28-40 | 职场 PUA/被孤立 | 忍 vs 反击 vs 跳槽 | 反击(魅力≥50)：快乐+5 智力+3；跳槽：财富-5 快乐+3 |
| 6 | `career_side_business` | 30-45 | 副业尝试 | 全力做 vs 当爱好 | 全力(智力≥55)：财富+15 快乐-3；反转亏钱：财富-10 |
| 7 | `career_affair` | 35-48 | 出轨诱惑 | 界限 vs 越界 | 越界：快乐+5(短期)，设 `choice_affair`（影响 marriage）|
| 8 | `career_fire_plan` | 45-55 | 提前退休/ FIRE | 攒钱退休 vs 继续干 | FIRE：财富-20 快乐+10；继续：财富+10 快乐-3 |

#### Retirement 新增 4 个

| # | id | ageRange | text 概念 | 核心选择 | apply 效果 |
|---|-----|----------|-----------|----------|------------|
| 9 | `retirement_grandchild_debate` | 65-75 | 孙辈教育理念冲突 | 干预 vs 尊重年轻人 | 干预：快乐-3 魅力-2；尊重：快乐+3 魅力+2 |
| 10 | `retirement_elder_college` | 62-72 | 老年大学/兴趣班 | 报名 vs 一个人待着 | 报名：智力+3 快乐+5 魅力+2 |
| 11 | `retirement_friend_passing` | 68-80 | 老友离世 | 如何面对 | 释然：快乐+2 智力+2；消沉：快乐-5 体质-3 |
| 12 | `retirement_will` | 72-85 | 遗嘱/遗产分配 | 公平 vs 偏心 | 公平：快乐+5；偏心：快乐-3 财富-5 |

### 代码模板

```typescript
// 追加到 src/content/career/_index.ts 的 careerEvents 数组末尾
{
  id: 'career_civil_service',
  stage: 'career',
  ageRange: [30, 40],
  once: true,
  trigger: { baseWeight: 4, requires: [{ flag: 'milestone_has_job' }] },
  text: '单位里掀起"考编热"。同事桌上都摆着行测和申论，连午休都在刷题。',
  choices: [
    {
      label: '跟风备考，搏一个编制',
      outcomes: [
        { weight: 40, condition: { attrGte: { 智力: 60 } }, apply: (s) => { s.attrs.智力 += 3; s.attrs.财富 += 10; s.attrs.快乐 += 8; }, result: '你上岸了。虽然工资差不多，但那种踏实感是钱买不到的。' },
        { weight: 60, condition: { all: [] }, apply: (s) => { s.attrs.智力 += 3; s.attrs.快乐 -= 5; }, result: '考了两年没考上。行测题刷了几千道，梦里都是图形推理。' },
      ],
    },
    {
      label: '不折腾了，过好现在',
      outcomes: [{ weight: 100, condition: { all: [] }, apply: (s) => { s.attrs.快乐 += 2; }, result: '你看着同事们焦头烂额的样子，喝了一口茶。' }],
    },
  ],
},
```

### 步骤

- [ ] **Step 1:** 读 spec W3 节 + 现有 `src/content/career/_index.ts` 末尾结构
- [ ] **Step 2:** 在 `careerEvents` 数组末尾追加 8 个 career 事件
- [ ] **Step 3:** 在 `retirementEvents` 数组末尾追加 4 个 retirement 事件
- [ ] **Step 4:** `npm run build && npm test`（66/66）
- [ ] **Step 5:** `npm run playtest -- 200`，检查新事件触达 > 5%，career avg 触达提升
- [ ] **Step 6:** 提交

```bash
git add src/content/career/_index.ts src/content/retirement/_index.ts
git commit -m "feat(content): add 12 career/retirement density events"
```

---

## Task 9: W4 — 10 条 followUp 回响链

**Files:**
- Create: `src/content/special/followup-extensions.ts`（10 个 followUp 事件）
- Modify: `src/content/school/_index.ts`（2 处 followUp 挂载）
- Modify: `src/content/college/_index.ts`（2 处）
- Modify: `src/content/career/_index.ts`（3 处）
- Modify: `src/content/childhood/_index.ts`（1 处）
- Modify: `src/content/retirement/_index.ts`（1 处）
- Modify: `src/content/_registry.ts`（注册 10 个 followUp 事件）

**Interfaces:**
- Produces: `followupExtensionEvents: GameEvent[]`（10 个 followUp 目标事件，全 baseWeight 0 无 requires）

### ⚠️ followUp 事件纪律

**所有 10 个 followUp 事件必须用 `trigger: { baseWeight: 0 }`，不带 requires！** 原因见 plan Global Constraints。如果不小心带了 requires，detectThresholdEvents 会在 flag 被设之后检测到它，和 followUp 机制双触发。

### 10 条 followUp 链规格

| # | 源事件 | 源 choice | 设的 flag | followUp 事件 ID | followUp 文案 | apply 效果 |
|---|--------|-----------|-----------|------------------|-------------|------------|
| 1 | `school_gaokao` | 复读 | `choice_gaokao_retake` | `gaokao_retake_consequence` | 复读一年的煎熬 | 体质-3 快乐-8, delete flag |
| 2 | `college_failed_course` | 挂科后摆烂 | `choice_failed_skip` | `college_academic_warning` | 收到退学警告 | 快乐-10 智力+2(痛定思痛), delete flag |
| 3 | `career_overwork_critical` | 继续加班 | `choice_overwork_ignore` | `overwork_hospital_stay` | 猝死边缘住院 | 体质-15 财富-10, delete flag |
| 4 | `career_layoff` | 跟 HR 硬刚 | `choice_layoff_fight` | `layoff_lawsuit` | 劳动仲裁 | 反转(智力≥55):财富+15; 常规:财富-5 快乐-10, delete flag |
| 5 | `career_house_loan` | 断供 | `choice_house_default` | `house_auction` | 房子被法拍 | 财富-30 快乐-15, delete flag |
| 6 | `career_marriage` | 冷暴力 | `choice_marriage_cold` | `marriage_counseling` | 婚姻咨询/离婚危机 | 快乐-10; 反转(魅力≥50):挽回 快乐+5, delete flag |
| 7 | `retirement_pension` | 养老金被骗 | `choice_pension_fraud` | `pension_fraud_aftermath` | 报警/自认倒霉 | 反转(智力≥50):追回 财富+10; 常规:快乐-15, delete flag |
| 8 | `childhood_snack_thief` | 勒索同学 | `choice_bully_extort` | `childhood_bully_escalation` | 老师找家长 | 快乐-5 魅力-3; 反转:被揍 体质-3, delete flag |
| 9 | `school_first_crush` | 死缠烂打 | `choice_crush_stalk` | `crush_rejection_trauma` | 被当众羞辱 | 快乐-10 魅力-5, delete flag |
| 10 | `college_roommate_conflict` | 动手 | `choice_roommate_violence` | `roommate_violence_aftermath` | 留校察看 | 快乐-5 体质-3, delete flag |

### followUp 事件代码模板

```typescript
// src/content/special/followup-extensions.ts
import type { GameEvent } from '../../engine/types';

export const followupExtensionEvents: GameEvent[] = [
  {
    id: 'gaokao_retake_consequence',
    stage: 'school',
    ageRange: [18, 20],
    once: true,
    trigger: { baseWeight: 0 }, // ← 无 requires！只靠 followUp 触发
    text: '复读这一年，你尝到了什么叫"度日如年"。身边同学都在大学里军训、社团、谈恋爱，你还在刷去年的试卷。',
    choices: [{
      label: '咬牙撑过去',
      outcomes: [{
        weight: 100,
        condition: { all: [] },
        apply: (s) => { s.attrs.体质 -= 3; s.attrs.快乐 -= 8; s.flags.delete('choice_gaokao_retake'); },
        result: '你的黑眼圈比课本还厚。但模考成绩在慢慢回升。',
      }],
    }],
  },
  // ... 其余 9 个 followUp 事件按同样结构
];
```

### 挂载 followUp 的修改模板

在源事件的指定 choice 的 outcome 上，添加 `s.flags.add('...')` 到 apply，添加 `followUp: '...'` 到 outcome：

```typescript
// 修改前（career/_index.ts 的 career_overwork_critical 某个 outcome）
apply: (s) => { s.attrs.体质 -= 5; },
result: '你继续硬撑。',

// 修改后
apply: (s) => { s.attrs.体质 -= 5; s.flags.add('choice_overwork_ignore'); },
followUp: 'overwork_hospital_stay',
result: '你继续硬撑。',
```

### 步骤

- [ ] **Step 1:** 创建 `src/content/special/followup-extensions.ts`，写 10 个 followUp 事件（全 baseWeight 0 无 requires）
- [ ] **Step 2:** 在 `_registry.ts` 注册：

```typescript
import { followupExtensionEvents } from './special/followup-extensions';
// ALL_EVENTS（在 luckEncounterEvents 之后）
  ...followupExtensionEvents,
```

- [ ] **Step 3:** 逐个修改 10 个源事件的指定 choice。**每个修改需要先读源事件找到目标 choice**（用 grep 搜 choice label 或 event id），然后在 outcome 上加 flag + followUp
- [ ] **Step 4:** `npm run build && npm test`（66/66）
- [ ] **Step 5:** `npm run playtest -- 200`，检查 10 个 followUp 事件 ID 均出现在触达列表（> 0%）
- [ ] **Step 6:** 提交

```bash
git add src/content/special/followup-extensions.ts src/content/_registry.ts src/content/school/_index.ts src/content/college/_index.ts src/content/career/_index.ts src/content/childhood/_index.ts src/content/retirement/_index.ts
git commit -m "feat(content): add 10 followUp chains on existing high-stakes choices"
```

---

## Task 10: P4 — playtest 终验 + 微调

**Files:**
- Create: `docs/superpowers/playtest/enrichment-r2-report.md`
- Modify（可能）: `src/engine/constants.ts`（如果微调阈值）

### 步骤

- [ ] **Step 1:** 运行 `npm run playtest -- 300`，捕获完整输出
- [ ] **Step 2:** 创建 `docs/superpowers/playtest/enrichment-r2-report.md`，包含：
  - 完整 playtest 输出（```text 块）
  - 与上一版 final-report 的对比表（D%, B+%, 运气 avg, 结局种类, career 触达, choice count）
  - 验证标准达成检查（对照 spec 的验证标准表）

- [ ] **Step 3:** 检查验证标准：

| 指标 | 目标 | 达成？ |
|------|------|--------|
| B+ 评级占比 | ≥ 30% | |
| 运气 avg | ≥ 55 | |
| default_ordinary 占比 | < 25% | |
| 结局种类数 | ≥ 20 | |
| career 事件 avg 触达 | ≥ 25% | |
| 平均选择数/局 | ≥ 30 | |

- [ ] **Step 4:** 如果 B+ 仍 < 30%：
  - 检查运气 avg 是否达标。如果运气 ≥ 55 但 B+ 仍低，微调 RATING_THRESHOLDS（B 45→42, A 60→55）
  - 如果运气 < 55，检查新运气事件的触达率，可能需要提高 baseWeight

- [ ] **Step 5:** 检查 6 个分支结局是否都有 > 0% 触达。如果某个分支 0%：
  - 检查 foreshadow 是否触发太低（baseWeight 2 可能偏低）
  - 检查入口事件的 milestone_requires 是否过严
  - 检查结局 condition 是否可满足

- [ ] **Step 6:** `npm test && npm run build` 确认全绿
- [ ] **Step 7:** 提交

```bash
git add docs/superpowers/playtest/enrichment-r2-report.md
git commit -m "docs: enrichment R2 playtest report — 60 events + 18 endings added"
```

---

## Self-Review 记录

**Spec coverage 检查：**
- W1 运气遭遇（8 事件）→ Task 1 ✓
- W2 犯罪分支 → Task 2 ✓
- W2 邪教分支 → Task 3 ✓
- W2 大病分支 → Task 4 ✓
- W2 复仇分支 → Task 5 ✓
- W2 艺术分支 → Task 6 ✓
- W2 双面身份分支 → Task 7 ✓
- W3 career 密度（8 事件）→ Task 8 ✓
- W3 retirement 密度（4 事件）→ Task 8 ✓
- W4 followUp 扩展（10 链）→ Task 9 ✓
- P4 playtest 验收 → Task 10 ✓
- Flag 命名规范 → Global Constraints ✓
