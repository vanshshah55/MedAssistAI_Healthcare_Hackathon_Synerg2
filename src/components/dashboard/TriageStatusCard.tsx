import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { cn } from '../../utils/cn';
import { ChevronRight, AlertCircle, Users } from 'lucide-react';

interface TriageStatusCardProps {
  level: 'immediate' | 'urgent' | 'delayed' | 'expectant';
  className?: string;
}

const TriageStatusCard: React.FC<TriageStatusCardProps> = ({ level, className }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { patients } = useAppStore();
  
  const count = patients.filter(p => p.triageLevel.toLowerCase() === level.toLowerCase()).length;
  
  const getColors = () => {
    switch (level) {
      case 'immediate':
        return {
          bg: 'bg-red-50',
          hoverBg: 'hover:bg-red-100',
          border: 'border-red-200',
          text: 'text-red-700',
          icon: 'text-red-600',
          indicator: 'bg-red-500',
          hover: 'hover:border-red-300'
        };
      case 'urgent':
        return {
          bg: 'bg-orange-50',
          hoverBg: 'hover:bg-orange-100',
          border: 'border-orange-200',
          text: 'text-orange-700',
          icon: 'text-orange-600',
          indicator: 'bg-orange-500',
          hover: 'hover:border-orange-300'
        };
      case 'delayed':
        return {
          bg: 'bg-yellow-50',
          hoverBg: 'hover:bg-yellow-100',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          icon: 'text-yellow-600',
          indicator: 'bg-yellow-500',
          hover: 'hover:border-yellow-300'
        };
      default:
        return {
          bg: 'bg-gray-50',
          hoverBg: 'hover:bg-gray-100',
          border: 'border-gray-200',
          text: 'text-gray-700',
          icon: 'text-gray-600',
          indicator: 'bg-gray-500',
          hover: 'hover:border-gray-300'
        };
    }
  };

  const colors = getColors();
  const formattedLevel = level.charAt(0).toUpperCase() + level.slice(1);

  return (
    <div
      className={cn(
        "relative rounded-lg border p-4 transition-all duration-200 cursor-pointer",
        colors.bg,
        colors.hoverBg,
        colors.border,
        colors.hover,
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate('/patients')}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={cn(
            "w-3 h-3 rounded-full mr-2",
            colors.indicator
          )} />
          <h3 className={cn(
            "font-semibold",
            colors.text
          )}>
            {formattedLevel}
          </h3>
        </div>
        
        {level === 'immediate' && count > 0 && (
          <div className="animate-pulse">
            <AlertCircle className={cn("h-5 w-5", colors.icon)} />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center">
        <Users className={cn("h-5 w-5 mr-2", colors.icon)} />
        <div>
          <p className={cn("text-2xl font-bold", colors.text)}>{count}</p>
          <p className="text-sm text-gray-600">Patients</p>
        </div>
      </div>

      {/* Interactive elements */}
      <div 
        className={cn(
          "flex items-center mt-4 transition-opacity",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      >
        <span className={cn("text-sm font-medium", colors.text)}>
          View patients
        </span>
        <ChevronRight className={cn("h-4 w-4 ml-1", colors.text)} />
      </div>
    </div>
  );
};

export default TriageStatusCard;