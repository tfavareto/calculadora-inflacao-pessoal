import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const sections = [
  {
    title: '1. Introdução',
    body: `Esta Política de Privacidade descreve como o Meu IPCA coleta, usa e protege as informações dos usuários, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018) e o Marco Civil da Internet (Lei nº 12.965/2014).`,
  },
  {
    title: '2. Dados Coletados',
    body: `2.1. Dados inseridos voluntariamente: gastos por categoria e mês, informações de movimentações financeiras e seleção de cidade/região.\n2.2. Dados técnicos: informações de uso anônimas para melhoria da Plataforma (erros, desempenho).\n2.3. O Meu IPCA não coleta nome, CPF, endereço, dados bancários ou qualquer informação de identificação pessoal.`,
  },
  {
    title: '3. Armazenamento Local',
    body: `Todos os dados inseridos na Plataforma são armazenados exclusivamente no seu dispositivo via localStorage do navegador. Esses dados não são transmitidos, enviados ou armazenados em servidores do Meu IPCA ou de terceiros.`,
  },
  {
    title: '4. Finalidade do Uso dos Dados',
    body: `Os dados inseridos são utilizados exclusivamente para:\n• Calcular sua inflação pessoal com base nos pesos das categorias;\n• Comparar seus gastos com o IPCA oficial do IBGE;\n• Exibir históricos e gráficos de evolução de gastos.`,
  },
  {
    title: '5. Compartilhamento de Dados',
    body: `5.1. O Meu IPCA não vende, aluga ou compartilha dados pessoais com terceiros.\n5.2. Os dados IPCA são obtidos diretamente da API pública do IBGE/SIDRA, conforme os termos de uso desse serviço.\n5.3. Em caso de obrigação legal, poderemos divulgar informações às autoridades competentes.`,
  },
  {
    title: '6. Seus Direitos (LGPD)',
    body: `Nos termos da LGPD, você tem direito a:\n• Confirmar a existência de tratamento de dados;\n• Acessar os dados armazenados (todos disponíveis localmente no seu navegador);\n• Corrigir dados incompletos ou incorretos;\n• Eliminar seus dados (utilize o botão "Limpar todos os dados" na Plataforma);\n• Revogar o consentimento a qualquer momento.`,
  },
  {
    title: '7. Cookies e Tecnologias',
    body: `A Plataforma utiliza localStorage do navegador para persistência de dados locais. Não utilizamos cookies de rastreamento, publicidade ou análise comportamental de terceiros.`,
  },
  {
    title: '8. Segurança',
    body: `Adotamos medidas técnicas adequadas para proteger as informações na Plataforma. No entanto, nenhum sistema é completamente seguro. Recomendamos que o Usuário não compartilhe o acesso ao seu dispositivo com terceiros.`,
  },
  {
    title: '9. Retenção de Dados',
    body: `Os dados permanecem no seu dispositivo até que você os exclua manualmente ou limpe o armazenamento do navegador. O Meu IPCA não possui cópias desses dados.`,
  },
  {
    title: '10. Alterações nesta Política',
    body: `Esta Política pode ser atualizada periodicamente. Alterações relevantes serão comunicadas na Plataforma. Recomendamos revisá-la periodicamente.`,
  },
  {
    title: '11. Contato — Encarregado de Dados (DPO)',
    body: `Para exercer seus direitos ou esclarecer dúvidas sobre esta Política, entre em contato:\nE-mail: suporte.macropanorama@gmail.com`,
  },
];

export default function PrivacyModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
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

        <h2 className="text-xl font-bold text-white mb-1">Política de Privacidade</h2>
        <p className="text-xs mb-6" style={{ color: 'var(--text-3)' }}>
          Última atualização: junho de 2025 · Em conformidade com a LGPD
        </p>

        <div className="space-y-6">
          {sections.map(s => (
            <div key={s.title}>
              <p
                className="text-[11px] font-bold uppercase tracking-wider mb-2"
                style={{ color: '#F97316' }}
              >
                {s.title}
              </p>
              <p className="text-sm leading-relaxed whitespace-pre-line text-white">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
