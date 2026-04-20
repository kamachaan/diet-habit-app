'use client'

import { useState, useEffect, useCallback } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday } from 'date-fns'
import { ja } from 'date-fns/locale'
import { getRecordsByMonth, getOrCreateRecord } from '@/lib/db'
import { Record, getScore, getScoreColor } from '@/types'
import DayModal from '@/components/DayModal'
import Summary from '@/components/Summary'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [records, setRecords] = useState<Record[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSummary, setShowSummary] = useState(false)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    const data = await getRecordsByMonth(year, month)
    setRecords(data)
    setLoading(false)
  }, [year, month])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start, end })
    const startPadding = getDay(start)
    return { days, startPadding }
  }

  const getRecordForDate = (date: Date): Record | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return records.find(r => r.date === dateStr)
  }

  const handleDayClick = async (date: Date) => {
    setSelectedDate(date)
    const dateStr = format(date, 'yyyy-MM-dd')
    let record = records.find(r => r.date === dateStr)
    if (!record) {
      record = await getOrCreateRecord(dateStr) || undefined
      if (record) setRecords(prev => [...prev, record!])
    }
    setSelectedRecord(record || null)
  }

  const handleRecordUpdate = (updated: Record) => {
    setRecords(prev => prev.map(r => r.id === updated.id ? updated : r))
    setSelectedRecord(updated)
  }

  const handleCloseModal = () => {
    setSelectedDate(null)
    setSelectedRecord(null)
  }

  const { days, startPadding } = getDaysInMonth()

  const totalDays = records.length
  const avgScore = totalDays > 0
    ? Math.round((records.reduce((sum, r) => sum + getScore(r), 0) / totalDays) * 10) / 10
    : 0

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-cream/90 backdrop-blur-sm border-b border-sage-100">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-sage-700 tracking-tight">🌿 習慣ログ</h1>
            <p className="text-xs text-sage-400 font-light">ダイエット記録</p>
          </div>
          <button
            onClick={() => setShowSummary(true)}
            className="flex items-center gap-1.5 bg-sage-500 text-white text-xs font-medium px-3 py-2 rounded-full shadow-sm active:opacity-80"
          >
            <span>📊</span><span>まとめ</span>
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pb-8">
        {/* Month nav */}
        <div className="flex items-center justify-between py-4">
          <button onClick={() => setCurrentDate(new Date(year, month - 2, 1))}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-sage-100 text-sage-600 active:bg-sage-200 text-xl">‹</button>
          <div className="text-center">
            <div className="text-xl font-bold text-sage-700">{format(currentDate, 'M月', { locale: ja })}</div>
            <div className="text-xs text-sage-400">{year}</div>
          </div>
          <button onClick={() => setCurrentDate(new Date(year, month, 1))}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-sage-100 text-sage-600 active:bg-sage-200 text-xl">›</button>
        </div>

        {/* Stats bar */}
        {totalDays > 0 && (
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-4 bg-white rounded-2xl px-5 py-2.5 shadow-sm border border-sage-100">
              <div className="text-center">
                <div className="text-xs text-sage-400 mb-0.5">月平均スコア</div>
                <div className="text-2xl font-bold font-mono text-sage-600">{avgScore}<span className="text-sm font-normal text-sage-400">/6</span></div>
              </div>
              <div className="text-sage-200 text-lg">|</div>
              <div className="text-center">
                <div className="text-xs text-sage-400 mb-0.5">記録日数</div>
                <div className="text-2xl font-bold font-mono text-sage-600">{totalDays}<span className="text-sm font-normal text-sage-400">日</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((day, i) => (
            <div key={day} className={`text-center text-xs font-medium py-1.5 ${i === 0 ? 'text-blush-500' : i === 6 ? 'text-blue-400' : 'text-sage-400'}`}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar */}
        {loading ? (
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-sage-50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: startPadding }).map((_, i) => <div key={`p${i}`} className="aspect-square" />)}
            {days.map((day) => {
              const record = getRecordForDate(day)
              const score = record ? getScore(record) : null
              const colorKey = score !== null ? getScoreColor(score) : null
              return (
                <DayCell
                  key={day.toISOString()}
                  day={day.getDate()}
                  dayOfWeek={getDay(day)}
                  score={score}
                  colorKey={colorKey}
                  isToday={isToday(day)}
                  onClick={() => handleDayClick(day)}
                />
              )
            })}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4">
          {[
            { color: 'bg-sage-400', label: '5〜6' },
            { color: 'bg-warm-500', label: '3〜4' },
            { color: 'bg-blush-500', label: '0〜2' },
            { color: 'bg-sage-200', label: '未記録' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${color}`} />
              <span className="text-xs text-sage-400">{label}</span>
            </div>
          ))}
        </div>
      </main>

      {selectedDate && (
        <DayModal
          date={selectedDate}
          record={selectedRecord}
          onClose={handleCloseModal}
          onUpdate={handleRecordUpdate}
        />
      )}
      {showSummary && (
        <Summary records={records} month={month} year={year} onClose={() => setShowSummary(false)} />
      )}
    </div>
  )
}

interface DayCellProps {
  day: number
  dayOfWeek: number
  score: number | null
  colorKey: string | null
  isToday: boolean
  onClick: () => void
}

function DayCell({ day, dayOfWeek, score, colorKey, isToday, onClick }: DayCellProps) {
  const bg = colorKey === 'green' ? 'bg-sage-100 border-sage-300'
    : colorKey === 'yellow' ? 'bg-warm-100 border-amber-300/40'
    : colorKey === 'red' ? 'bg-blush-100 border-red-300/40'
    : 'bg-white border-sage-100'

  const dotColor = colorKey === 'green' ? 'bg-sage-400'
    : colorKey === 'yellow' ? 'bg-warm-500'
    : colorKey === 'red' ? 'bg-blush-500'
    : 'bg-sage-200'

  const scoreText = colorKey === 'green' ? 'text-sage-600'
    : colorKey === 'yellow' ? 'text-amber-600'
    : colorKey === 'red' ? 'text-red-500'
    : 'text-sage-300'

  const dayText = dayOfWeek === 0 ? 'text-blush-500' : dayOfWeek === 6 ? 'text-blue-400' : 'text-sage-700'

  return (
    <button
      onClick={onClick}
      className={`calendar-cell aspect-square rounded-xl border ${bg} flex flex-col items-center justify-center gap-0.5 relative ${isToday ? 'ring-2 ring-sage-500 ring-offset-1' : ''}`}
    >
      {isToday && <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-sage-500 today-pulse" />}
      <span className={`text-xs font-medium leading-none ${dayText} ${isToday ? 'font-bold' : ''}`}>{day}</span>
      {score !== null ? (
        <>
          <span className={`font-mono text-xs font-bold leading-none ${scoreText}`}>{score}/6</span>
          <div className="flex gap-px mt-0.5">
            {[0,1,2,3,4,5].map(i => (
              <div key={i} className={`w-1 h-1 rounded-full ${i < score ? dotColor : 'bg-sage-200'}`} />
            ))}
          </div>
        </>
      ) : (
        <div className="w-1.5 h-1.5 rounded-full bg-sage-100 mt-0.5" />
      )}
    </button>
  )
}
