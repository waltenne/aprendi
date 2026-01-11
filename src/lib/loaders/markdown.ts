import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import { type CourseSection } from '@/lib/schemas';
import { slugify } from '@/lib/utils';

/**
 * Processa Markdown para HTML
 */
export function processMarkdown(markdown: string): string {
  const result = remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .processSync(markdown);

  return result.toString();
}

/**
 * Processa Markdown de forma assíncrona
 */
export async function processMarkdownAsync(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);

  return result.toString();
}

/**
 * Extrai seções do conteúdo Markdown
 * Considera headings de nível 2 (##) como seções principais
 */
export function extractSections(markdown: string): CourseSection[] {
  if (!markdown) return [];

  const sections: CourseSection[] = [];
  const lines = markdown.split('\n');
  
  let currentSection: CourseSection | null = null;
  let contentLines: string[] = [];
  let introLines: string[] = [];
  let foundFirstSection = false;

  // Headings que devem ser ignorados (índices, sumários)
  const ignoredHeadings = ['seções', 'índice', 'sumário', 'conteúdo', 'sections'];

  for (const line of lines) {
    // Verifica se é um heading de nível 2
    const h2Match = line.match(/^##\s+(.+)$/);
    
    if (h2Match) {
      const title = h2Match[1].trim();
      const titleLower = title.toLowerCase();
      
      // Ignora headings de índice
      if (ignoredHeadings.some(h => titleLower === h || titleLower.startsWith(h))) {
        continue;
      }

      // Salva seção anterior
      if (currentSection) {
        sections.push({
          ...currentSection,
          content: contentLines.join('\n').trim(),
        });
        contentLines = [];
      } else if (!foundFirstSection && introLines.length > 0) {
        // Cria seção de introdução com conteúdo antes da primeira seção
        const introContent = introLines.join('\n').trim();
        if (introContent && introContent.split('\n').filter(l => l.trim() && !l.startsWith('#')).length > 0) {
          sections.push({
            id: 'introducao',
            title: 'Introdução',
            level: 2,
            content: introContent,
          });
        }
      }

      foundFirstSection = true;
      currentSection = {
        id: slugify(title),
        title,
        level: 2,
        content: '',
      };
    } else if (!foundFirstSection) {
      // Acumula conteúdo de introdução
      introLines.push(line);
    } else if (currentSection) {
      // Acumula conteúdo da seção atual
      contentLines.push(line);
    }
  }

  // Adiciona a última seção
  if (currentSection) {
    sections.push({
      ...currentSection,
      content: contentLines.join('\n').trim(),
    });
  }

  return sections;
}

/**
 * Extrai headings para navegação/TOC
 */
export function extractHeadings(markdown: string): Array<{
  level: number;
  title: string;
  id: string;
}> {
  if (!markdown) return [];

  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: Array<{ level: number; title: string; id: string }> = [];
  
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = slugify(title);
    headings.push({ level, title, id });
  }

  return headings;
}

/**
 * Remove frontmatter YAML do Markdown (se existir)
 */
export function removeFrontmatter(markdown: string): string {
  const frontmatterRegex = /^---\n[\s\S]*?\n---\n/;
  return markdown.replace(frontmatterRegex, '').trim();
}
