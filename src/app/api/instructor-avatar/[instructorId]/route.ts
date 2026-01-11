// Gera os parâmetros estáticos para todos os instrutores conhecidos
export async function generateStaticParams() {
  return [
    { instructorId: 'waltenne' },
    { instructorId: 'comunidade-aprendi' }
  ];
}
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const INSTRUCTORS_DIR = path.join(process.cwd(), 'content', 'instructors');
const DEFAULT_AVATAR = path.join(process.cwd(), 'public', 'images', 'default-avatar.png');

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ instructorId: string }> }
) {
  try {
    const params = await context.params;
    const { instructorId } = params;
    
    // Tenta encontrar avatar nas extensões suportadas
    const extensions = ['png', 'jpg', 'jpeg', 'webp'];
    let avatarPath: string | null = null;
    
    for (const ext of extensions) {
      const testPath = path.join(INSTRUCTORS_DIR, 'images', `${instructorId}.${ext}`);
      if (fs.existsSync(testPath)) {
        avatarPath = testPath;
        break;
      }
    }
    
    // Se não encontrou, usa avatar padrão
    if (!avatarPath) {
      if (fs.existsSync(DEFAULT_AVATAR)) {
        avatarPath = DEFAULT_AVATAR;
      } else {
        // Retorna um SVG simples como fallback final
        const defaultSvg = `
          <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="#e5e7eb"/>
            <circle cx="100" cy="80" r="40" fill="#9ca3af"/>
            <ellipse cx="100" cy="180" rx="60" ry="40" fill="#9ca3af"/>
          </svg>
        `;
        return new NextResponse(defaultSvg, {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=86400',
          },
        });
      }
    }
    
    // Lê o arquivo
    const imageBuffer = fs.readFileSync(avatarPath);
    
    // Define o tipo MIME baseado na extensão
    const ext = path.extname(avatarPath).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : 
                       ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                       ext === '.webp' ? 'image/webp' :
                       ext === '.svg' ? 'image/svg+xml' :
                       'image/png';
    
    // Retorna a imagem
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error serving instructor avatar:', error);
    
    // Retorna SVG de erro
    const errorSvg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#f3f4f6"/>
        <text x="100" y="100" font-size="60" text-anchor="middle" fill="#6b7280">?</text>
      </svg>
    `;
    return new NextResponse(errorSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }
}
