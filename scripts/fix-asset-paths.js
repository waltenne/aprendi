// scripts/fix-asset-paths.js - versão enxuta
const fs = require('fs-extra');
const path = require('path');

const basePath = '/aprendi';
const siteHost = process.env.NEXT_PUBLIC_SITE_URL || 'https://waltenne.github.io';
const siteBase = `${siteHost.replace(/\/$/, '')}${basePath}`;

async function fixAssetPaths() {
  const outDir = path.join(__dirname, '../out');
  if (!await fs.pathExists(outDir)) {
    console.error('❌ Diretório "out" não encontrado. Execute npm run build primeiro.');
    process.exit(1);
  }

  const htmlFiles = await findFiles(outDir, '.html');
  let corrections = 0;

  for (const file of htmlFiles) {
    let content = await fs.readFile(file, 'utf8');
    const original = content;

    content = content.replace(/(src|href)="\/_next\/([^"\s]*)"/g, `$1="${basePath}/_next/$2`);
    content = content.replace(/(src|href)="\/(images|instructors|courses|favicon\.ico)([^"\s]*)"/g, `$1="${basePath}/$2$3`);
    content = content.replace(/"\/api\/([^"\s]*)"/g, `"${basePath}/api/$1"`);
    content = content.replace(/http:\/\/localhost:3000/g, siteBase);
    content = content.replace(/href=\\"\/images\//g, `href=\\"${basePath}/images/`);
    content = content.replace(/href=\"\/images\//g, `href=\"${basePath}/images/`);
    content = content.replace(/"\/images\//g, `"${basePath}/images/`);
    content = content.replace(/src=\"\/images\//g, `src=\"${basePath}/images/`);
    content = content.replace(/url\(\/_next\/([^)]*)\)/g, `url(${basePath}/_next/$1)`);

    if (content !== original) {
      await fs.writeFile(file, content, 'utf8');
      corrections++;
      console.log(`✅ Corrigido: ${path.relative(outDir, file)}`);
    }
  }

  console.log(`🎉 Correções aplicadas: ${corrections} arquivos modificados`);

  const indexPath = path.join(outDir, 'index.html');
  if (await fs.pathExists(indexPath)) {
    const indexContent = await fs.readFile(indexPath, 'utf8');
    const hasBase = indexContent.includes(`${basePath}/_next/`);
    console.log(hasBase ? '✅ index.html está com caminhos corretos!' : '⚠️  index.html ainda pode ter problemas de caminho');
  }
}

async function findFiles(dir, ext) {
  const files = [];
  async function walk(currentDir) {
    const items = await fs.readdir(currentDir);
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) await walk(fullPath);
      else if (item.endsWith(ext)) files.push(fullPath);
    }
  }
  await walk(dir);
  return files;
}

if (require.main === module) fixAssetPaths().catch(err => { console.error('❌ Erro fatal:', err); process.exit(1); });

module.exports = { fixAssetPaths };