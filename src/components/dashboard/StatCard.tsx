import React from 'react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string | number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change,
  className 
}) => {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm p-5 border border-gray-100",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
          
          {change && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-xs font-medium",
                change.type === 'increase' && "text-success-600",
                change.type === 'decrease' && "text-danger-600",
                change.type === 'neutral' && "text-gray-500"
              )}>
                {change.type === 'increase' && '+'}
                {change.type === 'decrease' && '-'}
                {change.value}
              </span>
              <span className="text-xs text-gray-500 ml-1">from last hour</span>
            </div>
          )}
        </div>
        
        <div className="p-2 rounded-full bg-primary-50">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;