
import React from 'react';
import { Transaction, TransactionType } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center text-slate-400">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
      </div>
      <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
        {[...transactions].reverse().map((t) => (
          <div key={t.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                t.type === TransactionType.INCOME ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
              }`}>
                {t.type === TransactionType.INCOME ? 'IN' : 'EX'}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{t.description}</p>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span>{t.category}</span>
                  <span>•</span>
                  <span>{new Date(t.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`font-bold text-lg ${
                t.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-slate-800'
              }`}>
                {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <button 
                onClick={() => onDelete(t.id)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
