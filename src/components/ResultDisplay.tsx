import type { CalculationResult, FinancialGoal, FinancialData } from '@/types';
import { exportToExcel } from '@/utils/excelExport';
import './ResultDisplay.css';

interface ResultDisplayProps {
  result: CalculationResult;
  goal: FinancialGoal;
  data: FinancialData;
}

export const ResultDisplay = ({ result, goal, data }: ResultDisplayProps) => {
  const getPaymentMethodBadge = () => {
    switch (result.paymentMethod) {
      case 'debit':
        return <span className="badge badge-success">Débito</span>;
      case 'credit':
        return <span className="badge badge-warning">Crédito</span>;
      case 'save-first':
        return <span className="badge badge-info">Economizar Primeiro</span>;
    }
  };

  const handleExport = () => {
    exportToExcel(goal, data, result);
  };

  return (
    <div className="result-display">
      <div className="result-header">
        <h2>Seu Plano Financeiro</h2>
        <p className="goal-summary">
          Meta: <strong>{goal.description}</strong> - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.value)}
        </p>
        <button onClick={handleExport} className="export-button" title="Exportar para Excel">
          Exportar Excel
        </button>
      </div>

      {result.warnings.length > 0 && (
        <div className="warnings-section">
          {result.warnings.map((warning, index) => (
            <div key={index} className="warning-item">
              {warning}
            </div>
          ))}
        </div>
      )}

      <div className="result-card">
        <div className="result-row">
          <span className="result-label">Pode comprar agora?</span>
          <span className={`result-value ${result.canBuyNow ? 'positive' : 'negative'}`}>
            {result.canBuyNow ? 'Sim' : 'Não'}
          </span>
        </div>

        <div className="result-row">
          <span className="result-label">Método de pagamento recomendado:</span>
          <span className="result-value">
            {getPaymentMethodBadge()}
          </span>
        </div>

        <div className="result-row">
          <span className="result-label">Capacidade de economia mensal:</span>
          <span className={`result-value ${result.monthlySavings > 0 ? 'positive' : 'negative'}`}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.monthlySavings)}
          </span>
        </div>

        {result.monthsToSave > 0 && (
          <div className="result-row">
            <span className="result-label">Tempo para juntar o valor:</span>
            <span className="result-value">
              {result.monthsToSave} {result.monthsToSave === 1 ? 'mês' : 'meses'}
            </span>
          </div>
        )}

        {result.impactEmergencyFund && (
          <div className="impact-warning">
            <strong>Atenção:</strong> Esta compra impactará sua reserva de emergência!
          </div>
        )}
      </div>

      <div className="recommendation-section">
        <h3>Recomendação Personalizada</h3>
        <div className="recommendation-text">
          {result.recommendation.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="tips-section">
        <h3>Dicas Financeiras</h3>
        <ul>
          <li>Mantenha sempre uma reserva de emergência equivalente a 3-6 meses de despesas</li>
          <li>Evite usar cartão de crédito se não puder pagar à vista</li>
          <li>Priorize quitar dívidas antes de fazer novas compras</li>
          <li>Considere automatizar suas economias mensais</li>
          <li>Revise periodicamente seus gastos e identifique onde pode economizar</li>
        </ul>
      </div>
    </div>
  );
};
