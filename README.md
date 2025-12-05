# Quanto Eu Preciso?

Site estático para planejamento financeiro pessoal, desenvolvido em React com TypeScript.

**URL**: https://quantoeupreciso.com.br/

## Sobre o Projeto

Este site ajuda usuários a:
- Definir metas financeiras (viagens, produtos, compras específicas)
- Analisar sua situação financeira atual
- Receber recomendações personalizadas sobre:
  - Melhor forma de pagamento (débito, crédito ou economizar primeiro)
  - Tempo necessário para juntar o valor
  - Impacto na reserva de emergência
  - Viabilidade de compra parcelada

## Segurança

O projeto implementa diversas práticas de segurança:

- Processamento Local: Todos os dados são processados no navegador, nenhuma informação é enviada para servidores
- Sanitização de Inputs: Proteção contra XSS e injeção de código
- Validação de Dados: Validação rigorosa de todos os inputs do usuário
- Headers de Segurança: CSP, X-Frame-Options, HSTS, etc.
- Sem Vulnerabilidades: Dependências atualizadas sem CVEs conhecidas
- HTTPS: Obrigatório em produção

Consulte [SECURITY.md](./SECURITY.md) para detalhes sobre configuração de segurança.

## Tecnologias

- React 19.2.0 - Framework UI
- TypeScript 5.9.3 - Tipagem estática
- Vite 7.2.4 - Build tool e dev server
- React Compiler - Otimizações automáticas
- ExcelJS - Exportação de relatórios

## Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Estrutura do Projeto

```
## Estrutura do Projeto

```
src/
├── components/
│   ├── FinancialForm.tsx
│   ├── FinancialForm.css
│   ├── ResultDisplay.tsx
│   └── ResultDisplay.css
├── types/
│   └── index.ts
├── utils/
│   ├── calculator.ts
│   ├── validation.ts
│   └── excelExport.ts
├── App.tsx
├── App.css
├── main.tsx
└── index.css
```
## Lógica de Cálculo

O sistema analisa:

1. Dados da Meta:
   - Descrição do objetivo
   - Valor necessário
   - Data desejada para compra

2. Dados Financeiros:
   - Renda bruta e líquida
   - Despesas mensais fixas
   - Economia atual
   - Reserva de emergência
   - Formas de pagamento disponíveis

3. Cenários Avaliados:
   - Compra imediata no débito (se tem o valor)
   - Economia mensal necessária
   - Viabilidade de parcelamento
## Features

- Interface responsiva e intuitiva
- Mobile-first design
- Validação em tempo real
- Dicas financeiras educativas
- 100% privado (processamento local)
- Exportação para Excel com análise detalhada

## Deploy

### GitHub Pages
### Netlify
```bash
npm run build
# Fazer deploy da pasta dist/
```

### Vercel
```bash
npm run build
# Deploy automático via Git
```

### Cloudflare Pages
```bash
npm run build
# Build command: npm run build
# Build output: dist
```

## Disclaimer

## 🔐 Variáveis de Ambiente

Este projeto não requer variáveis de ambiente, pois todo processamento é feito no cliente.

## Disclaimer

Esta ferramenta fornece estimativas educacionais para planejamento financeiro pessoal. As recomendações são baseadas em cálculos simples e não substituem a orientação de um profissional financeiro certificado. Sempre consulte um especialista antes de tomar decisões financeiras importantes.
