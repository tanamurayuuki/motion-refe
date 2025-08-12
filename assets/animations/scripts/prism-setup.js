/**
 * Prism.js Setup for Code Viewer
 * シンタックスハイライト用のPrism.jsセットアップスクリプト
 */

(function() {
    'use strict';

    /**
     * Prism.jsライブラリをCDNから読み込み
     */
    function loadPrismLibrary() {
        return new Promise((resolve, reject) => {
            // CSS読み込み（ダークテーマ）
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
            cssLink.onerror = () => reject(new Error('Failed to load Prism CSS'));
            document.head.appendChild(cssLink);

            // Core JS読み込み
            const coreScript = document.createElement('script');
            coreScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js';
            coreScript.onload = () => {
                loadLanguageComponents().then(resolve).catch(reject);
            };
            coreScript.onerror = () => reject(new Error('Failed to load Prism core'));
            document.head.appendChild(coreScript);
        });
    }

    /**
     * 必要な言語コンポーネントを読み込み
     */
    function loadLanguageComponents() {
        const components = [
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-markup.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-css.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-markup-templating.min.js'
        ];

        return Promise.all(components.map(src => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = () => reject(new Error(`Failed to load ${src}`));
                document.head.appendChild(script);
            });
        }));
    }

    /**
     * プラグインを読み込み（オプション）
     */
    function loadPrismPlugins() {
        const plugins = [
            {
                css: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css',
                js: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js'
            },
            {
                js: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js'
            },
            {
                css: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/toolbar/prism-toolbar.min.css',
                js: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/toolbar/prism-toolbar.min.js'
            }
        ];

        plugins.forEach(plugin => {
            if (plugin.css) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = plugin.css;
                document.head.appendChild(link);
            }
            
            if (plugin.js) {
                const script = document.createElement('script');
                script.src = plugin.js;
                document.head.appendChild(script);
            }
        });
    }

    /**
     * カスタムPrism設定
     */
    function setupPrismConfig() {
        // Prismが読み込まれた後に設定を適用
        if (typeof Prism !== 'undefined') {
            // 自動ハイライトを無効化（手動制御のため）
            Prism.manual = true;
            
            // カスタムフックを追加
            Prism.hooks.add('before-highlight', function(env) {
                // コードの前処理
                if (env.code) {
                    env.code = env.code.trim();
                }
            });

            Prism.hooks.add('after-highlight', function(env) {
                // ハイライト後の処理
                if (env.element && env.element.parentNode) {
                    env.element.parentNode.classList.add('prism-highlighted');
                }
            });

            console.log('Prism.js setup completed');
        }
    }

    /**
     * フォールバック用シンタックスハイライト
     * Prism.jsが読み込めない場合の基本的なハイライト
     */
    function fallbackHighlighter() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(block => {
            const lang = block.className.match(/language-(\w+)/);
            if (lang) {
                applyBasicHighlighting(block, lang[1]);
            }
        });
    }

    /**
     * 基本的なシンタックスハイライト（フォールバック）
     */
    function applyBasicHighlighting(element, language) {
        let content = element.innerHTML;
        
        switch (language) {
            case 'html':
                content = content
                    .replace(/(&lt;[^&]*&gt;)/g, '<span class="html-tag">$1</span>')
                    .replace(/(\w+)=/g, '<span class="html-attr">$1</span>=');
                break;
                
            case 'css':
                content = content
                    .replace(/([.#]\w+)/g, '<span class="css-selector">$1</span>')
                    .replace(/(\w+):/g, '<span class="css-property">$1</span>:')
                    .replace(/(#[0-9a-fA-F]{3,6})/g, '<span class="css-color">$1</span>');
                break;
                
            case 'javascript':
                content = content
                    .replace(/\b(function|const|let|var|if|else|for|while|return)\b/g, '<span class="js-keyword">$1</span>')
                    .replace(/\b(\d+)\b/g, '<span class="js-number">$1</span>')
                    .replace(/(\/\/.*$)/gm, '<span class="js-comment">$1</span>');
                break;
        }
        
        element.innerHTML = content;
        element.classList.add('fallback-highlighted');
    }

    /**
     * 初期化
     */
    function init() {
        // Prism.jsの読み込みを試行
        loadPrismLibrary()
            .then(() => {
                // プラグインを読み込み
                loadPrismPlugins();
                
                // 設定を適用
                setTimeout(setupPrismConfig, 100);
            })
            .catch(error => {
                console.warn('Prism.js could not be loaded, using fallback highlighter:', error);
                
                // フォールバックハイライタを適用
                fallbackHighlighter();
                
                // フォールバック用CSS追加
                addFallbackStyles();
            });
    }

    /**
     * フォールバック用スタイル追加
     */
    function addFallbackStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .fallback-highlighted .html-tag { color: #f56565; }
            .fallback-highlighted .html-attr { color: #4299e1; }
            .fallback-highlighted .css-selector { color: #48bb78; }
            .fallback-highlighted .css-property { color: #9f7aea; }
            .fallback-highlighted .css-color { color: #ed8936; }
            .fallback-highlighted .js-keyword { color: #667eea; font-weight: bold; }
            .fallback-highlighted .js-number { color: #ed8936; }
            .fallback-highlighted .js-comment { color: #718096; font-style: italic; }
        `;
        document.head.appendChild(style);
    }

    /**
     * グローバル関数として公開
     */
    window.PrismSetup = {
        init: init,
        highlight: function(element) {
            if (typeof Prism !== 'undefined' && Prism.highlightElement) {
                Prism.highlightElement(element);
            } else {
                // フォールバック
                const lang = element.className.match(/language-(\w+)/);
                if (lang) {
                    applyBasicHighlighting(element, lang[1]);
                }
            }
        },
        highlightAll: function() {
            if (typeof Prism !== 'undefined' && Prism.highlightAll) {
                Prism.highlightAll();
            } else {
                fallbackHighlighter();
            }
        }
    };

    // 自動初期化（DOM読み込み完了後）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();