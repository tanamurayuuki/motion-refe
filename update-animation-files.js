/**
 * Animation Files Bulk Update Script
 * 全アニメーションファイルにコード表示機能を追加するスクリプト
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// ファイルパターン
const animationFiles = glob.sync('assets/animations/**/*.html');

console.log(`Found ${animationFiles.length} animation files to update`);

animationFiles.forEach((filePath, index) => {
    try {
        console.log(`Processing: ${filePath}`);
        
        // ファイル読み込み
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 相対パスを計算（基準: assets/animations/からの深さ）
        const depth = filePath.split('/').length - 3; // assets/animations/ を除いた深さ
        const relativePath = '../'.repeat(depth);
        
        // 1. CSSリンク追加（既に追加済みでない場合）
        if (!content.includes('code-viewer.css')) {
            content = content.replace(
                /(<link rel="stylesheet" href="[^"]*charts\.css">)/,
                `$1\n    <link rel="stylesheet" href="${relativePath}styles/code-viewer.css">`
            );
        }
        
        // 2. スクリプト追加（既に追加済みでない場合）
        if (!content.includes('code-viewer.js')) {
            content = content.replace(
                /(\s*)<\/body>/,
                `$1\n    <!-- Code Viewer Scripts -->\n    <script src="${relativePath}scripts/prism-setup.js"></script>\n    <script src="${relativePath}scripts/code-viewer.js"></script>\n</body>`
            );
        }
        
        // ファイル書き込み
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Updated: ${filePath}`);
        
    } catch (error) {
        console.error(`✗ Error updating ${filePath}:`, error.message);
    }
});

console.log(`\n✓ Update completed for ${animationFiles.length} files`);