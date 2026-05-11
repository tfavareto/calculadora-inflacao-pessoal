# 📊 Calculadora de Inflação Pessoal

Calcule sua inflação pessoal e compare com o IPCA oficial do IBGE — em tempo real, sem cadastro, sem servidor.

![Stack](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Stack](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Stack](https://img.shields.io/badge/Vite-6-646CFF?style=flat&logo=vite)
![Stack](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?style=flat&logo=tailwindcss)

---

## O que é

A inflação oficial (IPCA) mede a variação de preços de uma cesta de consumo **média** da população brasileira. Mas o seu consumo é diferente: se você gasta mais com aluguel e menos com vestuário, sua inflação real é outra.

Esta calculadora usa o **Índice de Laspeyres** — a mesma metodologia do IBGE — para calcular sua inflação pessoal com base nos seus próprios gastos, agrupados pelos 9 grupos oficiais do IPCA.

---

## Funcionalidades

- **Dashboard** com inflação acumulada e variação mensal (gráficos interativos com toggle por série)
- **Comparativo direto** entre sua inflação e o IPCA oficial mês a mês
- **9 grupos IPCA** oficiais: Alimentação, Moradia, Transportes, Saúde, Educação e mais
- **Fetch automático** do IPCA via API do IBGE SIDRA, com fallback local (2022–2025)
- **Dados demo** para explorar o app sem precisar cadastrar nada
- **Persistência local** via `localStorage` — seus dados ficam no seu navegador
- **Seletores customizados** com emoji e cor de cada categoria

---

## Metodologia

O índice pessoal é calculado pela fórmula de Laspeyres:

```
IPP(t) = Σ [ w(c) × E(c,t) / E(c,M₀) ] × 100
```

Onde:
- `w(c)` = peso da categoria `c` no seu consumo do mês-base `M₀`
- `E(c,t)` = gasto na categoria `c` no mês `t`
- `E(c,M₀)` = gasto na categoria `c` no mês-base

Os pesos são fixados no primeiro mês de registro e permanecem constantes, exatamente como o IBGE faz com a POF (Pesquisa de Orçamentos Familiares).

---

## Stack

| Tecnologia | Uso |
|---|---|
| React 18 + TypeScript | UI e lógica de estado |
| Vite 6 | Bundler e dev server |
| Tailwind CSS 3 | Estilização |
| Recharts | Gráficos de área e barras |
| Lucide React | Ícones |
| IBGE SIDRA API | Dados oficiais do IPCA |

---

## Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/tfavareto/calculadora-inflacao-pessoal.git
cd calculadora-inflacao-pessoal

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` no navegador.

```bash
# Build de produção
npm run build
```

---

## Estrutura do projeto

```
src/
├── App.tsx                          # Estado global, fetch IPCA, roteamento
├── calculator.ts                    # Lógica Laspeyres
├── ibgeApi.ts                       # Fetch IPCA via IBGE SIDRA + fallback
├── constants.ts                     # 9 grupos IPCA com pesos, cores e emojis
├── demoData.ts                      # Dados de exemplo (Jan–Abr 2024)
├── components/
│   ├── CustomSelect.tsx             # Dropdown customizado reutilizável
│   ├── Layout.tsx / Sidebar.tsx     # Layout e navegação
│   ├── SummaryCards.tsx             # Cards de KPI
│   ├── TransactionForm.tsx          # Modal de nova movimentação
│   ├── TransactionList.tsx          # Lista com filtros
│   └── charts/
│       ├── InflationAreaChart.tsx   # Gráfico de área acumulada
│       └── MonthlyBarChart.tsx      # Gráfico de barras mensal
└── pages/
    ├── Dashboard.tsx
    ├── Transactions.tsx
    └── Methodology.tsx
```

---

## Grupos IPCA disponíveis

| Grupo | Peso oficial |
|---|---|
| 🍽️ Alimentação e Bebidas | 23,20% |
| 🏠 Moradia | 14,25% |
| 🛋️ Artigos de Residência | 4,27% |
| 👗 Vestuário | 5,45% |
| 🚗 Transportes | 19,04% |
| 💊 Saúde e Cuidados Pessoais | 11,38% |
| 💼 Despesas Pessoais | 9,30% |
| 📚 Educação | 5,47% |
| 📱 Comunicação | 4,32% |

> Pesos extraídos da POF 2017–2018, base do IPCA atual do IBGE.

---

## Autor

**Thiago Favareto**

- GitHub: [@tfavareto](https://github.com/tfavareto)
- E-mail: [thiagofavareto9@gmail.com](mailto:thiagofavareto9@gmail.com)

---

## Licença

MIT
