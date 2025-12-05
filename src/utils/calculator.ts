import type { FinancialData, FinancialGoal, CalculationResult } from '@/types';
import { sanitizeNumber, monthsBetween } from '@/utils/validation';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const calculateFinancialPlan = (
  goal: FinancialGoal,
  data: FinancialData
): CalculationResult => {
  const goalValue = sanitizeNumber(goal.value);
  const netIncome = sanitizeNumber(data.netIncome);
  const monthlyExpenses = sanitizeNumber(data.monthlyExpenses);
  const currentSavings = sanitizeNumber(data.currentSavings);
  const emergencyFund = sanitizeNumber(data.emergencyFund);

  const monthlySavings = netIncome - monthlyExpenses;
  const targetDate = new Date(goal.targetDate);
  const today = new Date();
  const monthsUntilTarget = monthsBetween(today, targetDate);
  const neededAmount = goalValue - currentSavings;

  const warnings: string[] = [];
  let paymentMethod: 'debit' | 'credit' | 'save-first' = 'save-first';
  let recommendation = '';
  let canBuyNow = false;
  let impactEmergencyFund = false;

  if (currentSavings >= goalValue) {
    canBuyNow = true;
    paymentMethod = 'debit';

    const afterPurchase = currentSavings - goalValue;
    if (afterPurchase < emergencyFund) {
      impactEmergencyFund = true;
      warnings.push('ATENÇÃO: Esta compra afetará sua reserva de emergência!');
      recommendation = `Você tem ${formatCurrency(currentSavings)} em economias e pode comprar agora no débito. Porém, isso deixará você com ${formatCurrency(afterPurchase)}, abaixo da sua reserva de emergência ideal de ${formatCurrency(emergencyFund)}. Considere esperar ou usar crédito parcelado.`;
    } else {
      recommendation = `Ótima notícia! Você já tem o valor necessário (${formatCurrency(currentSavings)}) e pode comprar no débito mantendo sua reserva de emergência intacta.`;
    }
  } else if (monthlySavings > 0) {
    const recommendedMonthlySaving = monthlySavings * 0.7;
    const monthsToSaveRecommended = Math.ceil(neededAmount / recommendedMonthlySaving);
    const monthsToSaveMax = Math.ceil(neededAmount / monthlySavings);

    if (monthsToSaveRecommended <= monthsUntilTarget) {
      paymentMethod = 'save-first';
      const leftoverPerMonth = monthlySavings - recommendedMonthlySaving;

      recommendation = `PLANO RECOMENDADO:\n\n` +
        `• Economize ${formatCurrency(recommendedMonthlySaving)} por mês (70% da sua capacidade)\n` +
        `• Sobrará ${formatCurrency(leftoverPerMonth)} mensais para imprevistos\n` +
        `• Tempo necessário: ${monthsToSaveRecommended} meses\n` +
        `• Você tem ${monthsUntilTarget} meses até sua data alvo\n\n` +
        `Conseguirá comprar no débito a tempo mantendo uma margem de segurança!\n\n` +
        `Se preferir, economizando ${formatCurrency(monthlySavings)} (100% da capacidade), atingirá a meta em ${monthsToSaveMax} meses.`;
    } else if (monthsToSaveMax <= monthsUntilTarget) {
      paymentMethod = 'save-first';

      recommendation = `ECONOMIA APERTADA:\n\n` +
        `• Será necessário economizar ${formatCurrency(monthlySavings)} por mês (100% da sua capacidade)\n` +
        `• Tempo necessário: ${monthsToSaveMax} meses\n` +
        `• Você tem ${monthsUntilTarget} meses até sua data alvo\n\n` +
        `Conseguirá comprar no débito a tempo, mas sem margem de segurança.\n\n` +
        `IDEAL: Economizar ${formatCurrency(recommendedMonthlySaving)} por mês levaria ${monthsToSaveRecommended} meses (com margem para imprevistos).`;
    } else {
      if (data.hasCreditCard) {
        const creditLimit = sanitizeNumber(data.creditLimit);

        if (creditLimit >= goalValue) {
          paymentMethod = 'credit';

          const interestRate = 0.15;
          const maxInstallments = 12;

          let idealInstallments = maxInstallments;
          for (let i = 1; i <= maxInstallments; i++) {
            const monthlyInterest = interestRate / 12;
            const installmentValue = (goalValue * (1 + monthlyInterest * i)) / i;

            if (installmentValue <= monthlySavings * 0.3) {
              idealInstallments = i;
              break;
            }
          }

          const totalWithInterest = goalValue * (1 + (interestRate / 12) * idealInstallments);
          const monthlyInstallment = totalWithInterest / idealInstallments;

          if (monthlyInstallment > monthlySavings * 0.3) {
            warnings.push('ATENÇÃO: As parcelas no cartão de crédito podem comprometer muito seu orçamento!');
          }

          recommendation = `Economizando ${formatCurrency(monthlySavings)} por mês, você precisaria de ${monthsToSaveMax} meses, mas só tem ${monthsUntilTarget} meses.\n\nMELHOR CENÁRIO COM CARTÃO:\n• Parcelar em ${idealInstallments}x de ${formatCurrency(monthlyInstallment)}\n• Total com juros (~${(interestRate * 100).toFixed(0)}% a.a.): ${formatCurrency(totalWithInterest)}\n• Limite disponível: ${formatCurrency(creditLimit)}\n\nOUTRAS OPÇÕES:\n• Adiar a compra para quando tiver o valor completo\n• Aumentar sua economia mensal em ${formatCurrency((neededAmount / monthsUntilTarget) - monthlySavings)}`;
        } else {
          warnings.push(`ATENÇÃO: Seu limite de crédito (${formatCurrency(creditLimit)}) é insuficiente para esta compra!`);
          recommendation = `Economizando ${formatCurrency(monthlySavings)} por mês, você precisaria de ${monthsToSaveMax} meses, mas só tem ${monthsUntilTarget} meses.\n\nSeu limite de crédito atual (${formatCurrency(creditLimit)}) não é suficiente para comprar ${formatCurrency(goalValue)}.\n\nRECOMENDAÇÕES:\n1. Adiar a compra para quando tiver o valor completo\n2. Aumentar sua economia mensal em ${formatCurrency((neededAmount / monthsUntilTarget) - monthlySavings)}\n3. Solicitar aumento de limite no cartão\n4. Combinar economia atual + crédito disponível`;
        }
      } else {
        warnings.push('ATENÇÃO: Você não conseguirá juntar o valor a tempo e não possui cartão de crédito.');
        recommendation = `Economizando ${formatCurrency(monthlySavings)} por mês, você precisaria de ${monthsToSaveMax} meses, mas só tem ${monthsUntilTarget} meses. Recomendações:\n\n1. Adiar a compra para quando tiver o valor completo\n2. Aumentar sua economia mensal em ${formatCurrency((neededAmount / monthsUntilTarget) - monthlySavings)}\n3. Considerar obter um cartão de crédito (use com responsabilidade)`;
      }
    }
  } else {
    warnings.push('ATENÇÃO: Suas despesas mensais são iguais ou maiores que sua renda líquida!');
    recommendation = `Atualmente você não tem capacidade de poupança (sobra ${formatCurrency(monthlySavings)} por mês). Antes de pensar nesta compra, é essencial:\n\n1. Revisar e reduzir suas despesas mensais\n2. Buscar formas de aumentar sua renda\n3. Criar um orçamento sustentável\n\nConsidere adiar esta meta até organizar suas finanças.`;

    if (data.hasCreditCard) {
      warnings.push('ATENÇÃO: Comprar no crédito sem capacidade de pagamento levará ao endividamento!');
    }
  }

  if (emergencyFund < netIncome * 3) {
    warnings.push('Recomendação: Sua reserva de emergência deveria ser de 3-6 meses de despesas.');
  }

  const recommendedMonthlySaving = monthlySavings > 0 ? monthlySavings * 0.7 : monthlySavings;
  const recommendedMonthsToSave = neededAmount > 0 && recommendedMonthlySaving > 0
    ? Math.ceil(neededAmount / recommendedMonthlySaving)
    : 0;

  return {
    canBuyNow,
    monthlySavings: recommendedMonthlySaving,
    monthsToSave: recommendedMonthsToSave,
    paymentMethod,
    recommendation,
    impactEmergencyFund,
    warnings
  };
};
