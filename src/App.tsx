import { useState } from 'react';
import { FinancialForm } from '@/components/FinancialForm';
import { ResultDisplay } from '@/components/ResultDisplay';
import type { FinancialGoal, FinancialData, CalculationResult } from '@/types';
import { calculateFinancialPlan } from '@/utils/calculator';
import './App.css';

function App() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [currentGoal, setCurrentGoal] = useState<FinancialGoal | null>(null);
  const [currentData, setCurrentData] = useState<FinancialData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = (goal: FinancialGoal, data: FinancialData) => {
    setIsLoading(true);

    setTimeout(() => {
      const calculationResult = calculateFinancialPlan(goal, data);
      setResult(calculationResult);
      setCurrentGoal(goal);
      setCurrentData(data);
      setIsLoading(false);
    }, 800);
  };

  const handleReset = () => {
    setResult(null);
    setCurrentGoal(null);
    setCurrentData(null);
    setIsLoading(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Quanto Eu Preciso</h1>
        <p className="app-subtitle">
          Planejamento financeiro inteligente para suas metas
        </p>
      </header>

      <main className="app-main">
        <div className="form-container">
          <FinancialForm onCalculate={handleCalculate} />
        </div>

        <div className="result-container">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Calculando seu plano financeiro...</p>
            </div>
          ) : result && currentGoal && currentData ? (
            <div className="result-wrapper">
              <ResultDisplay
                result={result}
                goal={currentGoal}
                data={currentData}
              />
              <div className="reset-section">
                <button onClick={handleReset} className="reset-button">
                  Novo Cálculo
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <h3>Preencha o formulário</h3>
              <p>Complete as informações ao lado para receber seu plano financeiro personalizado.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p className="privacy-note">
          Seus dados são processados localmente e não são enviados para servidores.
        </p>
      </footer>
    </div>
  );
}

export default App;
