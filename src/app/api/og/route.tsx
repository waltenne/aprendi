import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

/**
 * Gera imagens Open Graph dinâmicas para compartilhamento social
 * 
 * Uso: /api/og?title=Meu%20Curso&icon=📚&level=Iniciante
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const title = searchParams.get('title') || 'PCursos';
  const icon = searchParams.get('icon') || '📚';
  const level = searchParams.get('level') || '';
  const instructor = searchParams.get('instructor') || '';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#030712',
          backgroundImage: 'linear-gradient(to bottom right, #030712, #1e3a5f)',
        }}
      >
        {/* Padrão de fundo */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
          }}
        />
        
        {/* Container principal */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            maxWidth: '1000px',
          }}
        >
          {/* Ícone */}
          <div
            style={{
              fontSize: 100,
              marginBottom: 30,
            }}
          >
            {icon}
          </div>
          
          {/* Título */}
          <div
            style={{
              fontSize: 60,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            {title}
          </div>
          
          {/* Metadata */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginTop: 20,
            }}
          >
            {level && (
              <div
                style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.3)',
                  color: '#93c5fd',
                  padding: '10px 24px',
                  borderRadius: 30,
                  fontSize: 24,
                }}
              >
                {level}
              </div>
            )}
            {instructor && (
              <div
                style={{
                  color: '#9ca3af',
                  fontSize: 24,
                }}
              >
                por {instructor}
              </div>
            )}
          </div>
          
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 60,
              gap: '12px',
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                backgroundColor: '#3b82f6',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
              }}
            >
              🎓
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              PCursos
            </div>
          </div>
        </div>
        
        {/* Rodapé */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            color: '#6b7280',
            fontSize: 20,
          }}
        >
          Cursos gratuitos com certificado
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
