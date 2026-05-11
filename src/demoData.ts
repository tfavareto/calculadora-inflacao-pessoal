import { Transaction, IPCACategory } from './types';

function tx(
  date: string,
  description: string,
  category: IPCACategory,
  type: 'expense' | 'income',
  amount: number,
): Transaction {
  return { id: crypto.randomUUID(), date, description, category, type, amount };
}

/**
 * Demo dataset — Jan/2024 → Mar/2026 (27 months)
 *
 * Cenário: casal em apartamento alugado, São Paulo, renda ~R$9 k–9,5 k/mês.
 * A inflação pessoal cresce levemente acima do IPCA oficial (mix de serviços e
 * alimentação pesada), deixando a comparação interessante para o usuário.
 *
 * Eventos notáveis embutidos:
 *  • Reajuste aluguel em Abr/24 (+5 %) e Abr/25 (+6 %)
 *  • Reajuste plano de saúde em Abr/24 (+9,2 %) — ANS
 *  • Aumento salário em Mar/24 (R$ 9 k) e Mar/25 (R$ 9,5 k)
 *  • Alta banda larga/celular Jan/25 (+10 %)
 *  • Bandeira escassez hídrica out-nov/24 → conta de luz +R$ 80
 *  • Mensalidade faculdade reajuste em Fev/24 (+7 %) e Fev/25 (+6 %)
 *  • Gastos extra: férias Jan/25, reforma banheiro Ago/24
 */
export const DEMO_TRANSACTIONS: Transaction[] = [

  // ═══════════════════════════════════════════════════════════
  // Janeiro 2024  — mês-base
  // ═══════════════════════════════════════════════════════════
  tx('2024-01-05', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 920),
  tx('2024-01-12', 'iFood — almoço & jantar',       'alimentacao_bebidas', 'expense', 380),
  tx('2024-01-19', 'Mercado Extra — reposição',     'alimentacao_bebidas', 'expense', 490),
  tx('2024-01-03', 'Aluguel + condomínio',           'moradia',             'expense', 2800),
  tx('2024-01-10', 'Enel — conta de luz',            'moradia',             'expense', 210),
  tx('2024-01-10', 'Sabesp — conta de água',         'moradia',             'expense', 92),
  tx('2024-01-15', 'Gasolina Shell',                 'transportes',         'expense', 345),
  tx('2024-01-22', 'Uber — semana trabalho',         'transportes',         'expense', 178),
  tx('2024-01-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 480),
  tx('2024-01-14', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 128),
  tx('2024-01-05', 'Mensalidade faculdade',           'educacao',            'expense', 1100),
  tx('2024-01-08', 'Tim — celular',                  'comunicacao',         'expense', 79),
  tx('2024-01-08', 'Claro — internet fibra',         'comunicacao',         'expense', 110),
  tx('2024-01-25', 'Netflix + Spotify',              'despesas_pessoais',   'expense', 85),
  tx('2024-01-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 120),
  tx('2024-01-31', 'Salário Janeiro/24',             'alimentacao_bebidas', 'income',  8500),

  // ═══════════════════════════════════════════════════════════
  // Fevereiro 2024  — Carnaval; reajuste faculdade
  // ═══════════════════════════════════════════════════════════
  tx('2024-02-06', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 960),
  tx('2024-02-13', 'iFood — semana de carnaval',    'alimentacao_bebidas', 'expense', 520),
  tx('2024-02-20', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 510),
  tx('2024-02-03', 'Aluguel + condomínio',           'moradia',             'expense', 2800),
  tx('2024-02-10', 'Enel — conta de luz',            'moradia',             'expense', 245),
  tx('2024-02-10', 'Sabesp — conta de água',         'moradia',             'expense', 98),
  tx('2024-02-13', 'Gasolina Shell',                 'transportes',         'expense', 362),
  tx('2024-02-20', 'Uber — deslocamentos carnaval',  'transportes',         'expense', 220),
  tx('2024-02-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 480),
  tx('2024-02-16', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 145),
  tx('2024-02-05', 'Mensalidade faculdade',           'educacao',            'expense', 1177),
  tx('2024-02-08', 'Tim — celular',                  'comunicacao',         'expense', 79),
  tx('2024-02-08', 'Claro — internet fibra',         'comunicacao',         'expense', 110),
  tx('2024-02-18', 'Roupas carnaval — Renner',       'vestuario',           'expense', 195),
  tx('2024-02-25', 'Netflix + Spotify',              'despesas_pessoais',   'expense', 85),
  tx('2024-02-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 120),
  tx('2024-02-29', 'Salário Fevereiro/24',           'alimentacao_bebidas', 'income',  8500),

  // ═══════════════════════════════════════════════════════════
  // Março 2024  — aumento de salário para R$ 9.000
  // ═══════════════════════════════════════════════════════════
  tx('2024-03-05', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 995),
  tx('2024-03-13', 'iFood',                          'alimentacao_bebidas', 'expense', 410),
  tx('2024-03-20', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 540),
  tx('2024-03-03', 'Aluguel + condomínio',           'moradia',             'expense', 2800),
  tx('2024-03-10', 'Enel — conta de luz',            'moradia',             'expense', 228),
  tx('2024-03-10', 'Sabesp — conta de água',         'moradia',             'expense', 95),
  tx('2024-03-14', 'Gasolina Shell',                 'transportes',         'expense', 370),
  tx('2024-03-21', 'Uber',                           'transportes',         'expense', 190),
  tx('2024-03-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 480),
  tx('2024-03-15', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 132),
  tx('2024-03-05', 'Mensalidade faculdade',           'educacao',            'expense', 1177),
  tx('2024-03-08', 'Tim — celular',                  'comunicacao',         'expense', 79),
  tx('2024-03-08', 'Claro — internet fibra',         'comunicacao',         'expense', 110),
  tx('2024-03-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 105),
  tx('2024-03-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 120),
  tx('2024-03-31', 'Salário Março/24 + aumento',    'alimentacao_bebidas', 'income',  9000),

  // ═══════════════════════════════════════════════════════════
  // Abril 2024  — reajuste aluguel +5 %; reajuste plano de saúde +9,2 %
  // ═══════════════════════════════════════════════════════════
  tx('2024-04-04', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1020),
  tx('2024-04-11', 'iFood',                          'alimentacao_bebidas', 'expense', 395),
  tx('2024-04-18', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 560),
  tx('2024-04-03', 'Aluguel + condomínio',           'moradia',             'expense', 2940),
  tx('2024-04-10', 'Enel — conta de luz',            'moradia',             'expense', 232),
  tx('2024-04-10', 'Sabesp — conta de água',         'moradia',             'expense', 98),
  tx('2024-04-15', 'Gasolina Shell',                 'transportes',         'expense', 380),
  tx('2024-04-22', 'Uber',                           'transportes',         'expense', 185),
  tx('2024-04-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 524),
  tx('2024-04-18', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 158),
  tx('2024-04-05', 'Mensalidade faculdade',           'educacao',            'expense', 1177),
  tx('2024-04-08', 'Tim — celular',                  'comunicacao',         'expense', 79),
  tx('2024-04-08', 'Claro — internet fibra',         'comunicacao',         'expense', 110),
  tx('2024-04-20', 'Calça jeans + camisa — C&A',    'vestuario',           'expense', 285),
  tx('2024-04-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 105),
  tx('2024-04-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 120),
  tx('2024-04-30', 'Salário Abril/24',               'alimentacao_bebidas', 'income',  9000),

  // ═══════════════════════════════════════════════════════════
  // Maio 2024
  // ═══════════════════════════════════════════════════════════
  tx('2024-05-04', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1035),
  tx('2024-05-10', 'iFood',                          'alimentacao_bebidas', 'expense', 405),
  tx('2024-05-17', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 565),
  tx('2024-05-03', 'Aluguel + condomínio',           'moradia',             'expense', 2940),
  tx('2024-05-10', 'Enel — conta de luz',            'moradia',             'expense', 238),
  tx('2024-05-10', 'Sabesp — conta de água',         'moradia',             'expense', 100),
  tx('2024-05-14', 'Gasolina Shell',                 'transportes',         'expense', 382),
  tx('2024-05-21', 'Uber',                           'transportes',         'expense', 188),
  tx('2024-05-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 524),
  tx('2024-05-15', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 135),
  tx('2024-05-05', 'Mensalidade faculdade',           'educacao',            'expense', 1177),
  tx('2024-05-08', 'Tim — celular',                  'comunicacao',         'expense', 79),
  tx('2024-05-08', 'Claro — internet fibra',         'comunicacao',         'expense', 110),
  tx('2024-05-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 105),
  tx('2024-05-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 120),
  tx('2024-05-31', 'Salário Maio/24',                'alimentacao_bebidas', 'income',  9000),

  // ═══════════════════════════════════════════════════════════
  // Junho 2024  — inverno; manutenção veículo
  // ═══════════════════════════════════════════════════════════
  tx('2024-06-05', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1050),
  tx('2024-06-12', 'iFood',                          'alimentacao_bebidas', 'expense', 390),
  tx('2024-06-19', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 545),
  tx('2024-06-03', 'Aluguel + condomínio',           'moradia',             'expense', 2940),
  tx('2024-06-10', 'Enel — conta de luz',            'moradia',             'expense', 252),
  tx('2024-06-10', 'Sabesp — conta de água',         'moradia',             'expense', 98),
  tx('2024-06-13', 'Gasolina Shell',                 'transportes',         'expense', 375),
  tx('2024-06-20', 'Revisão 30k — concessionária',  'transportes',         'expense', 480),
  tx('2024-06-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 524),
  tx('2024-06-14', 'Drogasil — vitaminas inverno',   'saude_cuidados',      'expense', 165),
  tx('2024-06-05', 'Mensalidade faculdade',           'educacao',            'expense', 1177),
  tx('2024-06-08', 'Tim — celular',                  'comunicacao',         'expense', 79),
  tx('2024-06-08', 'Claro — internet fibra',         'comunicacao',         'expense', 110),
  tx('2024-06-15', 'Casaco + bota inverno — Zara',  'vestuario',           'expense', 430),
  tx('2024-06-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 105),
  tx('2024-06-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 120),
  tx('2024-06-28', 'Salário Junho/24',               'alimentacao_bebidas', 'income',  9000),

  // ═══════════════════════════════════════════════════════════
  // Julho 2024  — férias curtas; gasolina sobe
  // ═══════════════════════════════════════════════════════════
  tx('2024-07-04', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1080),
  tx('2024-07-11', 'iFood — férias',                'alimentacao_bebidas', 'expense', 450),
  tx('2024-07-18', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 580),
  tx('2024-07-03', 'Aluguel + condomínio',           'moradia',             'expense', 2940),
  tx('2024-07-10', 'Enel — conta de luz',            'moradia',             'expense', 248),
  tx('2024-07-10', 'Sabesp — conta de água',         'moradia',             'expense', 96),
  tx('2024-07-12', 'Gasolina Shell',                 'transportes',         'expense', 395),
  tx('2024-07-20', 'Uber',                           'transportes',         'expense', 192),
  tx('2024-07-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 524),
  tx('2024-07-16', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 142),
  tx('2024-07-05', 'Mensalidade faculdade',           'educacao',            'expense', 1177),
  tx('2024-07-08', 'Tim — celular',                  'comunicacao',         'expense', 79),
  tx('2024-07-08', 'Claro — internet fibra',         'comunicacao',         'expense', 110),
  tx('2024-07-20', 'Passagem aérea — viagem curta',  'despesas_pessoais',   'expense', 680),
  tx('2024-07-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 105),
  tx('2024-07-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 120),
  tx('2024-07-31', 'Salário Julho/24',               'alimentacao_bebidas', 'income',  9000),

  // ═══════════════════════════════════════════════════════════
  // Agosto 2024  — IPCA -0.02 % (leve deflação); reforma banheiro
  // ═══════════════════════════════════════════════════════════
  tx('2024-08-06', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1065),
  tx('2024-08-13', 'iFood',                          'alimentacao_bebidas', 'expense', 380),
  tx('2024-08-20', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 555),
  tx('2024-08-03', 'Aluguel + condomínio',           'moradia',             'expense', 2940),
  tx('2024-08-10', 'Enel — conta de luz',            'moradia',             'expense', 240),
  tx('2024-08-10', 'Sabesp — conta de água',         'moradia',             'expense', 94),
  tx('2024-08-14', 'Gasolina Shell',                 'transportes',         'expense', 368),
  tx('2024-08-21', 'Uber',                           'transportes',         'expense', 178),
  tx('2024-08-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 524),
  tx('2024-08-15', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 130),
  tx('2024-08-05', 'Mensalidade faculdade',           'educacao',            'expense', 1177),
  tx('2024-08-08', 'Tim — celular',                  'comunicacao',         'expense', 79),
  tx('2024-08-08', 'Claro — internet fibra',         'comunicacao',         'expense', 110),
  tx('2024-08-22', 'Reforma banheiro — materiais',   'artigos_residencia',  'expense', 1250),
  tx('2024-08-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 105),
  tx('2024-08-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 120),
  tx('2024-08-30', 'Salário Agosto/24',              'alimentacao_bebidas', 'income',  9000),

  // ═══════════════════════════════════════════════════════════
  // Setembro 2024
  // ═══════════════════════════════════════════════════════════
  tx('2024-09-05', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1090),
  tx('2024-09-12', 'iFood',                          'alimentacao_bebidas', 'expense', 415),
  tx('2024-09-19', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 572),
  tx('2024-09-03', 'Aluguel + condomínio',           'moradia',             'expense', 2940),
  tx('2024-09-10', 'Enel — conta de luz',            'moradia',             'expense', 258),
  tx('2024-09-10', 'Sabesp — conta de água',         'moradia',             'expense', 99),
  tx('2024-09-13', 'Gasolina Shell',                 'transportes',         'expense', 380),
  tx('2024-09-20', 'Uber',                           'transportes',         'expense', 195),
  tx('2024-09-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 524),
  tx('2024-09-16', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 148),
  tx('2024-09-05', 'Mensalidade faculdade',           'educacao',            'expense', 1177),
  tx('2024-09-08', 'Tim — celular',                  'comunicacao',         'expense', 79),
  tx('2024-09-08', 'Claro — internet fibra',         'comunicacao',         'expense', 110),
  tx('2024-09-20', 'Tênis esportivo — Netshoes',    'vestuario',           'expense', 320),
  tx('2024-09-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 105),
  tx('2024-09-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 120),
  tx('2024-09-30', 'Salário Setembro/24',            'alimentacao_bebidas', 'income',  9000),

  // ═══════════════════════════════════════════════════════════
  // Outubro 2024  — bandeira escassez hídrica (+R$ 80 luz)
  // ═══════════════════════════════════════════════════════════
  tx('2024-10-04', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1110),
  tx('2024-10-11', 'iFood',                          'alimentacao_bebidas', 'expense', 420),
  tx('2024-10-18', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 585),
  tx('2024-10-03', 'Aluguel + condomínio',           'moradia',             'expense', 2940),
  tx('2024-10-10', 'Enel — conta de luz (bandeira)', 'moradia',             'expense', 340),
  tx('2024-10-10', 'Sabesp — conta de água',         'moradia',             'expense', 102),
  tx('2024-10-15', 'Gasolina Shell',                 'transportes',         'expense', 388),
  tx('2024-10-22', 'Uber',                           'transportes',         'expense', 198),
  tx('2024-10-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 524),
  tx('2024-10-15', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 155),
  tx('2024-10-05', 'Mensalidade faculdade',           'educacao',            'expense', 1177),
  tx('2024-10-08', 'Tim — celular',                  'comunicacao',         'expense', 79),
  tx('2024-10-08', 'Claro — internet fibra',         'comunicacao',         'expense', 110),
  tx('2024-10-18', 'Jogo de lençóis + travesseiros', 'artigos_residencia',  'expense', 280),
  tx('2024-10-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 105),
  tx('2024-10-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 120),
  tx('2024-10-31', 'Salário Outubro/24',             'alimentacao_bebidas', 'income',  9000),

  // ═══════════════════════════════════════════════════════════
  // Novembro 2024  — Black Friday (eletrônico)
  // ═══════════════════════════════════════════════════════════
  tx('2024-11-05', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1100),
  tx('2024-11-12', 'iFood',                          'alimentacao_bebidas', 'expense', 410),
  tx('2024-11-19', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 570),
  tx('2024-11-03', 'Aluguel + condomínio',           'moradia',             'expense', 2940),
  tx('2024-11-10', 'Enel — conta de luz (bandeira)', 'moradia',             'expense', 338),
  tx('2024-11-10', 'Sabesp — conta de água',         'moradia',             'expense', 100),
  tx('2024-11-14', 'Gasolina Shell',                 'transportes',         'expense', 392),
  tx('2024-11-21', 'Uber',                           'transportes',         'expense', 195),
  tx('2024-11-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 524),
  tx('2024-11-14', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 138),
  tx('2024-11-05', 'Mensalidade faculdade',           'educacao',            'expense', 1177),
  tx('2024-11-08', 'Tim — celular',                  'comunicacao',         'expense', 79),
  tx('2024-11-08', 'Claro — internet fibra',         'comunicacao',         'expense', 110),
  tx('2024-11-29', 'Air fryer Black Friday — Americanas', 'artigos_residencia', 'expense', 349),
  tx('2024-11-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 105),
  tx('2024-11-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 120),
  tx('2024-11-29', 'Salário Novembro/24',            'alimentacao_bebidas', 'income',  9000),

  // ═══════════════════════════════════════════════════════════
  // Dezembro 2024  — Natal; 13º salário
  // ═══════════════════════════════════════════════════════════
  tx('2024-12-04', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1200),
  tx('2024-12-11', 'iFood',                          'alimentacao_bebidas', 'expense', 480),
  tx('2024-12-18', 'Mercado Extra — ceia natalina', 'alimentacao_bebidas', 'expense', 680),
  tx('2024-12-03', 'Aluguel + condomínio',           'moradia',             'expense', 2940),
  tx('2024-12-10', 'Enel — conta de luz',            'moradia',             'expense', 268),
  tx('2024-12-10', 'Sabesp — conta de água',         'moradia',             'expense', 103),
  tx('2024-12-13', 'Gasolina Shell',                 'transportes',         'expense', 405),
  tx('2024-12-20', 'Uber — viagens festas',          'transportes',         'expense', 230),
  tx('2024-12-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 524),
  tx('2024-12-15', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 145),
  tx('2024-12-05', 'Mensalidade faculdade',           'educacao',            'expense', 1177),
  tx('2024-12-08', 'Tim — celular',                  'comunicacao',         'expense', 79),
  tx('2024-12-08', 'Claro — internet fibra',         'comunicacao',         'expense', 110),
  tx('2024-12-20', 'Presentes Natal — Shopee/Americanas', 'despesas_pessoais', 'expense', 420),
  tx('2024-12-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 105),
  tx('2024-12-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 120),
  tx('2024-12-20', '13º salário Dezembro/24',        'alimentacao_bebidas', 'income',  9000),
  tx('2024-12-31', 'Salário Dezembro/24',            'alimentacao_bebidas', 'income',  9000),

  // ═══════════════════════════════════════════════════════════
  // Janeiro 2025  — viagem réveillon; bandeira tarifária verde
  // ═══════════════════════════════════════════════════════════
  tx('2025-01-07', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1130),
  tx('2025-01-14', 'iFood — pós-férias',            'alimentacao_bebidas', 'expense', 430),
  tx('2025-01-21', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 590),
  tx('2025-01-03', 'Aluguel + condomínio',           'moradia',             'expense', 2940),
  tx('2025-01-10', 'Enel — conta de luz',            'moradia',             'expense', 265),
  tx('2025-01-10', 'Sabesp — conta de água',         'moradia',             'expense', 105),
  tx('2025-01-08', 'Gasolina Shell',                 'transportes',         'expense', 398),
  tx('2025-01-17', 'Uber',                           'transportes',         'expense', 200),
  tx('2025-01-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 524),
  tx('2025-01-16', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 142),
  tx('2025-01-05', 'Mensalidade faculdade',           'educacao',            'expense', 1177),
  tx('2025-01-08', 'Tim — celular',                  'comunicacao',         'expense', 79),
  tx('2025-01-08', 'Claro — internet fibra',         'comunicacao',         'expense', 110),
  tx('2025-01-10', 'Viagem réveillon — hotel/passeios', 'despesas_pessoais', 'expense', 1850),
  tx('2025-01-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 105),
  tx('2025-01-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 120),
  tx('2025-01-31', 'Salário Janeiro/25',             'alimentacao_bebidas', 'income',  9000),

  // ═══════════════════════════════════════════════════════════
  // Fevereiro 2025  — IPCA 1,31 % (alta tarifária energia/transporte)
  // reajuste faculdade +6 %; internet + celular +10 %
  // ═══════════════════════════════════════════════════════════
  tx('2025-02-05', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1180),
  tx('2025-02-12', 'iFood — carnaval',              'alimentacao_bebidas', 'expense', 550),
  tx('2025-02-19', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 610),
  tx('2025-02-03', 'Aluguel + condomínio',           'moradia',             'expense', 2940),
  tx('2025-02-10', 'Enel — conta de luz (alta)',     'moradia',             'expense', 310),
  tx('2025-02-10', 'Sabesp — conta de água',         'moradia',             'expense', 108),
  tx('2025-02-12', 'Gasolina Shell',                 'transportes',         'expense', 420),
  tx('2025-02-19', 'Uber',                           'transportes',         'expense', 225),
  tx('2025-02-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 524),
  tx('2025-02-14', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 162),
  tx('2025-02-05', 'Mensalidade faculdade',           'educacao',            'expense', 1247),
  tx('2025-02-08', 'Tim — celular',                  'comunicacao',         'expense', 87),
  tx('2025-02-08', 'Claro — internet fibra',         'comunicacao',         'expense', 121),
  tx('2025-02-22', 'Camisas sociais + terno — Zara', 'vestuario',           'expense', 520),
  tx('2025-02-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 112),
  tx('2025-02-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 130),
  tx('2025-02-28', 'Salário Fevereiro/25',           'alimentacao_bebidas', 'income',  9000),

  // ═══════════════════════════════════════════════════════════
  // Março 2025  — aumento salário para R$ 9.500
  // ═══════════════════════════════════════════════════════════
  tx('2025-03-06', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1210),
  tx('2025-03-13', 'iFood',                          'alimentacao_bebidas', 'expense', 435),
  tx('2025-03-20', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 620),
  tx('2025-03-03', 'Aluguel + condomínio',           'moradia',             'expense', 2940),
  tx('2025-03-10', 'Enel — conta de luz',            'moradia',             'expense', 295),
  tx('2025-03-10', 'Sabesp — conta de água',         'moradia',             'expense', 109),
  tx('2025-03-13', 'Gasolina Shell',                 'transportes',         'expense', 412),
  tx('2025-03-20', 'Uber',                           'transportes',         'expense', 208),
  tx('2025-03-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 524),
  tx('2025-03-15', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 150),
  tx('2025-03-05', 'Mensalidade faculdade',           'educacao',            'expense', 1247),
  tx('2025-03-08', 'Tim — celular',                  'comunicacao',         'expense', 87),
  tx('2025-03-08', 'Claro — internet fibra',         'comunicacao',         'expense', 121),
  tx('2025-03-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 112),
  tx('2025-03-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 130),
  tx('2025-03-31', 'Salário Março/25 + aumento',    'alimentacao_bebidas', 'income',  9500),

  // ═══════════════════════════════════════════════════════════
  // Abril 2025  — reajuste aluguel +6 %; reajuste plano ANS
  // ═══════════════════════════════════════════════════════════
  tx('2025-04-04', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1235),
  tx('2025-04-11', 'iFood',                          'alimentacao_bebidas', 'expense', 445),
  tx('2025-04-18', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 638),
  tx('2025-04-03', 'Aluguel + condomínio',           'moradia',             'expense', 3116),
  tx('2025-04-10', 'Enel — conta de luz',            'moradia',             'expense', 285),
  tx('2025-04-10', 'Sabesp — conta de água',         'moradia',             'expense', 112),
  tx('2025-04-14', 'Gasolina Shell',                 'transportes',         'expense', 408),
  tx('2025-04-21', 'Uber',                           'transportes',         'expense', 210),
  tx('2025-04-08', 'Bradesco Saúde — plano (ANS)',   'saude_cuidados',      'expense', 572),
  tx('2025-04-16', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 155),
  tx('2025-04-05', 'Mensalidade faculdade',           'educacao',            'expense', 1247),
  tx('2025-04-08', 'Tim — celular',                  'comunicacao',         'expense', 87),
  tx('2025-04-08', 'Claro — internet fibra',         'comunicacao',         'expense', 121),
  tx('2025-04-19', 'Tênis + bermudas verão — Nike',  'vestuario',           'expense', 380),
  tx('2025-04-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 112),
  tx('2025-04-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 130),
  tx('2025-04-30', 'Salário Abril/25',               'alimentacao_bebidas', 'income',  9500),

  // ═══════════════════════════════════════════════════════════
  // Maio 2025
  // ═══════════════════════════════════════════════════════════
  tx('2025-05-06', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1255),
  tx('2025-05-13', 'iFood',                          'alimentacao_bebidas', 'expense', 440),
  tx('2025-05-20', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 645),
  tx('2025-05-03', 'Aluguel + condomínio',           'moradia',             'expense', 3116),
  tx('2025-05-10', 'Enel — conta de luz',            'moradia',             'expense', 278),
  tx('2025-05-10', 'Sabesp — conta de água',         'moradia',             'expense', 114),
  tx('2025-05-13', 'Gasolina Shell',                 'transportes',         'expense', 410),
  tx('2025-05-20', 'Uber',                           'transportes',         'expense', 205),
  tx('2025-05-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 572),
  tx('2025-05-15', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 145),
  tx('2025-05-05', 'Mensalidade faculdade',           'educacao',            'expense', 1247),
  tx('2025-05-08', 'Tim — celular',                  'comunicacao',         'expense', 87),
  tx('2025-05-08', 'Claro — internet fibra',         'comunicacao',         'expense', 121),
  tx('2025-05-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 112),
  tx('2025-05-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 130),
  tx('2025-05-30', 'Salário Maio/25',                'alimentacao_bebidas', 'income',  9500),

  // ═══════════════════════════════════════════════════════════
  // Junho 2025  — inverno; troca de pneus
  // ═══════════════════════════════════════════════════════════
  tx('2025-06-05', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1270),
  tx('2025-06-12', 'iFood',                          'alimentacao_bebidas', 'expense', 425),
  tx('2025-06-19', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 650),
  tx('2025-06-03', 'Aluguel + condomínio',           'moradia',             'expense', 3116),
  tx('2025-06-10', 'Enel — conta de luz',            'moradia',             'expense', 290),
  tx('2025-06-10', 'Sabesp — conta de água',         'moradia',             'expense', 112),
  tx('2025-06-14', 'Gasolina Shell',                 'transportes',         'expense', 405),
  tx('2025-06-21', 'Troca de pneus — Pneustore',    'transportes',         'expense', 920),
  tx('2025-06-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 572),
  tx('2025-06-14', 'Drogasil — vitaminas inverno',   'saude_cuidados',      'expense', 178),
  tx('2025-06-05', 'Mensalidade faculdade',           'educacao',            'expense', 1247),
  tx('2025-06-08', 'Tim — celular',                  'comunicacao',         'expense', 87),
  tx('2025-06-08', 'Claro — internet fibra',         'comunicacao',         'expense', 121),
  tx('2025-06-18', 'Jaqueta + calça inverno — Farm', 'vestuario',           'expense', 465),
  tx('2025-06-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 112),
  tx('2025-06-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 130),
  tx('2025-06-30', 'Salário Junho/25',               'alimentacao_bebidas', 'income',  9500),

  // ═══════════════════════════════════════════════════════════
  // Julho 2025  — IPCA 0,35 %; férias
  // ═══════════════════════════════════════════════════════════
  tx('2025-07-04', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1280),
  tx('2025-07-11', 'iFood — férias',                'alimentacao_bebidas', 'expense', 490),
  tx('2025-07-18', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 660),
  tx('2025-07-03', 'Aluguel + condomínio',           'moradia',             'expense', 3116),
  tx('2025-07-10', 'Enel — conta de luz',            'moradia',             'expense', 285),
  tx('2025-07-10', 'Sabesp — conta de água',         'moradia',             'expense', 110),
  tx('2025-07-12', 'Gasolina Shell',                 'transportes',         'expense', 400),
  tx('2025-07-19', 'Uber',                           'transportes',         'expense', 198),
  tx('2025-07-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 572),
  tx('2025-07-15', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 148),
  tx('2025-07-05', 'Mensalidade faculdade',           'educacao',            'expense', 1247),
  tx('2025-07-08', 'Tim — celular',                  'comunicacao',         'expense', 87),
  tx('2025-07-08', 'Claro — internet fibra',         'comunicacao',         'expense', 121),
  tx('2025-07-15', 'Pacote viagem — Decolar',        'despesas_pessoais',   'expense', 2200),
  tx('2025-07-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 112),
  tx('2025-07-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 130),
  tx('2025-07-31', 'Salário Julho/25',               'alimentacao_bebidas', 'income',  9500),

  // ═══════════════════════════════════════════════════════════
  // Agosto 2025  — IPCA -0,11 % (deflação leve)
  // ═══════════════════════════════════════════════════════════
  tx('2025-08-06', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1268),
  tx('2025-08-13', 'iFood',                          'alimentacao_bebidas', 'expense', 415),
  tx('2025-08-20', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 640),
  tx('2025-08-03', 'Aluguel + condomínio',           'moradia',             'expense', 3116),
  tx('2025-08-10', 'Enel — conta de luz',            'moradia',             'expense', 270),
  tx('2025-08-10', 'Sabesp — conta de água',         'moradia',             'expense', 108),
  tx('2025-08-14', 'Gasolina Shell',                 'transportes',         'expense', 392),
  tx('2025-08-21', 'Uber',                           'transportes',         'expense', 192),
  tx('2025-08-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 572),
  tx('2025-08-15', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 138),
  tx('2025-08-05', 'Mensalidade faculdade',           'educacao',            'expense', 1247),
  tx('2025-08-08', 'Tim — celular',                  'comunicacao',         'expense', 87),
  tx('2025-08-08', 'Claro — internet fibra',         'comunicacao',         'expense', 121),
  tx('2025-08-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 112),
  tx('2025-08-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 130),
  tx('2025-08-29', 'Salário Agosto/25',              'alimentacao_bebidas', 'income',  9500),

  // ═══════════════════════════════════════════════════════════
  // Setembro 2025  — IPCA 0,48 %
  // ═══════════════════════════════════════════════════════════
  tx('2025-09-05', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1285),
  tx('2025-09-12', 'iFood',                          'alimentacao_bebidas', 'expense', 425),
  tx('2025-09-19', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 658),
  tx('2025-09-03', 'Aluguel + condomínio',           'moradia',             'expense', 3116),
  tx('2025-09-10', 'Enel — conta de luz',            'moradia',             'expense', 280),
  tx('2025-09-10', 'Sabesp — conta de água',         'moradia',             'expense', 112),
  tx('2025-09-13', 'Gasolina Shell',                 'transportes',         'expense', 398),
  tx('2025-09-20', 'Uber',                           'transportes',         'expense', 202),
  tx('2025-09-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 572),
  tx('2025-09-16', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 152),
  tx('2025-09-05', 'Mensalidade faculdade',           'educacao',            'expense', 1247),
  tx('2025-09-08', 'Tim — celular',                  'comunicacao',         'expense', 87),
  tx('2025-09-08', 'Claro — internet fibra',         'comunicacao',         'expense', 121),
  tx('2025-09-22', 'Tênis e roupas primavera — Riachuelo', 'vestuario',     'expense', 340),
  tx('2025-09-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 112),
  tx('2025-09-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 130),
  tx('2025-09-30', 'Salário Setembro/25',            'alimentacao_bebidas', 'income',  9500),

  // ═══════════════════════════════════════════════════════════
  // Outubro 2025  — IPCA 0,09 % (desinflação)
  // ═══════════════════════════════════════════════════════════
  tx('2025-10-04', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1292),
  tx('2025-10-11', 'iFood',                          'alimentacao_bebidas', 'expense', 428),
  tx('2025-10-18', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 662),
  tx('2025-10-03', 'Aluguel + condomínio',           'moradia',             'expense', 3116),
  tx('2025-10-10', 'Enel — conta de luz',            'moradia',             'expense', 276),
  tx('2025-10-10', 'Sabesp — conta de água',         'moradia',             'expense', 110),
  tx('2025-10-15', 'Gasolina Shell',                 'transportes',         'expense', 396),
  tx('2025-10-22', 'Uber',                           'transportes',         'expense', 199),
  tx('2025-10-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 572),
  tx('2025-10-15', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 148),
  tx('2025-10-05', 'Mensalidade faculdade',           'educacao',            'expense', 1247),
  tx('2025-10-08', 'Tim — celular',                  'comunicacao',         'expense', 87),
  tx('2025-10-08', 'Claro — internet fibra',         'comunicacao',         'expense', 121),
  tx('2025-10-20', 'Liquidificador + panelas — Americanas', 'artigos_residencia', 'expense', 315),
  tx('2025-10-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 112),
  tx('2025-10-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 130),
  tx('2025-10-31', 'Salário Outubro/25',             'alimentacao_bebidas', 'income',  9500),

  // ═══════════════════════════════════════════════════════════
  // Novembro 2025  — IPCA 0,18 %; Black Friday
  // ═══════════════════════════════════════════════════════════
  tx('2025-11-05', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1298),
  tx('2025-11-12', 'iFood',                          'alimentacao_bebidas', 'expense', 430),
  tx('2025-11-19', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 668),
  tx('2025-11-03', 'Aluguel + condomínio',           'moradia',             'expense', 3116),
  tx('2025-11-10', 'Enel — conta de luz',            'moradia',             'expense', 278),
  tx('2025-11-10', 'Sabesp — conta de água',         'moradia',             'expense', 110),
  tx('2025-11-14', 'Gasolina Shell',                 'transportes',         'expense', 398),
  tx('2025-11-21', 'Uber',                           'transportes',         'expense', 195),
  tx('2025-11-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 572),
  tx('2025-11-14', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 140),
  tx('2025-11-05', 'Mensalidade faculdade',           'educacao',            'expense', 1247),
  tx('2025-11-08', 'Tim — celular',                  'comunicacao',         'expense', 87),
  tx('2025-11-08', 'Claro — internet fibra',         'comunicacao',         'expense', 121),
  tx('2025-11-28', 'Smart TV 55" Black Friday — Kabum', 'artigos_residencia', 'expense', 1890),
  tx('2025-11-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 112),
  tx('2025-11-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 130),
  tx('2025-11-28', 'Salário Novembro/25',            'alimentacao_bebidas', 'income',  9500),

  // ═══════════════════════════════════════════════════════════
  // Dezembro 2025  — IPCA 0,33 %; Natal; 13º
  // ═══════════════════════════════════════════════════════════
  tx('2025-12-05', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1340),
  tx('2025-12-12', 'iFood',                          'alimentacao_bebidas', 'expense', 500),
  tx('2025-12-19', 'Mercado Extra — ceia',           'alimentacao_bebidas', 'expense', 720),
  tx('2025-12-03', 'Aluguel + condomínio',           'moradia',             'expense', 3116),
  tx('2025-12-10', 'Enel — conta de luz',            'moradia',             'expense', 290),
  tx('2025-12-10', 'Sabesp — conta de água',         'moradia',             'expense', 112),
  tx('2025-12-13', 'Gasolina Shell',                 'transportes',         'expense', 408),
  tx('2025-12-20', 'Uber — festas',                  'transportes',         'expense', 240),
  tx('2025-12-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 572),
  tx('2025-12-15', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 148),
  tx('2025-12-05', 'Mensalidade faculdade',           'educacao',            'expense', 1247),
  tx('2025-12-08', 'Tim — celular',                  'comunicacao',         'expense', 87),
  tx('2025-12-08', 'Claro — internet fibra',         'comunicacao',         'expense', 121),
  tx('2025-12-20', 'Presentes Natal — variados',     'despesas_pessoais',   'expense', 480),
  tx('2025-12-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 112),
  tx('2025-12-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 130),
  tx('2025-12-19', '13º salário Dezembro/25',        'alimentacao_bebidas', 'income',  9500),
  tx('2025-12-31', 'Salário Dezembro/25',            'alimentacao_bebidas', 'income',  9500),

  // ═══════════════════════════════════════════════════════════
  // Janeiro 2026  — IPCA 0,33 %
  // ═══════════════════════════════════════════════════════════
  tx('2026-01-07', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1355),
  tx('2026-01-14', 'iFood',                          'alimentacao_bebidas', 'expense', 450),
  tx('2026-01-21', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 685),
  tx('2026-01-03', 'Aluguel + condomínio',           'moradia',             'expense', 3116),
  tx('2026-01-10', 'Enel — conta de luz',            'moradia',             'expense', 286),
  tx('2026-01-10', 'Sabesp — conta de água',         'moradia',             'expense', 115),
  tx('2026-01-13', 'Gasolina Shell',                 'transportes',         'expense', 405),
  tx('2026-01-20', 'Uber',                           'transportes',         'expense', 205),
  tx('2026-01-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 572),
  tx('2026-01-16', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 145),
  tx('2026-01-05', 'Mensalidade faculdade',           'educacao',            'expense', 1247),
  tx('2026-01-08', 'Tim — celular',                  'comunicacao',         'expense', 87),
  tx('2026-01-08', 'Claro — internet fibra',         'comunicacao',         'expense', 121),
  tx('2026-01-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 112),
  tx('2026-01-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 130),
  tx('2026-01-31', 'Salário Janeiro/26',             'alimentacao_bebidas', 'income',  9500),

  // ═══════════════════════════════════════════════════════════
  // Fevereiro 2026  — IPCA 0,70 %; reajuste faculdade +6,5 %
  // ═══════════════════════════════════════════════════════════
  tx('2026-02-05', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1380),
  tx('2026-02-12', 'iFood — carnaval',              'alimentacao_bebidas', 'expense', 560),
  tx('2026-02-19', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 698),
  tx('2026-02-03', 'Aluguel + condomínio',           'moradia',             'expense', 3116),
  tx('2026-02-10', 'Enel — conta de luz',            'moradia',             'expense', 298),
  tx('2026-02-10', 'Sabesp — conta de água',         'moradia',             'expense', 118),
  tx('2026-02-12', 'Gasolina Shell',                 'transportes',         'expense', 418),
  tx('2026-02-19', 'Uber — deslocamentos carnaval',  'transportes',         'expense', 238),
  tx('2026-02-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 572),
  tx('2026-02-14', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 165),
  tx('2026-02-05', 'Mensalidade faculdade',           'educacao',            'expense', 1328),
  tx('2026-02-08', 'Tim — celular',                  'comunicacao',         'expense', 87),
  tx('2026-02-08', 'Claro — internet fibra',         'comunicacao',         'expense', 121),
  tx('2026-02-22', 'Roupas carnaval + acessórios',   'vestuario',           'expense', 248),
  tx('2026-02-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 112),
  tx('2026-02-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 130),
  tx('2026-02-28', 'Salário Fevereiro/26',           'alimentacao_bebidas', 'income',  9500),

  // ═══════════════════════════════════════════════════════════
  // Março 2026  — IPCA 0,88 % (mês mais recente disponível)
  // ═══════════════════════════════════════════════════════════
  tx('2026-03-05', 'Supermercado Pão de Açúcar',   'alimentacao_bebidas', 'expense', 1410),
  tx('2026-03-12', 'iFood',                          'alimentacao_bebidas', 'expense', 468),
  tx('2026-03-19', 'Mercado Extra',                  'alimentacao_bebidas', 'expense', 718),
  tx('2026-03-03', 'Aluguel + condomínio',           'moradia',             'expense', 3116),
  tx('2026-03-10', 'Enel — conta de luz',            'moradia',             'expense', 310),
  tx('2026-03-10', 'Sabesp — conta de água',         'moradia',             'expense', 120),
  tx('2026-03-13', 'Gasolina Shell',                 'transportes',         'expense', 425),
  tx('2026-03-20', 'Uber',                           'transportes',         'expense', 215),
  tx('2026-03-08', 'Bradesco Saúde — plano',         'saude_cuidados',      'expense', 572),
  tx('2026-03-15', 'Drogasil — farmácia',            'saude_cuidados',      'expense', 158),
  tx('2026-03-05', 'Mensalidade faculdade',           'educacao',            'expense', 1328),
  tx('2026-03-08', 'Tim — celular',                  'comunicacao',         'expense', 87),
  tx('2026-03-08', 'Claro — internet fibra',         'comunicacao',         'expense', 121),
  tx('2026-03-22', 'Tênis verão — Netshoes',         'vestuario',           'expense', 298),
  tx('2026-03-25', 'Netflix + Spotify + Max',        'despesas_pessoais',   'expense', 112),
  tx('2026-03-28', 'Smart Fit — academia',           'despesas_pessoais',   'expense', 130),
  tx('2026-03-31', 'Salário Março/26',               'alimentacao_bebidas', 'income',  9500),
];
