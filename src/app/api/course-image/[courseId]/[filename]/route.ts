// Gera os parâmetros estáticos para todas as imagens conhecidas dos cursos
export async function generateStaticParams() {
  return [
    { courseId: 'docker-basico', filename: 'cover.png' },
    { courseId: 'cicd', filename: 'cover.png' }
  ];
}
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const COURSES_DIR = path.join(process.cwd(), 'content', 'courses');

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseId: string; filename: string }> }
) {
  try {
    const params = await context.params;
    const { courseId, filename } = params;
    
    // Caminho para a imagem
    const imagePath = path.join(COURSES_DIR, courseId, 'images', 'logo', filename);
    
    // Verifica se o arquivo existe
    if (!fs.existsSync(imagePath)) {
      console.log('Image not found:', imagePath);
      return new NextResponse('Image not found', { status: 404 });
    }
    
    // Lê o arquivo
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Define o tipo MIME baseado na extensão
    const ext = path.extname(filename).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : 
                       ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                       ext === '.webp' ? 'image/webp' :
                       'image/png';
    
    // Retorna a imagem
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving course image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
