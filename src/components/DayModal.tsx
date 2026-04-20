'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Record, HABITS, HabitKey, getScore, getScoreColor } from '@/types'
import { upsertRecord, supabase } from '@/lib/db'

interface Props {
  date: Date
  record: Record | null
  onClose: () => void
  onUpdate: (record: Record) => void
  onDelete: (date: string) => void
}

export default function DayModal({ date, record, onClose, onUpdate, onDelete }: Props) {
  const dateStr = format(date, 'yyyy-MM-dd')

  const [habits, setHabits] = useState({
    habit1: record?.habit1 ?? true,
    habit2: record?.habit2 ?? true,
    habit3: record?.habit3 ?? true,
    habit4: record?.habit4 ?? true,
    habit5: record?.habit5 ?? true,
    habit6: record?.habit6 ?? true,
  })
  const [memo, setMemo] = useState(record?.memo || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (record) {
      setHabits({
        habit1: record.habit1,
        habit2: record.habit2,
        habit3: record.habit3,
        habit4: record.habit4,
        habit5: record.habit5,
        habit6: record.habit6,
      })
      setMemo(record.memo || '')
    }
  }, [record])

  const score = [habits.habit1, habits.habit2, habits.habit3, habits.habit4, habits.habit5, habits.habit6].filter(Boolean).length
  const colorKey = getScoreColor(score)

  const scoreColor = colorKey === 'green' ? 'text-sage-500'
    : colorKey === 'yellow' ? 'text-amber-500'
    : 'text-red-500'

  const scoreBg = colorKey === 'green' ? 'bg-sage-100'
    : colorKey === 'yellow' ? 'bg-warm-100'
    : 'bg-blush-100'

  const scoreLabel = colorKey === 'green' ? '🎉 よくできました！'
    : colorKey === 'yellow' ? '👍 まずまずです'
    : '💪 明日がんばろう'

  const toggleHabit = (key: HabitKey) => {
    setHabits(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    setSaving(true)
    const updated = await upsertRecord(dateStr, { ...habits, memo })
    setSaving(false)
    if (updated) {
      onUpdate(updated)
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        onClose()
      }, 1000)
    }
  }

  const handleDelete = async () => {
    if (!record) {
      onClose()
      return
    }
    setDeleting(true)
    const { error } = await supabase.from('records').delete().eq('id', record.id)
    setDeleting(false)
    if (!error) {
      onDelete(dateStr)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center modal-backdrop bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-md bg-cream rounded-t-3xl shadow-2xl animate-slide-up safe-bottom">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-sage-200" />
        </div>

        <div className="px-5 pt-2 pb-4 border-b border-sage-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-sage-700">
                {format(date, 'M月d日（E）', { locale: ja })}
              </div>
              <div className="text-xs text-sage-400 mt-0.5">{scoreLabel}</div>
            </div>
            <div className={`${scoreBg} ${scoreColor} rounded-2xl px-4 py-2 text-center`}>
              <div className="text-2xl font-bold font-mono leading-none">{score}</div>
              <div className="text-xs opacity-70">/6</div>
            </div>
          </div>

          <div className="mt-3 h-2 bg-sage-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                colorKey === 'green' ? 'bg-sage-400' :
                colorKey === 'yellow' ? 'bg-warm-500' :
                'bg-blush-500'
              }`}
              style={{ width: `${(score / 6) * 100}%` }}
            />
          </div>
        </div>

        <div className="px-4 py-3 space-y-2 overflow-y-auto max-h-[50vh]">
          {HABITS.map(({ key, label, detail, emoji }) => {
            const checked = habits[key]
            return (
              <button
                key={key}
                onClick={() => toggleHabit(key)}
                className={`habit-toggle w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                  checked
                    ? 'bg-sage-50 border-sage-200'
                    : 'bg-white border-sage-100 opacity-60'
                }`}
              >
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                  checked
                    ? 'bg-sage-500 border-sage-500'
                    : 'bg-white border-sage-200'
                }`}>
                  {checked && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className={`text-sm font-medium ${checked ? 'text-sage-700' : 'text-sage-400'}`}>
                    <span className="mr-1">{emoji}</span>{label}
                  </div>
                  <div className="text-xs text-sage-400 mt-0.5">{detail}</div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="px-4 pb-3">
          <div className="text-xs font-medium text-sage-500 mb-1.5 flex items-center gap-1">
            <span>📝</span> メモ（任意）
          </div>
          <textarea
            value={memo}
            onChange={e => setMemo(e.target.value)}
            placeholder="今日の気づきや一言メモ..."
            rows={2}
            className="w-full bg-white border border-sage-100 rounded-2xl px-4 py-3 text-sm text-sage-700 placeholder-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-300 transition"
          />
        </div>

        <div className="px-4 pb-6 flex gap-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="py-4 px-5 rounded-2xl font-bold text-base bg-blush-100 text-blush-500 active:opacity-80 disabled:opacity-60"
          >
            {deleting ? '削除中...' : '🗑️'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex-1 py-4 rounded-2xl font-bold text-base transition-all ${
              saved
                ? 'bg-sage-400 text-white'
                : 'bg-sage-500 text-white active:bg-sage-600'
            } disabled:opacity-60`}
          >
            {saving ? '保存中...' : saved ? '✓ 保存しました！' : '保存する'}
          </button>
        </div>
      </div>
    </div>
  )
}