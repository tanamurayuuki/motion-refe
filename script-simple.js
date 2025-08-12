/**
 * シンプル版 - 基本機能のみ実装
 */

console.log('=== Simple script loaded ===');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - Simple version');
    
    // Check if elements exist
    const categoryItems = document.querySelectorAll('.category-item');
    const gridToggle = document.getElementById('grid-toggle');
    const searchInput = document.getElementById('search-input');
    
    console.log('Found elements:');
    console.log('- Category items:', categoryItems.length);
    console.log('- Grid toggle:', !!gridToggle);
    console.log('- Search input:', !!searchInput);
    
    if (categoryItems.length === 0) {
        console.warn('No category items found!');
    }
    
    // Category header click (accordion toggle)
    document.addEventListener('click', function(e) {
        console.log('Click detected on:', e.target);
        console.log('Target classes:', e.target.className);
        
        // Handle category header clicks
        if (e.target.classList.contains('category-header') || e.target.closest('.category-header')) {
            console.log('Category header clicked');
            const header = e.target.classList.contains('category-header') ? e.target : e.target.closest('.category-header');
            toggleAccordion(header);
            return;
        }
        
        // Handle category item clicks
        if (e.target.classList.contains('category-item')) {
            console.log('Category item clicked:', e.target.dataset.id);
            console.log('Element:', e.target);
            
            const contentId = e.target.dataset.id;
            displayContent(contentId);
            
            // Set active state
            document.querySelectorAll('.category-item').forEach(item => {
                item.classList.remove('active');
            });
            e.target.classList.add('active');
        }
    });
    
    // Grid toggle button
    document.addEventListener('click', function(e) {
        if (e.target.id === 'grid-toggle' || e.target.closest('#grid-toggle')) {
            console.log('Grid toggle clicked');
            toggleGrid();
        }
    });
    
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            console.log('Search input:', e.target.value);
            performSearch(e.target.value);
        });
    }
    
    // Difficulty filter buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('difficulty-filter-btn')) {
            console.log('Difficulty filter clicked:', e.target.dataset.difficulty);
            
            // Update active state
            document.querySelectorAll('.difficulty-filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            
            // Filter by difficulty
            filterByDifficulty(e.target.dataset.difficulty);
        }
    });
    
    // Load data and initialize
    loadData().then(data => {
        window.appData = data;
        console.log('Data loaded:', data);
    }).catch(error => {
        console.error('Error loading data:', error);
    });
});

/**
 * Load data from JSON file
 */
async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to load data:', error);
        return [];
    }
}

/**
 * Toggle accordion menu
 */
function toggleAccordion(header) {
    console.log('Toggling accordion for:', header);
    
    const categoryList = header.nextElementSibling;
    const icon = header.querySelector('.category-icon');
    
    if (!categoryList) {
        console.error('Category list not found');
        return;
    }
    
    const isExpanded = header.classList.contains('active');
    
    if (isExpanded) {
        // Close accordion
        header.classList.remove('active');
        categoryList.classList.remove('expanded');
        if (icon) icon.textContent = '▼';
        console.log('Accordion closed');
    } else {
        // Open accordion
        header.classList.add('active');
        categoryList.classList.add('expanded');
        if (icon) icon.textContent = '▲';
        console.log('Accordion opened');
    }
}

/**
 * Display content details
 */
function displayContent(contentId) {
    if (!window.appData) {
        console.error('Data not loaded');
        return;
    }
    
    const content = window.appData.find(item => item.id === contentId);
    if (!content) {
        console.error('Content not found:', contentId);
        return;
    }
    
    console.log('Displaying content:', content);
    
    // Hide welcome message
    const welcomeMessage = document.getElementById('welcome-message');
    const contentDisplay = document.getElementById('content-display');
    
    if (welcomeMessage) welcomeMessage.classList.add('hidden');
    if (contentDisplay) contentDisplay.classList.remove('hidden');
    
    // Update content
    const titleElement = document.getElementById('content-title');
    const categoryElement = document.getElementById('content-category');
    const descriptionElement = document.getElementById('content-description');
    const pointsElement = document.getElementById('content-points');
    const usageElement = document.getElementById('content-usage');
    
    if (titleElement) titleElement.textContent = content.title;
    if (categoryElement) categoryElement.textContent = content.category + ' > ' + content.subcategory;
    if (descriptionElement) descriptionElement.textContent = content.description;
    if (usageElement) usageElement.textContent = content.usage;
    
    if (pointsElement && content.points) {
        pointsElement.innerHTML = content.points.map(point => `<li>${point}</li>`).join('');
    }
    
    // Update video/animation
    const videoElement = document.getElementById('video-element');
    if (videoElement && content.video_url) {
        videoElement.src = content.video_url;
    }
}

/**
 * Toggle grid view
 */
function toggleGrid() {
    const gridToggle = document.getElementById('grid-toggle');
    const contentGrid = document.getElementById('content-grid');
    const categoryNav = document.querySelector('.category-nav');
    
    if (!gridToggle || !contentGrid) return;
    
    const isActive = gridToggle.classList.contains('active');
    
    if (isActive) {
        // Hide grid
        gridToggle.classList.remove('active');
        contentGrid.classList.add('hidden');
        if (categoryNav) categoryNav.classList.remove('hidden');
    } else {
        // Show grid
        gridToggle.classList.add('active');
        populateGrid();
        contentGrid.classList.remove('hidden');
        if (categoryNav) categoryNav.classList.add('hidden');
    }
}

/**
 * Populate grid with content
 */
function populateGrid() {
    const gridContainer = document.getElementById('grid-items');
    if (!gridContainer || !window.appData) return;
    
    gridContainer.innerHTML = window.appData.map(content => {
        return `
            <div class="grid-item" data-id="${content.id}">
                <div class="grid-item-thumbnail">
                    <img src="assets/thumbnails/default.jpg" alt="${content.title}">
                    <div class="grid-category">${content.category}</div>
                </div>
                <div class="grid-item-info">
                    <h3 class="grid-item-title">${content.title}</h3>
                    <p class="grid-item-description">${content.description.substring(0, 100)}...</p>
                    <div class="grid-item-meta">
                        <span class="grid-difficulty ${content.difficulty || 'medium'}">${content.difficulty || '中級'}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Add grid item click events
    document.querySelectorAll('.grid-item').forEach(item => {
        item.addEventListener('click', function(e) {
            const contentId = this.dataset.id;
            displayContent(contentId);
            
            // Hide grid and show content
            const gridToggle = document.getElementById('grid-toggle');
            const contentGrid = document.getElementById('content-grid');
            const categoryNav = document.querySelector('.category-nav');
            
            if (gridToggle) gridToggle.classList.remove('active');
            if (contentGrid) contentGrid.classList.add('hidden');
            if (categoryNav) categoryNav.classList.remove('hidden');
        });
    });
}

/**
 * Perform search
 */
function performSearch(searchTerm) {
    if (!window.appData) return;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    // Show/hide category items based on search
    document.querySelectorAll('.category-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        const contentId = item.dataset.id;
        const content = window.appData.find(c => c.id === contentId);
        
        let matches = text.includes(lowerSearchTerm);
        
        if (content) {
            matches = matches || 
                content.title.toLowerCase().includes(lowerSearchTerm) ||
                content.description.toLowerCase().includes(lowerSearchTerm) ||
                content.category.toLowerCase().includes(lowerSearchTerm) ||
                (content.keywords && content.keywords.some(k => k.toLowerCase().includes(lowerSearchTerm)));
        }
        
        if (searchTerm === '' || matches) {
            item.style.display = 'block';
            item.parentElement.style.display = 'list-item';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show/hide category groups
    document.querySelectorAll('.category-group').forEach(group => {
        const visibleItems = group.querySelectorAll('.category-item[style*="display: block"], .category-item:not([style*="display: none"])');
        const hiddenItems = group.querySelectorAll('.category-item[style*="display: none"]');
        
        if (visibleItems.length === 0) {
            group.style.display = 'none';
        } else {
            group.style.display = 'block';
            
            // Expand if searching
            if (searchTerm !== '') {
                const header = group.querySelector('.category-header');
                const list = group.querySelector('.category-list');
                if (header && list) {
                    header.classList.add('active');
                    list.classList.add('expanded');
                }
            }
        }
    });
}

/**
 * Filter by difficulty
 */
function filterByDifficulty(difficulty) {
    if (!window.appData) return;
    
    document.querySelectorAll('.category-item').forEach(item => {
        const contentId = item.dataset.id;
        const content = window.appData.find(c => c.id === contentId);
        
        if (difficulty === 'all' || !content || content.difficulty === difficulty) {
            item.style.display = 'block';
            item.parentElement.style.display = 'list-item';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Update category groups visibility
    document.querySelectorAll('.category-group').forEach(group => {
        const visibleItems = group.querySelectorAll('.category-item[style*="display: block"], .category-item:not([style*="display: none"])');
        
        if (visibleItems.length === 0) {
            group.style.display = 'none';
        } else {
            group.style.display = 'block';
        }
    });
}

console.log('Simple script setup complete');