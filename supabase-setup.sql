-- ============================================
-- Supabase テーブル設定
-- ダイエット習慣ログ
-- ============================================

-- records テーブル作成
CREATE TABLE IF NOT EXISTS records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  habit1 BOOLEAN NOT NULL DEFAULT true,
  habit2 BOOLEAN NOT NULL DEFAULT true,
  habit3 BOOLEAN NOT NULL DEFAULT true,
  habit4 BOOLEAN NOT NULL DEFAULT true,
  habit5 BOOLEAN NOT NULL DEFAULT true,
  habit6 BOOLEAN NOT NULL DEFAULT true,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- updated_at を自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_records_updated_at
  BEFORE UPDATE ON records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- インデックス（月別取得の高速化）
CREATE INDEX IF NOT EXISTS records_date_idx ON records(date);

-- Row Level Security を有効化（認証なしで全アクセス許可 ※個人利用前提）
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

-- 全操作を許可するポリシー（個人用アプリ想定）
CREATE POLICY "Allow all operations" ON records
  FOR ALL
  USING (true)
  WITH CHECK (true);
