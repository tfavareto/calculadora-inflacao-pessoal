import {
  TrendingUp,
  ShoppingCart,
  BarChart2,
  Lightbulb,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

/* ── Componentes internos ────────────────────────────── */

function SectionCard({
  icon,
  iconBg,
  title,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
        <h2 className="text-base font-bold" style={{ color: 'var(--text-1)' }}>
          {title}
        </h2>
      </div>
      <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--text-2)' }}>
        {children}
      </div>
    </div>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-semibold" style={{ color: 'var(--text-1)' }}>
      {children}
    </span>
  );
}

function Callout({
  emoji,
  children,
}: {
  emoji: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex gap-3 rounded-xl px-4 py-3 text-sm"
      style={{
        background: 'rgba(249,115,22,0.07)',
        border: '1px solid rgba(249,115,22,0.16)',
        color: 'var(--text-2)',
      }}
    >
      <span className="text-base shrink-0 mt-0.5">{emoji}</span>
      <span>{children}</span>
    </div>
  );
}

function TipList({ items }: { items: { emoji: string; title: string; text: string }[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.title} className="flex gap-3">
          <span className="text-lg shrink-0">{item.emoji}</span>
          <span>
            <Highlight>{item.title}:</Highlight> {item.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ── Página principal ────────────────────────────────── */

export default function WhatIsInflation() {
  return (
    <div className="max-w-3xl space-y-5">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>
          O que é Inflação?
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>
          Um guia simples para entender um dos temas mais importantes da sua vida financeira
        </p>
      </div>

      {/* 1 — O que é inflação? */}
      <SectionCard
        icon={<TrendingUp size={18} className="text-white" />}
        iconBg="linear-gradient(135deg, #F97316, #EA580C)"
        title="1. O que é inflação?"
      >
        <p>
          Inflação é o <Highlight>aumento generalizado e contínuo dos preços</Highlight> de produtos
          e serviços ao longo do tempo. Na prática, significa que R$&nbsp;100 hoje compram{' '}
          <em>menos coisas</em> do que compravam há um ano.
        </p>
        <p>
          Imagine que você pagava R$&nbsp;5,00 por um pão de queijo em 2022. Se a inflação do
          período foi de 10%, o mesmo pão de queijo passou a custar R$&nbsp;5,50. O produto é
          o mesmo — mas o seu dinheiro "encolheu".
        </p>
        <Callout emoji="💡">
          O contrário da inflação é a <Highlight>deflação</Highlight>: quando os preços caem de
          forma generalizada. Isso parece bom, mas também pode ser sinal de economia fraca.
        </Callout>
        <p>
          A inflação é causada por vários fatores: aumento da demanda, alta nos custos de
          produção, variação do câmbio (dólar mais caro = importados mais caros), crise de
          abastecimento e até expectativas do mercado.
        </p>
      </SectionCard>

      {/* 2 — O que é o IPCA? */}
      <SectionCard
        icon={<BarChart2 size={18} className="text-white" />}
        iconBg="linear-gradient(135deg, #0d9488, #0f766e)"
        title="2. O que é o IPCA?"
      >
        <p>
          O <Highlight>IPCA (Índice Nacional de Preços ao Consumidor Amplo)</Highlight> é o
          principal indicador oficial de inflação do Brasil, calculado mensalmente pelo{' '}
          <Highlight>IBGE (Instituto Brasileiro de Geografia e Estatística)</Highlight>.
        </p>
        <p>
          Para calculá-lo, o IBGE monitora os preços de uma{' '}
          <Highlight>cesta de produtos e serviços</Highlight> comprada por famílias com renda de
          1 a 40 salários mínimos em 13 regiões metropolitanas do país. São 9 grandes grupos:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { emoji: '🍎', label: 'Alimentação e Bebidas', peso: '23,2%' },
            { emoji: '🏠', label: 'Habitação', peso: '14,1%' },
            { emoji: '🛋️', label: 'Artigos de Residência', peso: '4,7%' },
            { emoji: '👕', label: 'Vestuário', peso: '4,5%' },
            { emoji: '🚌', label: 'Transportes', peso: '20,5%' },
            { emoji: '💊', label: 'Saúde e Cuidados', peso: '12,5%' },
            { emoji: '💈', label: 'Despesas Pessoais', peso: '11,1%' },
            { emoji: '📚', label: 'Educação', peso: '5,4%' },
            { emoji: '📱', label: 'Comunicação', peso: '4,0%' },
          ].map((g) => (
            <div
              key={g.label}
              className="rounded-lg px-3 py-2 flex items-start gap-2"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <span className="text-sm shrink-0">{g.emoji}</span>
              <div>
                <p className="text-[11px] leading-tight" style={{ color: 'var(--text-2)' }}>{g.label}</p>
                <p className="text-[11px] font-semibold mt-0.5" style={{ color: 'var(--text-3)' }}>{g.peso}</p>
              </div>
            </div>
          ))}
        </div>
        <Callout emoji="📌">
          O IPCA é usado pelo <Highlight>Banco Central</Highlight> para definir a taxa de juros
          (Selic) por meio do sistema de metas de inflação. A meta para 2025 é de{' '}
          <Highlight>3,0% ao ano</Highlight> (tolerância de ±1,5%).
        </Callout>
      </SectionCard>

      {/* 3 — Por que a inflação importa? */}
      <SectionCard
        icon={<ShoppingCart size={18} className="text-white" />}
        iconBg="linear-gradient(135deg, #dc2626, #991b1b)"
        title="3. Por que a inflação importa?"
      >
        <p>
          A inflação afeta diretamente o seu <Highlight>poder de compra</Highlight> — ou seja,
          quanto você consegue comprar com o mesmo salário. Quando os preços sobem mais rápido
          do que a sua renda, você fica mais pobre mesmo sem perceber.
        </p>
        <TipList
          items={[
            {
              emoji: '💸',
              title: 'Erosão do salário',
              text: 'Se você ganhou 5% de aumento mas a inflação foi 7%, na prática seu salário caiu 2% em termos reais.',
            },
            {
              emoji: '🏦',
              title: 'Dinheiro parado perde valor',
              text: 'R$ 10.000 guardados embaixo do colchão por um ano com inflação de 5% valem o equivalente a R$ 9.524 no mesmo período.',
            },
            {
              emoji: '📋',
              title: 'Contratos e dívidas',
              text: 'Muitos contratos (aluguel, financiamentos, planos de saúde) são reajustados pelo IPCA ou por índices atrelados a ele.',
            },
            {
              emoji: '🛒',
              title: 'Decisões de consumo',
              text: 'Em períodos de inflação alta, as pessoas tendem a antecipar compras — o que pode pressionar ainda mais os preços.',
            },
          ]}
        />
      </SectionCard>

      {/* 4 — Por que calcular a minha inflação? */}
      <SectionCard
        icon={<Lightbulb size={18} className="text-white" />}
        iconBg="linear-gradient(135deg, #d97706, #92400e)"
        title="4. Por que devo calcular a minha inflação?"
      >
        <p>
          O IPCA é uma <Highlight>média nacional</Highlight>. Ele reflete o comportamento de
          milhões de famílias com hábitos de consumo muito diferentes dos seus. Uma família
          que gasta muito com escola particular sente a inflação de forma diferente de outra que
          não tem filhos em idade escolar.
        </p>
        <Callout emoji="🎯">
          <strong>Sua inflação pessoal pode ser muito diferente do IPCA oficial.</strong>{' '}
          Tudo depende de <em>onde</em> você gasta o seu dinheiro — e é exatamente isso que o{' '}
          <Highlight>Meu IPCA</Highlight> calcula para você.
        </Callout>
        <p>Com o <Highlight>Meu IPCA</Highlight> você consegue:</p>
        <TipList
          items={[
            {
              emoji: '📊',
              title: 'Ver sua inflação real',
              text: 'Calculamos seu índice pessoal mês a mês com base nas suas próprias movimentações, usando a metodologia de Laspeyres — a mesma utilizada pelo IBGE.',
            },
            {
              emoji: '🗺️',
              title: 'Comparar com o IPCA da sua região',
              text: 'Além do IPCA nacional, você pode acompanhar o índice da sua cidade (em 13 regiões metropolitanas) na aba Minha Cidade.',
            },
            {
              emoji: '🔍',
              title: 'Identificar onde a inflação te atinge mais',
              text: 'O painel mostra quais categorias pesam mais no seu orçamento e como cada uma contribui para a sua inflação pessoal.',
            },
            {
              emoji: '📈',
              title: 'Acompanhar a evolução ao longo do tempo',
              text: 'Visualize gráficos mês a mês e entenda se sua inflação pessoal está acima ou abaixo do índice oficial.',
            },
          ]}
        />
        <p>
          Conhecer a sua inflação pessoal é o primeiro passo para tomar decisões mais
          inteligentes sobre <Highlight>renda, gastos e investimentos</Highlight>.
        </p>
      </SectionCard>

      {/* 5 — Como proteger o poder de compra */}
      <SectionCard
        icon={<ShieldCheck size={18} className="text-white" />}
        iconBg="linear-gradient(135deg, #059669, #065f46)"
        title="5. Como posso proteger meu poder de compra?"
      >
        <p>
          Não é possível eliminar completamente o impacto da inflação, mas existem estratégias
          eficazes para <Highlight>minimizá-lo</Highlight> e manter o seu padrão de vida.
        </p>
        <TipList
          items={[
            {
              emoji: '📉',
              title: 'Revise seus gastos por categoria',
              text: 'Use o Meu IPCA para identificar onde você está gastando mais e se esses gastos estão crescendo acima da inflação. Às vezes, pequenos ajustes de hábito fazem grande diferença.',
            },
            {
              emoji: '💼',
              title: 'Negocie seu salário com base no IPCA',
              text: 'Ao pedir aumento, use o IPCA do período como referência mínima. Aumento abaixo da inflação é, na prática, uma redução de salário real.',
            },
            {
              emoji: '🏛️',
              title: 'Mantenha reservas em aplicações que rendem acima da inflação',
              text: 'Tesouro IPCA+, CDBs atrelados ao CDI, LCIs e LCAs são exemplos de produtos que historicamente protegem contra a inflação. Consulte um profissional habilitado para orientação personalizada.',
            },
            {
              emoji: '🔄',
              title: 'Renegocie contratos indexados',
              text: 'Verifique se aluguéis, mensalidades e outros contratos usam índices muito acima do IPCA — às vezes é possível renegociar para índices mais favoráveis.',
            },
            {
              emoji: '🛒',
              title: 'Planeje compras de alto valor',
              text: 'Em momentos de inflação alta em setores específicos (ex: eletrônicos, alimentos), antecipar compras planejadas pode ser vantajoso. Evite, porém, o endividamento para antecipar consumo.',
            },
            {
              emoji: '📚',
              title: 'Educação financeira contínua',
              text: 'Entender como a economia funciona ajuda a tomar decisões melhores. Acompanhe o IPCA mensalmente, monitore sua inflação pessoal e revise seu orçamento regularmente.',
            },
          ]}
        />
      </SectionCard>

      {/* Disclaimer */}
      <div
        className="rounded-xl px-5 py-4 flex gap-3"
        style={{
          background: 'rgba(251,191,36,0.06)',
          border: '1px solid rgba(251,191,36,0.18)',
        }}
      >
        <AlertCircle size={16} className="shrink-0 mt-0.5" style={{ color: '#FCD34D' }} />
        <div className="text-xs leading-relaxed space-y-1" style={{ color: 'var(--text-3)' }}>
          <p className="font-semibold" style={{ color: '#FCD34D' }}>
            Aviso importante — conteúdo educativo
          </p>
          <p>
            Todo o conteúdo desta página tem <strong>finalidade exclusivamente educativa e
            informativa</strong>. As informações aqui apresentadas não constituem, e não devem
            ser interpretadas como, recomendação, sugestão ou oferta de qualquer produto
            financeiro, modalidade de investimento, assessoria de investimentos ou qualquer
            serviço regulado pelo Banco Central do Brasil ou pela CVM.
          </p>
          <p>
            Antes de tomar qualquer decisão financeira ou de investimento, consulte um{' '}
            <strong>profissional habilitado</strong> e avalie seu perfil de investidor. Cada
            situação financeira é única — o que funciona para uma pessoa pode não ser adequado
            para outra.
          </p>
        </div>
      </div>
    </div>
  );
}
