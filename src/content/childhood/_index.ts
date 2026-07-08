// src/content/childhood/_index.ts
import type { GameEvent } from '../../engine/types';

export const childhoodEvents: GameEvent[] = [
  {
    id: 'childhood_family_rich',
    stage: 'childhood', ageRange: [1, 3], once: true,
    trigger: { baseWeight: 3 },
    text: '你出生在一个殷实的家庭。父母带你到处旅行。',
    choices: [{ label: '继续', outcomes: [{
      weight: 100, condition: { all: [] },
      apply: (s) => { s.attrs.财富 += 10; s.attrs.智力 += 5; s.flags.add('milestone_rich_family'); },
      result: '你见多识广，比同龄人成熟。',
    }]}],
  },
  {
    id: 'childhood_family_poor',
    stage: 'childhood', ageRange: [1, 3], once: true,
    trigger: { baseWeight: 3, excludes: ['childhood_family_rich'] },
    text: '你的家境普通，父母为生活奔波。',
    choices: [{ label: '继续', outcomes: [{
      weight: 100, condition: { all: [] },
      apply: (s) => { s.attrs.体质 -= 5; s.attrs.智力 += 3; s.flags.add('milestone_poor_family'); },
      result: '你早早学会了独立。',
    }]}],
  },
  {
    id: 'childhood_talent_music',
    stage: 'childhood', ageRange: [4, 6], once: true,
    trigger: { baseWeight: 4 },
    text: '你听到邻居弹钢琴，眼睛一亮。',
    choices: [
      { label: '央求父母学钢琴', outcomes: [{
        weight: 100, condition: { attrGte: { 财富: 30 } },
        apply: (s) => { s.attrs.魅力 += 8; s.attrs.财富 -= 5; },
        result: '你开始学钢琴，气质逐渐显现。',
      }]},
      { label: '算了', outcomes: [{
        weight: 100, condition: { all: [] },
        apply: () => {},
        result: '你只是听听就算了。',
      }]},
    ],
  },
  {
    id: 'childhood_first_friend',
    stage: 'childhood', ageRange: [5, 6], once: true,
    trigger: { baseWeight: 5 },
    text: '你在公园认识了第一个好朋友。',
    choices: [{ label: '继续', outcomes: [{
      weight: 100, condition: { all: [] },
      apply: (s) => { s.attrs.快乐 += 10; s.flags.add('milestone_first_friend'); },
      result: '童年有了伙伴。',
    }]}],
  },

  // 6. 捡到流浪小动物 — 6-9 岁
  {
    id: 'childhood_pet',
    stage: 'childhood', ageRange: [6, 9], once: true,
    trigger: { baseWeight: 4 },
    text: '放学路上，一只脏兮兮的小猫蹲在草丛里冲你喵喵叫，声音小得像在撒娇。',
    choices: [
      {
        label: '偷偷抱回家藏起来养',
        outcomes: [
          {
            weight: 100,
            condition: { attrGte: { 财富: 20 } },
            apply: (s) => { s.attrs.快乐 += 8; s.attrs.魅力 += 3; s.flags.add('choice_kept_pet'); },
            result: '你偷偷买了猫粮，小猫越长越胖。它成了你童年最好的秘密朋友。',
          },
          {
            weight: 100,
            condition: { attrLt: { 财富: 20 } },
            apply: (s) => { s.attrs.快乐 += 2; s.attrs.快乐 -= 3; },
            result: '你藏了三天就被发现了，妈妈叹着气把小猫送了人。你哭了一整晚。',
          },
        ],
      },
      {
        label: '交给爸妈处理',
        outcomes: [{
          weight: 100, condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 3; s.attrs.运气 += 2; },
          result: '爸爸帮忙联系了邻居收养它。你偶尔还能去看一眼。',
        }],
      },
    ],
  },

  // 7. 邻家的老人 — 5-9 岁
  {
    id: 'childhood_grandparent',
    stage: 'childhood', ageRange: [5, 9], once: true,
    trigger: { baseWeight: 4 },
    text: '隔壁总给你塞糖的奶奶已经三天没开过灯了。妈妈说，她去了一个很远的地方。',
    choices: [
      {
        label: '偷偷在她门口放一朵花',
        outcomes: [{
          weight: 100, condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 3; s.attrs.智力 += 3; s.flags.add('choice_mourned_neighbor'); },
          result: '你没有哭，但你第一次明白，有些人走了就不会再回来了。',
        }],
      },
      {
        label: '问妈妈「死」是什么',
        outcomes: [{
          weight: 100, condition: { all: [] },
          apply: (s) => { s.attrs.智力 += 5; s.attrs.快乐 -= 2; },
          result: '妈妈抱住了你，讲了很久。那天晚上你失眠了，第一次思考人生。',
        }],
      },
    ],
  },

  // 8. 偷吃零食 — 4-7 岁
  {
    id: 'childhood_snack_thief',
    stage: 'childhood', ageRange: [4, 7], once: true,
    trigger: { baseWeight: 5 },
    text: '妈妈把那袋薯片藏在了最高的柜子顶上。但她小看了你搬凳子的决心。',
    choices: [
      {
        label: '勇敢地爬上去',
        outcomes: [
          {
            weight: 50,
            condition: { attrGte: { 体质: 30 } },
            apply: (s) => { s.attrs.快乐 += 8; s.attrs.体质 += 2; },
            result: '你身手矫健地拿到了薯片，一边看动画一边吃光了。这是人生巅峰。',
          },
          {
            weight: 50,
            condition: { attrLt: { 体质: 30 } },
            apply: (s) => { s.attrs.快乐 -= 5; s.attrs.体质 -= 2; },
            result: '凳子晃了一下，你摔了个屁股墩。薯片没吃着，还被妈妈逮个正着。',
          },
        ],
      },
      {
        label: '忍住，等妈妈主动给',
        outcomes: [{
          weight: 100, condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 2; s.attrs.智力 += 3; },
          result: '你第二天得到了一整包薯片的奖励——妈妈说你终于懂事了。',
        }],
      },
    ],
  },

  // 9. 小树林探险 — 6-10 岁
  {
    id: 'childhood_nature_explore',
    stage: 'childhood', ageRange: [6, 10], once: true,
    trigger: { baseWeight: 4 },
    text: '暑假的下午闷得发慌，你和小伙伴们决定去后面那片小树林"探险"。',
    choices: [
      {
        label: '当领队，带头往深处走',
        outcomes: [
          {
            weight: 100,
            condition: { attrGte: { 体质: 35 } },
            apply: (s) => { s.attrs.体质 += 5; s.attrs.快乐 += 6; s.attrs.魅力 += 3; },
            result: '你带队找到了一条小溪，还抓到了蝌蚪。你在小伙伴中威望大涨。',
          },
          {
            weight: 100,
            condition: { attrLt: { 体质: 35 } },
            apply: (s) => { s.attrs.快乐 += 3; s.attrs.体质 += 2; },
            result: '你摔了一身泥，被蚊子咬了一腿包，但确实是个难忘的下午。',
          },
        ],
      },
      {
        label: '跟在后面，负责"放哨"',
        outcomes: [{
          weight: 100, condition: { all: [] },
          apply: (s) => { s.attrs.快乐 += 5; s.attrs.智力 += 2; },
          result: '你站在树荫下放哨，啥也没干，但感觉特别重要。',
        }],
      },
    ],
  },

  // 10. 父母吵架 — 7-11 岁
  {
    id: 'childhood_parents_fight',
    stage: 'childhood', ageRange: [7, 11], once: true,
    trigger: { baseWeight: 4 },
    text: '客厅里又传来摔东西的声音。你把被子蒙过头顶，但那些话还是钻了进来。',
    choices: [
      {
        label: '偷偷出去给他们倒杯水',
        outcomes: [
          {
            weight: 100,
            condition: { attrGte: { 智力: 30 } },
            apply: (s) => { s.attrs.快乐 -= 2; s.attrs.智力 += 3; s.attrs.魅力 += 2; },
            result: '你端着水杯出现在门口，他们都愣住了，那一晚安静了下来。',
          },
          {
            weight: 100,
            condition: { attrLt: { 智力: 30 } },
            apply: (s) => { s.attrs.快乐 -= 6; s.attrs.体质 -= 2; },
            result: '你刚走出去就被吼了回来。你没哭，但躲回被子里发抖。',
          },
        ],
      },
      {
        label: '装睡，等他们吵完',
        outcomes: [{
          weight: 100, condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 5; s.attrs.智力 += 2; },
          result: '你数着他们摔了几次门，三个小时后才迷迷糊糊睡过去。',
        }],
      },
    ],
  },

  // 11. 搬家转学 — 8-12 岁
  {
    id: 'childhood_move',
    stage: 'childhood', ageRange: [8, 12], once: true,
    trigger: { baseWeight: 3 },
    text: '爸爸回来说工作调动，下个月要搬家。你看着墙上那张和朋友们的合影，说不出话。',
    choices: [
      {
        label: '大哭一场，死活不肯走',
        outcomes: [{
          weight: 100, condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 8; s.attrs.魅力 += 2; },
          result: '你哭了一整个周末，但搬家车还是来了。你在新学校沉默了好一阵。',
        }],
      },
      {
        label: '认真和朋友告别',
        outcomes: [{
          weight: 100, condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 3; s.attrs.智力 += 3; s.attrs.魅力 += 4; s.flags.add('choice_moved_childhood'); },
          result: '你们互留了地址。虽然后来大多断了联系，但那个下午的拥抱你记了很久。',
        }],
      },
      {
        label: '假装无所谓',
        outcomes: [{
          weight: 100, condition: { all: [] },
          apply: (s) => { s.attrs.快乐 -= 5; s.attrs.智力 += 2; },
          result: '你把所有情绪压进了箱子里。新学校的同学觉得你"酷酷的"。',
        }],
      },
    ],
  },
];
