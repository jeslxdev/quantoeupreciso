import ExcelJS from 'exceljs';
import type { FinancialGoal, FinancialData, CalculationResult } from '@/types';

/**
 * Exporta o plano financeiro para Excel com formatação e fórmulas
 */
export const exportToExcel = async (
  goal: FinancialGoal,
  data: FinancialData,
  result: CalculationResult
) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Quanto Eu Preciso';
  workbook.created = new Date();

  // ===== ABA 1: RESUMO DO PLANO =====
  const resumo = workbook.addWorksheet('Resumo do Plano');

  // Título
  resumo.mergeCells('A1:B1');
  resumo.getCell('A1').value = 'PLANO FINANCEIRO - QUANTO EU PRECISO';
  resumo.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FF2c3e50' } };
  resumo.getCell('A1').alignment = { horizontal: 'center' };

  resumo.getCell('A2').value = 'Gerado em:';
  resumo.getCell('B2').value = new Date().toLocaleString('pt-BR');

  // Sua Meta
  resumo.getCell('A4').value = 'SUA META';
  resumo.getCell('A4').font = { bold: true, size: 12 };
  resumo.getCell('A4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFe5e7eb' } };

  resumo.getCell('A5').value = 'Descrição:';
  resumo.getCell('B5').value = goal.description;
  resumo.getCell('A6').value = 'Valor:';
  resumo.getCell('B6').value = goal.value;
  resumo.getCell('B6').numFmt = 'R$ #,##0.00';
  resumo.getCell('A7').value = 'Data Alvo:';
  resumo.getCell('B7').value = new Date(goal.targetDate).toLocaleDateString('pt-BR');

  // Suas Finanças
  resumo.getCell('A9').value = 'SUAS FINANÇAS';
  resumo.getCell('A9').font = { bold: true, size: 12 };
  resumo.getCell('A9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFe5e7eb' } };

  resumo.getCell('A10').value = 'Renda Bruta Mensal:';
  resumo.getCell('B10').value = data.grossIncome;
  resumo.getCell('B10').numFmt = 'R$ #,##0.00';

  resumo.getCell('A11').value = 'Renda Líquida Mensal:';
  resumo.getCell('B11').value = data.netIncome;
  resumo.getCell('B11').numFmt = 'R$ #,##0.00';

  resumo.getCell('A12').value = 'Despesas Mensais:';
  resumo.getCell('B12').value = data.monthlyExpenses;
  resumo.getCell('B12').numFmt = 'R$ #,##0.00';

  resumo.getCell('A13').value = 'Economia Atual:';
  resumo.getCell('B13').value = data.currentSavings;
  resumo.getCell('B13').numFmt = 'R$ #,##0.00';

  resumo.getCell('A14').value = 'Reserva de Emergência Ideal:';
  resumo.getCell('B14').value = data.emergencyFund;
  resumo.getCell('B14').numFmt = 'R$ #,##0.00';

  let row = 15;
  resumo.getCell(`A${row}`).value = 'Tem Cartão de Débito:';
  resumo.getCell(`B${row}`).value = data.hasDebitCard ? 'Sim' : 'Não';

  row++;
  resumo.getCell(`A${row}`).value = 'Tem Cartão de Crédito:';
  resumo.getCell(`B${row}`).value = data.hasCreditCard ? 'Sim' : 'Não';

  if (data.hasCreditCard) {
    row++;
    resumo.getCell(`A${row}`).value = 'Limite do Cartão:';
    resumo.getCell(`B${row}`).value = data.creditLimit;
    resumo.getCell(`B${row}`).numFmt = 'R$ #,##0.00';
  }

  // Análise
  row += 2;
  resumo.getCell(`A${row}`).value = 'ANÁLISE E RECOMENDAÇÃO';
  resumo.getCell(`A${row}`).font = { bold: true, size: 12 };
  resumo.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFe5e7eb' } };

  row++;
  resumo.getCell(`A${row}`).value = 'Pode comprar agora?';
  resumo.getCell(`B${row}`).value = result.canBuyNow ? 'Sim' : 'Não';
  resumo.getCell(`B${row}`).font = { bold: true, color: { argb: result.canBuyNow ? 'FF10b981' : 'FFef4444' } };

  row++;
  resumo.getCell(`A${row}`).value = 'Método recomendado:';
  resumo.getCell(`B${row}`).value = result.paymentMethod === 'debit' ? 'Débito' :
                                      result.paymentMethod === 'credit' ? 'Crédito' : 'Economizar Primeiro';

  row++;
  resumo.getCell(`A${row}`).value = 'Economia mensal recomendada:';
  resumo.getCell(`B${row}`).value = result.monthlySavings;
  resumo.getCell(`B${row}`).numFmt = 'R$ #,##0.00';

  row++;
  resumo.getCell(`A${row}`).value = 'Tempo necessário (meses):';
  resumo.getCell(`B${row}`).value = result.monthsToSave;

  row++;
  resumo.getCell(`A${row}`).value = 'Impacta reserva de emergência?';
  resumo.getCell(`B${row}`).value = result.impactEmergencyFund ? 'Sim' : 'Não';

  // Recomendação
  row += 2;
  resumo.mergeCells(`A${row}:B${row}`);
  resumo.getCell(`A${row}`).value = 'RECOMENDAÇÃO DETALHADA';
  resumo.getCell(`A${row}`).font = { bold: true, size: 12 };
  resumo.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFe5e7eb' } };

  row++;
  resumo.mergeCells(`A${row}:B${row + 5}`);
  resumo.getCell(`A${row}`).value = result.recommendation;
  resumo.getCell(`A${row}`).alignment = { wrapText: true, vertical: 'top' };

  // Avisos
  if (result.warnings.length > 0) {
    row += 7;
    resumo.mergeCells(`A${row}:B${row}`);
    resumo.getCell(`A${row}`).value = 'AVISOS';
    resumo.getCell(`A${row}`).font = { bold: true, size: 12 };
    resumo.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFfef3c7' } };

    result.warnings.forEach(warning => {
      row++;
      resumo.mergeCells(`A${row}:B${row}`);
      resumo.getCell(`A${row}`).value = warning;
      resumo.getCell(`A${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFfef3c7' } };
    });
  }

  resumo.getColumn(1).width = 30;
  resumo.getColumn(2).width = 50;

  // ===== ABA 2: SIMULAÇÃO DE ECONOMIA =====
  const simulacao = workbook.addWorksheet('Simulação Mensal');

  simulacao.mergeCells('A1:E1');
  simulacao.getCell('A1').value = 'SIMULAÇÃO DE ECONOMIA MENSAL';
  simulacao.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FF2c3e50' } };
  simulacao.getCell('A1').alignment = { horizontal: 'center' };

  simulacao.getCell('A3').value = 'Valor da Meta:';
  simulacao.getCell('B3').value = goal.value;
  simulacao.getCell('B3').numFmt = 'R$ #,##0.00';

  simulacao.getCell('A4').value = 'Economia Atual:';
  simulacao.getCell('B4').value = data.currentSavings;
  simulacao.getCell('B4').numFmt = 'R$ #,##0.00';

  simulacao.getCell('A5').value = 'Valor Necessário:';
  simulacao.getCell('B5').value = { formula: 'B3-B4' };
  simulacao.getCell('B5').numFmt = 'R$ #,##0.00';

  simulacao.getCell('A6').value = 'Economia Mensal Recomendada:';
  simulacao.getCell('B6').value = result.monthlySavings;
  simulacao.getCell('B6').numFmt = 'R$ #,##0.00';

  // Cabeçalhos
  const headerRow = simulacao.getRow(8);
  headerRow.values = ['Mês', 'Economia Mensal', 'Total Acumulado', 'Falta para Meta', '% Atingido'];
  headerRow.font = { bold: true };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2c3e50' } };
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { horizontal: 'center' };
  });

  const mesesSimulacao = Math.max(result.monthsToSave, 12);
  for (let i = 1; i <= mesesSimulacao; i++) {
    const dataRow = simulacao.getRow(8 + i);
    dataRow.getCell(1).value = i;
    dataRow.getCell(2).value = { formula: '$B$6' };
    dataRow.getCell(2).numFmt = 'R$ #,##0.00';
    dataRow.getCell(3).value = { formula: `B${8 + i}*A${8 + i}` };
    dataRow.getCell(3).numFmt = 'R$ #,##0.00';
    dataRow.getCell(4).value = { formula: `$B$5-C${8 + i}` };
    dataRow.getCell(4).numFmt = 'R$ #,##0.00';
    dataRow.getCell(5).value = { formula: `C${8 + i}/$B$5` };
    dataRow.getCell(5).numFmt = '0.00%';
  }

  simulacao.getColumn(1).width = 8;
  simulacao.getColumn(2).width = 20;
  simulacao.getColumn(3).width = 20;
  simulacao.getColumn(4).width = 20;
  simulacao.getColumn(5).width = 15;

  // ===== ABA 3: COMPARAÇÃO DE CENÁRIOS =====
  const comparacao = workbook.addWorksheet('Comparação Cenários');

  comparacao.mergeCells('A1:D1');
  comparacao.getCell('A1').value = 'COMPARAÇÃO DE CENÁRIOS DE ECONOMIA';
  comparacao.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FF2c3e50' } };
  comparacao.getCell('A1').alignment = { horizontal: 'center' };

  const capacidadeTotal = data.netIncome - data.monthlyExpenses;
  const valorNecessario = goal.value - data.currentSavings;

  comparacao.getCell('A3').value = 'Capacidade Total de Economia:';
  comparacao.getCell('B3').value = capacidadeTotal;
  comparacao.getCell('B3').numFmt = 'R$ #,##0.00';

  comparacao.getCell('A4').value = 'Valor Necessário:';
  comparacao.getCell('B4').value = valorNecessario;
  comparacao.getCell('B4').numFmt = 'R$ #,##0.00';

  const cenarioHeader = comparacao.getRow(6);
  cenarioHeader.values = ['Cenário', 'Economia Mensal', 'Meses Necessários', 'Sobra Mensal'];
  cenarioHeader.font = { bold: true };
  cenarioHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2c3e50' } };
  cenarioHeader.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { horizontal: 'center' };
  });

  const cenarios = [
    { nome: 'Conservador (50%)', percentual: 0.5 },
    { nome: 'Recomendado (70%)', percentual: 0.7 },
    { nome: 'Agressivo (100%)', percentual: 1.0 }
  ];

  cenarios.forEach((cenario, i) => {
    const cenarioRow = comparacao.getRow(7 + i);
    cenarioRow.getCell(1).value = cenario.nome;
    cenarioRow.getCell(2).value = { formula: `$B$3*${cenario.percentual}` };
    cenarioRow.getCell(2).numFmt = 'R$ #,##0.00';
    cenarioRow.getCell(3).value = { formula: `CEILING($B$4/B${7 + i},1)` };
    cenarioRow.getCell(4).value = { formula: `$B$3-B${7 + i}` };
    cenarioRow.getCell(4).numFmt = 'R$ #,##0.00';

    if (i === 1) {
      cenarioRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFdbeafe' } };
    }
  });

  comparacao.getColumn(1).width = 25;
  comparacao.getColumn(2).width = 20;
  comparacao.getColumn(3).width = 20;
  comparacao.getColumn(4).width = 20;

  // ===== ABA 4: CALCULADORA =====
  const calculadora = workbook.addWorksheet('Calculadora');

  calculadora.mergeCells('A1:C1');
  calculadora.getCell('A1').value = 'CALCULADORA FINANCEIRA INTERATIVA';
  calculadora.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FF2c3e50' } };
  calculadora.getCell('A1').alignment = { horizontal: 'center' };

  calculadora.getCell('A3').value = 'ENTRADA DE DADOS';
  calculadora.getCell('A3').font = { bold: true, size: 12 };
  calculadora.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFe5e7eb' } };

  calculadora.getCell('A4').value = 'Meta (R$):';
  calculadora.getCell('B4').value = goal.value;
  calculadora.getCell('B4').numFmt = 'R$ #,##0.00';
  calculadora.getCell('B4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFfef3c7' } };
  calculadora.getCell('C4').value = '← Edite este valor';

  calculadora.getCell('A5').value = 'Economia Mensal (R$):';
  calculadora.getCell('B5').value = result.monthlySavings;
  calculadora.getCell('B5').numFmt = 'R$ #,##0.00';
  calculadora.getCell('B5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFfef3c7' } };
  calculadora.getCell('C5').value = '← Edite este valor';

  calculadora.getCell('A6').value = 'Economia Atual (R$):';
  calculadora.getCell('B6').value = data.currentSavings;
  calculadora.getCell('B6').numFmt = 'R$ #,##0.00';
  calculadora.getCell('B6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFfef3c7' } };
  calculadora.getCell('C6').value = '← Edite este valor';

  calculadora.getCell('A8').value = 'RESULTADOS';
  calculadora.getCell('A8').font = { bold: true, size: 12 };
  calculadora.getCell('A8').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFe5e7eb' } };

  calculadora.getCell('A9').value = 'Valor Necessário:';
  calculadora.getCell('B9').value = { formula: 'B4-B6' };
  calculadora.getCell('B9').numFmt = 'R$ #,##0.00';

  calculadora.getCell('A10').value = 'Meses Necessários:';
  calculadora.getCell('B10').value = { formula: 'CEILING(B9/B5,1)' };

  calculadora.getCell('A11').value = 'Total a Economizar:';
  calculadora.getCell('B11').value = { formula: 'B5*B10' };
  calculadora.getCell('B11').numFmt = 'R$ #,##0.00';

  calculadora.getCell('A12').value = 'Total com Economia Atual:';
  calculadora.getCell('B12').value = { formula: 'B6+B11' };
  calculadora.getCell('B12').numFmt = 'R$ #,##0.00';

  calculadora.getCell('A13').value = 'Diferença da Meta:';
  calculadora.getCell('B13').value = { formula: 'B12-B4' };
  calculadora.getCell('B13').numFmt = 'R$ #,##0.00';

  calculadora.getCell('A14').value = 'Atingirá a meta?';
  calculadora.getCell('B14').value = { formula: 'IF(B12>=B4,"SIM ✓","NÃO ✗")' };
  calculadora.getCell('B14').font = { bold: true };

  calculadora.getCell('A16').value = 'SIMULAÇÃO COM JUROS (Poupança/Investimento)';
  calculadora.getCell('A16').font = { bold: true, size: 12 };
  calculadora.getCell('A16').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFe5e7eb' } };

  calculadora.getCell('A17').value = 'Taxa de Juros Mensal (%):';
  calculadora.getCell('B17').value = 0.5;
  calculadora.getCell('B17').numFmt = '0.00%';
  calculadora.getCell('B17').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFfef3c7' } };
  calculadora.getCell('C17').value = '← Edite este valor';

  calculadora.getCell('A18').value = 'Montante Final:';
  calculadora.getCell('B18').value = { formula: 'FV(B17,B10,B5,B6,0)' };
  calculadora.getCell('B18').numFmt = 'R$ #,##0.00';

  calculadora.getCell('A19').value = 'Juros Ganhos:';
  calculadora.getCell('B19').value = { formula: 'ABS(B18)-B11-B6' };
  calculadora.getCell('B19').numFmt = 'R$ #,##0.00';

  calculadora.getColumn(1).width = 30;
  calculadora.getColumn(2).width = 20;
  calculadora.getColumn(3).width = 25;

  // Exportar arquivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `plano-financeiro-${goal.description.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 30)}-${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
};
