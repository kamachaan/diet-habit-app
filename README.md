# 🌿 ダイエット習慣ログ

スマホ最適化されたダイエット習慣管理アプリ。  
1ヶ月カレンダーで6つの食習慣を可視化します。

---

## 📱 機能

- 月別カレンダーで習慣を一覧表示
- 日付タップでモーダル表示（6習慣チェック＋メモ）
- スコア色分け（緑/黄/赤）
- 月間サマリー（平均スコア・習慣別達成率）
- Supabaseへ即時保存

---

## 🚀 セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <your-repo-url>
cd diet-habit-app
npm install
```

---

### 2. Supabase設定

#### 2-1. Supabaseプロジェクト作成

1. [supabase.com](https://supabase.com) にアクセス
2. 「New project」でプロジェクトを作成
3. プロジェクト名・パスワード・リージョン（Tokyo推奨）を設定

#### 2-2. テーブル作成

1. Supabaseダッシュボード → **SQL Editor**
2. 以下のファイルの中身を貼り付けて実行：

```
supabase-setup.sql
```

#### 2-3. APIキーの取得

1. ダッシュボード → **Settings** → **API**
2. 以下の2つをコピー：
   - `Project URL`
   - `anon` `public` キー

---

### 3. 環境変数の設定

プロジェクトルートに `.env.local` を作成：

```bash
cp .env.local.example .env.local
```

`.env.local` を編集：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5c...
```

---

### 4. ローカル起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認

---

## ☁️ Vercelデプロイ手順

### 方法A：GitHub経由（推奨）

1. GitHubにリポジトリをpush
2. [vercel.com](https://vercel.com) → 「Add New Project」
3. GitHubリポジトリを選択してimport
4. **Environment Variables** に以下を追加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. 「Deploy」ボタンをクリック

### 方法B：CLIでデプロイ

```bash
npm i -g vercel
vercel

# 環境変数を設定
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# 本番デプロイ
vercel --prod
```

---

## 📁 ファイル構成

```
src/
├── app/
│   ├── layout.tsx      # ルートレイアウト
│   ├── page.tsx        # メイン画面（カレンダー）
│   └── globals.css     # グローバルスタイル
├── components/
│   ├── DayModal.tsx    # 日付タップモーダル
│   └── Summary.tsx     # 月間サマリー
├── lib/
│   ├── supabase.ts     # Supabaseクライアント
│   └── db.ts           # DB操作関数
└── types/
    └── index.ts        # 型定義・習慣定義
```

---

## 🎨 チェック項目

| # | 習慣 | 基準 |
|---|------|------|
| 1 | 朝整えた？ | 納豆＋味噌汁でOK |
| 2 | タンパク質ベースで食べた？ | 手のひら1枚分以上 |
| 3 | 食べ過ぎ防止できた？ | 8分目＋空腹放置しない |
| 4 | 夜コントロールできた？ | 炭水化物なしor少量 |
| 5 | ドカ食いしてない？ | 満腹以上まで食べていない |
| 6 | 我慢しすぎてない？ | ストレス・反動なし |

---

## 🔒 セキュリティについて

このアプリは個人利用前提のため、RLSポリシーで全アクセスを許可しています。  
複数ユーザーで使う場合は、Supabase Authを追加してください。
