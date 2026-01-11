'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface GiscusProps {
  /** ID do repositório GitHub (obtido em giscus.app) */
  repoId?: string;
  /** Nome do repositório (owner/repo) */
  repo?: string;
  /** ID da categoria de discussão */
  categoryId?: string;
  /** Nome da categoria de discussão */
  category?: string;
  /** Mapeamento do termo de busca */
  mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
  /** Termo específico (quando mapping = 'specific') */
  term?: string;
  /** Habilitar reações */
  reactionsEnabled?: boolean;
  /** Emitir metadados da discussão */
  emitMetadata?: boolean;
  /** Posição da caixa de input */
  inputPosition?: 'top' | 'bottom';
  /** Carregar comentários de forma lazy */
  lazyLoad?: boolean;
}

/**
 * Componente de comentários usando Giscus (GitHub Discussions)
 * 
 * Para configurar:
 * 1. Acesse https://giscus.app
 * 2. Configure seu repositório
 * 3. Defina as variáveis no .env.local:
 *    - NEXT_PUBLIC_GISCUS_REPO
 *    - NEXT_PUBLIC_GISCUS_REPO_ID
 *    - NEXT_PUBLIC_GISCUS_CATEGORY
 *    - NEXT_PUBLIC_GISCUS_CATEGORY_ID
 * 
 * @see https://giscus.app
 */
export function Giscus({
  repo = process.env.NEXT_PUBLIC_GISCUS_REPO,
  repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
  category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || 'Announcements',
  categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
  mapping = 'pathname',
  term,
  reactionsEnabled = true,
  emitMetadata = false,
  inputPosition = 'bottom',
  lazyLoad = true,
}: GiscusProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!ref.current || !repo || !repoId || !categoryId) return;

    // Remove script anterior se existir
    const existingScript = ref.current.querySelector('script');
    if (existingScript) {
      existingScript.remove();
    }

    // Remove iframe anterior
    const existingIframe = ref.current.querySelector('iframe');
    if (existingIframe) {
      existingIframe.remove();
    }

    // Cria novo script
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', mapping);
    if (term) script.setAttribute('data-term', term);
    script.setAttribute('data-reactions-enabled', reactionsEnabled ? '1' : '0');
    script.setAttribute('data-emit-metadata', emitMetadata ? '1' : '0');
    script.setAttribute('data-input-position', inputPosition);
    script.setAttribute('data-theme', resolvedTheme === 'dark' ? 'dark' : 'light');
    script.setAttribute('data-lang', 'pt');
    if (lazyLoad) script.setAttribute('data-loading', 'lazy');

    ref.current.appendChild(script);
  }, [repo, repoId, category, categoryId, mapping, term, reactionsEnabled, emitMetadata, inputPosition, resolvedTheme, lazyLoad]);

  // Atualiza tema do Giscus quando o tema do site muda
  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (iframe) {
      iframe.contentWindow?.postMessage(
        {
          giscus: {
            setConfig: {
              theme: resolvedTheme === 'dark' ? 'dark' : 'light',
            },
          },
        },
        'https://giscus.app'
      );
    }
  }, [resolvedTheme]);

  // Não renderiza se não houver configuração
  if (!repo || !repoId || !categoryId) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center text-muted-foreground">
        <p className="text-sm">
          Comentários desabilitados. Configure as variáveis do Giscus no .env.local
        </p>
      </div>
    );
  }

  return (
    <div ref={ref} className="giscus-container" />
  );
}
