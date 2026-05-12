import { IPCACategory } from './types';

export interface CategoryConfig {
  label: string;
  officialWeight: number;
  color: string;
  bgColor: string;
  textColor: string;
  emoji: string;
  description: string;
}

export const CATEGORIES: Record<IPCACategory, CategoryConfig> = {
  alimentacao_bebidas: {
    label: 'Alimentação e Bebidas',
    officialWeight: 23.20,
    color: '#F59E0B',
    bgColor: '#FEF9EC',
    textColor: '#92400E',
    emoji: '🍽️',
    description: 'Alimentos em casa, alimentação fora do domicílio e bebidas',
  },
  moradia: {
    label: 'Moradia',
    officialWeight: 14.25,
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    textColor: '#1E40AF',
    emoji: '🏠',
    description: 'Aluguel, condomínio, IPTU, energia elétrica, gás encanado e água',
  },
  artigos_residencia: {
    label: 'Artigos de Residência',
    officialWeight: 4.27,
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    textColor: '#5B21B6',
    emoji: '🛋️',
    description: 'Móveis, eletrodomésticos, utensílios e equipamentos domésticos',
  },
  vestuario: {
    label: 'Vestuário',
    officialWeight: 5.45,
    color: '#EC4899',
    bgColor: '#FDF2F8',
    textColor: '#9D174D',
    emoji: '👗',
    description: 'Roupas, calçados, tecidos e acessórios do vestuário',
  },
  transportes: {
    label: 'Transportes',
    officialWeight: 19.04,
    color: '#06B6D4',
    bgColor: '#ECFEFF',
    textColor: '#155E75',
    emoji: '🚗',
    description: 'Combustível, transporte público, manutenção e seguro de veículo',
  },
  saude_cuidados: {
    label: 'Saúde e Cuidados Pessoais',
    officialWeight: 11.38,
    color: '#10B981',
    bgColor: '#ECFDF5',
    textColor: '#065F46',
    emoji: '💊',
    description: 'Plano de saúde, medicamentos, consultas médicas e higiene pessoal',
  },
  despesas_pessoais: {
    label: 'Despesas Pessoais',
    officialWeight: 9.30,
    color: '#F97316',
    bgColor: '#FFF7ED',
    textColor: '#9A3412',
    emoji: '💼',
    description: 'Lazer, recreação, serviços pessoais e seguros diversos',
  },
  educacao: {
    label: 'Educação',
    officialWeight: 5.47,
    color: '#84CC16',
    bgColor: '#F7FEE7',
    textColor: '#3F6212',
    emoji: '📚',
    description: 'Mensalidades escolares, cursos, livros e material escolar',
  },
  comunicacao: {
    label: 'Comunicação',
    officialWeight: 4.32,
    color: '#14B8A6',
    bgColor: '#F0FDFA',
    textColor: '#134E4A',
    emoji: '📱',
    description: 'Internet banda larga, plano de celular e TV por assinatura',
  },
};

export const CATEGORY_LIST = (Object.keys(CATEGORIES) as IPCACategory[]).map((key) => ({
  value: key,
  ...CATEGORIES[key],
}));

// Fallback IPCA data (monthly %) when the IBGE API is unavailable
export const FALLBACK_IPCA: Record<string, number> = {
  '202201': 0.54, '202202': 1.01, '202203': 1.62, '202204': 1.06,
  '202205': 0.47, '202206': 0.67, '202207': -0.68, '202208': -0.73,
  '202209': -0.29, '202210': 0.59, '202211': 0.41, '202212': 0.54,
  '202301': 0.53, '202302': 0.84, '202303': 0.71, '202304': 0.61,
  '202305': 0.23, '202306': -0.08, '202307': 0.12, '202308': 0.23,
  '202309': 0.26, '202310': 0.24, '202311': 0.28, '202312': 0.62,
  '202401': 0.42, '202402': 0.83, '202403': 0.16, '202404': 0.38,
  '202405': 0.46, '202406': 0.21, '202407': 0.38, '202408': -0.02,
  '202409': 0.44, '202410': 0.56, '202411': 0.39, '202412': 0.52,
  '202501': 0.16, '202502': 1.31, '202503': 0.56, '202504': 0.43,
  '202505': 0.26, '202506': 0.24, '202507': 0.26, '202508': -0.11,
  '202509': 0.48, '202510': 0.09, '202511': 0.18, '202512': 0.33,
  '202601': 0.33, '202602': 0.70, '202603': 0.88,
};

export const MONTH_NAMES_SHORT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
