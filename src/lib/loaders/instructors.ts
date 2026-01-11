import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { 
  validateInstructorsFile, 
  type Instructor, 
  type InstructorsFile 
} from '@/lib/schemas';

// Re-export do tipo para uso em outros módulos
export type { Instructor } from '@/lib/schemas';

/**
 * Caminho base para o diretório de conteúdo
 */
const CONTENT_DIR = path.join(process.cwd(), 'content');
const INSTRUCTORS_FILE = path.join(CONTENT_DIR, 'instructors', 'instructors.yml');

/**
 * Cache em memória para instrutores
 */
let instructorsCache: InstructorsFile | null = null;

/**
 * Carrega e valida o arquivo de instrutores
 * @throws Error se o arquivo não existir ou os dados forem inválidos
 */
export function loadInstructorsFile(): InstructorsFile {
  if (instructorsCache) {
    return instructorsCache;
  }

  if (!fs.existsSync(INSTRUCTORS_FILE)) {
    throw new Error(`Arquivo de instrutores não encontrado: ${INSTRUCTORS_FILE}`);
  }

  const raw = fs.readFileSync(INSTRUCTORS_FILE, 'utf8');
  const data = yaml.load(raw);
  
  // Valida com Zod - falha build se inválido
  const validated = validateInstructorsFile(data);
  instructorsCache = validated;
  
  return validated;
}

/**
 * Retorna todos os instrutores com avatares processados
 */
export function getAllInstructors(): Instructor[] {
  const file = loadInstructorsFile();
  return file.instructors.map(instructor => processInstructorAvatar(instructor));
}

/**
 * Busca um instrutor por ID com avatar processado
 * @param id - ID do instrutor
 * @returns Instructor ou undefined se não encontrado
 */
export function getInstructorById(id: string): Instructor | undefined {
  const instructors = getAllInstructors();
  return instructors.find((i) => i.id === id);
}

/**
 * Processa o avatar do instrutor
 * - Se for URL externa válida, mantém
 * - Se for caminho local, converte para API route
 * - Se não existir, usa API route que retorna default
 */
function processInstructorAvatar(instructor: Instructor): Instructor {
  const avatarPath = path.join(process.cwd(), 'content', 'instructors', 'images');
  
  // Se já é URL externa válida (http/https), mantém
  if (instructor.avatar?.startsWith('http://') || instructor.avatar?.startsWith('https://')) {
    return instructor;
  }
  
  // Verifica se existe arquivo local
  const extensions = ['png', 'jpg', 'jpeg', 'webp'];
  let hasLocalFile = false;
  
  for (const ext of extensions) {
    const testPath = path.join(avatarPath, `${instructor.id}.${ext}`);
    if (fs.existsSync(testPath)) {
      hasLocalFile = true;
      break;
    }
  }
  
  // Se tem arquivo local OU não tem avatar definido, usa o caminho estático
  if (hasLocalFile || !instructor.avatar) {
    // Detecta a extensão do arquivo
    let foundExt = 'png';
    for (const ext of extensions) {
      const testPath = path.join(avatarPath, `${instructor.id}.${ext}`);
      if (fs.existsSync(testPath)) {
        foundExt = ext;
        break;
      }
    }
    const avatarUrl = `/instructors/${instructor.id}.${foundExt}`;
    return {
      ...instructor,
      avatar: avatarUrl
    };
  }
  
  // Se tem avatar definido mas não é URL nem arquivo local, retorna undefined
  // O componente usará o fallback padrão
  return {
    ...instructor,
    avatar: undefined
  };
}

/**
 * Retorna IDs de todos os instrutores (para geração de páginas estáticas)
 */
export function getAllInstructorIds(): string[] {
  const instructors = getAllInstructors();
  return instructors.map((i) => i.id);
}

/**
 * Limpa o cache de instrutores (útil para testes)
 */
export function clearInstructorsCache(): void {
  instructorsCache = null;
}
