import { useState } from 'react';
import { IoInformationCircleOutline } from 'react-icons/io5';
import type { FinancialGoal, FinancialData } from '@/types';
import { sanitizeText, validateDate } from '@/utils/validation';
import './FinancialForm.css';

interface FinancialFormProps {
  onCalculate: (goal: FinancialGoal, data: FinancialData) => void;
}

export const FinancialForm = ({ onCalculate }: FinancialFormProps) => {
  const [goal, setGoal] = useState<FinancialGoal>({
    description: '',
    value: 0,
    targetDate: ''
  });

  const [data, setData] = useState<FinancialData>({
    grossIncome: 0,
    netIncome: 0,
    monthlyExpenses: 0,
    emergencyFund: 0,
    hasDebitCard: false,
    hasCreditCard: false,
    creditLimit: 0,
    currentSavings: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCurrencyDisplay = (valueInCents: number): string => {
    const valueInReais = valueInCents / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valueInReais);
  };

  const handleCurrencyChange = (field: keyof FinancialGoal | keyof FinancialData, value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    const valueInCents = parseInt(digitsOnly || '0', 10);
    const valueInReais = valueInCents / 100;

    if (field === 'value') {
      setGoal({ ...goal, value: valueInReais });
    } else {
      setData({ ...data, [field]: valueInReais });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!goal.description.trim()) {
      newErrors.description = 'Descreva sua meta';
    }

    if (goal.value <= 0) {
      newErrors.value = 'Valor deve ser maior que zero';
    }

    if (!goal.targetDate) {
      newErrors.targetDate = 'Selecione uma data';
    } else if (!validateDate(goal.targetDate)) {
      newErrors.targetDate = 'Data inválida';
    } else {
      const target = new Date(goal.targetDate);
      const today = new Date();
      if (target <= today) {
        newErrors.targetDate = 'Data deve ser futura';
      }
    }

    if (data.netIncome <= 0) {
      newErrors.netIncome = 'Informe sua renda líquida';
    }

    if (data.grossIncome < data.netIncome) {
      newErrors.grossIncome = 'Renda bruta deve ser maior que líquida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const sanitizedGoal = {
        ...goal,
        description: sanitizeText(goal.description)
      };

      onCalculate(sanitizedGoal, data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="financial-form">
      <div className="form-content">
        <div className="form-section">
          <h2>Sua Meta</h2>

          <div className="form-group">
            <label htmlFor="description">
              O que você quer comprar?
              <span className="tooltip-icon">
                <IoInformationCircleOutline />
                <span className="tooltip-text">Descreva o que você deseja adquirir (produto, serviço, viagem, etc.)</span>
              </span>
            </label>
          <input
            id="description"
            type="text"
            value={goal.description}
            onChange={(e) => setGoal({ ...goal, description: e.target.value })}
            placeholder="Ex: Viagem para Paris, Notebook, Carro..."
            maxLength={200}
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="value">
            Qual o valor? (R$)
            <span className="tooltip-icon">
              <IoInformationCircleOutline />
              <span className="tooltip-text">Digite apenas números. Ex: 5000 = R$ 50,00 ou 500000 = R$ 5.000,00</span>
            </span>
          </label>
          <input
            id="value"
            type="text"
            value={goal.value > 0 ? formatCurrencyDisplay(goal.value * 100) : ''}
            onChange={(e) => handleCurrencyChange('value', e.target.value)}
            placeholder="R$ 0,00"
            className={errors.value ? 'error' : ''}
          />
          {errors.value && <span className="error-message">{errors.value}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="targetDate">
            Quando você quer comprar?
            <span className="tooltip-icon">
              <IoInformationCircleOutline />
              <span className="tooltip-text">Selecione a data desejada para realizar esta compra</span>
            </span>
          </label>
          <input
            id="targetDate"
            type="date"
            value={goal.targetDate}
            onChange={(e) => setGoal({ ...goal, targetDate: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            max="2099-12-31"
            pattern="\d{4}-\d{2}-\d{2}"
            className={errors.targetDate ? 'error' : ''}
          />
          {errors.targetDate && <span className="error-message">{errors.targetDate}</span>}
        </div>
        </div>

        <div className="form-section">
          <h2>Suas Finanças</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="grossIncome">
                Renda bruta mensal (R$)
                <span className="tooltip-icon">
                  <IoInformationCircleOutline />
                  <span className="tooltip-text">Seu salário total antes dos descontos (INSS, IR, etc.)</span>
                </span>
              </label>
            <input
              id="grossIncome"
              type="text"
              value={data.grossIncome > 0 ? formatCurrencyDisplay(data.grossIncome * 100) : ''}
              onChange={(e) => handleCurrencyChange('grossIncome', e.target.value)}
              placeholder="R$ 0,00"
              className={errors.grossIncome ? 'error' : ''}
            />
            {errors.grossIncome && <span className="error-message">{errors.grossIncome}</span>}
          </div>

            <div className="form-group">
              <label htmlFor="netIncome">
                Renda líquida mensal (R$)
                <span className="tooltip-icon">
                  <IoInformationCircleOutline />
                  <span className="tooltip-text">Valor que você recebe na conta após todos os descontos</span>
                </span>
              </label>
            <input
              id="netIncome"
              type="text"
              value={data.netIncome > 0 ? formatCurrencyDisplay(data.netIncome * 100) : ''}
              onChange={(e) => handleCurrencyChange('netIncome', e.target.value)}
              placeholder="R$ 0,00"
              className={errors.netIncome ? 'error' : ''}
            />
            {errors.netIncome && <span className="error-message">{errors.netIncome}</span>}
          </div>
        </div>

          <div className="form-group">
            <label htmlFor="monthlyExpenses">
              Despesas mensais fixas (R$)
              <span className="tooltip-icon">
                <IoInformationCircleOutline />
                <span className="tooltip-text">Soma de aluguel, condomínio, luz, água, internet, transporte, etc.</span>
              </span>
            </label>
          <input
            id="monthlyExpenses"
            type="text"
            value={data.monthlyExpenses > 0 ? formatCurrencyDisplay(data.monthlyExpenses * 100) : ''}
            onChange={(e) => handleCurrencyChange('monthlyExpenses', e.target.value)}
            placeholder="R$ 0,00"
          />
        </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="currentSavings">
                Economia atual (R$)
                <span className="tooltip-icon">
                  <IoInformationCircleOutline />
                  <span className="tooltip-text">Quanto você tem guardado atualmente (poupança, investimentos líquidos)</span>
                </span>
              </label>
            <input
              id="currentSavings"
              type="text"
              value={data.currentSavings > 0 ? formatCurrencyDisplay(data.currentSavings * 100) : ''}
              onChange={(e) => handleCurrencyChange('currentSavings', e.target.value)}
              placeholder="R$ 0,00"
            />
          </div>

            <div className="form-group">
              <label htmlFor="emergencyFund">
                Reserva de emergência ideal (R$)
                <span className="tooltip-icon">
                  <IoInformationCircleOutline />
                  <span className="tooltip-text">Valor que você quer manter intocável para emergências (recomendado: 3 a 6 vezes suas despesas mensais)</span>
                </span>
              </label>
            <input
              id="emergencyFund"
              type="text"
              value={data.emergencyFund > 0 ? formatCurrencyDisplay(data.emergencyFund * 100) : ''}
              onChange={(e) => handleCurrencyChange('emergencyFund', e.target.value)}
              placeholder="R$ 0,00"
            />
          </div>
        </div>

        <div className="form-section">
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={data.hasDebitCard}
                onChange={(e) => setData({ ...data, hasDebitCard: e.target.checked })}
              />
              Tenho cartão de débito
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={data.hasCreditCard}
                onChange={(e) => setData({ ...data, hasCreditCard: e.target.checked })}
              />
              Tenho cartão de crédito
            </label>
          </div>

          {data.hasCreditCard && (
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label htmlFor="creditLimit">
                Limite do cartão de crédito (R$)
                <span className="tooltip-icon">
                  <IoInformationCircleOutline />
                  <span className="tooltip-text">Valor total de limite disponível no seu cartão de crédito</span>
                </span>
              </label>
              <input
                id="creditLimit"
                type="text"
                value={data.creditLimit > 0 ? formatCurrencyDisplay(data.creditLimit * 100) : ''}
                onChange={(e) => handleCurrencyChange('creditLimit', e.target.value)}
                placeholder="R$ 0,00"
              />
            </div>
          )}
          </div>
        </div>
      </div>

      <div className="form-footer">
        <button type="submit" className="submit-button">
          Calcular Melhor Plano
        </button>
      </div>
    </form>
  );
};
