import React from 'react';
import { useAppStore } from '../../store';
import ResourcesList from './ResourcesList';

const ResourcesFile: React.FC = () => {
  const { resources } = useAppStore();
  
  // Calculate resource statistics
  const totalResources = resources.length;
  const availableResources = resources.filter(r => r.status === 'available').length;
  const inUseResources = resources.filter(r => r.status === 'in-use').length;
  const maintenanceResources = resources.filter(r => r.status === 'maintenance').length;
  
  return (
    <div className="resources-container">
      <h1 className="text-2xl font-bold mb-6">Resource Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Resources</p>
          <p className="text-2xl font-bold">{totalResources}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Available</p>
          <p className="text-2xl font-bold text-success-600">{availableResources}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">In Use</p>
          <p className="text-2xl font-bold text-primary-600">{inUseResources}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Maintenance</p>
          <p className="text-2xl font-bold text-warning-600">{maintenanceResources}</p>
        </div>
      </div>
      
      <ResourcesList />
    </div>
  );
};

export default ResourcesFile;