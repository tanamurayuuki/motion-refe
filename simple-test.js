const fs = require('fs');
const path = require('path');

// ファイル存在確認とサイズチェック
function analyzeAnimationFiles() {
    console.log('🔍 アニメーションファイルの分析を開始します...\n');
    
    const categories = [
        { name: '基本グラフ', folder: 'basic-graphs', files: [
            'bar-chart', 'line-chart', 'pie-chart', 'area-chart', 'scatter-chart',
            'bubble-chart', 'donut-chart', 'histogram', 'radar-chart', 'treemap-chart'
        ]},
        { name: '表現テクニック', folder: 'techniques', files: [
            'counter', 'gauge', 'timeline', 'flowchart', 'particles',
            'map-animation', 'treemap', 'sunburst', 'morphing', 'dashboard'
        ]},
        { name: '用途・シーン別', folder: 'use-cases', files: [
            'business-report', 'product-demo', 'education-campaign', 'company-history',
            'market-analysis', 'annual-report', 'customer-survey', 'project-management',
            'competitor-analysis', 'roi-analysis'
        ]}
    ];
    
    categories.forEach(category => {
        console.log(`\n📁 ${category.name} (${category.folder}):`);
        
        category.files.forEach(fileName => {
            const filePath = path.join(__dirname, 'assets', 'animations', category.folder, `${fileName}.html`);
            
            if (fs.existsSync(filePath)) {
                const stats = fs.statSync(filePath);
                const content = fs.readFileSync(filePath, 'utf8');
                
                // 基本チェック
                const hasCodeViewer = content.includes('code-viewer.css') && content.includes('code-viewer.js');
                const hasUseCase = content.includes('use-case');
                const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
                const widthMatch = content.match(/const width = (\d+)/);
                const heightMatch = content.match(/const height = (\d+)/);
                
                console.log(`  ${fileName}.html:`);
                console.log(`    ✅ サイズ: ${(stats.size / 1024).toFixed(1)}KB`);
                console.log(`    ${hasCodeViewer ? '✅' : '❌'} コードビューアー: ${hasCodeViewer ? '統合済み' : '未統合'}`);
                
                if (category.folder === 'use-cases') {
                    console.log(`    ${hasUseCase ? '✅' : '❌'} use-caseクラス: ${hasUseCase ? '設定済み' : '未設定'}`);
                }
                
                if (viewBoxMatch) {
                    console.log(`    📏 viewBox: ${viewBoxMatch[1]}`);
                } else {
                    console.log(`    ❌ viewBox: 見つかりません`);
                }
                
                if (widthMatch && heightMatch) {
                    console.log(`    📐 JS寸法: ${widthMatch[1]}×${heightMatch[1]}`);
                } else {
                    console.log(`    ❌ JS寸法: 見つかりません`);
                }
                
                // 潜在的な問題をチェック
                const issues = [];
                
                if (category.folder === 'use-cases') {
                    if (!viewBoxMatch || viewBoxMatch[1] !== '0 0 900 450') {
                        issues.push('viewBoxが900×450ではありません');
                    }
                    if (!widthMatch || widthMatch[1] !== '900') {
                        issues.push('JS幅が900ではありません');
                    }
                    if (!heightMatch || heightMatch[1] !== '450') {
                        issues.push('JS高さが450ではありません');
                    }
                    if (!hasUseCase) {
                        issues.push('use-caseクラスが設定されていません');
                    }
                }
                
                if (!hasCodeViewer) {
                    issues.push('コードビューアーが統合されていません');
                }
                
                if (issues.length > 0) {
                    console.log(`    ⚠️  問題: ${issues.join(', ')}`);
                }
                
            } else {
                console.log(`  ❌ ${fileName}.html: ファイルが見つかりません`);
            }
        });
    });
    
    // CSSファイルの確認
    console.log('\n\n🎨 CSSファイルの分析:');
    
    const cssFiles = [
        'assets/animations/styles/animations.css',
        'assets/animations/styles/charts.css', 
        'assets/animations/styles/code-viewer.css'
    ];
    
    cssFiles.forEach(cssFile => {
        const filePath = path.join(__dirname, cssFile);
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            const content = fs.readFileSync(filePath, 'utf8');
            
            console.log(`  ${path.basename(cssFile)}:`);
            console.log(`    ✅ サイズ: ${(stats.size / 1024).toFixed(1)}KB`);
            
            // 重要なCSSルールの確認
            if (cssFile.includes('animations.css')) {
                const hasUseCaseClass = content.includes('.animation-container.use-case');
                const hasChartAreaUseCase = content.includes('.chart-area.use-case');
                console.log(`    ${hasUseCaseClass ? '✅' : '❌'} use-case container: ${hasUseCaseClass ? '設定済み' : '未設定'}`);
                console.log(`    ${hasChartAreaUseCase ? '✅' : '❌'} use-case chart-area: ${hasChartAreaUseCase ? '設定済み' : '未設定'}`);
            }
            
            if (cssFile.includes('charts.css')) {
                const hasUseCaseSVG = content.includes('product-demo-container .chart-svg');
                console.log(`    ${hasUseCaseSVG ? '✅' : '❌'} use-case SVG: ${hasUseCaseSVG ? '設定済み' : '未設定'}`);
            }
            
        } else {
            console.log(`  ❌ ${path.basename(cssFile)}: ファイルが見つかりません`);
        }
    });
    
    console.log('\n🎉 分析完了!\n');
}

analyzeAnimationFiles();