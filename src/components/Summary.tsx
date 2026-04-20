'use client'

import { Record, HABITS, getScore } from '@/types'

interface Props {
  records: Record[]
  month: number
  year: number
  onClose: () => void
}

export default function Summary({ records, month, year, onClose }: Props) {
  const totalDays = records.length
  if (totalDays === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center modal-backdrop bg-black/40" onClick={onClose}>
        <div className="w-full max-w-md bg-cream rounded-t-3xl p-6 animate-slide-up safe-bottom">
          <div className="text-center py-10 text-sage-400">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-medium">この月の記録がまだありません</p>
          </div>
        </div>
      </div>
    )
  }

  const totalScore = records.reduce((sum, r) => sum + getScore(r), 0)
  const avgScore = Math.round((totalScore / totalDays) * 10) / 10
  const perfectDays = records.filter(r => getScore(r) === 6).length
  const goodDays = records.filter(r => getScore(r) >= 5).length

  const habitStats = HABITS.map(({ key, label, emoji }) => {
    const achieved = records.filter(r => r[key]).length
    const rate = Math.round((achieved / totalDays) * 100)
    return { key, label, emoji, achieved, rate }
  })

  const overallRate = Math.round((totalScore / (totalDays * 6)) * 100)

  const rateColor = (rate: number) =>
    rate >= 80 ? 'bg-sage-400' : rate >= 50 ? 'bg-warm-500' : 'bg-blush-500'

  const rateText = (rate: number) =>
    rate >= 80 ? 'text-sage-600' : rate >= 50 ? 'text-amber-600' : 'text-red-500'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center modal-backdrop bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-md bg-cream rounded-t-3xl shadow-2xl animate-slide-up safe-bottom">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-sage-200" />
        </div>

        <div className="px-5 pt-2 pb-4 border-b border-sage-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-sage-700">📊 {month}月のまとめ</h2>
            <p className="text-xs text-sage-400">{year}年 · {totalDays}日分の記録</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-sage-100 text-sage-500 text-sm">✕</button>
        </div>

        <div className="overflow-y-auto max-h-[75vh] px-4 py-4 space-y-4">
          {/* Top stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '平均スコア', value: `${avgScore}/6`, sub: '毎日の平均' },
              { label: '達成率', value: `${overallRate}%`, sub: '全習慣合計' },
              { label: '完璧な日', value: `${perfectDays}日`, sub: '6/6達成' },
            ].map(({ label, value, sub }) => (
              <div key={label} className="bg-white rounded-2xl p-3 text-center border border-sage-100">
                <div className="text-xs text-sage-400 mb-1">{label}</div>
                <div className="text-xl font-bold font-mono text-sage-600">{value}</div>
                <div className="text-xs text-sage-300 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>

          {/* Overall progress bar */}
          <div className="bg-white rounded-2xl p-4 border border-sage-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-sage-600">総合達成率</span>
              <span className={`text-sm font-bold font-mono ${rateText(overallRate)}`}>{overallRate}%</span>
            </div>
            <div className="h-3 bg-sage-50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${rateColor(overallRate)}`}
                style={{ width: `${overallRate}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-sage-300 mt-1">
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>

          {/* Per-habit stats */}
          <div className="bg-white rounded-2xl border border-sage-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-sage-50">
              <h3 className="text-sm font-medium text-sage-600">習慣別の達成率</h3>
            </div>
            <div className="divide-y divide-sage-50">
              {habitStats.map(({ key, label, emoji, achieved, rate }) => (
                <div key={key} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{emoji}</span>
                      <span className="text-xs font-medium text-sage-600 leading-tight">{label}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-sage-400">{achieved}/{totalDays}日</span>
                      <span className={`text-xs font-bold font-mono w-10 text-right ${rateText(rate)}`}>{rate}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-sage-50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${rateColor(rate)}`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Encouragement */}
          <div className={`rounded-2xl p-4 text-center ${
            overallRate >= 80 ? 'bg-sage-100' : overallRate >= 50 ? 'bg-warm-100' : 'bg-blush-100'
          }`}>
            <div className="text-2xl mb-1">
              {overallRate >= 80 ? '🎊' : overallRate >= 50 ? '👍' : '💪'}
            </div>
            <p className={`text-sm font-medium ${
              overallRate >= 80 ? 'text-sage-600' : overallRate >= 50 ? 'text-amber-600' : 'text-red-500'
            }`}>
              {overallRate >= 80
                ? '素晴らしい月でした！この調子で続けましょう'
                : overallRate >= 50
                ? 'まずまずのスタート！来月はさらに上を目指そう'
                : '焦らず少しずつ。習慣は続けることが大事です'}
            </p>
          </div>

          <div className="pb-2" />
        </div>
      </div>
    </div>
  )
}
