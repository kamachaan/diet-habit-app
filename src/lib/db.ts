import { supabase } from './supabase'
import { Record } from '@/types'
import { format } from 'date-fns'

export async function getRecordsByMonth(year: number, month: number): Promise<Record[]> {
  const startDate = format(new Date(year, month - 1, 1), 'yyyy-MM-dd')
  const endDate = format(new Date(year, month, 0), 'yyyy-MM-dd')

  const { data, error } = await supabase
    .from('records')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching records:', error)
    return []
  }

  return data || []
}

export async function getOrCreateRecord(date: string): Promise<Record | null> {
  // Try to fetch existing record
  const { data: existing } = await supabase
    .from('records')
    .select('*')
    .eq('date', date)
    .single()

  if (existing) return existing

  // Create new record with all habits true
  const newRecord = {
    date,
    habit1: true,
    habit2: true,
    habit3: true,
    habit4: true,
    habit5: true,
    habit6: true,
    memo: null,
  }

  const { data, error } = await supabase
    .from('records')
    .insert(newRecord)
    .select()
    .single()

  if (error) {
    console.error('Error creating record:', error)
    return null
  }

  return data
}

export async function updateRecord(id: string, updates: Partial<Record>): Promise<Record | null> {
  const { data, error } = await supabase
    .from('records')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating record:', error)
    return null
  }

  return data
}

export async function upsertRecord(date: string, updates: Partial<Omit<Record, 'id' | 'date'>>): Promise<Record | null> {
  const { data, error } = await supabase
    .from('records')
    .upsert({ date, ...updates }, { onConflict: 'date' })
    .select()
    .single()

  if (error) {
    console.error('Error upserting record:', error)
    return null
  }

  return data
}
