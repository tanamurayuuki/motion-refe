/**
 * 動作確認済み版 - メインアプリ用
 */

console.log('=== Working script loaded ===');

// アプリケーションのデータ
let appData = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded - Working version');
    
    // データを読み込み
    try {
        appData = await loadData();
        console.log('Data loaded successfully:', appData.length, 'items');
    } catch (error) {
        console.error('Failed to load data:', error);
        appData = [];
    }
    
    // イベントリスナーを設定
    setupEventListeners();
    
    console.log('App initialization complete');
});

/**
 * データ読み込み（キャッシュ回避）
 */
async function loadData() {
    try {
        // キャッシュバスターを追加
        const cacheBuster = '?v=' + Date.now();
        const response = await fetch('data.json' + cacheBuster, {
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Data loaded with cache buster:', data.length, 'items');
        return data;
    } catch (error) {
        console.error('Failed to load data:', error);
        return [];
    }
}

/**
 * イベントリスナーの設定
 */
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // メインのクリックイベント
    document.addEventListener('click', function(e) {
        console.log('Click on:', e.target.tagName, e.target.className);
        
        // カテゴリヘッダーのクリック（アコーディオン）
        if (e.target.classList.contains('category-header') || e.target.closest('.category-header')) {
            const header = e.target.classList.contains('category-header') ? e.target : e.target.closest('.category-header');
            console.log('Category header clicked');
            toggleAccordion(header);
            return;
        }
        
        // カテゴリアイテムのクリック
        if (e.target.classList.contains('category-item')) {
            console.log('Category item clicked:', e.target.dataset.id);
            const contentId = e.target.dataset.id;
            displayContent(contentId);
            setActiveItem(e.target);
            return;
        }
        
        // グリッド切り替えボタン
        if (e.target.id === 'grid-toggle' || e.target.closest('#grid-toggle')) {
            console.log('Grid toggle clicked');
            toggleGrid();
            return;
        }
        
        // 難易度フィルターボタン
        if (e.target.classList.contains('difficulty-filter-btn')) {
            console.log('Difficulty filter clicked:', e.target.dataset.difficulty);
            setDifficultyFilter(e.target);
            return;
        }
        
        // 人気検索ワードボタン
        if (e.target.classList.contains('popular-tag')) {
            console.log('Popular tag clicked:', e.target.dataset.search);
            performSearch(e.target.dataset.search);
            return;
        }
    });
    
    // 検索入力
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            console.log('Search input:', e.target.value);
            performSearch(e.target.value);
        });
    }
    
    // 検索クリアボタン
    const clearSearchBtn = document.getElementById('clear-search');
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            console.log('Clear search clicked');
            searchInput.value = '';
            performSearch('');
        });
    }
    
    console.log('Event listeners setup complete');
}

/**
 * アコーディオンの切り替え
 */
function toggleAccordion(header) {
    const categoryList = header.nextElementSibling;
    const icon = header.querySelector('.category-icon');
    
    if (!categoryList) {
        console.error('Category list not found');
        return;
    }
    
    const isExpanded = header.classList.contains('active');
    
    if (isExpanded) {
        header.classList.remove('active');
        categoryList.classList.remove('expanded');
        if (icon) icon.textContent = '▼';
        console.log('Accordion closed');
    } else {
        header.classList.add('active');
        categoryList.classList.add('expanded');
        if (icon) icon.textContent = '▲';
        console.log('Accordion opened');
    }
}

/**
 * コンテンツ表示
 */
function displayContent(contentId) {
    console.log('=== Displaying content:', contentId, '===');
    
    if (!appData || appData.length === 0) {
        console.error('App data not loaded');
        return;
    }
    
    const content = appData.find(item => item.id === contentId);
    if (!content) {
        console.error('Content not found:', contentId);
        console.log('Available content IDs:', appData.map(item => item.id));
        return;
    }
    
    console.log('Content found:', content.title);
    console.log('Content data:', content);
    
    // ウェルカムメッセージを隠してコンテンツ表示を表示
    const welcomeMessage = document.getElementById('welcome-message');
    const contentDisplay = document.getElementById('content-display');
    
    if (welcomeMessage) {
        welcomeMessage.classList.add('hidden');
        console.log('Welcome message hidden');
    }
    
    if (contentDisplay) {
        contentDisplay.classList.remove('hidden');
        console.log('Content display shown');
    }
    
    // コンテンツ情報を更新
    updateContentDetails(content);
    
    // 動画/アニメーションの更新
    updateVideoPlayer(content);
    
    console.log('Content display complete:', content.title);
    console.log('=== End content display ===');
}

/**
 * コンテンツ詳細の更新
 */
function updateContentDetails(content) {
    // タイトルとカテゴリ
    const titleElement = document.getElementById('content-title');
    const categoryElement = document.getElementById('content-category');
    
    if (titleElement) {
        titleElement.textContent = content.title;
        titleElement.dataset.id = content.id; // お気に入り機能用
    }
    
    if (categoryElement) {
        categoryElement.textContent = `${content.category} > ${content.subcategory}`;
    }
    
    // 説明
    const descriptionElement = document.getElementById('content-description');
    if (descriptionElement) {
        descriptionElement.textContent = content.description;
    }
    
    // 表現のポイント
    const pointsElement = document.getElementById('content-points');
    if (pointsElement && content.points) {
        pointsElement.innerHTML = content.points
            .map(point => `<li>${point}</li>`)
            .join('');
    }
    
    // 主な用途
    const usageElement = document.getElementById('content-usage');
    if (usageElement) {
        usageElement.textContent = content.usage;
    }
    
    // 学習目標
    const objectivesElement = document.getElementById('learning-objectives');
    if (objectivesElement && content.learning_objectives) {
        objectivesElement.innerHTML = content.learning_objectives
            .map(objective => `<li>${objective}</li>`)
            .join('');
    }
    
    // タグ
    const tagsElement = document.getElementById('content-tags');
    if (tagsElement && content.tags) {
        tagsElement.innerHTML = content.tags
            .map(tag => `<span class="content-tag">${tag}</span>`)
            .join('');
    }
    
    // 難易度と時間
    const difficultyElement = document.getElementById('content-difficulty');
    const durationElement = document.getElementById('content-duration');
    
    if (difficultyElement && content.difficulty) {
        difficultyElement.textContent = content.difficulty;
        difficultyElement.className = `difficulty-badge ${content.difficulty}`;
    }
    
    if (durationElement && content.duration) {
        durationElement.textContent = content.duration;
    }
}

/**
 * 動画プレイヤーの更新
 */
function updateVideoPlayer(content) {
    console.log('Updating video player for:', content.title);
    console.log('Video URL:', content.video_url);
    
    const videoElement = document.getElementById('video-element');
    const videoPlayer = document.getElementById('video-player');
    const videoPlaceholder = document.getElementById('video-placeholder');
    const animationContainer = document.querySelector('.animation-container');
    
    if (content.video_url) {
        console.log('Video URL found, updating player...');
        
        if (content.video_url.endsWith('.html')) {
            // HTMLアニメーションの場合はiframeを使用（キャッシュ回避）
            console.log('Loading HTML animation via iframe');
            
            if (animationContainer) {
                // キャッシュバスターを追加
                const cacheBuster = '?v=' + Date.now();
                const iframeSrc = content.video_url + cacheBuster;
                
                // 既存のiframeを完全に削除してから新しく作成
                animationContainer.innerHTML = '';
                
                setTimeout(() => {
                    // カテゴリに応じて適切な高さを設定
                    let iframeHeight = '500px';
                    if (content.category === 'use-cases') {
                        iframeHeight = '600px'; // 用途・シーン別は大きなレイアウトのため高くする
                    } else if (content.category === 'techniques') {
                        iframeHeight = '550px'; // 表現テクニックもやや高く
                    }
                    
                    animationContainer.innerHTML = `
                        <div class="iframe-container" style="position: relative; width: 100%; height: ${iframeHeight}; background: #f8f9fa; border-radius: 8px; overflow: hidden;">
                            <iframe src="${iframeSrc}" 
                                    style="width: 100%; height: 100%; border: none; transform: scale(1);"
                                    title="${content.title}"
                                    onload="console.log('Iframe loaded:', '${content.title}')">
                            </iframe>
                        </div>
                    `;
                    console.log('Iframe created with URL:', iframeSrc, 'Height:', iframeHeight);
                }, 100);
            }
            
            // ビデオプレイヤーを隠す
            if (videoPlayer) videoPlayer.classList.add('hidden');
            if (videoPlaceholder) videoPlaceholder.classList.add('hidden');
            
        } else {
            // 通常の動画ファイル
            console.log('Loading video file');
            
            // iframeコンテナをクリア
            if (animationContainer) {
                animationContainer.innerHTML = `
                    <div class="video-player" id="video-player">
                        <video id="video-element" class="video-element" preload="metadata">
                            <source src="" type="video/mp4">
                            お使いのブラウザは動画タグに対応していません。
                        </video>
                        <div class="video-placeholder hidden" id="video-placeholder">
                            <div class="video-placeholder__content">
                                <div class="play-icon">▶</div>
                                <p>アニメーション再生エリア</p>
                            </div>
                        </div>
                    </div>
                `;
                
                // 新しく作成されたビデオ要素を取得
                const newVideoElement = document.getElementById('video-element');
                if (newVideoElement) {
                    newVideoElement.src = content.video_url;
                }
            }
            
            if (videoPlayer) videoPlayer.classList.remove('hidden');
            if (videoPlaceholder) videoPlaceholder.classList.add('hidden');
        }
    } else {
        // 動画がない場合はプレースホルダーを表示
        console.log('No video URL, showing placeholder');
        
        if (animationContainer) {
            animationContainer.innerHTML = `
                <div class="video-placeholder" id="video-placeholder">
                    <div class="video-placeholder__content">
                        <div class="play-icon">▶</div>
                        <p>アニメーション再生エリア</p>
                        <p>動画ファイルが見つかりません</p>
                    </div>
                </div>
            `;
        }
        
        if (videoPlayer) videoPlayer.classList.add('hidden');
    }
    
    console.log('Video player update complete');
}

/**
 * アクティブアイテムの設定
 */
function setActiveItem(element) {
    // 既存のactiveクラスをすべて削除
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 新しいアクティブアイテムにクラス追加
    element.classList.add('active');
    
    console.log('Active item set:', element.dataset.id);
}

/**
 * グリッド表示の切り替え
 */
function toggleGrid() {
    const gridToggle = document.getElementById('grid-toggle');
    const contentGrid = document.getElementById('content-grid');
    const categoryNav = document.querySelector('.category-nav');
    const content = document.querySelector('.content');
    
    if (!gridToggle || !contentGrid) {
        console.error('Grid elements not found');
        return;
    }
    
    const isActive = gridToggle.classList.contains('active');
    
    if (isActive) {
        // グリッド表示を閉じる
        gridToggle.classList.remove('active');
        contentGrid.classList.add('hidden');
        if (categoryNav) categoryNav.classList.remove('hidden');
        if (content) content.classList.remove('hidden');
        console.log('Grid view closed');
    } else {
        // グリッド表示を開く
        gridToggle.classList.add('active');
        populateGrid();
        contentGrid.classList.remove('hidden');
        if (categoryNav) categoryNav.classList.add('hidden');
        if (content) content.classList.add('hidden');
        console.log('Grid view opened');
    }
}

/**
 * グリッドの内容を生成
 */
function populateGrid() {
    const gridContainer = document.getElementById('grid-items');
    if (!gridContainer || !appData || appData.length === 0) {
        console.error('Cannot populate grid: missing container or data');
        return;
    }
    
    gridContainer.innerHTML = appData.map(content => {
        const thumbnailUrl = `assets/thumbnails/default.jpg`; // デフォルトサムネイル
        
        return `
            <div class="grid-item" data-id="${content.id}">
                <div class="grid-item-thumbnail">
                    <img src="${thumbnailUrl}" 
                         alt="${content.title}"
                         onerror="this.src='assets/thumbnails/default.jpg'">
                    <div class="grid-category">${content.category}</div>
                </div>
                <div class="grid-item-info">
                    <h3 class="grid-item-title">${content.title}</h3>
                    <p class="grid-item-description">${content.description.substring(0, 100)}...</p>
                    <div class="grid-item-meta">
                        <span class="grid-difficulty ${content.difficulty || 'medium'}">${content.difficulty || '中級'}</span>
                        <span class="grid-duration">${content.duration || '中時間'}</span>
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
    gridContainer.addEventListener('click', function(e) {
        const gridItem = e.target.closest('.grid-item');
        if (gridItem) {
            const contentId = gridItem.dataset.id;
            console.log('Grid item clicked:', contentId);
            
            // コンテンツを表示
            displayContent(contentId);
            
            // グリッド表示を閉じる
            const gridToggle = document.getElementById('grid-toggle');
            const contentGrid = document.getElementById('content-grid');
            const categoryNav = document.querySelector('.category-nav');
            const content = document.querySelector('.content');
            
            if (gridToggle) gridToggle.classList.remove('active');
            if (contentGrid) contentGrid.classList.add('hidden');
            if (categoryNav) categoryNav.classList.remove('hidden');
            if (content) content.classList.remove('hidden');
        }
    });
    
    console.log('Grid populated with', appData.length, 'items');
}

/**
 * 難易度フィルターの設定
 */
function setDifficultyFilter(button) {
    const difficulty = button.dataset.difficulty;
    
    // アクティブ状態の更新
    document.querySelectorAll('.difficulty-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
    
    // フィルタリングの実行
    filterByDifficulty(difficulty);
    
    console.log('Difficulty filter set:', difficulty);
}

/**
 * 難易度でフィルタリング
 */
function filterByDifficulty(difficulty) {
    if (!appData || appData.length === 0) return;
    
    document.querySelectorAll('.category-item').forEach(item => {
        const contentId = item.dataset.id;
        const content = appData.find(c => c.id === contentId);
        
        if (difficulty === 'all' || !content || content.difficulty === difficulty) {
            item.style.display = 'block';
            item.parentElement.style.display = 'list-item';
        } else {
            item.style.display = 'none';
        }
    });
    
    // カテゴリグループの表示/非表示を更新
    updateCategoryGroupsVisibility();
    
    console.log('Filtered by difficulty:', difficulty);
}

/**
 * 検索実行
 */
function performSearch(searchTerm) {
    if (!appData || appData.length === 0) return;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    console.log('Performing search:', searchTerm);
    
    document.querySelectorAll('.category-item').forEach(item => {
        const contentId = item.dataset.id;
        const content = appData.find(c => c.id === contentId);
        const text = item.textContent.toLowerCase();
        
        let matches = text.includes(lowerSearchTerm);
        
        if (content && !matches) {
            matches = content.title.toLowerCase().includes(lowerSearchTerm) ||
                     content.description.toLowerCase().includes(lowerSearchTerm) ||
                     content.category.toLowerCase().includes(lowerSearchTerm) ||
                     (content.keywords && content.keywords.some(k => k.toLowerCase().includes(lowerSearchTerm))) ||
                     (content.tags && content.tags.some(t => t.toLowerCase().includes(lowerSearchTerm)));
        }
        
        if (searchTerm === '' || matches) {
            item.style.display = 'block';
            item.parentElement.style.display = 'list-item';
        } else {
            item.style.display = 'none';
        }
    });
    
    // カテゴリグループの表示/非表示を更新
    updateCategoryGroupsVisibility();
    
    // 検索結果がある場合はアコーディオンを開く
    if (searchTerm !== '') {
        document.querySelectorAll('.category-group').forEach(group => {
            const visibleItems = group.querySelectorAll('.category-item[style*="display: block"], .category-item:not([style*="display: none"])');
            if (visibleItems.length > 0) {
                const header = group.querySelector('.category-header');
                const list = group.querySelector('.category-list');
                if (header && list) {
                    header.classList.add('active');
                    list.classList.add('expanded');
                }
            }
        });
    }
    
    console.log('Search complete');
}

/**
 * カテゴリグループの表示/非表示を更新
 */
function updateCategoryGroupsVisibility() {
    document.querySelectorAll('.category-group').forEach(group => {
        const visibleItems = group.querySelectorAll('.category-item[style*="display: block"], .category-item:not([style*="display: none"])');
        
        if (visibleItems.length === 0) {
            group.style.display = 'none';
        } else {
            group.style.display = 'block';
        }
    });
}

console.log('Working script setup complete');