/**
 * Code Viewer Component
 * インフォグラフィックアニメーション学習ツール用コード表示機能
 */

class CodeViewer {
    constructor() {
        this.isVisible = false;
        this.activeTab = 'html';
        this.sourceCode = {
            html: '',
            css: '',
            javascript: ''
        };
        this.init();
    }

    init() {
        this.extractSourceCode();
        this.createViewer();
        this.bindEvents();
    }

    /**
     * 現在のHTMLドキュメントからソースコードを抽出
     */
    extractSourceCode() {
        // HTMLコードの抽出
        this.sourceCode.html = this.formatHTML(document.documentElement.outerHTML);
        
        // CSSコードの抽出
        this.sourceCode.css = this.extractCSS();
        
        // JavaScriptコードの抽出
        this.sourceCode.javascript = this.extractJavaScript();
    }

    /**
     * HTMLコードをフォーマット
     */
    formatHTML(html) {
        // 基本的なフォーマットとクリーンアップ
        return html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // script tags remove
            .replace(/\s*data-[^=]*="[^"]*"/g, '') // data attributes remove
            .replace(/\s+/g, ' ') // multiple spaces to single
            .replace(/>\s*</g, '>\n<') // add line breaks
            .replace(/^/, '') // trim start
            .trim();
    }

    /**
     * CSSコードを抽出
     */
    extractCSS() {
        let cssContent = '';
        
        // 内部スタイルシート
        const styleElements = document.querySelectorAll('style');
        styleElements.forEach(style => {
            if (style.textContent.trim()) {
                cssContent += style.textContent.trim() + '\n\n';
            }
        });

        // 外部スタイルシート（実際の内容は取得できないため、参考として記載）
        const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
        if (linkElements.length > 0) {
            cssContent += '/* 外部CSSファイル */\n';
            linkElements.forEach(link => {
                cssContent += `/* ${link.href} */\n`;
            });
            cssContent += '\n/* 実際のスタイルはブラウザの開発者ツールで確認してください */\n\n';
        }

        // 基本的なチャートスタイルをサンプルとして追加
        cssContent += this.generateSampleCSS();
        
        return cssContent || '/* CSSスタイルが見つかりませんでした */';
    }

    /**
     * JavaScriptコードを抽出
     */
    extractJavaScript() {
        let jsContent = '';
        
        // 内部スクリプト
        const scriptElements = document.querySelectorAll('script:not([src])');
        scriptElements.forEach(script => {
            if (script.textContent.trim() && !script.textContent.includes('CodeViewer')) {
                jsContent += script.textContent.trim() + '\n\n';
            }
        });

        return jsContent || '/* JavaScriptコードが見つかりませんでした */';
    }

    /**
     * サンプルCSSを生成
     */
    generateSampleCSS() {
        return `/* チャート共通スタイル */
.chart-svg {
    width: 100%;
    height: 100%;
}

.grid-line {
    stroke: #e0e0e0;
    stroke-width: 1;
    stroke-dasharray: 2,2;
}

.axis {
    stroke: #333;
    stroke-width: 2;
}

.bar {
    transition: opacity 0.3s ease;
    cursor: pointer;
}

.bar:hover {
    opacity: 0.8;
}

.tooltip {
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 4px;
    font-size: 12px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 1000;
}

.tooltip.show {
    opacity: 1;
}`;
    }

    /**
     * コードビューアーのHTMLを作成
     */
    createViewer() {
        const viewerHTML = `
            <div class="code-viewer-container">
                <div class="code-viewer-toggle">
                    <button class="code-view-btn" id="codeViewToggle" 
                            aria-expanded="false" 
                            aria-controls="codePanel"
                            aria-describedby="codeViewerDescription">
                        <span class="icon-code"></span>
                        コードを見る
                    </button>
                    <div id="codeViewerDescription" class="sr-only">
                        このボタンを押すとアニメーションのソースコードを表示できます
                    </div>
                </div>
                
                <div class="code-panel" id="codePanel" role="region" aria-labelledby="codeViewToggle" aria-hidden="true">
                    <div class="code-tabs" role="tablist" aria-label="コード表示タブ">
                        <button class="code-tab active" data-tab="html" role="tab" 
                                aria-selected="true" aria-controls="htmlTab" tabindex="0">HTML</button>
                        <button class="code-tab" data-tab="css" role="tab"
                                aria-selected="false" aria-controls="cssTab" tabindex="-1">CSS</button>
                        <button class="code-tab" data-tab="javascript" role="tab"
                                aria-selected="false" aria-controls="jsTab" tabindex="-1">JavaScript</button>
                        <button class="code-tab" data-tab="all" role="tab"
                                aria-selected="false" aria-controls="allTab" tabindex="-1">すべて</button>
                    </div>
                    
                    <div class="code-content">
                        <div class="code-actions" role="toolbar" aria-label="コード操作ツール">
                            <button class="code-action-btn" id="copyCode" 
                                    aria-label="現在のコードをクリップボードにコピー" title="コピー">
                                <span class="icon-copy"></span>
                                コピー
                            </button>
                            <button class="code-action-btn" id="downloadCode" 
                                    aria-label="現在のコードをファイルとしてダウンロード" title="ダウンロード">
                                <span class="icon-download"></span>
                                ダウンロード
                            </button>
                            <button class="code-action-btn" id="fullscreenCode" 
                                    aria-label="コードを全画面で表示" title="全画面表示">
                                <span class="icon-expand"></span>
                                全画面
                            </button>
                        </div>
                        
                        <div class="code-block active" data-lang="html" id="htmlTab" role="tabpanel" aria-labelledby="html-tab">
                            <pre tabindex="0"><code class="language-html">${this.escapeHtml(this.sourceCode.html)}</code></pre>
                        </div>
                        
                        <div class="code-block" data-lang="css" id="cssTab" role="tabpanel" aria-labelledby="css-tab" aria-hidden="true">
                            <pre tabindex="0"><code class="language-css">${this.escapeHtml(this.sourceCode.css)}</code></pre>
                        </div>
                        
                        <div class="code-block" data-lang="javascript" id="jsTab" role="tabpanel" aria-labelledby="js-tab" aria-hidden="true">
                            <pre tabindex="0"><code class="language-javascript">${this.escapeHtml(this.sourceCode.javascript)}</code></pre>
                        </div>
                        
                        <div class="code-block" data-lang="all" id="allTab" role="tabpanel" aria-labelledby="all-tab" aria-hidden="true">
                            <pre tabindex="0"><code class="language-html">&lt;!-- HTML --&gt;
${this.escapeHtml(this.sourceCode.html)}

&lt;style&gt;
/* CSS */
${this.escapeHtml(this.sourceCode.css)}
&lt;/style&gt;

&lt;script&gt;
// JavaScript
${this.escapeHtml(this.sourceCode.javascript)}
&lt;/script&gt;</code></pre>
                        </div>
                    </div>
                </div>
                
                <!-- Fullscreen Modal -->
                <div class="code-fullscreen-modal" id="fullscreenModal">
                    <div class="code-fullscreen-content">
                        <div class="code-fullscreen-header">
                            <div class="code-fullscreen-title">コード表示 - <span id="fullscreenLang">HTML</span></div>
                            <button class="code-fullscreen-close" id="closeFullscreen">
                                <span class="icon-close"></span>
                            </button>
                        </div>
                        <div class="code-fullscreen-body">
                            <div class="code-fullscreen-tabs">
                                <button class="code-tab active" data-tab="html">HTML</button>
                                <button class="code-tab" data-tab="css">CSS</button>
                                <button class="code-tab" data-tab="javascript">JavaScript</button>
                                <button class="code-tab" data-tab="all">すべて</button>
                            </div>
                            <div id="fullscreenCodeContent">
                                <pre><code class="language-html">${this.escapeHtml(this.sourceCode.html)}</code></pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // アニメーションコンテナに追加
        const animationContainer = document.querySelector('.animation-container');
        if (animationContainer) {
            animationContainer.insertAdjacentHTML('beforeend', viewerHTML);
        }
    }

    /**
     * イベントバインディング
     */
    bindEvents() {
        // トグルボタン
        const toggleBtn = document.getElementById('codeViewToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleViewer());
        }

        // タブ切り替え
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('code-tab')) {
                this.switchTab(e.target.dataset.tab);
            }
        });

        // アクションボタン
        const copyBtn = document.getElementById('copyCode');
        const downloadBtn = document.getElementById('downloadCode');
        const fullscreenBtn = document.getElementById('fullscreenCode');
        const closeBtn = document.getElementById('closeFullscreen');

        if (copyBtn) copyBtn.addEventListener('click', () => this.copyCode());
        if (downloadBtn) downloadBtn.addEventListener('click', () => this.downloadCode());
        if (fullscreenBtn) fullscreenBtn.addEventListener('click', () => this.openFullscreen());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeFullscreen());

        // キーボードナビゲーション
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeFullscreen();
            }
            
            // タブキーでコードタブ間を移動
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                const activeTab = document.querySelector('.code-tab:focus');
                if (activeTab) {
                    e.preventDefault();
                    this.navigateTabs(e.key === 'ArrowRight' ? 1 : -1);
                }
            }
            
            // Enterキーでタブ選択
            if (e.key === 'Enter' || e.key === ' ') {
                const activeTab = document.querySelector('.code-tab:focus');
                if (activeTab) {
                    e.preventDefault();
                    this.switchTab(activeTab.dataset.tab);
                }
            }
        });
    }

    /**
     * ビューアーの表示切り替え
     */
    toggleViewer() {
        const panel = document.getElementById('codePanel');
        const button = document.getElementById('codeViewToggle');
        
        if (!panel || !button) return;

        this.isVisible = !this.isVisible;
        
        if (this.isVisible) {
            panel.classList.add('show');
            button.classList.add('active');
            button.innerHTML = '<span class="icon-code"></span>コードを隠す';
            
            // シンタックスハイライト適用
            this.applySyntaxHighlighting();
        } else {
            panel.classList.remove('show');
            button.classList.remove('active');
            button.innerHTML = '<span class="icon-code"></span>コードを見る';
        }
    }

    /**
     * タブ切り替え
     */
    switchTab(tabName) {
        // アクティブなタブを更新
        document.querySelectorAll('.code-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            }
        });

        // アクティブなコードブロックを更新
        document.querySelectorAll('.code-block').forEach(block => {
            block.classList.remove('active');
            if (block.dataset.lang === tabName) {
                block.classList.add('active');
            }
        });

        this.activeTab = tabName;
        this.updateTabAccessibility(tabName);
        this.applySyntaxHighlighting();
    }

    /**
     * タブナビゲーション（キーボード用）
     */
    navigateTabs(direction) {
        const tabs = Array.from(document.querySelectorAll('.code-tab'));
        const currentIndex = tabs.findIndex(tab => tab === document.activeElement);
        let nextIndex = currentIndex + direction;
        
        if (nextIndex < 0) nextIndex = tabs.length - 1;
        if (nextIndex >= tabs.length) nextIndex = 0;
        
        tabs[nextIndex].focus();
    }

    /**
     * アクセシビリティ属性の更新
     */
    updateTabAccessibility(activeTab) {
        // タブボタンの更新
        document.querySelectorAll('.code-tab').forEach(tab => {
            const isActive = tab.dataset.tab === activeTab;
            tab.setAttribute('aria-selected', isActive);
            tab.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        // コンテンツパネルの更新
        document.querySelectorAll('.code-block').forEach(block => {
            const isActive = block.dataset.lang === activeTab;
            block.setAttribute('aria-hidden', !isActive);
        });

        // メインパネルのaria-expanded更新
        const toggleButton = document.getElementById('codeViewToggle');
        if (toggleButton) {
            toggleButton.setAttribute('aria-expanded', this.isVisible);
        }

        // パネルのaria-hidden更新
        const panel = document.getElementById('codePanel');
        if (panel) {
            panel.setAttribute('aria-hidden', !this.isVisible);
        }
    }

    /**
     * コードをクリップボードにコピー
     */
    async copyCode() {
        const activeBlock = document.querySelector('.code-block.active code');
        if (!activeBlock) return;

        const text = activeBlock.textContent;
        
        try {
            await navigator.clipboard.writeText(text);
            this.showCopySuccess();
        } catch (err) {
            // フォールバック方法
            this.fallbackCopyTextToClipboard(text);
        }
    }

    /**
     * コピー成功表示
     */
    showCopySuccess() {
        const copyBtn = document.getElementById('copyCode');
        if (copyBtn) {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span class="icon-check"></span>コピー完了';
            copyBtn.classList.add('success');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.classList.remove('success');
            }, 2000);
        }
    }

    /**
     * フォールバックコピー方法
     */
    fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopySuccess();
        } catch (err) {
            console.error('コピーに失敗しました', err);
        }
        
        document.body.removeChild(textArea);
    }

    /**
     * コードファイルをダウンロード
     */
    downloadCode() {
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `infographic-code-${timestamp}`;
        
        if (this.activeTab === 'all') {
            this.downloadAllFiles(filename);
        } else {
            this.downloadSingleFile(filename);
        }
    }

    /**
     * 単一ファイルダウンロード
     */
    downloadSingleFile(baseFilename) {
        const extensions = { html: 'html', css: 'css', javascript: 'js' };
        const extension = extensions[this.activeTab];
        const content = this.sourceCode[this.activeTab];
        
        this.createDownload(`${baseFilename}.${extension}`, content);
    }

    /**
     * 全ファイルダウンロード（ZIPとして）
     */
    downloadAllFiles(baseFilename) {
        // 簡単な方法として、全コードを1つのHTMLファイルにまとめる
        const combinedContent = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Infographic Animation Code</title>
    <style>
${this.sourceCode.css}
    </style>
</head>
<body>
${this.sourceCode.html}

    <script>
${this.sourceCode.javascript}
    </script>
</body>
</html>`;
        
        this.createDownload(`${baseFilename}-complete.html`, combinedContent);
    }

    /**
     * ダウンロード実行
     */
    createDownload(filename, content) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(link.href);
    }

    /**
     * フルスクリーン表示を開く
     */
    openFullscreen() {
        const modal = document.getElementById('fullscreenModal');
        const langSpan = document.getElementById('fullscreenLang');
        const content = document.getElementById('fullscreenCodeContent');
        
        if (!modal || !content) return;

        const activeBlock = document.querySelector('.code-block.active');
        if (activeBlock) {
            content.innerHTML = activeBlock.innerHTML;
            langSpan.textContent = this.activeTab.toUpperCase();
        }

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    /**
     * フルスクリーン表示を閉じる
     */
    closeFullscreen() {
        const modal = document.getElementById('fullscreenModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    /**
     * シンタックスハイライト適用
     */
    applySyntaxHighlighting() {
        // Prism.jsが利用可能な場合のみ実行
        if (typeof Prism !== 'undefined') {
            setTimeout(() => {
                Prism.highlightAll();
            }, 100);
        }
    }

    /**
     * HTMLエスケープ
     */
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    // Prism.jsの読み込み完了を待つ
    const initCodeViewer = () => {
        new CodeViewer();
    };

    // Prism.jsが既に読み込まれているかチェック
    if (typeof Prism !== 'undefined') {
        initCodeViewer();
    } else {
        // Prism.jsの読み込みを待つ
        const checkPrism = setInterval(() => {
            if (typeof Prism !== 'undefined') {
                clearInterval(checkPrism);
                initCodeViewer();
            }
        }, 100);
        
        // 3秒後にタイムアウト（Prism.jsがなくても動作させる）
        setTimeout(() => {
            clearInterval(checkPrism);
            if (typeof Prism === 'undefined') {
                initCodeViewer();
            }
        }, 3000);
    }
});