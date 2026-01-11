#!/usr/bin/env node

/**
 * Script para copiar imagens de cursos e instrutores para a pasta public
 * Necessário para o build estático do Next.js funcionar no GitHub Pages
 */

const fs = require('fs');
const path = require('path');

const COURSES_DIR = path.join(process.cwd(), 'content', 'courses');
const INSTRUCTORS_DIR = path.join(process.cwd(), 'content', 'instructors');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Cria diretórios na public se não existirem
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Copia arquivo
function copyFile(src, dest) {
  try {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copiado: ${path.basename(dest)}`);
  } catch (error) {
    console.error(`✗ Erro ao copiar ${src}:`, error.message);
  }
}

// Copia imagens dos cursos
function copyCourseImages() {
  console.log('\n📦 Copiando imagens dos cursos...');
  
  const coursesPublicDir = path.join(PUBLIC_DIR, 'courses');
  ensureDir(coursesPublicDir);
  
  if (!fs.existsSync(COURSES_DIR)) {
    console.log('⚠️  Diretório de cursos não encontrado');
    return;
  }
  
  const courses = fs.readdirSync(COURSES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  let count = 0;
  
  for (const courseSlug of courses) {
    const logoPath = path.join(COURSES_DIR, courseSlug, 'images', 'logo');
    
    if (!fs.existsSync(logoPath)) {
      continue;
    }
    
    // Cria diretório do curso
    const coursePublicDir = path.join(coursesPublicDir, courseSlug);
    ensureDir(coursePublicDir);
    
    // Copia todas as imagens
    const images = fs.readdirSync(logoPath);
    for (const image of images) {
      const srcPath = path.join(logoPath, image);
      const destPath = path.join(coursePublicDir, image);
      copyFile(srcPath, destPath);
      count++;
    }
  }
  
  console.log(`✅ ${count} imagens de cursos copiadas\n`);
}

// Copia avatares dos instrutores
function copyInstructorAvatars() {
  console.log('👤 Copiando avatares dos instrutores...');
  
  const instructorsPublicDir = path.join(PUBLIC_DIR, 'instructors');
  ensureDir(instructorsPublicDir);
  
  const imagesPath = path.join(INSTRUCTORS_DIR, 'images');
  
  if (!fs.existsSync(imagesPath)) {
    console.log('⚠️  Diretório de avatares não encontrado');
    return;
  }
  
  const avatars = fs.readdirSync(imagesPath);
  let count = 0;
  
  for (const avatar of avatars) {
    const srcPath = path.join(imagesPath, avatar);
    const destPath = path.join(instructorsPublicDir, avatar);
    
    // Só copia arquivos (não diretórios)
    if (fs.statSync(srcPath).isFile()) {
      copyFile(srcPath, destPath);
      count++;
    }
  }
  
  console.log(`✅ ${count} avatares copiados\n`);
}

// Executa
console.log('🚀 Preparando imagens para build estático...');
copyCourseImages();
copyInstructorAvatars();
console.log('✨ Concluído!\n');
