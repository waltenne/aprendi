// scripts/verify-build.js
const fs = require('fs-extra');
const path = require('path');

async function verifyBuild() {
  console.log('🔍 Verificando build para GitHub Pages...');
  
  const outDir = path.join(__dirname, '../out');
  const basePath = '/aprendi';
  
  if (!await fs.pathExists(outDir)) {
    console.error('❌ Diretório "out" não encontrado');
    return;
  }
  
  // Verificar arquivos críticos
  const criticalFiles = [
    'index.html',
    '_next/static/css',
    '_next/static/chunks'
  ];
  
  for (const file of criticalFiles) {
    const filePath = path.join(outDir, file);
    const exists = await fs.pathExists(filePath);
    console.log(`${exists ? '✅' : '❌'} ${file}: ${exists ? 'OK' : 'FALTANDO'}`);
  }
  
  // Verificar index.html
  const indexPath = path.join(outDir, 'index.html');
  if (await fs.pathExists(indexPath)) {
    const content = await fs.readFile(indexPath, 'utf8');
    
    // Verificar se tem basePath
    const hasBasePath = content.includes(`${basePath}/_next/`);
    console.log(`📄 index.html tem basePath ${basePath}: ${hasBasePath ? '✅' : '❌'}`);
    
    // Contar ocorrências problemáticas
    const wrongPaths = (content.match(/\/_next\//g) || []).length;
    const correctPaths = (content.match(/\/aprendi\/_next\//g) || []).length;
    
    console.log(`🔗 Caminhos incorretos (_next/): ${wrongPaths}`);
    console.log(`🔗 Caminhos corretos (aprendi/_next/): ${correctPaths}`);
    
    if (wrongPaths > 0 && correctPaths === 0) {
      console.log('⚠️  AVISO: Os caminhos não foram corrigidos!');
      console.log('💡 Execute: npm run fix-asset-paths');
    }
  }
  
  // Listar estrutura
  console.log('\n📁 Estrutura do diretório out:');
  const items = await fs.readdir(outDir);
  console.log(items.map(item => `  📂 ${item}`).join('\n'));
}

if (require.main === module) {
  verifyBuild().catch(console.error);
}