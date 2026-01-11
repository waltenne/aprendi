// scripts/copy-images.js
const fs = require('fs-extra');
const path = require('path');

async function copyImages() {
  console.log('🖼️  Copiando imagens...');
  
  const publicDir = path.join(__dirname, '../public');
  const outDir = path.join(__dirname, '../out');
  
  if (!await fs.pathExists(publicDir)) {
    console.log('⚠️  Pasta public não encontrada, pulando cópia de imagens');
    return;
  }
  
  // Garantir que o diretório out existe
  await fs.ensureDir(outDir);
  
  // Copiar toda a pasta public para out
  await fs.copy(publicDir, outDir, {
    overwrite: true,
    errorOnExist: false
  });
  
  console.log('✅ Imagens copiadas de public/ para out/');
  
  // Também copiar para subdiretório aprendi (para garantir)
  const subdir = path.join(outDir, 'aprendi');
  await fs.ensureDir(subdir);
  await fs.copy(publicDir, subdir, {
    overwrite: true
  });
  
  console.log('✅ Imagens também copiadas para out/aprendi/ (backup)');
}

if (require.main === module) {
  copyImages().catch(error => {
    console.error('❌ Erro ao copiar imagens:', error);
    process.exit(1);
  });
}

module.exports = { copyImages };