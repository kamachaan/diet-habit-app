export interface Record {
  id: string
  date: string
  habit1: boolean
  habit2: boolean
  habit3: boolean
  habit4: boolean
  habit5: boolean
  habit6: boolean
  memo: string | null
  created_at?: string
}

export const HABITS: { key: keyof Pick<Record, 'habit1'|'habit2'|'habit3'|'habit4'|'habit5'|'habit6'>; label: string; detail: string; emoji: string }[] = [
  {
    key: 'habit1',
    label: '朝整えた？',
    detail: '納豆＋味噌汁でOK',
    emoji: '🌅',
  },
  {
    key: 'habit2',
    label: 'タンパク質ベースで食べた？',
    detail: '手のひら1枚分以上',
    emoji: '🥩',
  },
  {
    key: 'habit3',
    label: '食べ過ぎ防止できた？',
    detail: '8分目＋空腹放置しない',
    emoji: '🍽️',
  },
  {
    key: 'habit4',
    label: '夜コントロールできた？',
    detail: '炭水化物なしor少量',
    emoji: '🌙',
  },
  {
    key: 'habit5',
    label: 'ドカ食いしてない？',
    detail: '満腹以上まで食べていない',
    emoji: '🚫',
  },
  {
    key: 'habit6',
    label: '我慢しすぎてない？',
    detail: 'ストレス・反動なし',
    emoji: '😌',
  },
]

export type HabitKey = typeof HABITS[number]['key']

export function getScore(record: Partial<Record>): number {
  return [
    record.habit1,
    record.habit2,
    record.habit3,
    record.habit4,
    record.habit5,
    record.habit6,
  ].filter(Boolean).length
}

export function getScoreColor(score: number): string {
  if (score >= 5) return 'green'
  if (score >= 3) return 'yellow'
  return 'red'
}
