'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import { cn } from '@/lib/utils';

interface CourseContentProps {
  /** Conteúdo Markdown bruto */
  content: string;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Extrai o ID do vídeo de uma URL do YouTube
 */
function extractYouTubeId(url: string): string | null {
  const regexes = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
  ];

  for (const regex of regexes) {
    const match = url.match(regex);
    if (match) return match[1];
  }
  return null;
}

/**
 * Plugin remark para converter URLs do YouTube em HTML raw
 * Isso evita conflito de hidratação com <div> dentro de <p>
 */
function remarkYouTubeEmbed() {
  return (tree: Root) => {
    visit(tree, 'image', (node, index, parent) => {
      const url = node.url as string;
      if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
        return;
      }

      const videoId = extractYouTubeId(url);
      if (!videoId) return;

      // Converte para HTML raw com tamanho limitado e legenda centralizada
      const html = `<div class="my-6 w-full max-w-2xl mx-auto"><div class="relative w-full overflow-hidden rounded-lg shadow-lg" style="padding-bottom: 56.25%"><iframe class="absolute top-0 left-0 h-full w-full rounded-lg" src="https://www.youtube.com/embed/${videoId}" title="Course Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div>`;

      const htmlNode = {
        type: 'html',
        value: html,
      };

      if (parent && typeof index === 'number') {
        parent.children[index] = htmlNode as any;
      }
    });
  };
}

/**
 * Plugin remark para adicionar legendas em imagens (processa antes de gerar HTML)
 */
function remarkImageCaption() {
  return (tree: Root) => {
    visit(tree, 'image', (node: any, index, parent) => {
      if (!node.url || node.url.includes('youtube.com') || node.url.includes('youtu.be')) {
        return;
      }

      const alt = node.alt as string;
      
      // Cria HTML bruto com figura e legenda
      const html = `<figure class="my-6 text-center">
        <img src="${node.url}" alt="${alt || ''}" class="mx-auto rounded-lg shadow-md border border-border max-w-[512px] w-full h-auto" loading="lazy" />
        <figcaption class="text-sm text-muted-foreground mt-3 italic">${alt}</figcaption>
      </figure>`;

      const htmlNode = {
        type: 'html',
        value: html,
      };

      if (parent && typeof index === 'number') {
        parent.children[index] = htmlNode;
      }
    });
  };
}

/**
 * Plugin rehype para centralizar legendas de vídeos (parágrafos em itálico)
 */
function rehypeVideoCaptionCenter() {
  return (tree: Root) => {
    visit(tree, 'element', (node: any) => {
      // Centraliza parágrafos que contêm apenas <em> (itálico)
      if (node.tagName === 'p' && node.children?.length > 0) {
        const hasOnlyEmphasis = node.children.every((child: any) => 
          child.type === 'element' && child.tagName === 'em'
        );
        
        if (hasOnlyEmphasis) {
          node.properties = node.properties || {};
          // use theme-aware classes instead of inline color
          node.properties.className = (node.properties.className || []).concat(['text-center', 'text-muted-foreground', 'text-sm']);
        }
      }
    });
  };
}

/**
 * Componente para renderizar conteúdo Markdown do curso
 * Usa react-markdown com plugins para GFM, syntax highlighting, slugs e Mermaid
 * Suporta imagens e vídeos do YouTube
 */
export function CourseContent({ content, className }: CourseContentProps) {
  return (
    <article className={cn('prose-course', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkYouTubeEmbed, remarkImageCaption]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSlug,
          [rehypeHighlight, { detect: true, ignoreMissing: true }],
          rehypeVideoCaptionCenter
        ]}
        components={{
          // Customização de componentes para melhor integração com o tema
          pre: ({ children, ...props }) => (
            <pre 
              className="relative rounded-lg border border-border bg-muted/50 dark:bg-[hsl(222,47%,8%)] overflow-x-auto" 
              {...props}
            >
              {children}
            </pre>
          ),
            code: ({ className, children, ...props }) => {
              const isInline = !className;
              return isInline ? (
                <code 
                  className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary" 
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <code className={cn('hljs', className)} {...props}>
                  {children}
                </code>
              );
            },
          a: ({ children, href, ...props }) => (
            <a 
              href={href}
              className="text-primary underline-offset-4 hover:underline"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              {...props}
            >
              {children}
            </a>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote 
              className="border-l-4 border-primary pl-4 italic text-muted-foreground" 
              {...props}
            >
              {children}
            </blockquote>
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th 
              className="border border-border bg-muted px-4 py-2 text-left font-semibold" 
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-border px-4 py-2" {...props}>
              {children}
            </td>
          ),
          img: ({ src, alt, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={src} 
              alt={alt || ''} 
              className="rounded-lg shadow-md max-w-lg h-auto border border-border mx-auto block" 
              loading="lazy"
              title={alt}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}

interface CourseContentHtmlProps {
  /** Conteúdo HTML processado */
  htmlContent: string;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Componente alternativo para renderizar HTML já processado
 * Use CourseContent com Markdown bruto para melhor resultado
 */
export function CourseContentHtml({ htmlContent, className }: CourseContentHtmlProps) {
  return (
    <article
      className={cn('prose-course', className)}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
