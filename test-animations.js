const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testAnimations() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    console.log('🚀 インフォグラフィックアニメーション学習ツールのテストを開始します...\n');
    
    // スクリーンショット保存ディレクトリの作成
    const screenshotDir = './test-screenshots';
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir);
    }
    
    // 用途・シーン別アニメーションのテスト
    const useCases = [
        'business-report',
        'product-demo', 
        'education-campaign',
        'company-history',
        'market-analysis',
        'annual-report',
        'customer-survey',
        'project-management',
        'competitor-analysis',
        'roi-analysis'
    ];
    
    console.log('📊 用途・シーン別アニメーションのテスト:');
    
    for (const useCase of useCases) {
        try {
            const url = `file://${__dirname}/assets/animations/use-cases/${useCase}.html`;
            console.log(`\n⏳ テスト中: ${useCase}`);
            
            await page.goto(url);
            await page.waitForTimeout(2000); // アニメーション読み込み待機
            
            // スクリーンショット撮影
            await page.screenshot({ 
                path: `${screenshotDir}/${useCase}.png`,
                fullPage: true 
            });
            
            // 基本的な要素の存在確認
            const title = await page.locator('.chart-title').textContent();
            const svg = await page.locator('.chart-svg').count();
            const controls = await page.locator('.control-panel').count();
            
            console.log(`  ✅ タイトル: ${title}`);
            console.log(`  ✅ SVG要素: ${svg}個`);
            console.log(`  ✅ コントロールパネル: ${controls}個`);
            
            // レイアウト崩れの検出
            const svgBox = await page.locator('.chart-svg').boundingBox();
            if (svgBox) {
                console.log(`  📏 SVGサイズ: ${svgBox.width}×${svgBox.height}`);
                
                if (svgBox.width < 300 || svgBox.height < 200) {
                    console.log(`  ⚠️  警告: SVGサイズが小さすぎます`);
                }
            }
            
            // テキストオーバーフローの検出
            const textElements = await page.locator('text').all();
            let overflowCount = 0;
            
            for (const textElement of textElements) {
                const box = await textElement.boundingBox();
                if (box && (box.x < 0 || box.y < 0)) {
                    overflowCount++;
                }
            }
            
            if (overflowCount > 0) {
                console.log(`  ⚠️  警告: ${overflowCount}個のテキスト要素がオーバーフローしています`);
            }
            
        } catch (error) {
            console.log(`  ❌ エラー: ${error.message}`);
        }
    }
    
    // 基本グラフのテスト
    const basicGraphs = [
        'bar-chart',
        'line-chart', 
        'pie-chart',
        'area-chart',
        'scatter-chart',
        'bubble-chart',
        'donut-chart',
        'histogram',
        'radar-chart',
        'treemap-chart'
    ];
    
    console.log('\n\n📈 基本グラフアニメーションのテスト:');
    
    for (const graph of basicGraphs) {
        try {
            const url = `file://${__dirname}/assets/animations/basic-graphs/${graph}.html`;
            console.log(`\n⏳ テスト中: ${graph}`);
            
            await page.goto(url);
            await page.waitForTimeout(1500);
            
            await page.screenshot({ 
                path: `${screenshotDir}/basic-${graph}.png`,
                fullPage: true 
            });
            
            const title = await page.locator('.chart-title').textContent();
            const svg = await page.locator('.chart-svg').count();
            
            console.log(`  ✅ タイトル: ${title}`);
            console.log(`  ✅ SVG要素: ${svg}個`);
            
        } catch (error) {
            console.log(`  ❌ エラー: ${error.message}`);
        }
    }
    
    // 表現テクニックのテスト
    const techniques = [
        'counter',
        'gauge',
        'timeline',
        'flowchart',
        'particles',
        'map-animation',
        'treemap',
        'sunburst',
        'morphing',
        'dashboard'
    ];
    
    console.log('\n\n🎨 表現テクニックアニメーションのテスト:');
    
    for (const technique of techniques) {
        try {
            const url = `file://${__dirname}/assets/animations/techniques/${technique}.html`;
            console.log(`\n⏳ テスト中: ${technique}`);
            
            await page.goto(url);
            await page.waitForTimeout(1500);
            
            await page.screenshot({ 
                path: `${screenshotDir}/technique-${technique}.png`,
                fullPage: true 
            });
            
            const title = await page.locator('.chart-title').textContent();
            const svg = await page.locator('.chart-svg').count();
            
            console.log(`  ✅ タイトル: ${title}`);
            console.log(`  ✅ SVG要素: ${svg}個`);
            
        } catch (error) {
            console.log(`  ❌ エラー: ${error.message}`);
        }
    }
    
    console.log('\n\n🎉 テスト完了! スクリーンショットは ./test-screenshots/ フォルダに保存されました。');
    
    await browser.close();
}

// テスト実行
testAnimations().catch(console.error);