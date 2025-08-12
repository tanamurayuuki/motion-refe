# コードビューアー機能 - 使用ガイド

インフォグラフィックアニメーション学習ツールに統合されたコード表示機能の使用方法とカスタマイズガイドです。

## 🚀 機能概要

### 主要機能
- **タブ形式表示**: HTML、CSS、JavaScript、すべてを別タブで表示
- **シンタックスハイライト**: Prism.jsによる美しいコードハイライト
- **ワンクリックコピー**: Clipboard APIを使用したコード一括コピー
- **ダウンロード機能**: 単体ファイルまたは統合HTMLファイルとしてダウンロード
- **フルスクリーン表示**: コードを全画面で見やすく表示
- **レスポンシブ対応**: モバイル・タブレット・デスクトップに最適化
- **アクセシビリティ**: WCAG準拠のキーボードナビゲーションとスクリーンリーダー対応

### ユーザーエクスペリエンス
- **簡単な操作**: 「コードを見る」ボタン一つで即座にコード表示
- **学習効率向上**: 実際のアニメーションとコードを並べて学習可能
- **カスタマイズ可能**: テーマやレイアウトの調整が簡単

## 📁 ファイル構造

```
assets/animations/
├── styles/
│   ├── animations.css      # 既存のアニメーションスタイル
│   ├── charts.css          # 既存のチャートスタイル
│   └── code-viewer.css     # 🆕 コードビューアー専用CSS
├── scripts/
│   ├── prism-setup.js      # 🆕 Prism.jsセットアップスクリプト
│   └── code-viewer.js      # 🆕 メインのコードビューアー機能
└── basic-graphs/
    ├── bar-chart.html      # ✅ 統合済み
    ├── line-chart.html     # ✅ 統合済み
    ├── pie-chart.html      # ✅ 統合済み
    └── ...
```

## 🛠 インストール・統合方法

### 1. 新しいアニメーションファイルへの統合

既存のアニメーションHTMLファイルに以下を追加：

```html
<!-- head内のCSS読み込み部分に追加 -->
<link rel="stylesheet" href="../styles/code-viewer.css">

<!-- body閉じタグ直前に追加 -->
<script src="../scripts/prism-setup.js"></script>
<script src="../scripts/code-viewer.js"></script>
```

### 2. 相対パス調整

ファイル階層に応じて相対パスを調整してください：

```html
<!-- basic-graphs/ フォルダの場合 -->
<link rel="stylesheet" href="../styles/code-viewer.css">
<script src="../scripts/code-viewer.js"></script>

<!-- techniques/ フォルダの場合 -->
<link rel="stylesheet" href="../styles/code-viewer.css">
<script src="../scripts/code-viewer.js"></script>

<!-- use-cases/ フォルダの場合 -->
<link rel="stylesheet" href="../styles/code-viewer.css">
<script src="../scripts/code-viewer.js"></script>
```

## 🎨 UI構成とコンポーネント

### 基本レイアウト
```
[アニメーション表示エリア]
[再生コントロールパネル]
┌─────────────────────────────┐
│     [コードを見る] ボタン        │
└─────────────────────────────┘
┌─────────────────────────────┐
│ [HTML] [CSS] [JavaScript] [すべて] │ ← タブメニュー
├─────────────────────────────┤
│ シンタックスハイライト付きコード   │
│ スクロール可能エリア             │
│                              │
└─────────────────────────────┘
│ [📋コピー] [⬇️DL] [⛶全画面] │ ← アクション
└─────────────────────────────┘
```

### コンポーネント詳細

#### 1. トグルボタン
- **機能**: コードパネルの表示・非表示切り替え
- **スタイル**: グラデーション背景、ホバーアニメーション
- **アクセシビリティ**: `aria-expanded`, `aria-controls`属性

#### 2. タブナビゲーション
- **構成**: HTML, CSS, JavaScript, すべて
- **キーボード操作**: 矢印キーで移動、Enter/Spaceで選択
- **視覚的フィードバック**: アクティブタブのハイライト

#### 3. コードエリア
- **シンタックスハイライト**: Prism.js Tomorrow Nightテーマ
- **スクロール**: 縦・横スクロール対応
- **フォーカス管理**: tabindex="0"でキーボードアクセス可能

#### 4. アクションボタン
- **コピー**: Clipboard API使用、フォールバック付き
- **ダウンロード**: Blob API使用、複数形式対応
- **全画面**: モーダル表示、ESCキーで終了

## ⚙️ カスタマイズガイド

### 1. テーマ変更

```css
/* カスタムカラーテーマ */
.code-panel {
    background: #1e1e1e; /* ダークグレー */
}

.code-block pre {
    background: #0d1117; /* GitHub Dark */
    color: #c9d1d9;
}

/* ライトテーマ */
.code-panel.light-theme {
    background: #ffffff;
}
.code-panel.light-theme .code-block pre {
    background: #f6f8fa;
    color: #24292f;
}
```

### 2. レイアウト調整

```css
/* コンパクト表示 */
.code-viewer-container.compact .code-panel {
    margin-top: 15px;
}

.code-viewer-container.compact .code-block pre {
    max-height: 300px; /* 高さ制限 */
}

/* ワイド表示 */
.code-viewer-container.wide {
    max-width: 1200px;
}
```

### 3. 機能の無効化

```javascript
// 特定機能の無効化例
class CustomCodeViewer extends CodeViewer {
    constructor() {
        super();
        this.disableDownload = true; // ダウンロード機能無効
        this.disableFullscreen = false; // フルスクリーン有効
    }
}
```

## 🔧 高度な設定

### 1. Prism.js設定変更

```javascript
// prism-setup.js内で設定変更
function setupPrismConfig() {
    if (typeof Prism !== 'undefined') {
        // 行番号表示を有効化
        Prism.plugins.lineNumbers.config = {
            startFrom: 1
        };
        
        // コピーボタンを有効化
        Prism.plugins.toolbar.registerButton('copy-to-clipboard', {
            text: 'コピー',
            onClick: function (env) {
                // カスタムコピー処理
            }
        });
    }
}
```

### 2. コード抽出のカスタマイズ

```javascript
// code-viewer.js内のextractSourceCodeメソッドをオーバーライド
class CustomCodeViewer extends CodeViewer {
    extractCSS() {
        // カスタムCSS抽出ロジック
        let cssContent = super.extractCSS();
        
        // 独自の処理を追加
        cssContent += this.getCustomStyles();
        
        return cssContent;
    }
    
    getCustomStyles() {
        return `
/* カスタムスタイル */
.custom-element {
    color: #special;
}`;
    }
}
```

## 📱 レスポンシブ対応

### ブレイクポイント
- **Desktop**: 1024px以上 - フル機能
- **Tablet**: 768px-1023px - コンパクト表示
- **Mobile**: 767px以下 - モバイル最適化

### モバイル最適化機能
```css
@media (max-width: 768px) {
    /* タブを縦スタック */
    .code-tabs {
        flex-direction: column;
    }
    
    /* フォントサイズ調整 */
    .code-block pre {
        font-size: 12px;
        line-height: 1.4;
    }
    
    /* フルスクリーンをフル画面に */
    .code-fullscreen-content {
        width: 100vw;
        height: 100vh;
        border-radius: 0;
    }
}
```

## ♿ アクセシビリティ機能

### キーボードナビゲーション
- **Tab**: フォーカス移動
- **矢印キー**: タブ間移動
- **Enter/Space**: タブ選択
- **Escape**: フルスクリーン終了

### スクリーンリーダー対応
- **ARIA属性**: role, aria-label, aria-expanded
- **セマンティック構造**: header, main, button要素
- **説明テキスト**: .sr-onlyクラスで追加情報

### カラーアクセシビリティ
```css
/* ハイコントラスト対応 */
@media (prefers-contrast: high) {
    .code-tab.active {
        background: HighlightText;
        color: Highlight;
        border: 2px solid currentColor;
    }
}

/* 色覚対応 */
.color-blind-friendly .syntax-error {
    background: #ffeeee;
    border-left: 4px solid #ff0000;
    text-decoration: underline;
}
```

## 🐛 トラブルシューティング

### よくある問題と解決方法

#### 1. シンタックスハイライトが効かない
```javascript
// 解決方法: 手動でPrism.js再実行
setTimeout(() => {
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
}, 500);
```

#### 2. コピー機能が動作しない
```javascript
// 解決方法: HTTPSまたはlocalhostで実行
// または フォールバック方法を使用
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
}
```

#### 3. CDNが読み込めない
```html
<!-- 解決方法: ローカルファイル使用 -->
<script src="assets/lib/prism/prism.min.js"></script>
<link rel="stylesheet" href="assets/lib/prism/prism.min.css">
```

### パフォーマンス最適化

#### 1. 遅延読み込み
```javascript
// 大きなファイルの遅延読み込み
class LazyCodeViewer extends CodeViewer {
    init() {
        // ユーザーがボタンを押すまで初期化を遅延
        document.getElementById('codeViewToggle').addEventListener('click', () => {
            if (!this.initialized) {
                super.init();
                this.initialized = true;
            }
        });
    }
}
```

#### 2. コード最小化
```javascript
// 不要な空白・コメント削除
extractJavaScript() {
    let jsContent = super.extractJavaScript();
    return jsContent
        .replace(/\/\*[\s\S]*?\*\//g, '') // コメント削除
        .replace(/\s+/g, ' ') // 空白最小化
        .trim();
}
```

## 📄 ライセンス・クレジット

### 使用ライブラリ
- **Prism.js**: MIT License - https://prismjs.com/
- **Clipboard API**: Web標準API

### カスタムコード
- **MIT License**で提供
- 改変・再配布自由

## 🔄 更新履歴

### v1.0.0 (2024-08-12)
- ✅ 基本的なコード表示機能
- ✅ シンタックスハイライト
- ✅ コピー・ダウンロード機能
- ✅ フルスクリーン表示
- ✅ レスポンシブ対応
- ✅ アクセシビリティ対応

### 今後の予定
- 🔄 CodePen連携
- 🔄 編集可能モード
- 🔄 コード説明機能
- 🔄 多言語対応

## 📞 サポート

### 技術サポート
- GitHub Issues: (プロジェクトリポジトリ)
- 技術ドキュメント: このファイル

### カスタマイズ相談
- 個別カスタマイズはプロジェクト要件に応じて対応可能

---

**🎉 コードビューアー機能の統合が完了しました！**

これで学習者は実際のアニメーションを見ながら、その背後にあるコードを簡単に確認・学習できます。