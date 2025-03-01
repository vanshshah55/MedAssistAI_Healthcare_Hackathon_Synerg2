import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { cn } from '../../utils/cn';
import { Search, ArrowUpDown } from 'lucide-react';
import { formatTimeAgo } from '../../utils/format';

const ResourcesList: React.FC = () => {
  const { resources, getPatientById, updateResourceStatus } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  }>({
    key: 'name',
    direction: 'ascending',
  });
  
  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter ? resource.type === typeFilter : true;
    const matchesStatus = statusFilter ? resource.status === statusFilter : true;
    return matchesSearch && matchesType && matchesStatus;
  });
  
  const sortedResources = [...filteredResources].sort((a, b) => {
    const aValue = a[sortConfig.key as keyof typeof a];
    const bValue = b[sortConfig.key as keyof typeof b];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      if (sortConfig.direction === 'ascending') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    }
    return 0;
  });
  
  const getSortIcon = (key: string) => {
    if (sortConfig.key === key) {
      return (
        <ArrowUpDown className={cn(
          "h-4 w-4 ml-1",
          sortConfig.direction === 'ascending' ? 'text-primary-600' : 'text-primary-600'
        )} />
      );
    }
    return <ArrowUpDown className="h-4 w-4 ml-1 text-gray-400" />;
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success-100 text-success-800';
      case 'in-use':
        return 'bg-primary-100 text-primary-800';
      case 'maintenance':
        return 'bg-warning-100 text-warning-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleUpdateStatus = (
    resourceId: string, 
    status: 'available' | 'in-use' | 'maintenance' | 'reserved'
  ) => {
    updateResourceStatus(resourceId, status);
  };
  
  const resourceTypes = Array.from(new Set(resources.map(r => r.type)));
  const statusTypes = ['available', 'in-use', 'maintenance'];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <h2 className="font-semibold text-xl text-gray-800">Resources</h2>
        
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={typeFilter || ''}
              onChange={(e) => setTypeFilter(e.target.value || null)}
            >
              <option value="">All Types</option>
              {resourceTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
            >
              <option value="">All Statuses</option>
              {statusTypes.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Resource {getSortIcon('name')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center">
                  Type {getSortIcon('type')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status {getSortIcon('status')}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignment
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedResources.map((resource) => {
              const assignedPatient = resource.assignedTo ? getPatientById(resource.assignedTo) : null;
              
              return (
                <tr key={resource.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                        <div className="text-sm text-gray-500">ID: {resource.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                      getStatusColor(resource.status)
                    )}>
                      {resource.status.charAt(0).toUpperCase() + resource.status.slice(1).replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {resource.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {assignedPatient ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">{assignedPatient.name}</div>
                        <div className="text-xs text-gray-500">
                          {resource.estimatedReleaseTime && `Est. release: ${formatTimeAgo(resource.estimatedReleaseTime)}`}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {resource.status === 'in-use' && (
                        <button
                          className="text-success-600 hover:text-success-900"
                          onClick={() => handleUpdateStatus(resource.id, 'available')}
                        >
                          Mark Available
                        </button>
                      )}
                      {resource.status === 'available' && (
                        <button
                          className="text-warning-600 hover:text-warning-900"
                          onClick={() => handleUpdateStatus(resource.id, 'maintenance')}
                        >
                          Maintenance
                        </button>
                      )}
                      {resource.status === 'maintenance' && (
                        <button
                          className="text-success-600 hover:text-success-900"
                          onClick={() => handleUpdateStatus(resource.id, 'available')}
                        >
                          Mark Available
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResourcesList;