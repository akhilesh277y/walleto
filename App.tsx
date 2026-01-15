
import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, TransactionType, BudgetState } from './types';
import SummaryCard from './components/SummaryCard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Charts from './components/Charts';
import ImageLab from './components/ImageLab';
import { Icons } from './constants.tsx';

const App: React.FC = () => {
  const [state, setState] = useState<BudgetState>(() => {
    const saved = localStorage.getItem('finvue_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
    return {
      transactions: [],
      totalBalance: 0,
      totalIncome: 0,
      totalExpense: 0,
    };
  });

  const [activeTab, setActiveTab] = useState<'finance' | 'ai'>('finance');

  useEffect(() => {
    localStorage.setItem('finvue_data', JSON.stringify(state));
  }, [state]);

  const summary = useMemo(() => {
    const totalIncome = state.transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = state.transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    };
  }, [state.transactions]);

  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: crypto.randomUUID(),
    };
    setState(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction]
    }));
  };

  const deleteTransaction = (id: string) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black italic">F</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">FinVue<span className="text-indigo-600">.</span></h1>
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('finance')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === 'finance' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('ai')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center space-x-2 ${
                  activeTab === 'ai' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
                }`}
              >
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                <span>Image Lab</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {activeTab === 'finance' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header / Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SummaryCard 
                title="Total Balance" 
                amount={summary.balance} 
                icon={<Icons.Wallet />}
                colorClass="text-slate-900"
                iconBgClass="bg-indigo-50 text-indigo-600"
              />
              <SummaryCard 
                title="Total Income" 
                amount={summary.totalIncome} 
                icon={<Icons.TrendUp />}
                colorClass="text-emerald-600"
                iconBgClass="bg-emerald-50 text-emerald-600"
              />
              <SummaryCard 
                title="Total Expenses" 
                amount={summary.totalExpense} 
                icon={<Icons.TrendDown />}
                colorClass="text-red-600"
                iconBgClass="bg-red-50 text-red-600"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Form and Visuals */}
              <div className="lg:col-span-1 space-y-8">
                <TransactionForm onAdd={addTransaction} />
                <Charts transactions={state.transactions} />
              </div>

              {/* Right Column - History */}
              <div className="lg:col-span-2">
                <TransactionList 
                  transactions={state.transactions} 
                  onDelete={deleteTransaction} 
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <ImageLab />
            
            <div className="mt-8 bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-2">Powered by Gemini AI</h4>
                <p className="text-indigo-200 text-sm max-w-lg">
                  Use our advanced AI studio to clean up receipt scans, add professional filters to your finance photos, or simply experiment with Gemini's visual capabilities.
                </p>
              </div>
              <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="absolute left-0 bottom-0 w-48 h-48 bg-purple-500/20 rounded-full -ml-10 -mb-10 blur-3xl"></div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} FinVue. All rights reserved.</p>
        <p className="mt-1">Simple. Beautiful. Personal Finance.</p>
      </footer>
    </div>
  );
};

export default App;
