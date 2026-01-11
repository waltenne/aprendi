'use client';

import { useRef, useCallback, useState } from 'react';
import { toPng } from 'html-to-image';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Share2, Award } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

interface CertificateProps {
  courseName: string;
  studentName: string;
  instructorName: string;
  completionDate: string;
  className?: string;
}

/**
 * Componente de Certificado Simbólico
 * Renderiza um certificado visual e permite download como imagem
 */
export function Certificate({
  courseName,
  studentName,
  instructorName,
  completionDate,
  className,
}: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!certificateRef.current) return;

    try {
      // Ativa modo de exportação
      setIsExporting(true);
      
      // Aguarda o React renderizar com o novo estado
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toPng(certificateRef.current, {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `certificado-${courseName.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Erro ao gerar certificado:', error);
    } finally {
      // Desativa modo de exportação
      setIsExporting(false);
    }
  }, [courseName]);

  const handleShare = useCallback(async () => {
    if (!certificateRef.current) return;

    try {
      // Ativa modo de exportação
      setIsExporting(true);
      
      // Aguarda o React renderizar com o novo estado
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toPng(certificateRef.current, {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: '#ffffff',
      });

      // Converte data URL para blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'certificado.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Certificado - ${courseName}`,
          text: `Concluí o curso "${courseName}" na Aprendi!`,
          files: [file],
        });
      } else {
        // Fallback: copia o link
        await navigator.clipboard.writeText(
          `Concluí o curso "${courseName}" na Aprendi! 🎉`
        );
        alert('Texto copiado para a área de transferência!');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    } finally {
      // Desativa modo de exportação
      setIsExporting(false);
    }
  }, [courseName]);

  const formattedDate = formatDate(completionDate);

  return (
    <div className={cn('space-y-3', className)}>
      {/* Certificado Visual */}
      <Card className="overflow-hidden shadow-xl max-w-4xl mx-auto">
        <div
          ref={certificateRef}
          className="relative w-full aspect-[1.414/1] p-8 md:p-12"
          style={{
            background: isExporting 
              ? '#ffffff' 
              : 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 50%, #EEF2FF 100%)',
          }}
        >
          {/* Borda decorativa dupla - simplificada para export */}
          {isExporting ? (
            <>
              <div 
                className="absolute inset-4 rounded-2xl pointer-events-none"
                style={{
                  border: '4px double #3B82F6',
                }}
              />
              <div 
                className="absolute inset-6 rounded-xl pointer-events-none"
                style={{
                  border: '2px solid #DBEAFE',
                }}
              />
            </>
          ) : (
            <>
              <div className="absolute inset-4 border-[4px] border-double rounded-2xl pointer-events-none"
                   style={{
                     borderImage: 'linear-gradient(135deg, #3B82F6, #6366F1, #8B5CF6) 1',
                   }}
              />
              <div className="absolute inset-6 border-2 border-blue-100 rounded-xl pointer-events-none" />
            </>
          )}

          {/* Decorações de canto elegantes */}
          <div className="absolute top-8 left-8 w-16 h-16">
            <svg viewBox="0 0 100 100" className="text-blue-200" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10,10 L50,10 M10,10 L10,50" />
              <circle cx="30" cy="30" r="3" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute top-8 right-8 w-16 h-16 rotate-90">
            <svg viewBox="0 0 100 100" className="text-blue-200" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10,10 L50,10 M10,10 L10,50" />
              <circle cx="30" cy="30" r="3" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute bottom-8 left-8 w-16 h-16 -rotate-90">
            <svg viewBox="0 0 100 100" className="text-blue-200" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10,10 L50,10 M10,10 L10,50" />
              <circle cx="30" cy="30" r="3" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute bottom-8 right-8 w-16 h-16 rotate-180">
            <svg viewBox="0 0 100 100" className="text-blue-200" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10,10 L50,10 M10,10 L10,50" />
              <circle cx="30" cy="30" r="3" fill="currentColor" />
            </svg>
          </div>

          {/* Conteúdo */}
          <div className="relative z-10 text-center space-y-6">
            {/* Header com Logo */}
            <div className="space-y-3">
              <div className="flex justify-center mb-4">
                <div className="relative w-16 h-16 rounded-full bg-white shadow-lg ring-2 ring-blue-100 p-1.5">
                  {isExporting ? (
                    <img
                      src="/images/logo.png"
                      alt="Aprendi Logo"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '6px',
                      }}
                    />
                  ) : (
                    <Image
                      src="/images/logo.png"
                      alt="Aprendi Logo"
                      fill
                      className="object-contain p-1.5"
                    />
                  )}
                </div>
              </div>
              {isExporting ? (
                <h1 
                  className="text-3xl md:text-4xl font-serif font-bold leading-tight"
                  style={{ color: '#4F46E5' }}
                >
                  Certificado de Conclusão
                </h1>
              ) : (
                <h1 className="text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  Certificado de Conclusão
                </h1>
              )}
              <p 
                className="text-xs uppercase tracking-[0.25em] font-semibold"
                style={{ color: isExporting ? '#2563EB' : undefined }}
              >
                Aprendi - Plataforma Educacional
              </p>
            </div>

            {/* Corpo com espaçamento otimizado */}
            <div className="py-6 space-y-4">
              <p className="text-gray-600 text-sm">Certificamos que</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 font-serif px-6 py-2">
                {studentName}
              </p>
              <p className="text-gray-600 text-sm">concluiu com sucesso o curso</p>
              {isExporting ? (
                <p 
                  className="text-xl md:text-2xl font-semibold px-6"
                  style={{ color: '#4F46E5' }}
                >
                  {courseName}
                </p>
              ) : (
                <p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent px-6">
                  {courseName}
                </p>
              )}
            </div>

            {/* Footer com linha divisória decorativa */}
            <div className="pt-5">
              <div className="flex items-center justify-center mb-4">
                {isExporting ? (
                  <>
                    <div style={{ height: '1px', width: '96px', background: '#93C5FD' }}></div>
                    <div 
                      className="mx-3 p-1.5 rounded-full"
                      style={{ background: '#DBEAFE' }}
                    >
                      <Award className="h-4 w-4" style={{ color: '#2563EB' }} />
                    </div>
                    <div style={{ height: '1px', width: '96px', background: '#93C5FD' }}></div>
                  </>
                ) : (
                  <>
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
                    <div className="mx-3 p-1.5 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
                      <Award className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
                  </>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-12 max-w-2xl mx-auto">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Data de Conclusão</p>
                  <p className="font-semibold text-gray-800 text-base">{formattedDate}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Instrutor</p>
                  <p className="font-semibold text-gray-800 text-base">{instructorName}</p>
                </div>
              </div>
            </div>

            {/* Aviso com melhor destaque */}
            <div className="pt-4">
              <p 
                className="text-xs italic font-medium"
                style={{ color: isExporting ? '#93C5FD' : undefined }}
              >
                Este é um certificado simbólico de participação.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button onClick={handleDownload} size="lg" className="w-full sm:w-auto">
          <Download className="h-4 w-4 mr-2" />
          Baixar Certificado
        </Button>
      </div>
    </div>
  );
}
