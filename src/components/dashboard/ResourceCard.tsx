import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { AlertCircle, ChevronRight } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  available: number;
  total: number;
  type: 'beds' | 'ventilators' | 'staff';
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  available,
  total,
  type
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  // Calculate availability percentage
  const availabilityPercentage = (available / total) * 100;
  
  const getStatusColor = () => {
    if (availabilityPercentage <= 30) {
      return {
        background: 'bg-green-50',
        border: 'border-green-100',
        text: 'text-green-700',
        progressBar: 'bg-green-500',
        progressBg: 'bg-green-100',
        hover: 'hover:bg-green-100'
      };
    } else if (availabilityPercentage <= 60) {
      return {
        background: 'bg-orange-50',
        border: 'border-orange-100',
        text: 'text-orange-700',
        progressBar: 'bg-orange-500',
        progressBg: 'bg-orange-100',
        hover: 'hover:bg-orange-100'
      };
    } else {
      return {
        background: 'bg-red-50',
        border: 'border-red-100',
        text: 'text-red-700',
        progressBar: 'bg-red-500',
        progressBg: 'bg-red-100',
        hover: 'hover:bg-red-100'
      };
    }
  };

  const colors = getStatusColor();
  
  const handleClick = () => {
    switch (type) {
      case 'beds':
        navigate('/resources');
        break;
      case 'ventilators':
        navigate('/resources');
        break;
      case 'staff':
        navigate('/resources');
        break;
    }
  };

  return (
    <div
      className={cn(
        'relative rounded-lg border p-4 transition-all duration-200 cursor-pointer',
        colors.background,
        colors.border,
        colors.hover
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className={cn("font-semibold", colors.text)}>{title}</h3>
        {availabilityPercentage >= 70 && (
          <div className="animate-pulse">
            <AlertCircle className={cn("h-5 w-5", colors.text)} />
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-baseline">
          <span className={cn("text-2xl font-bold mr-1", colors.text)}>
            {available}
          </span>
          <span className="text-gray-600 text-sm">
            / {total}
          </span>
        </div>
        <p className="text-sm text-gray-600">Available</p>
      </div>

      <div className="space-y-2">
        <div className={cn("h-2 rounded-full", colors.progressBg)}>
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              colors.progressBar
            )}
            style={{ width: `${availabilityPercentage}%` }}
          />
        </div>
        <div className="flex justify-end">
          <span className={cn("text-sm font-medium", colors.text)}>
            {Math.round(availabilityPercentage)}%
          </span>
        </div>
      </div>

      <div 
        className={cn(
          "flex items-center mt-4 transition-opacity",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      >
        <span className={cn("text-sm font-medium", colors.text)}>
          Manage {title.toLowerCase()}
        </span>
        <ChevronRight className={cn("h-4 w-4 ml-1", colors.text)} />
      </div>
    </div>
  );
};

export default ResourceCard; 