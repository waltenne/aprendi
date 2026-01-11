// scripts/fix-asset-paths.js
const fs = require('fs-extra');
const path = require('path');

async function fixAssetPaths() {
  console.log('🔧 Corrigindo caminhos de assets para GitHub Pages...');
  
  const outDir = path.join(__dirname, '../out');
  const basePath = '/aprendi';
  
  // Verificar se o diretório out existe
  if (!await fs.pathExists(outDir)) {
    console.error('❌ Diretório "out" não encontrado. Execute npm run build primeiro.');
    process.exit(1);
  }
  
  // Encontrar todos os arquivos HTML
  const htmlFiles = await findFiles(outDir, '.html');
  
  console.log(`📄 Encontrados ${htmlFiles.length} arquivos HTML para corrigir`);
  
  let corrections = 0;
  
  for (const file of htmlFiles) {
    try {
      let content = await fs.readFile(file, 'utf8');
      let originalContent = content;
      
      // 1. Corrigir caminhos _next/static
      content = content.replace(
        /(src|href)="\/_next\/([^"]*)"/g,
        `$1="${basePath}/_next/$2"`
      );
      
      // 2. Corrigir caminhos de assets estáticos
      content = content.replace(
        /(src|href)="\/(images|instructors|courses|favicon\.ico)([^"]*)"/g,
        `$1="${basePath}/$2$3"`
      );
      
      // 3. Corrigir URLs de API (se houver)
      content = content.replace(
        /"\/api\/([^"]*)"/g,
        `"${basePath}/api/$1"`
      );
      
      // 4. Corrigir caminhos CSS
      content = content.replace(
        /url\(\/(_next\/[^)]*)\)/g,
        `url(${basePath}/$1)`
      );
      
      if (content !== originalContent) {
        await fs.writeFile(file, content, 'utf8');
        corrections++;
        console.log(`✅ Corrigido: ${path.relative(outDir, file)}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao corrigir ${file}:`, error.message);
    }
  }
  
  console.log(`🎉 Correções aplicadas: ${corrections} arquivos modificados`);
  
  // Verificar se o index.html tem os caminhos corretos
  const indexPath = path.join(outDir, 'index.html');
  if (await fs.pathExists(indexPath)) {
    const indexContent = await fs.readFile(indexPath, 'utf8');
    const hasBasePath = indexContent.includes(`${basePath}/_next/`);
    
    if (hasBasePath) {
      console.log('✅ index.html está com caminhos corretos!');
    } else {
      console.log('⚠️  index.html ainda pode ter problemas de caminho');
    }
  }
}

async function findFiles(dir, ext) {
  const files = [];
  
  async function walk(currentDir) {
    const items = await fs.readdir(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = await fs.stat(fullPath);
      
      if (stat.isDirectory()) {
        await walk(fullPath);
      } else if (item.endsWith(ext)) {
        files.push(fullPath);
      }
    }
  }
  
  await walk(dir);
  return files;
}

// Executar se chamado diretamente
if (require.main === module) {
  fixAssetPaths().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = { fixAssetPaths };