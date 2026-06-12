import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const sections = [
  {
    title: '1. Aceitação dos Termos',
    body: `Ao acessar ou utilizar o Meu IPCA ("Plataforma"), você ("Usuário") declara ter lido, compreendido e concordado com estes Termos de Uso e com a Política de Privacidade. Caso não concorde, interrompa imediatamente o uso. Estes Termos são regidos pelo Código Civil Brasileiro (Lei nº 10.406/2002), pelo Marco Civil da Internet (Lei nº 12.965/2014) e demais legislações aplicáveis.`,
  },
  {
    title: '2. Descrição do Serviço',
    body: `O Meu IPCA é uma calculadora de inflação pessoal que permite ao usuário registrar seus gastos por categoria e comparar sua inflação real com o IPCA oficial divulgado pelo IBGE. Os dados de IPCA utilizados são obtidos diretamente da API pública do IBGE/SIDRA.`,
  },
  {
    title: '3. Uso da Plataforma',
    body: `3.1. O Meu IPCA é oferecido gratuitamente aos usuários.\n3.2. Os dados inseridos pelo Usuário são armazenados localmente no dispositivo (localStorage) e não são transmitidos a servidores externos.\n3.3. O Usuário é integralmente responsável pelas informações que insere na Plataforma.`,
  },
  {
    title: '4. Aviso sobre Informações Financeiras',
    body: `4.1. Todos os dados disponibilizados têm caráter meramente informativo e educacional.\n4.2. Nenhum conteúdo da Plataforma constitui recomendação de investimento, assessoria financeira ou oferta de compra/venda de valores mobiliários.\n4.3. Os índices IPCA exibidos são obtidos da API pública do IBGE e podem apresentar diferença em relação à divulgação oficial mais recente.\n4.4. O Meu IPCA não se responsabiliza por quaisquer decisões financeiras baseadas no uso da Plataforma.\n4.5. Consulte profissionais de investimentos habilitados antes de tomar qualquer decisão financeira.`,
  },
  {
    title: '5. Propriedade Intelectual',
    body: `5.1. Todo o conteúdo da Plataforma — incluindo código-fonte, design, textos, logotipos e metodologia de cálculo — é propriedade do Meu IPCA / Macro Panorama ou de seus licenciantes, protegido pela Lei nº 9.610/1998.\n5.2. É vedada qualquer reprodução, distribuição, modificação ou exploração comercial sem autorização prévia e escrita.\n5.3. O uso da Plataforma não transfere ao Usuário qualquer direito de propriedade intelectual.`,
  },
  {
    title: '6. Restrições de Uso',
    body: `É expressamente proibido ao Usuário:\n• Utilizar a Plataforma para fins ilícitos, fraudulentos ou contrários à moral;\n• Realizar acesso automatizado por bots, scrapers ou scripts sem autorização escrita;\n• Tentar contornar mecanismos de autenticação ou segurança;\n• Utilizar dados da Plataforma para criar produtos ou serviços concorrentes.`,
  },
  {
    title: '7. Limitação de Responsabilidade',
    body: `7.1. O Meu IPCA não garante disponibilidade ininterrupta dos serviços.\n7.2. Em nenhuma hipótese será responsável por danos indiretos, lucros cessantes, perda de dados ou prejuízos financeiros decorrentes do uso ou impossibilidade de uso da Plataforma.\n7.3. A disponibilidade dos dados do IBGE depende de serviços externos sobre os quais o Meu IPCA não possui controle.`,
  },
  {
    title: '8. Modificações dos Termos',
    body: `Estes Termos podem ser alterados a qualquer momento. Alterações relevantes serão comunicadas com no mínimo 10 (dez) dias de antecedência por aviso na Plataforma. O uso continuado após a publicação implica aceitação das novas condições.`,
  },
  {
    title: '9. Contato',
    body: `Em caso de dúvidas sobre estes Termos, entre em contato pelo e-mail: suporte.macropanorama@gmail.com`,
  },
  {
    title: '10. Lei Aplicável e Foro',
    body: `Estes Termos são regidos exclusivamente pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias, com exclusão de qualquer outro, por mais privilegiado que seja.`,
  },
];

export default function TermsModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 sm:p-8"
        style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <X size={15} style={{ color: 'var(--text-2)' }} />
        </button>

        <h2 className="text-base font-bold text-white mb-0.5">Termos de Uso</h2>
        <p className="text-xs mb-6" style={{ color: 'var(--text-3)' }}>
          Última atualização: junho de 2025
        </p>

        <div className="space-y-5">
          {sections.map(s => (
            <div key={s.title}>
              <p className="text-xs font-semibold text-white mb-1">{s.title}</p>
              <p
                className="text-xs leading-relaxed whitespace-pre-line"
                style={{ color: 'var(--text-2)' }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
