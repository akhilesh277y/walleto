
import React from 'react';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  colorClass: string;
  iconBgClass: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, icon, colorClass, iconBgClass }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
      <div className={`p-3 rounded-xl ${iconBgClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <p className={`text-2xl font-bold ${colorClass}`}>
          ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
};

export default SummaryCard;
