/**
 * Configuração global de áreas e seus ícones padrão
 */

export interface AreaConfig {
  name: string;
  icon: string;
  color: string;
}

export const AREAS_CONFIG: Record<string, AreaConfig> = {
  // =====================
  // TECNOLOGIA (TI)
  // =====================
  'Desenvolvimento': {
    name: 'Desenvolvimento',
    icon: '💻',
    color: '#10B981',
  },
  'DevOps': {
    name: 'DevOps',
    icon: '🚀',
    color: '#3B82F6',
  },
  'Infraestrutura': {
    name: 'Infraestrutura',
    icon: '🏗️',
    color: '#14B8A6',
  },
  'Cloud': {
    name: 'Cloud',
    icon: '☁️',
    color: '#06B6D4',
  },
  'Dados': {
    name: 'Dados',
    icon: '📊',
    color: '#8B5CF6',
  },
  'IA': {
    name: 'Inteligência Artificial',
    icon: '🤖',
    color: '#F59E0B',
  },
  'Segurança': {
    name: 'Segurança da Informação',
    icon: '🔒',
    color: '#EF4444',
  },
  'QA': {
    name: 'Qualidade & Testes',
    icon: '🧪',
    color: '#22C55E',
  },
  'Arquitetura': {
    name: 'Arquitetura de Software',
    icon: '🏛️',
    color: '#0EA5E9',
  },

  // =====================
  // DESIGN & PRODUTO
  // =====================
  'Design': {
    name: 'Design',
    icon: '🎨',
    color: '#EC4899',
  },
  'UX': {
    name: 'UX / UI',
    icon: '🧠',
    color: '#A855F7',
  },
  'Produto': {
    name: 'Produto',
    icon: '📦',
    color: '#6366F1',
  },

  // =====================
  // MARKETING & VENDAS
  // =====================
  'Marketing': {
    name: 'Marketing',
    icon: '📣',
    color: '#D946EF',
  },
  'Growth': {
    name: 'Growth',
    icon: '📈',
    color: '#F97316',
  },
  'Vendas': {
    name: 'Vendas',
    icon: '💰',
    color: '#16A34A',
  },
  'Comunidade': {
    name: 'Comunidade',
    icon: '🤝',
    color: '#0D9488',
  },

  // =====================
  // RH & PESSOAS
  // =====================
  'RH': {
    name: 'Recursos Humanos',
    icon: '🧑‍🤝‍🧑',
    color: '#F43F5E',
  },
  'People': {
    name: 'People & Culture',
    icon: '🌱',
    color: '#22C55E',
  },
  'Recrutamento': {
    name: 'Recrutamento & Seleção',
    icon: '🧲',
    color: '#E11D48',
  },

  // =====================
  // FINANCEIRO & LEGAL
  // =====================
  'Financeiro': {
    name: 'Financeiro',
    icon: '💵',
    color: '#15803D',
  },
  'Contábil': {
    name: 'Contábil',
    icon: '📚',
    color: '#166534',
  },
  'Jurídico': {
    name: 'Jurídico',
    icon: '⚖️',
    color: '#334155',
  },

  // =====================
  // ADMINISTRATIVO & OPERAÇÕES
  // =====================
  'Administrativo': {
    name: 'Administrativo',
    icon: '🏢',
    color: '#64748B',
  },
  'Operações': {
    name: 'Operações',
    icon: '⚙️',
    color: '#475569',
  },
  'Compras': {
    name: 'Compras & Suprimentos',
    icon: '🛒',
    color: '#78350F',
  },

  // =====================
  // TRANSVERSAL
  // =====================
  'Soft Skills': {
    name: 'Soft Skills',
    icon: '💡',
    color: '#6366F1',
  },
  'Gestão': {
    name: 'Gestão & Liderança',
    icon: '🧭',
    color: '#1E3A8A',
  },
  
  // =====================
  // SISTEMAS & EDUCAÇÃO
  // =====================
  'Sistemas Operacionais': {
    name: 'Sistemas Operacionais',
    icon: '🖥️',
    color: '#10B981',
  },
  'Programação': {
    name: 'Programação',
    icon: '👨‍💻',
    color: '#3B82F6',
  },
  'Desenvolvimento Pessoal': {
    name: 'Desenvolvimento Pessoal',
    icon: '🌱',
    color: '#F472B6',
  },
};

/**
 * Retorna a configuração de uma área
 */
export function getAreaConfig(areaName: string): AreaConfig {
  return AREAS_CONFIG[areaName] || {
    name: areaName,
    icon: '📖',
    color: '#6B7280',
  };
}

/**
 * Retorna o ícone padrão para uma área
 */
export function getAreaIcon(areaName: string): string {
  return getAreaConfig(areaName).icon;
}

/**
 * Retorna a cor padrão para uma área
 */
export function getAreaColor(areaName: string): string {
  return getAreaConfig(areaName).color;
}

/**
 * Retorna todas as áreas configuradas
 */
export function getAllAreasConfig(): AreaConfig[] {
  return Object.values(AREAS_CONFIG);
}
