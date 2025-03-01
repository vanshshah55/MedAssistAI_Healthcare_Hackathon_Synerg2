import React from 'react';
import { useAppStore } from '../../store';
import { cn } from '../../utils/cn';
import { formatTriageLevel } from '../../utils/format';

interface TriageStatusCardProps {
  level: 'immediate' | 'urgent' | 'delayed' | 'expectant';
  className?: string;
}

const TriageStatusCard: React.FC<TriageStatusCardProps> = ({ level, className }) => {
  const { getPatientsByTriageLevel, setActiveView, setSelectedPatientId } = useAppStore();
  
  const patients = getPatientsByTriageLevel(level);
  const count = patients.length;
  
  const getBgColor = () => {
    switch (level) {
      case 'immediate': return 'bg-danger-50 border-danger-200';
      case 'urgent': return 'bg-warning-50 border-warning-200';
      case 'delayed': return 'bg-primary-50 border-primary-200';
      case 'expectant': return 'bg-gray-50 border-gray-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };
  
  const getTextColor = () => {
    switch (level) {
      case 'immediate': return 'text-danger-700';
      case 'urgent': return 'text-warning-700';
      case 'delayed': return 'text-primary-700';
      case 'expectant': return 'text-gray-700';
      default: return 'text-gray-700';
    }
  };
  
  const getIndicatorColor = () => {
    switch (level) {
      case 'immediate': return 'bg-danger-500';
      case 'urgent': return 'bg-warning-500';
      case 'delayed': return 'bg-primary-500';
      case 'expectant': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };
  
  const handleViewPatients = () => {
    setActiveView('patients');
  };
  
  return (
    <div className={cn(
      "rounded-lg border p-4",
      getBgColor(),
      className
    )}>
      <div className="flex items-center">
        <div className={cn(
          "w-3 h-3 rounded-full mr-2",
          getIndicatorColor()
        )} />
        <h3 className={cn(
          "font-semibold",
          getTextColor()
        )}>
          {formatTriageLevel(level)}
        </h3>
      </div>
      
      <div className="mt-2">
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-sm text-gray-600">Patients</p>
      </div>
      
      {count > 0 && (
        <button
          className={cn(
            "mt-3 text-sm font-medium",
            getTextColor()
          )}
          onClick={handleViewPatients}
        >
          View patients →
        </button>
      )}
    </div>
  );
};

export default TriageStatusCard;