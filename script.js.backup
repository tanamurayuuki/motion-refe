/**
 * インフォグラフィックアニメーション学習ツール - JavaScript
 * Phase 3: 高度な検索機能とフィルタリング機能を実装
 */

console.log('=== script.js loaded ===');
console.log('Current time:', new Date().toLocaleTimeString());

/**
 * SearchManager Class - Phase 3
 * 高度な検索機能を提供（自動補完、検索履歴、ハイライト、あいまい検索）
 */
class SearchManager {
    constructor() {
        this.searchHistory = this.loadSearchHistory();
        this.searchSuggestions = [];
        this.debounceTimer = null;
        this.currentSearchTerm = '';
        this.init();
    }

    /**
     * 初期化
     */
    init() {
        this.setupEventListeners();
        this.updateSearchHistory();
        this.generateSearchSuggestions();
    }

    /**
     * イベントリスナーの設定
     */
    setupEventListeners() {
        // メイン検索入力
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
            searchInput.addEventListener('focus', () => this.showSearchHistory());
            searchInput.addEventListener('keydown', (e) => this.handleSearchKeydown(e));
        }

        // クリアボタン
        const clearSearchBtn = document.getElementById('clear-search');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => this.clearSearch());
        }

        // 検索履歴クリア
        const clearHistoryBtn = document.getElementById('clear-history');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.clearSearchHistory());
        }

        // 人気検索ワード
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('popular-tag')) {
                this.performSearch(e.target.dataset.search);
            }
        });

        // 検索履歴アイテムクリック
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('history-item')) {
                this.performSearch(e.target.textContent);
            }
        });

        // 検索候補クリック
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-item')) {
                this.performSearch(e.target.textContent);
            }
        });

        // 外部クリックで候補を非表示
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-box')) {
                this.hideSuggestions();
                this.hideSearchHistory();
            }
        });
    }

    /**
     * 検索入力処理（デバウンス付き）
     */
    handleSearchInput(e) {
        const value = e.target.value.trim();
        
        // デバウンス処理
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        if (value) {
            this.hideSearchHistory();
            this.debounceTimer = setTimeout(() => {
                this.showSearchSuggestions(value);
                this.currentSearchTerm = value;
                // リアルタイム検索
                window.infographicTool?.filterManager?.performSearch(value);
            }, 300);
        } else {
            this.hideSuggestions();
            this.showSearchHistory();
            this.clearSearch();
        }
    }

    /**
     * キーボードナビゲーション
     */
    handleSearchKeydown(e) {
        const suggestions = document.querySelectorAll('.suggestion-item');
        const highlighted = document.querySelector('.suggestion-item.highlighted');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!highlighted && suggestions.length > 0) {
                suggestions[0].classList.add('highlighted');
            } else if (highlighted) {
                const next = highlighted.nextElementSibling;
                highlighted.classList.remove('highlighted');
                if (next) {
                    next.classList.add('highlighted');
                } else {
                    suggestions[0].classList.add('highlighted');
                }
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (highlighted) {
                const prev = highlighted.previousElementSibling;
                highlighted.classList.remove('highlighted');
                if (prev) {
                    prev.classList.add('highlighted');
                } else {
                    suggestions[suggestions.length - 1].classList.add('highlighted');
                }
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlighted) {
                this.performSearch(highlighted.textContent);
            } else if (this.currentSearchTerm) {
                this.performSearch(this.currentSearchTerm, true);
            }
        } else if (e.key === 'Escape') {
            this.hideSuggestions();
            this.hideSearchHistory();
            e.target.blur();
        }
    }

    /**
     * 検索実行
     */
    performSearch(term, addToHistory = true) {
        if (!term || !term.trim()) return;

        term = term.trim();
        
        // 検索入力欄を更新
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = term;
        }

        // 検索履歴に追加
        if (addToHistory) {
            this.addToSearchHistory(term);
        }

        // 検索候補を非表示
        this.hideSuggestions();
        this.hideSearchHistory();

        // フィルターマネージャーに検索を委譲
        if (window.infographicTool?.filterManager) {
            window.infographicTool.filterManager.performSearch(term);
        }

        // 検索入力欄の状態を更新
        this.updateSearchInputState(term);
    }

    /**
     * 検索クリア
     */
    clearSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
            searchInput.classList.remove('has-results', 'no-results');
        }

        this.currentSearchTerm = '';
        this.hideSuggestions();
        
        // フィルターをクリア
        if (window.infographicTool?.filterManager) {
            window.infographicTool.filterManager.clearSearch();
        }
    }

    /**
     * 検索候補の生成（データベースから）
     */
    generateSearchSuggestions() {
        if (!window.infographicTool?.data) return;

        const suggestions = new Set();
        
        window.infographicTool.data.forEach(item => {
            // タイトル
            suggestions.add(item.title);
            
            // カテゴリ・サブカテゴリ
            suggestions.add(item.category);
            suggestions.add(item.subcategory);
            
            // キーワード
            if (item.keywords) {
                item.keywords.forEach(keyword => suggestions.add(keyword));
            }
            
            // タグ
            if (item.tags) {
                item.tags.forEach(tag => suggestions.add(tag));
            }

            // 用途
            if (item.use_cases) {
                item.use_cases.forEach(useCase => suggestions.add(useCase));
            }
        });

        this.searchSuggestions = Array.from(suggestions).sort();
    }

    /**
     * 検索候補の表示
     */
    showSearchSuggestions(term) {
        const suggestions = this.getFilteredSuggestions(term);
        const suggestionsContainer = document.getElementById('search-suggestions');
        const suggestionsList = document.getElementById('suggestions-list');

        if (!suggestionsContainer || !suggestionsList || suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        // 候補リストを生成
        suggestionsList.innerHTML = suggestions
            .map(suggestion => `<li class="suggestion-item">${this.highlightMatch(suggestion, term)}</li>`)
            .join('');

        suggestionsContainer.classList.remove('hidden');
    }

    /**
     * フィルタリングされた検索候補を取得
     */
    getFilteredSuggestions(term, limit = 6) {
        if (!term) return [];

        const lowerTerm = term.toLowerCase();
        return this.searchSuggestions
            .filter(suggestion => 
                suggestion.toLowerCase().includes(lowerTerm) ||
                this.fuzzyMatch(suggestion.toLowerCase(), lowerTerm)
            )
            .slice(0, limit);
    }

    /**
     * あいまい検索マッチング
     */
    fuzzyMatch(str, pattern) {
        const strLen = str.length;
        const patternLen = pattern.length;
        
        if (patternLen > strLen) return false;
        if (patternLen === strLen) return str === pattern;
        
        let strIndex = 0;
        let patternIndex = 0;
        
        while (strIndex < strLen && patternIndex < patternLen) {
            if (str[strIndex] === pattern[patternIndex]) {
                patternIndex++;
            }
            strIndex++;
        }
        
        return patternIndex === patternLen;
    }

    /**
     * マッチ部分のハイライト
     */
    highlightMatch(text, term) {
        if (!term) return text;
        
        const regex = new RegExp(`(${this.escapeRegExp(term)})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    /**
     * 正規表現エスケープ
     */
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * 検索候補を非表示
     */
    hideSuggestions() {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.classList.add('hidden');
        }
    }

    /**
     * 検索履歴の表示
     */
    showSearchHistory() {
        if (this.searchHistory.length === 0) return;

        const historyContainer = document.getElementById('search-history');
        const historyList = document.getElementById('history-list');

        if (!historyContainer || !historyList) return;

        historyList.innerHTML = this.searchHistory
            .slice(0, 5) // 最新5件のみ表示
            .map(item => `<li class="history-item">${item}</li>`)
            .join('');

        historyContainer.classList.remove('hidden');
    }

    /**
     * 検索履歴を非表示
     */
    hideSearchHistory() {
        const historyContainer = document.getElementById('search-history');
        if (historyContainer) {
            historyContainer.classList.add('hidden');
        }
    }

    /**
     * 検索履歴に追加
     */
    addToSearchHistory(term) {
        if (!term || this.searchHistory.includes(term)) {
            return;
        }

        this.searchHistory.unshift(term);
        this.searchHistory = this.searchHistory.slice(0, 10); // 最新10件まで保持
        this.saveSearchHistory();
        this.updateSearchHistory();
    }

    /**
     * 検索履歴をクリア
     */
    clearSearchHistory() {
        this.searchHistory = [];
        this.saveSearchHistory();
        this.updateSearchHistory();
        this.hideSearchHistory();
    }

    /**
     * 検索履歴の更新
     */
    updateSearchHistory() {
        // ここでUIの更新は不要（表示時に動的生成）
    }

    /**
     * 検索履歴の読み込み
     */
    loadSearchHistory() {
        try {
            const history = localStorage.getItem('infographic-search-history');
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('検索履歴の読み込みエラー:', error);
            return [];
        }
    }

    /**
     * 検索履歴の保存
     */
    saveSearchHistory() {
        try {
            localStorage.setItem('infographic-search-history', JSON.stringify(this.searchHistory));
        } catch (error) {
            console.error('検索履歴の保存エラー:', error);
        }
    }

    /**
     * 検索入力欄の状態更新
     */
    updateSearchInputState(term) {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        // フィルター結果によって状態を更新
        setTimeout(() => {
            const visibleItems = document.querySelectorAll('.category-item:not([style*="display: none"])');
            if (term && visibleItems.length === 0) {
                searchInput.classList.add('no-results');
                searchInput.classList.remove('has-results');
            } else if (term && visibleItems.length > 0) {
                searchInput.classList.add('has-results');
                searchInput.classList.remove('no-results');
            } else {
                searchInput.classList.remove('has-results', 'no-results');
            }
        }, 100);
    }
}

/**
 * ProgressManager Class - Phase 4
 * 学習進捗管理機能を提供
 */
class ProgressManager {
    constructor() {
        this.viewHistory = this.loadViewHistory();
        this.favorites = this.loadFavorites();
        this.init();
    }

    /**
     * 初期化
     */
    init() {
        this.setupEventListeners();
        this.updateProgressUI();
    }

    /**
     * イベントリスナーの設定
     */
    setupEventListeners() {
        // お気に入りボタン
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('favorite-btn') || e.target.closest('.favorite-btn')) {
                const contentId = e.target.closest('[data-id]')?.dataset.id ||
                                 document.getElementById('content-title')?.dataset.id;
                if (contentId) {
                    this.toggleFavorite(contentId);
                }
            }
        });

        // 閲覧履歴クリア
        document.addEventListener('click', (e) => {
            if (e.target.id === 'clear-history-btn') {
                this.clearHistory();
            }
        });

        // お気に入りクリア
        document.addEventListener('click', (e) => {
            if (e.target.id === 'clear-favorites-btn') {
                this.clearFavorites();
            }
        });
    }

    /**
     * コンテンツの閲覧記録
     */
    recordView(contentId) {
        if (!contentId) return;

        const now = Date.now();
        const existingIndex = this.viewHistory.findIndex(item => item.id === contentId);

        if (existingIndex >= 0) {
            // 既存の履歴を更新
            this.viewHistory[existingIndex].lastViewed = now;
            this.viewHistory[existingIndex].viewCount++;
        } else {
            // 新規追加
            this.viewHistory.push({
                id: contentId,
                firstViewed: now,
                lastViewed: now,
                viewCount: 1
            });
        }

        // 最新100件まで保持
        this.viewHistory = this.viewHistory
            .sort((a, b) => b.lastViewed - a.lastViewed)
            .slice(0, 100);

        this.saveViewHistory();
        this.updateProgressUI();
    }

    /**
     * お気に入りの切り替え
     */
    toggleFavorite(contentId) {
        if (!contentId) return;

        const index = this.favorites.indexOf(contentId);
        if (index >= 0) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(contentId);
        }

        this.saveFavorites();
        this.updateProgressUI();
        this.updateFavoriteButtons(contentId);
    }

    /**
     * お気に入りチェック
     */
    isFavorite(contentId) {
        return this.favorites.includes(contentId);
    }

    /**
     * 閲覧済みチェック
     */
    isViewed(contentId) {
        return this.viewHistory.some(item => item.id === contentId);
    }

    /**
     * 学習進捗の取得
     */
    getProgress() {
        const totalItems = window.infographicTool?.data?.length || 0;
        const viewedItems = this.viewHistory.length;
        const favoriteItems = this.favorites.length;
        
        return {
            total: totalItems,
            viewed: viewedItems,
            favorites: favoriteItems,
            viewedPercentage: totalItems > 0 ? Math.round((viewedItems / totalItems) * 100) : 0
        };
    }

    /**
     * 履歴クリア
     */
    clearHistory() {
        this.viewHistory = [];
        this.saveViewHistory();
        this.updateProgressUI();
    }

    /**
     * お気に入りクリア
     */
    clearFavorites() {
        this.favorites = [];
        this.saveFavorites();
        this.updateProgressUI();
        this.updateAllFavoriteButtons();
    }

    /**
     * 進捗UIの更新
     */
    updateProgressUI() {
        const progress = this.getProgress();
        
        // 進捗バー更新
        const progressBar = document.getElementById('progress-bar-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressBar) {
            progressBar.style.width = `${progress.viewedPercentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${progress.viewed}/${progress.total} (${progress.viewedPercentage}%)`;
        }

        // 統計情報更新
        const viewedCount = document.getElementById('viewed-count');
        const favoriteCount = document.getElementById('favorite-count');
        
        if (viewedCount) {
            viewedCount.textContent = progress.viewed;
        }
        
        if (favoriteCount) {
            favoriteCount.textContent = progress.favorites;
        }
    }

    /**
     * お気に入りボタンの更新
     */
    updateFavoriteButtons(contentId) {
        const isFav = this.isFavorite(contentId);
        const buttons = document.querySelectorAll(`[data-id="${contentId}"] .favorite-btn`);
        
        buttons.forEach(btn => {
            btn.classList.toggle('active', isFav);
            const icon = btn.querySelector('.favorite-icon');
            if (icon) {
                icon.textContent = isFav ? '★' : '☆';
            }
        });

        // 詳細表示のお気に入りボタンも更新
        const detailBtn = document.getElementById('favorite-detail-btn');
        if (detailBtn) {
            detailBtn.classList.toggle('active', isFav);
            const icon = detailBtn.querySelector('.favorite-icon');
            if (icon) {
                icon.textContent = isFav ? '★' : '☆';
            }
        }
    }

    /**
     * 全お気に入りボタンの更新
     */
    updateAllFavoriteButtons() {
        if (!window.infographicTool?.data) return;

        window.infographicTool.data.forEach(item => {
            this.updateFavoriteButtons(item.id);
        });
    }

    /**
     * 閲覧履歴の読み込み
     */
    loadViewHistory() {
        try {
            const history = localStorage.getItem('infographic-view-history');
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('閲覧履歴の読み込みエラー:', error);
            return [];
        }
    }

    /**
     * 閲覧履歴の保存
     */
    saveViewHistory() {
        try {
            localStorage.setItem('infographic-view-history', JSON.stringify(this.viewHistory));
        } catch (error) {
            console.error('閲覧履歴の保存エラー:', error);
        }
    }

    /**
     * お気に入りの読み込み
     */
    loadFavorites() {
        try {
            const favorites = localStorage.getItem('infographic-favorites');
            return favorites ? JSON.parse(favorites) : [];
        } catch (error) {
            console.error('お気に入りの読み込みエラー:', error);
            return [];
        }
    }

    /**
     * お気に入りの保存
     */
    saveFavorites() {
        try {
            localStorage.setItem('infographic-favorites', JSON.stringify(this.favorites));
        } catch (error) {
            console.error('お気に入りの保存エラー:', error);
        }
    }
}

/**
 * RelatedContentManager Class - Phase 4
 * 関連コンテンツ表示機能を提供
 */
class RelatedContentManager {
    constructor() {
        this.init();
    }

    /**
     * 初期化
     */
    init() {
        // 関連コンテンツクリックイベント
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('related-item')) {
                const contentId = e.target.dataset.id;
                if (contentId && window.infographicTool) {
                    window.infographicTool.displayContent(contentId);
                }
            }
        });
    }

    /**
     * 関連コンテンツの取得
     */
    getRelatedContent(currentContent, limit = 4) {
        if (!window.infographicTool?.data || !currentContent) return [];

        const allContent = window.infographicTool.data;
        const related = [];

        // 1. related_items で明示的に指定されたコンテンツ
        if (currentContent.related_items) {
            currentContent.related_items.forEach(id => {
                const item = allContent.find(content => content.id === id);
                if (item) related.push({ content: item, score: 100 });
            });
        }

        // 2. 同じカテゴリのコンテンツ
        allContent.forEach(content => {
            if (content.id === currentContent.id) return;
            if (related.find(r => r.content.id === content.id)) return;

            let score = 0;

            // カテゴリ一致
            if (content.category === currentContent.category) {
                score += 50;
            }

            // サブカテゴリ一致
            if (content.subcategory === currentContent.subcategory) {
                score += 30;
            }

            // 難易度一致
            if (content.difficulty === currentContent.difficulty) {
                score += 20;
            }

            // タグの一致度
            if (content.tags && currentContent.tags) {
                const commonTags = content.tags.filter(tag => 
                    currentContent.tags.includes(tag)
                );
                score += commonTags.length * 15;
            }

            // 用途の一致度
            if (content.use_cases && currentContent.use_cases) {
                const commonUseCases = content.use_cases.filter(useCase => 
                    currentContent.use_cases.includes(useCase)
                );
                score += commonUseCases.length * 10;
            }

            if (score > 0) {
                related.push({ content, score });
            }
        });

        // スコア順にソートして上位を返す
        return related
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.content);
    }

    /**
     * 関連コンテンツの表示
     */
    displayRelatedContent(currentContent) {
        const relatedContainer = document.getElementById('related-content-list');
        if (!relatedContainer) return;

        const relatedContent = this.getRelatedContent(currentContent);

        if (relatedContent.length === 0) {
            relatedContainer.innerHTML = '<p class="no-related">関連するコンテンツが見つかりません</p>';
            return;
        }

        relatedContainer.innerHTML = relatedContent.map(content => `
            <div class="related-item" data-id="${content.id}">
                <div class="related-thumbnail">
                    <img src="${this.getThumbnailUrl(content)}" 
                         alt="${content.title}" 
                         onerror="this.src='assets/thumbnails/default.jpg'">
                    <div class="related-category">${content.category}</div>
                </div>
                <div class="related-info">
                    <h4 class="related-title">${content.title}</h4>
                    <p class="related-description">${content.description.substring(0, 80)}...</p>
                    <div class="related-meta">
                        <span class="related-difficulty ${content.difficulty}">${content.difficulty}</span>
                        <span class="related-duration">${content.duration}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * サムネイルURLの取得
     */
    getThumbnailUrl(content) {
        // video_url から thumbnail を推定
        const videoPath = content.video_url;
        if (videoPath && videoPath.includes('assets/videos/')) {
            const filename = videoPath.split('/').pop().replace('.mp4', '.jpg');
            return `assets/thumbnails/${filename}`;
        }
        return 'assets/thumbnails/default.jpg';
    }
}

/**
 * FilterManager Class - Phase 3
 * 高度なフィルタリング機能を提供
 */
class FilterManager {
    constructor() {
        this.activeFilters = {
            category: [],
            difficulty: [],
            duration: [],
            use_cases: []
        };
        this.searchTerm = '';
        this.sortBy = 'relevance';
        this.init();
    }

    /**
     * 初期化
     */
    init() {
        this.setupEventListeners();
        this.updatePopularSearches();
    }

    /**
     * イベントリスナーの設定
     */
    setupEventListeners() {
        // 詳細検索パネルの開閉
        const advancedToggle = document.getElementById('advanced-search-toggle');
        if (advancedToggle) {
            advancedToggle.addEventListener('click', () => this.toggleAdvancedSearch());
        }

        // フィルターチェックボックス
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.name) {
                this.handleFilterChange(e.target);
            }
        });

        // フィルター適用・リセットボタン
        const applyBtn = document.getElementById('apply-filters');
        const resetBtn = document.getElementById('reset-filters');
        
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyFilters());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }

        // ソート変更
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => this.handleSortChange(e.target.value));
        }
    }

    /**
     * 詳細検索パネルの開閉
     */
    toggleAdvancedSearch() {
        const toggle = document.getElementById('advanced-search-toggle');
        const panel = document.getElementById('advanced-search-panel');
        
        if (!toggle || !panel) return;

        const isActive = toggle.classList.contains('active');
        
        if (isActive) {
            toggle.classList.remove('active');
            panel.classList.add('hidden');
        } else {
            toggle.classList.add('active');
            panel.classList.remove('hidden');
        }
    }

    /**
     * フィルター変更処理
     */
    handleFilterChange(checkbox) {
        const filterType = checkbox.name;
        const filterValue = checkbox.value;
        
        if (checkbox.checked) {
            if (!this.activeFilters[filterType].includes(filterValue)) {
                this.activeFilters[filterType].push(filterValue);
            }
        } else {
            this.activeFilters[filterType] = this.activeFilters[filterType]
                .filter(value => value !== filterValue);
        }

        // リアルタイムフィルタリング
        this.applyFilters();
    }

    /**
     * フィルターの適用
     */
    applyFilters() {
        if (!window.infographicTool?.data) return;

        const filteredData = this.getFilteredData();
        this.updateUI(filteredData);
        this.updateSearchResultsSummary(filteredData.length);
    }

    /**
     * フィルタリングされたデータを取得
     */
    getFilteredData() {
        if (!window.infographicTool?.data) return [];

        let filteredData = [...window.infographicTool.data];

        // テキスト検索フィルター
        if (this.searchTerm) {
            filteredData = filteredData.filter(item => this.matchesSearchTerm(item, this.searchTerm));
        }

        // カテゴリフィルター
        Object.keys(this.activeFilters).forEach(filterType => {
            const filterValues = this.activeFilters[filterType];
            if (filterValues.length > 0) {
                filteredData = filteredData.filter(item => {
                    if (filterType === 'use_cases' && item[filterType]) {
                        return item[filterType].some(useCase => filterValues.includes(useCase));
                    }
                    return filterValues.includes(item[filterType]);
                });
            }
        });

        // ソート
        return this.sortData(filteredData);
    }

    /**
     * 検索語との一致チェック
     */
    matchesSearchTerm(item, searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        
        // 基本フィールドでの検索
        const searchFields = [
            item.title,
            item.category,
            item.subcategory,
            item.description,
            item.usage,
            ...(item.points || []),
            ...(item.keywords || []),
            ...(item.tags || []),
            ...(item.use_cases || [])
        ];

        return searchFields.some(field => 
            field && field.toString().toLowerCase().includes(lowerTerm)
        );
    }

    /**
     * データのソート
     */
    sortData(data) {
        switch (this.sortBy) {
            case 'category':
                return data.sort((a, b) => a.category.localeCompare(b.category, 'ja'));
            case 'difficulty':
                const difficultyOrder = ['初級', '中級', '上級'];
                return data.sort((a, b) => {
                    const aIndex = difficultyOrder.indexOf(a.difficulty);
                    const bIndex = difficultyOrder.indexOf(b.difficulty);
                    return aIndex - bIndex;
                });
            case 'title':
                return data.sort((a, b) => a.title.localeCompare(b.title, 'ja'));
            case 'relevance':
            default:
                // 検索語がある場合は関連度順、なければデフォルト順序
                if (this.searchTerm) {
                    return this.sortByRelevance(data, this.searchTerm);
                }
                return data;
        }
    }

    /**
     * 関連度順ソート
     */
    sortByRelevance(data, searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        
        return data.sort((a, b) => {
            const aScore = this.calculateRelevanceScore(a, lowerTerm);
            const bScore = this.calculateRelevanceScore(b, lowerTerm);
            return bScore - aScore;
        });
    }

    /**
     * 関連度スコア計算
     */
    calculateRelevanceScore(item, searchTerm) {
        let score = 0;
        
        // タイトル完全一致
        if (item.title.toLowerCase() === searchTerm) {
            score += 100;
        }
        // タイトル部分一致
        else if (item.title.toLowerCase().includes(searchTerm)) {
            score += 50;
        }
        
        // カテゴリ・サブカテゴリ一致
        if (item.category.toLowerCase().includes(searchTerm)) {
            score += 30;
        }
        if (item.subcategory.toLowerCase().includes(searchTerm)) {
            score += 25;
        }
        
        // キーワード一致
        if (item.keywords) {
            item.keywords.forEach(keyword => {
                if (keyword.toLowerCase().includes(searchTerm)) {
                    score += 20;
                }
            });
        }
        
        // タグ一致
        if (item.tags) {
            item.tags.forEach(tag => {
                if (tag.toLowerCase().includes(searchTerm)) {
                    score += 15;
                }
            });
        }
        
        // 説明文一致
        if (item.description.toLowerCase().includes(searchTerm)) {
            score += 10;
        }
        
        return score;
    }

    /**
     * UIの更新
     */
    updateUI(filteredData) {
        const allItems = document.querySelectorAll('.category-item');
        const allGroups = document.querySelectorAll('.category-group');
        
        // すべてのアイテムを非表示
        allItems.forEach(item => {
            item.style.display = 'none';
            item.parentElement.style.display = 'none';
            item.classList.remove('search-match');
        });

        // すべてのグループを非表示
        allGroups.forEach(group => {
            group.style.display = 'none';
        });

        // フィルタリング結果に基づいて表示
        const displayedGroups = new Set();
        
        filteredData.forEach(item => {
            const itemElement = document.querySelector(`[data-id="${item.id}"]`);
            if (itemElement) {
                itemElement.style.display = 'block';
                itemElement.parentElement.style.display = 'list-item';
                
                if (this.searchTerm) {
                    itemElement.classList.add('search-match');
                    // ハイライト適用
                    this.highlightText(itemElement, this.searchTerm);
                }

                // 親グループを表示
                const group = itemElement.closest('.category-group');
                if (group) {
                    group.style.display = 'block';
                    displayedGroups.add(group);
                    
                    // アコーディオンを開く
                    const header = group.querySelector('.category-header');
                    if (header && this.searchTerm) {
                        header.classList.add('active');
                        const categoryList = group.querySelector('.category-list');
                        if (categoryList) {
                            categoryList.classList.add('expanded');
                        }
                    }
                }
            }
        });

        // 結果が0件の場合の処理
        if (filteredData.length === 0 && (this.searchTerm || this.hasActiveFilters())) {
            this.showNoResultsMessage();
        } else {
            this.hideNoResultsMessage();
        }
    }

    /**
     * テキストハイライト
     */
    highlightText(element, searchTerm) {
        if (!searchTerm) return;

        const text = element.textContent;
        const regex = new RegExp(`(${this.escapeRegExp(searchTerm)})`, 'gi');
        const highlightedText = text.replace(regex, '<span class="search-highlight">$1</span>');
        element.innerHTML = highlightedText;
    }

    /**
     * 正規表現エスケープ
     */
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * アクティブフィルターがあるかチェック
     */
    hasActiveFilters() {
        return Object.values(this.activeFilters).some(filters => filters.length > 0);
    }

    /**
     * 検索結果サマリーの更新
     */
    updateSearchResultsSummary(count) {
        const summary = document.getElementById('search-results-summary');
        const countElement = document.getElementById('results-count');
        
        if (!summary || !countElement) return;

        countElement.textContent = count;
        
        if (this.searchTerm || this.hasActiveFilters()) {
            summary.classList.remove('hidden');
        } else {
            summary.classList.add('hidden');
        }
    }

    /**
     * ソート変更処理
     */
    handleSortChange(sortValue) {
        this.sortBy = sortValue;
        this.applyFilters();
    }

    /**
     * フィルターリセット
     */
    resetFilters() {
        // チェックボックスをクリア
        document.querySelectorAll('#advanced-search-panel input[type="checkbox"]')
            .forEach(checkbox => checkbox.checked = false);
        
        // フィルター状態をリセット
        Object.keys(this.activeFilters).forEach(key => {
            this.activeFilters[key] = [];
        });

        // UIを更新
        this.applyFilters();
    }

    /**
     * 検索実行（SearchManagerから呼ばれる）
     */
    performSearch(term) {
        this.searchTerm = term;
        this.applyFilters();
    }

    /**
     * 検索クリア
     */
    clearSearch() {
        this.searchTerm = '';
        this.applyFilters();
        this.hideNoResultsMessage();
    }

    /**
     * 結果なしメッセージ表示
     */
    showNoResultsMessage() {
        let messageElement = document.querySelector('.no-results-message');
        
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'no-results-message';
            messageElement.innerHTML = `
                <h3>検索結果が見つかりません</h3>
                <p>検索条件を変更してもう一度お試しください。<br>
                または、人気の検索ワードからお選びください。</p>
            `;
            
            const categoryNav = document.querySelector('.category-nav');
            if (categoryNav) {
                categoryNav.appendChild(messageElement);
            }
        }
    }

    /**
     * 結果なしメッセージ非表示
     */
    hideNoResultsMessage() {
        const messageElement = document.querySelector('.no-results-message');
        if (messageElement) {
            messageElement.remove();
        }
    }

    /**
     * 人気検索ワードの更新
     */
    updatePopularSearches() {
        // 実装済みのHTMLに基づいて人気検索ワードは静的に設定
        // 将来的には使用統計に基づいて動的に更新可能
    }

    /**
     * 難易度フィルターの適用
     */
    applyDifficultyFilter(difficulty) {
        if (difficulty === 'all') {
            this.activeFilters.difficulty = [];
        } else {
            this.activeFilters.difficulty = [difficulty];
        }
        this.applyFilters();
    }
}

class InfographicTool {
    constructor() {
        this.data = [];
        this.currentContent = null;
        this.videoPlayer = null;
        this.searchManager = null;
        this.filterManager = null;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadData();
        this.setupCategoryAccordion();
        this.videoPlayer = new VideoPlayer();
        
        // Phase 3: Initialize enhanced search functionality
        this.initializeSearchFeatures();
        
        // Phase 4: Initialize grid view and progress tracking
        this.setupGridView();
        this.setupProgressTracking();
    }

    /**
     * Phase 3: Initialize search features
     */
    initializeSearchFeatures() {
        // Set global reference for managers to access data
        window.infographicTool = this;
        
        // Initialize search and filter managers
        this.searchManager = new SearchManager();
        this.filterManager = new FilterManager();
        
        // Connect the managers
        this.searchManager.filterManager = this.filterManager;
        this.filterManager.searchManager = this.searchManager;
        
        // Generate search suggestions after data is loaded
        setTimeout(() => {
            this.searchManager.generateSearchSuggestions();
        }, 100);
    }

    /**
     * イベントリスナーの設定
     */
    setupEventListeners() {
        // Category header clicks for accordion
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-header')) {
                this.toggleAccordion(e.target);
            }
        });

        // Category item clicks for content display
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-item')) {
                this.displayContent(e.target.dataset.id);
                this.setActiveItem(e.target);
            }
        });

        // Legacy search functionality - now handled by SearchManager
        // Keeping for backward compatibility but actual functionality is in Phase 3 managers

        // Video placeholder click
        document.addEventListener('click', (e) => {
            if (e.target.closest('.video-placeholder')) {
                this.playAnimation();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });
    }

    /**
     * データの読み込み
     */
    async loadData() {
        try {
            const response = await fetch('data.json');
            this.data = await response.json();
        } catch (error) {
            console.error('データの読み込みに失敗しました:', error);
            // Fallback to inline data if file loading fails
            this.data = this.getFallbackData();
        }
    }

    /**
     * フォールバックデータ（data.jsonが読み込めない場合）
     */
    getFallbackData() {
        return [
            {
                "id": "001",
                "category": "基本グラフ",
                "subcategory": "棒グラフ",
                "title": "年度別売上推移",
                "video_url": "assets/bar_growth.mp4",
                "description": "売上の年度別推移を縦棒グラフで表示。データの増減を視覚的に分かりやすく表現します。",
                "points": ["棒の高さで売上規模を表現", "色の変化で前年との差を強調", "アニメーションで時系列の変化を演出"],
                "usage": "市場分析、売上報告、業績プレゼンテーション"
            },
            {
                "id": "002",
                "category": "基本グラフ",
                "subcategory": "折れ線グラフ",
                "title": "株価変動トレンド",
                "video_url": "assets/line_trend.mp4",
                "description": "時系列データの変化を折れ線で表現。トレンドの把握に最適です。",
                "points": ["線の傾きで変化の方向性を表現", "データポイントのアニメーション", "区間ごとの色分けでトレンド強調"],
                "usage": "株価分析、売上推移、パフォーマンス監視"
            },
            {
                "id": "003",
                "category": "基本グラフ",
                "subcategory": "円グラフ",
                "title": "市場シェア分析",
                "video_url": "assets/pie_share.mp4",
                "description": "全体に対する各項目の割合を円形で表現。構成比の理解に効果的です。",
                "points": ["セクターの大きさで割合を表現", "色分けでカテゴリを区別", "アニメーションで注目セクターを強調"],
                "usage": "市場分析、予算配分、アンケート結果"
            },
            {
                "id": "004",
                "category": "基本グラフ",
                "subcategory": "面グラフ",
                "title": "累積売上推移",
                "video_url": "assets/area_cumulative.mp4",
                "description": "複数のデータ系列を積み重ねて全体の変化を表現。累積効果の可視化に適しています。",
                "points": ["面積で数量の大きさを表現", "積み重ねで複数要素の関係性を表示", "グラデーションで視覚的な美しさを演出"],
                "usage": "売上分析、リソース配分、進捗管理"
            },
            {
                "id": "005",
                "category": "表現テクニック",
                "subcategory": "カウンター",
                "title": "数値カウントアップ",
                "video_url": "assets/counter_animation.mp4",
                "description": "数値が0から目標値まで徐々にカウントアップするアニメーション。インパクトのある数値表現です。",
                "points": ["数値の変化でインパクトを創出", "カウント速度の調整で演出効果を制御", "最終値で一時停止して注目を集める"],
                "usage": "売上実績、利用者数、達成率の強調表示"
            },
            {
                "id": "006",
                "category": "表現テクニック",
                "subcategory": "ゲージ",
                "title": "進捗率表示",
                "video_url": "assets/gauge_progress.mp4",
                "description": "円形または半円形のゲージで進捗率や達成度を表現。直感的な理解を促します。",
                "points": ["ゲージの針で現在値を指示", "色の変化で状態を表現（赤・黄・緑）", "滑らかなアニメーションで変化を演出"],
                "usage": "KPI監視、目標達成率、品質指標"
            },
            {
                "id": "007",
                "category": "表現テクニック",
                "subcategory": "タイムライン",
                "title": "プロジェクト進捗",
                "video_url": "assets/timeline_project.mp4",
                "description": "時系列に沿った出来事や進捗を直線状に表現。プロセスの可視化に効果的です。",
                "points": ["時間軸に沿った情報配置", "マイルストーンの強調表示", "進捗に応じたアニメーション表現"],
                "usage": "プロジェクト管理、製品開発、企業沿革"
            },
            {
                "id": "008",
                "category": "表現テクニック",
                "subcategory": "フローチャート",
                "title": "業務プロセス",
                "video_url": "assets/flowchart_process.mp4",
                "description": "業務の流れや意思決定プロセスを図式化。複雑なワークフローの理解を支援します。",
                "points": ["矢印で処理の流れを表現", "条件分岐の視覚化", "各ステップの強調とアニメーション"],
                "usage": "業務フロー、意思決定プロセス、システム設計"
            },
            {
                "id": "009",
                "category": "用途・シーン別",
                "subcategory": "ビジネスレポート",
                "title": "四半期業績報告",
                "video_url": "assets/business_report.mp4",
                "description": "ビジネスレポート用の包括的なデータ可視化。複数指標を統合的に表現します。",
                "points": ["複数グラフの連携表示", "KPI指標の強調", "プロフェッショナルなデザイン"],
                "usage": "株主報告、役員会議、投資家向けプレゼンテーション"
            },
            {
                "id": "010",
                "category": "用途・シーン別",
                "subcategory": "製品解説",
                "title": "製品機能紹介",
                "video_url": "assets/product_explanation.mp4",
                "description": "製品の特徴や機能を分かりやすく説明。顧客理解を促進します。",
                "points": ["製品特徴の視覚的表現", "比較表によるメリット強調", "使用シーンの具体化"],
                "usage": "製品カタログ、営業プレゼンテーション、Webサイト"
            },
            {
                "id": "011",
                "category": "用途・シーン別",
                "subcategory": "教育キャンペーン",
                "title": "環境保護意識向上",
                "video_url": "assets/education_campaign.mp4",
                "description": "教育的メッセージを効果的に伝達。行動変容を促進します。",
                "points": ["統計データの感情的表現", "行動指針の明確化", "記憶に残るビジュアル表現"],
                "usage": "啓発キャンペーン、社内教育、公共広報"
            },
            {
                "id": "012",
                "category": "用途・シーン別",
                "subcategory": "企業沿革",
                "title": "会社設立50周年記念",
                "video_url": "assets/company_history.mp4",
                "description": "企業の歴史と成長を時系列で表現。ブランドストーリーを視覚化します。",
                "points": ["重要な節目の強調表示", "成長指標の推移表示", "企業文化の視覚的表現"],
                "usage": "周年記念、会社案内、採用活動"
            }
        ];
    }

    /**
     * カテゴリアコーディオンの初期設定
     */
    setupCategoryAccordion() {
        // 最初のカテゴリを開いた状態にする
        const firstCategoryHeader = document.querySelector('.category-header');
        if (firstCategoryHeader) {
            this.toggleAccordion(firstCategoryHeader, true);
        }
    }

    /**
     * アコーディオンの開閉
     */
    toggleAccordion(header, forceOpen = false) {
        const categoryId = header.dataset.category;
        const categoryList = document.getElementById(categoryId);
        const isActive = header.classList.contains('active');

        if (forceOpen || !isActive) {
            // Close all other accordions
            document.querySelectorAll('.category-header.active').forEach(h => {
                if (h !== header) {
                    h.classList.remove('active');
                    const id = h.dataset.category;
                    document.getElementById(id).classList.remove('expanded');
                }
            });

            // Open this accordion
            header.classList.add('active');
            categoryList.classList.add('expanded');
        } else {
            // Close this accordion
            header.classList.remove('active');
            categoryList.classList.remove('expanded');
        }
    }

    /**
     * コンテンツの表示
     */
    displayContent(contentId) {
        const content = this.data.find(item => item.id === contentId);
        if (!content) return;

        this.currentContent = content;

        // Hide welcome message and show content
        document.getElementById('welcome-message').classList.add('hidden');
        document.getElementById('content-display').classList.remove('hidden');

        // Update content elements
        document.getElementById('content-title').textContent = content.title;
        document.getElementById('content-category').textContent = 
            `${content.category} > ${content.subcategory}`;
        document.getElementById('content-description').textContent = content.description;
        document.getElementById('content-usage').textContent = content.usage;

        // Update points list
        const pointsList = document.getElementById('content-points');
        pointsList.innerHTML = content.points
            .map(point => `<li>${point}</li>`)
            .join('');

        // Load video in player
        this.videoPlayer.loadVideo(content.video_url, content.title);

        // Scroll to top of content
        document.querySelector('.content').scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * アクティブなアイテムの設定
     */
    setActiveItem(item) {
        // Remove active class from all items
        document.querySelectorAll('.category-item.active')
            .forEach(el => el.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
    }

    /**
     * レガシー検索機能（Phase 3で置き換え済み）
     * 後方互換性のため残しているが、新機能はSearchManager/FilterManagerを使用
     */
    filterContent(searchTerm) {
        // Phase 3では新しいFilterManagerが処理
        if (this.filterManager) {
            this.filterManager.performSearch(searchTerm);
        }
    }

    /**
     * アニメーション再生
     */
    playAnimation() {
        if (!this.videoPlayer) return;
        this.videoPlayer.togglePlay();
    }

    /**
     * キーボードナビゲーション
     */
    handleKeyNavigation(e) {
        // ESC key to close content and show welcome message
        if (e.key === 'Escape') {
            document.getElementById('content-display').classList.add('hidden');
            document.getElementById('welcome-message').classList.remove('hidden');
            
            // Remove active states
            document.querySelectorAll('.category-item.active')
                .forEach(el => el.classList.remove('active'));
                
            // Pause video if playing
            if (this.videoPlayer) {
                this.videoPlayer.pause();
            }
        }

        // Space key for play/pause (when content is visible)
        if (e.key === ' ' && !document.getElementById('content-display').classList.contains('hidden')) {
            e.preventDefault();
            if (this.videoPlayer) {
                this.videoPlayer.togglePlay();
            }
        }

        // Arrow keys for seeking (when content is visible)
        if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && 
            !document.getElementById('content-display').classList.contains('hidden')) {
            e.preventDefault();
            if (this.videoPlayer) {
                const seekTime = e.key === 'ArrowLeft' ? -5 : 5;
                this.videoPlayer.seek(seekTime);
            }
        }

        // Enter key on focused elements
        if (e.key === 'Enter' && e.target.classList.contains('category-header')) {
            this.toggleAccordion(e.target);
        }
        
        if (e.key === 'Enter' && e.target.classList.contains('category-item')) {
            this.displayContent(e.target.dataset.id);
            this.setActiveItem(e.target);
        }
    }

    /**
     * Phase 4: グリッド表示の設定
     */
    setupGridView() {
        const gridToggle = document.getElementById('grid-toggle');
        const contentGrid = document.getElementById('content-grid');
        
        if (!gridToggle || !contentGrid) return;

        // グリッド表示切り替え
        gridToggle.addEventListener('click', () => {
            const isActive = gridToggle.classList.contains('active');
            
            if (isActive) {
                gridToggle.classList.remove('active');
                contentGrid.classList.add('hidden');
                document.querySelector('.category-nav')?.classList.remove('hidden');
            } else {
                gridToggle.classList.add('active');
                this.populateGrid();
                contentGrid.classList.remove('hidden');
                document.querySelector('.category-nav')?.classList.add('hidden');
            }
        });

        // グリッドアイテムのクリックイベント
        document.addEventListener('click', (e) => {
            const gridItem = e.target.closest('.grid-item');
            if (gridItem && !e.target.closest('.favorite-btn')) {
                const contentId = gridItem.dataset.id;
                this.displayContent(contentId);
                // グリッド表示を終了してコンテンツ表示
                gridToggle.classList.remove('active');
                contentGrid.classList.add('hidden');
                document.querySelector('.category-nav')?.classList.remove('hidden');
                document.querySelector('.content')?.classList.remove('hidden');
            }
        });

        // 難易度フィルターボタンのクリックイベント
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('difficulty-filter-btn')) {
                // アクティブ状態の切り替え
                document.querySelectorAll('.difficulty-filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                
                // フィルタリングの実行
                const difficulty = e.target.dataset.difficulty;
                if (this.filterManager) {
                    this.filterManager.applyDifficultyFilter(difficulty);
                }
            }
        });
    }

    /**
     * Phase 4: グリッドの内容を生成
     */
    populateGrid() {
        const gridContainer = document.getElementById('grid-items');
        if (!gridContainer || !this.data) return;

        gridContainer.innerHTML = this.data.map(content => {
            const isViewed = this.progressManager?.isViewed(content.id) || false;
            const isFavorite = this.progressManager?.isFavorite(content.id) || false;
            const thumbnailUrl = this.relatedContentManager?.getThumbnailUrl(content) || 'assets/thumbnails/default.jpg';

            return `
                <div class="grid-item ${isViewed ? 'viewed' : ''}" data-id="${content.id}">
                    <div class="grid-item-thumbnail">
                        <img src="${thumbnailUrl}" 
                             alt="${content.title}"
                             onerror="this.src='assets/thumbnails/default.jpg'">
                        <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                                data-id="${content.id}">
                            <span class="favorite-icon">${isFavorite ? '★' : '☆'}</span>
                        </button>
                        <div class="grid-category">${content.category}</div>
                    </div>
                    <div class="grid-item-info">
                        <h3 class="grid-item-title">${content.title}</h3>
                        <p class="grid-item-description">${content.description.substring(0, 100)}...</p>
                        <div class="grid-item-meta">
                            <span class="grid-difficulty ${content.difficulty}">${content.difficulty}</span>
                            <span class="grid-duration">${content.duration}</span>
                        </div>
                        ${content.tags ? `
                            <div class="grid-tags">
                                ${content.tags.slice(0, 3).map(tag => 
                                    `<span class="grid-tag">${tag}</span>`
                                ).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Phase 4: 進捗追跡の設定
     */
    setupProgressTracking() {
        this.progressManager = new ProgressManager();
        this.relatedContentManager = new RelatedContentManager();
        this.progressManager.updateProgressUI();
    }
}

/**
 * Video Player Class
 * カスタム動画プレイヤーの機能を提供
 */
class VideoPlayer {
    constructor() {
        this.video = null;
        this.isRepeating = false;
        this.playbackSpeed = 1;
        this.isDragging = false;
        this.controlsVisible = false;
        this.controlsTimeout = null;
        this.init();
    }

    /**
     * 初期化
     */
    init() {
        this.video = document.getElementById('video-element');
        this.setupEventListeners();
        this.setupControlElements();
    }

    /**
     * DOM要素の取得
     */
    setupControlElements() {
        this.elements = {
            player: document.getElementById('video-player'),
            controls: document.getElementById('video-controls'),
            placeholder: document.getElementById('video-placeholder'),
            playPauseBtn: document.getElementById('play-pause-btn'),
            repeatBtn: document.getElementById('repeat-btn'),
            progressBar: document.getElementById('progress-bar'),
            progressFill: document.getElementById('progress-fill'),
            progressHandle: document.getElementById('progress-handle'),
            currentTime: document.getElementById('current-time'),
            duration: document.getElementById('duration'),
            speedBtns: document.querySelectorAll('.speed-btn')
        };
    }

    /**
     * イベントリスナーの設定
     */
    setupEventListeners() {
        // Video events
        this.video.addEventListener('loadedmetadata', () => this.updateDuration());
        this.video.addEventListener('timeupdate', () => this.updateProgress());
        this.video.addEventListener('play', () => this.updatePlayButton());
        this.video.addEventListener('pause', () => this.updatePlayButton());
        this.video.addEventListener('ended', () => this.handleVideoEnd());
        this.video.addEventListener('error', () => this.handleVideoError());
        this.video.addEventListener('loadstart', () => this.showLoading());
        this.video.addEventListener('canplay', () => this.hideLoading());

        // Control events
        document.addEventListener('click', (e) => {
            if (e.target.id === 'play-pause-btn' || e.target.closest('#play-pause-btn')) {
                this.togglePlay();
            } else if (e.target.id === 'repeat-btn' || e.target.closest('#repeat-btn')) {
                this.toggleRepeat();
            } else if (e.target.classList.contains('speed-btn')) {
                this.setSpeed(parseFloat(e.target.dataset.speed));
            }
        });

        // Progress bar events
        this.elements.progressBar?.addEventListener('click', (e) => this.handleProgressClick(e));
        this.elements.progressHandle?.addEventListener('mousedown', (e) => this.startDragging(e));
        
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) this.handleDragging(e);
        });
        
        document.addEventListener('mouseup', () => {
            if (this.isDragging) this.stopDragging();
        });

        // Controls visibility
        this.elements.player?.addEventListener('mouseenter', () => this.showControls());
        this.elements.player?.addEventListener('mouseleave', () => this.hideControlsWithDelay());
        this.elements.player?.addEventListener('mousemove', () => this.resetControlsTimeout());
    }

    /**
     * 動画の読み込み（アニメーション対応拡張版）
     */
    loadVideo(videoUrl, title) {
        if (!videoUrl) {
            this.showPlaceholder();
            return;
        }

        // Check if this is an animation HTML file
        if (videoUrl.endsWith('.html') && videoUrl.includes('assets/animations/')) {
            this.loadAnimation(videoUrl, title);
            return;
        }

        // Original video loading logic
        if (!this.video) {
            this.showPlaceholder();
            return;
        }

        this.showLoading();
        this.video.src = videoUrl;
        this.video.load();
        
        // Show video player, hide placeholder
        this.elements.player?.classList.remove('hidden');
        this.elements.placeholder?.classList.add('hidden');
        this.hideAnimationPlayer();
    }

    /**
     * アニメーションの読み込み（新機能）
     */
    loadAnimation(animationUrl, title) {
        // Create animation iframe container if it doesn't exist
        let animationContainer = document.getElementById('animation-container');
        if (!animationContainer) {
            animationContainer = document.createElement('div');
            animationContainer.id = 'animation-container';
            animationContainer.className = 'animation-container';
            animationContainer.innerHTML = `
                <iframe id="animation-frame" 
                        src="" 
                        style="width: 100%; height: 500px; border: none; border-radius: 15px; background: #f5f5f5;"
                        title="Interactive Animation">
                </iframe>
                <div class="animation-controls">
                    <button id="fullscreen-btn" class="animation-btn">
                        <span>🔍</span> フルスクリーン
                    </button>
                    <button id="reload-animation-btn" class="animation-btn">
                        <span>🔄</span> リロード
                    </button>
                </div>
            `;
            
            // Insert after video player
            const videoPlayer = document.getElementById('video-player');
            if (videoPlayer && videoPlayer.parentNode) {
                videoPlayer.parentNode.insertBefore(animationContainer, videoPlayer.nextSibling);
            }

            // Add animation controls event listeners
            this.setupAnimationControls();
        }

        // Load animation in iframe
        const iframe = document.getElementById('animation-frame');
        if (iframe) {
            iframe.src = animationUrl;
            iframe.title = title + ' - インタラクティブアニメーション';
        }

        // Show animation container, hide video player and placeholder
        animationContainer.classList.remove('hidden');
        this.elements.player?.classList.add('hidden');
        this.elements.placeholder?.classList.add('hidden');

        // Update animation controls
        this.updateAnimationTitle(title);
    }

    /**
     * アニメーション用コントロールの設定
     */
    setupAnimationControls() {
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        const reloadBtn = document.getElementById('reload-animation-btn');
        
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                const iframe = document.getElementById('animation-frame');
                if (iframe) {
                    if (iframe.requestFullscreen) {
                        iframe.requestFullscreen();
                    } else if (iframe.webkitRequestFullscreen) {
                        iframe.webkitRequestFullscreen();
                    } else if (iframe.mozRequestFullScreen) {
                        iframe.mozRequestFullScreen();
                    }
                }
            });
        }

        if (reloadBtn) {
            reloadBtn.addEventListener('click', () => {
                const iframe = document.getElementById('animation-frame');
                if (iframe && iframe.src) {
                    iframe.src = iframe.src; // Reload iframe
                }
            });
        }
    }

    /**
     * アニメーションタイトルの更新
     */
    updateAnimationTitle(title) {
        let titleElement = document.querySelector('.animation-title');
        if (!titleElement) {
            titleElement = document.createElement('div');
            titleElement.className = 'animation-title';
            titleElement.style.cssText = `
                text-align: center;
                margin-bottom: 15px;
                font-size: 16px;
                font-weight: 600;
                color: #2c3e50;
                padding: 10px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 8px;
                backdrop-filter: blur(10px);
            `;
            
            const animationContainer = document.getElementById('animation-container');
            if (animationContainer) {
                animationContainer.insertBefore(titleElement, animationContainer.firstChild);
            }
        }
        titleElement.textContent = title + ' - インタラクティブアニメーション';
    }

    /**
     * アニメーションプレイヤーを非表示
     */
    hideAnimationPlayer() {
        const animationContainer = document.getElementById('animation-container');
        if (animationContainer) {
            animationContainer.classList.add('hidden');
        }
    }

    /**
     * プレースホルダーの表示
     */
    showPlaceholder() {
        this.elements.player?.classList.add('hidden');
        this.elements.placeholder?.classList.remove('hidden');
    }

    /**
     * 再生/停止の切り替え
     */
    togglePlay() {
        if (!this.video) return;

        if (this.video.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    /**
     * 再生
     */
    play() {
        if (!this.video) return;
        
        this.video.play().catch(error => {
            console.error('再生エラー:', error);
            this.handleVideoError();
        });
    }

    /**
     * 停止
     */
    pause() {
        if (!this.video) return;
        this.video.pause();
    }

    /**
     * シーク機能
     */
    seek(seconds) {
        if (!this.video) return;
        
        const newTime = Math.max(0, Math.min(this.video.duration, this.video.currentTime + seconds));
        this.video.currentTime = newTime;
    }

    /**
     * 再生速度の設定
     */
    setSpeed(speed) {
        if (!this.video) return;
        
        this.playbackSpeed = speed;
        this.video.playbackRate = speed;
        
        // Update active speed button
        this.elements.speedBtns?.forEach(btn => {
            btn.classList.toggle('active', parseFloat(btn.dataset.speed) === speed);
        });
    }

    /**
     * リピートの切り替え
     */
    toggleRepeat() {
        this.isRepeating = !this.isRepeating;
        this.elements.repeatBtn?.classList.toggle('active', this.isRepeating);
    }

    /**
     * 再生ボタンの更新
     */
    updatePlayButton() {
        if (!this.elements.playPauseBtn) return;
        
        const icon = this.elements.playPauseBtn.querySelector('.play-icon');
        if (icon) {
            icon.textContent = this.video.paused ? '▶' : '⏸';
        }
    }

    /**
     * 進捗バーの更新
     */
    updateProgress() {
        if (!this.video || this.isDragging) return;
        
        const progress = (this.video.currentTime / this.video.duration) * 100;
        
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = `${progress}%`;
        }
        
        if (this.elements.progressHandle) {
            this.elements.progressHandle.style.left = `${progress}%`;
        }
        
        if (this.elements.currentTime) {
            this.elements.currentTime.textContent = this.formatTime(this.video.currentTime);
        }
    }

    /**
     * 総再生時間の更新
     */
    updateDuration() {
        if (!this.video || !this.elements.duration) return;
        
        this.elements.duration.textContent = this.formatTime(this.video.duration);
    }

    /**
     * 時間のフォーマット
     */
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * 進捗バークリック処理
     */
    handleProgressClick(e) {
        if (!this.video || !this.elements.progressBar) return;
        
        const rect = this.elements.progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickPercent = clickX / rect.width;
        const newTime = clickPercent * this.video.duration;
        
        this.video.currentTime = newTime;
    }

    /**
     * ドラッグ開始
     */
    startDragging(e) {
        e.preventDefault();
        this.isDragging = true;
        this.handleDragging(e);
    }

    /**
     * ドラッグ処理
     */
    handleDragging(e) {
        if (!this.isDragging || !this.video || !this.elements.progressBar) return;
        
        const rect = this.elements.progressBar.getBoundingClientRect();
        const dragX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const dragPercent = dragX / rect.width;
        const newTime = dragPercent * this.video.duration;
        
        this.video.currentTime = newTime;
        
        // Update visual progress during drag
        this.elements.progressFill.style.width = `${dragPercent * 100}%`;
        this.elements.progressHandle.style.left = `${dragPercent * 100}%`;
    }

    /**
     * ドラッグ終了
     */
    stopDragging() {
        this.isDragging = false;
    }

    /**
     * 動画終了時の処理
     */
    handleVideoEnd() {
        if (this.isRepeating) {
            this.video.currentTime = 0;
            this.play();
        } else {
            this.updatePlayButton();
        }
    }

    /**
     * 動画エラー処理
     */
    handleVideoError() {
        console.error('動画の読み込みに失敗しました');
        this.elements.player?.classList.add('error');
        this.hideLoading();
    }

    /**
     * ローディング表示
     */
    showLoading() {
        this.elements.player?.classList.add('loading');
    }

    /**
     * ローディング非表示
     */
    hideLoading() {
        this.elements.player?.classList.remove('loading');
    }

    /**
     * コントロール表示
     */
    showControls() {
        this.controlsVisible = true;
        this.elements.controls?.classList.add('show');
        this.resetControlsTimeout();
    }

    /**
     * コントロール非表示（遅延）
     */
    hideControlsWithDelay() {
        this.controlsTimeout = setTimeout(() => {
            this.controlsVisible = false;
            this.elements.controls?.classList.remove('show');
        }, 2000);
    }

    /**
     * コントロールタイムアウトリセット
     */
    resetControlsTimeout() {
        if (this.controlsTimeout) {
            clearTimeout(this.controlsTimeout);
        }
        this.hideControlsWithDelay();
    }
}

    /**
     * Phase 4: グリッド表示の設定
     */
    setupGridView() {
        const gridToggle = document.getElementById('grid-toggle');
        const contentGrid = document.getElementById('content-grid');
        
        if (!gridToggle || !contentGrid) return;

        // グリッド表示切り替え
        gridToggle.addEventListener('click', () => {
            const isActive = gridToggle.classList.contains('active');
            
            if (isActive) {
                gridToggle.classList.remove('active');
                contentGrid.classList.add('hidden');
                document.querySelector('.category-nav')?.classList.remove('hidden');
            } else {
                gridToggle.classList.add('active');
                this.populateGrid();
                contentGrid.classList.remove('hidden');
                document.querySelector('.category-nav')?.classList.add('hidden');
            }
        });

        // グリッドアイテムのクリックイベント
        document.addEventListener('click', (e) => {
            const gridItem = e.target.closest('.grid-item');
            if (gridItem && !e.target.closest('.favorite-btn')) {
                const contentId = gridItem.dataset.id;
                this.displayContent(contentId);
                // グリッド表示を終了してコンテンツ表示
                gridToggle.classList.remove('active');
                contentGrid.classList.add('hidden');
                document.querySelector('.category-nav')?.classList.remove('hidden');
                document.querySelector('.content')?.classList.remove('hidden');
            }
        });

        // 難易度フィルターボタンのクリックイベント
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('difficulty-filter-btn')) {
                // アクティブ状態の切り替え
                document.querySelectorAll('.difficulty-filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                
                // フィルタリングの実行
                const difficulty = e.target.dataset.difficulty;
                if (this.filterManager) {
                    this.filterManager.applyDifficultyFilter(difficulty);
                }
            }
        });
    }

    /**
     * Phase 4: グリッドの内容を生成
     */
    populateGrid() {
        const gridContainer = document.getElementById('grid-items');
        if (!gridContainer || !this.data) return;

        gridContainer.innerHTML = this.data.map(content => {
            const isViewed = this.progressManager?.isViewed(content.id) || false;
            const isFavorite = this.progressManager?.isFavorite(content.id) || false;
            const thumbnailUrl = this.relatedContentManager?.getThumbnailUrl(content) || 'assets/thumbnails/default.jpg';

            return `
                <div class="grid-item ${isViewed ? 'viewed' : ''}" data-id="${content.id}">
                    <div class="grid-item-thumbnail">
                        <img src="${thumbnailUrl}" 
                             alt="${content.title}"
                             onerror="this.src='assets/thumbnails/default.jpg'">
                        <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                                data-id="${content.id}">
                            <span class="favorite-icon">${isFavorite ? '★' : '☆'}</span>
                        </button>
                        <div class="grid-category">${content.category}</div>
                    </div>
                    <div class="grid-item-info">
                        <h3 class="grid-item-title">${content.title}</h3>
                        <p class="grid-item-description">${content.description.substring(0, 100)}...</p>
                        <div class="grid-item-meta">
                            <span class="grid-difficulty ${content.difficulty}">${content.difficulty}</span>
                            <span class="grid-duration">${content.duration}</span>
                        </div>
                        ${content.tags ? `
                            <div class="grid-tags">
                                ${content.tags.slice(0, 3).map(tag => 
                                    `<span class="grid-tag">${tag}</span>`
                                ).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        // グリッドアイテムのクリックイベント
        gridContainer.addEventListener('click', (e) => {
            const gridItem = e.target.closest('.grid-item');
            if (gridItem && !e.target.closest('.favorite-btn')) {
                const contentId = gridItem.dataset.id;
                this.displayContent(contentId);
                // グリッド表示を終了してコンテンツ表示
                document.getElementById('grid-toggle')?.classList.remove('active');
                document.getElementById('content-grid')?.classList.add('hidden');
                document.querySelector('.category-nav')?.classList.remove('hidden');
            }
        });
    }

    /**
     * 難易度フィルター機能の追加
     */
    setupDifficultyFilter() {
        const difficultyBtns = document.querySelectorAll('.difficulty-filter-btn');
        
        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const difficulty = btn.dataset.difficulty;
                
                // ボタンの状態を更新
                difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // フィルターを適用
                this.filterByDifficulty(difficulty);
            });
        });
    }

    /**
     * 難易度によるフィルタリング
     */
    filterByDifficulty(difficulty) {
        const allItems = document.querySelectorAll('.category-item, .grid-item');
        
        allItems.forEach(item => {
            const contentId = item.dataset.id;
            const content = this.data.find(c => c.id === contentId);
            
            if (difficulty === 'all' || content?.difficulty === difficulty) {
                item.style.display = '';
                item.parentElement?.style.setProperty('display', 'list-item');
            } else {
                item.style.display = 'none';
            }
        });

        // カテゴリグループの表示/非表示
        document.querySelectorAll('.category-group').forEach(group => {
            const visibleItems = group.querySelectorAll('.category-item[style*="display: none"]').length;
            const totalItems = group.querySelectorAll('.category-item').length;
            
            if (visibleItems === totalItems) {
                group.style.display = 'none';
            } else {
                group.style.display = 'block';
            }
        });
    }

    /**
     * 遅延読み込み機能の実装
     */
    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        // 遅延読み込み画像を監視
        document.querySelectorAll('img.lazy').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - Initializing InfographicTool');
    try {
        const app = new InfographicTool();
        console.log('InfographicTool initialized successfully');
        window.infographicTool = app; // グローバルアクセス用
    } catch (error) {
        console.error('Error initializing InfographicTool:', error);
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InfographicTool, VideoPlayer };
}