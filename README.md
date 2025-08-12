# インフォグラフィックアニメーション学習ツール

## 概要
初学者がインフォグラフィックアニメーションの表現手法・活用シーンを体系的かつ視覚的に学べるWebツールです。

## 特徴
- **30種類のアニメーション事例** - 基本グラフ、表現テクニック、用途・シーン別
- **インタラクティブアニメーション** - SVG/CSS/Canvasベースの美しいアニメーション
- **高度な検索・フィルタリング** - キーワード検索、難易度フィルター、カテゴリ絞り込み
- **学習進捗管理** - 閲覧履歴、お気に入り機能
- **レスポンシブデザイン** - PC・タブレット・モバイル完全対応

## ファイル構成
```
/
├── index.html              # メインHTMLファイル
├── styles.css              # メインCSSファイル  
├── script-working.js       # メインJavaScriptファイル
├── data.json              # コンテンツデータ（30事例）
└── assets/
    ├── animations/        # アニメーションファイル
    │   ├── basic-graphs/  # 基本グラフ（10種）
    │   ├── techniques/    # 表現テクニック（10種）
    │   ├── use-cases/     # 用途・シーン別（10種）
    │   └── styles/        # 共通CSSファイル
    ├── thumbnails/        # サムネイル画像
    └── videos/           # 動画ファイル（将来の拡張用）
```

## デプロイ方法

### 1. 静的Webサイトとしてデプロイ
**Apache/Nginx等のWebサーバー：**
- 全ファイルをWebサーバーのドキュメントルートにアップロード
- `index.html`にアクセスするだけで動作

**例（Apache）：**
```bash
# ファイルをアップロード
scp -r * user@server:/var/www/html/infographic-tool/

# ブラウザでアクセス
http://yourserver.com/infographic-tool/
```

### 2. GitHub Pagesでデプロイ
```bash
# GitHubリポジトリを作成後
git init
git add .
git commit -m "Add infographic animation learning tool"
git remote add origin https://github.com/username/infographic-tool.git
git push -u origin main

# GitHub Pages設定
# Settings > Pages > Source: Deploy from a branch > main
```

### 3. Netlify/Vercelでデプロイ
- **Netlify:** プロジェクトフォルダをドラッグ&ドロップでデプロイ
- **Vercel:** GitHubリポジトリを連携してデプロイ

### 4. ローカル開発サーバー
```bash
# Python（推奨）
python3 -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

## 技術要件
- **フロントエンド** - HTML5, CSS3, JavaScript (ES6+)
- **アニメーション** - SVG, CSS Animations, Canvas
- **データ** - JSON
- **レスポンシブ** - CSS Flexbox, Grid
- **互換性** - モダンブラウザ（Chrome, Firefox, Safari, Edge）

## 設定不要項目
- ❌ **データベース** - 不要（JSONファイル使用）
- ❌ **サーバーサイド処理** - 不要（静的サイト）
- ❌ **npm/yarn** - 不要（CDN使用）
- ❌ **ビルドプロセス** - 不要（直接実行）

## ブラウザ対応
- ✅ **Chrome** 80+
- ✅ **Firefox** 75+  
- ✅ **Safari** 13+
- ✅ **Edge** 80+
- ✅ **モバイルブラウザ** 対応

## パフォーマンス
- 初回ロード: ~2秒
- アニメーション切り替え: ~0.5秒
- データ検索: リアルタイム
- ファイルサイズ: 全体 < 5MB

## カスタマイズ
### コンテンツ追加
1. `data.json`に新しいアイテムを追加
2. `assets/animations/`に対応するHTMLファイルを作成
3. 自動的にメニューと検索に反映

### スタイル変更
- `styles.css`でメインスタイルを編集
- `assets/animations/styles/`でアニメーションスタイルを編集

### 機能拡張
- `script-working.js`に新機能を追加
- 既存のクラス構造を活用

## ライセンス
MIT License - 自由に使用・改変・再配布可能

## 作者
Claude Code + Anthropic Claude