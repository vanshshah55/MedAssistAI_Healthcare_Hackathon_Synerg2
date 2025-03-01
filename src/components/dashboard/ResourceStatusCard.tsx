import React from 'react';
import { useAppStore } from '../../store';
import { cn } from '../../utils/cn';

interface ResourceStatusCardProps {
  type: 'bed' | 'ventilator' | 'monitor' | 'ambulance' | 'staff' | 'blood' | 'medication';
  className?: string;
}

const ResourceStatusCard: React.FC<ResourceStatusCardProps> = ({ type, className }) => {
  const { getResourcesByType, getResourcesByStatus, setActiveView } = useAppStore();
  
  const resources = getResourcesByType(type);
  const availableResources = getResourcesByStatus('available').filter(r => r.type === type);
  const inUseResources = getResourcesByStatus('in-use').filter(r => r.type === type);
  
  const totalCount = resources.length;
  const availableCount = availableResources.length;
  const inUseCount = inUseResources.length;
  
  const availablePercentage = totalCount > 0 ? Math.round((availableCount / totalCount) * 100) : 0;
  
  const getStatusColor = () => {
    if (availablePercentage <= 20) return 'text-danger-700';
    if (availablePercentage <= 50) return 'text-warning-700';
    return 'text-success-700';
  };
  
  const getProgressColor = () => {
    if (availablePercentage <= 20) return 'bg-danger-500';
    if (availablePercentage <= 50) return 'bg-warning-500';
    return 'bg-success-500';
  };
  
  const formatResourceType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1) + 's';
  };
  
  const handleViewResources = () => {
    setActiveView('resources');
  };
  
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm p-4 border border-gray-100",
      className
    )}>
      <h3 className="font-semibold text-gray-800">{formatResourceType(type)}</h3>
      
      <div className="mt-2 flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">{availableCount} <span className="text-sm font-normal text-gray-500">/ {totalCount}</span></p>
          <p className="text-sm text-gray-600">Available</p>
        </div>
        
        <div className={cn(
          "text-sm font-medium",
          getStatusColor()
        )}>
          {availablePercentage}%
        </div>
      </div>
      
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
        <div 
          className={cn(
            "h-2 rounded-full",
            getProgressColor()
          )}
          style={{ width: `${availablePercentage}%` }}
        />
      </div>
      
      <button
        className="mt-3 text-sm font-medium text-primary-600"
        onClick={handleViewResources}
      >
        Manage resources →
      </button>
    </div>
  );
};

export default ResourceStatusCard;