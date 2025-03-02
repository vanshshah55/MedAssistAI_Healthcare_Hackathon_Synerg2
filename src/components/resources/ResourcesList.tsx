import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '../../store';
import { cn } from '../../utils/cn';
import { Search, ArrowUpDown, AlertTriangle } from 'lucide-react';
import { formatTimeAgo } from '../../utils/format';
import { Resource } from '../../pages/types';
import { mockPatients } from '../../data/mockData';

interface ResourcesListProps {
  resources?: Resource[];
}

const ResourcesList: React.FC<ResourcesListProps> = ({ resources }) => {
  const { resources: allResources, getPatientById, updateResourceStatus } = useAppStore();
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
  const [showAllocationMenu, setShowAllocationMenu] = useState(false);
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>('all');
  const [patientPriorityFilter, setPatientPriorityFilter] = useState<string>('all');
  const [selectedResourceDetails, setSelectedResourceDetails] = useState<Resource | null>(null);
  const [selectedPatientDetails, setSelectedPatientDetails] = useState<typeof mockPatients[0] | null>(null);
  
  const displayResources = resources || allResources;
  
  // Enhanced patient priority calculation with more factors
  const calculatePatientPriority = useCallback((patient: typeof mockPatients[0]) => {
    let score = 0;
    
    // Triage level priority
    switch (patient.triageLevel) {
      case 'critical': score += 50; break;
      case 'urgent': score += 30; break;
      case 'non-urgent': score += 10; break;
    }
    
    // Age priority (extra points for elderly and very young)
    if (patient.age > 60) score += 20;
    if (patient.age < 12) score += 15;
    
    // Vital signs analysis
    if (patient.vitalSigns) {
      const { heartRate, oxygenSaturation, temperature } = patient.vitalSigns;
      
      // Critical heart rate ranges
      if (heartRate > 120 || heartRate < 50) score += 15;
      else if (heartRate > 100 || heartRate < 60) score += 10;
      
      // Low oxygen saturation
      if (oxygenSaturation < 90) score += 20;
      else if (oxygenSaturation < 95) score += 10;
      
      // Fever or hypothermia
      if (temperature > 39 || temperature < 35) score += 15;
      else if (temperature > 38 || temperature < 36) score += 10;
    }
    
    // Chief complaint severity
    const criticalConditions = ['Chest Pain', 'Stroke', 'Trauma', 'Respiratory Distress', 'Unconscious'];
    const urgentConditions = ['Fracture', 'Severe Pain', 'Bleeding', 'Infection'];
    
    if (patient.chiefComplaint) {
      if (criticalConditions.some(condition => patient.chiefComplaint.includes(condition))) {
        score += 25;
      } else if (urgentConditions.some(condition => patient.chiefComplaint.includes(condition))) {
        score += 15;
      }
    }
    
    // Waiting time factor (increases priority over time)
    const waitingTime = Date.now() - new Date(patient.arrivalTime).getTime();
    const waitingHours = waitingTime / (1000 * 60 * 60);
    score += Math.min(waitingHours * 5, 20); // Cap waiting time score at 20
    
    return score;
  }, []);

  // Intelligent resource allocation algorithm
  const allocateResourcesAutomatically = useCallback(() => {
    const availableResources = displayResources.filter(r => r.status === 'available');
    const unassignedPatients = mockPatients
      .filter(p => !displayResources.some(r => r.assignedTo === p.id))
      .map(patient => ({
        ...patient,
        priority: calculatePatientPriority(patient)
      }))
      .sort((a, b) => b.priority - a.priority);

    // Resource-patient matching optimization
    availableResources.forEach(resource => {
      const suitablePatient = unassignedPatients.find(patient => {
        // Match resource type with patient needs
        switch (resource.type) {
          case 'ambulance':
            return patient.chiefComplaint.includes('Trauma') || 
                   patient.triageLevel === 'critical';
          case 'bed':
            return true; // All patients can use beds
          case 'ventilator':
            return patient.chiefComplaint.includes('Respiratory') || 
                   patient.vitalSigns.oxygenSaturation < 90;
          default:
            return true;
        }
      });

      if (suitablePatient) {
        updateResourceStatus(resource.id, 'in-use', suitablePatient.id);
        unassignedPatients.splice(unassignedPatients.indexOf(suitablePatient), 1);
      }
    });
  }, [displayResources, calculatePatientPriority, updateResourceStatus]);

  // Auto-allocation effect with intelligent timing
  useEffect(() => {
    const interval = setInterval(() => {
      const criticalUtilization = displayResources.filter(r => r.status === 'in-use').length / displayResources.length > 0.8;
      const hasUnassignedCritical = mockPatients.some(p => 
        p.triageLevel === 'critical' && 
        !displayResources.some(r => r.assignedTo === p.id)
      );

      if (criticalUtilization || hasUnassignedCritical) {
        allocateResourcesAutomatically();
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [displayResources, allocateResourcesAutomatically]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAllocationMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manual allocation handler
  const handleManualAllocation = () => {
    if (selectedResource && selectedPatient) {
      updateResourceStatus(selectedResource, 'in-use', selectedPatient);
      setShowManualDialog(false);
      setSelectedResource(null);
      setSelectedPatient(null);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const filteredResources = displayResources.filter(resource => {
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
      return sortConfig.direction === 'ascending'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
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
  
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-use': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const handleUpdateStatus = (
    resourceId: string, 
    status: 'available' | 'in-use' | 'maintenance' | 'reserved'
  ) => {
    updateResourceStatus(resourceId, status);
  };
  
  const handleAssignPatient = (resourceId: string, patientId: string) => {
    updateResourceStatus(resourceId, 'in-use', patientId);
  };
  
  const resourceTypes = Array.from(new Set(displayResources.map(r => r.type)));
  const statusTypes = ['available', 'in-use', 'maintenance'];
  
  const getUnassignedPatients = () => {
    const assignedPatientIds = displayResources
      .filter(r => r.assignedTo)
      .map(r => r.assignedTo);
    return mockPatients.filter(patient => !assignedPatientIds.includes(patient.id));
  };
  
  // Enhanced resource filtering
  const getFilteredResources = () => {
    return displayResources
      .filter(r => r.status === 'available')
      .filter(r => resourceTypeFilter === 'all' ? true : r.type === resourceTypeFilter);
  };

  // Enhanced patient filtering
  const getFilteredPatients = () => {
    const unassignedPatients = mockPatients
      .filter(p => !displayResources.some(r => r.assignedTo === p.id))
      .map(patient => ({
        ...patient,
        priority: calculatePatientPriority(patient)
      }));

    return unassignedPatients
      .sort((a, b) => b.priority - a.priority)
      .filter(patient => {
        switch (patientPriorityFilter) {
          case 'critical':
            return patient.triageLevel === 'critical';
          case 'urgent':
            return patient.triageLevel === 'urgent';
          case 'non-urgent':
            return patient.triageLevel === 'non-urgent';
          case 'high-priority':
            return patient.priority >= 70;
          case 'medium-priority':
            return patient.priority >= 40 && patient.priority < 70;
          case 'low-priority':
            return patient.priority < 40;
          default:
            return true;
        }
      });
  };

  // Update manual allocation dialog JSX
  const renderManualAllocationDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold">Manual Resource Allocation</h3>
          <button
            onClick={() => setShowManualDialog(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resources Section */}
          <div className="border rounded-lg p-4">
            <h4 className="text-lg font-medium mb-4">Available Resources</h4>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Type
              </label>
              <select
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={resourceTypeFilter}
                onChange={(e) => setResourceTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                {Array.from(new Set(displayResources.map(r => r.type))).map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
              {getFilteredResources().map(resource => (
                <div
                  key={resource.id}
                  onClick={() => {
                    setSelectedResource(resource.id);
                    setSelectedResourceDetails(resource);
                  }}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedResource === resource.id
                      ? 'bg-blue-50 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">{resource.name}</h5>
                      <p className="text-sm text-gray-600">Type: {resource.type}</p>
                      <p className="text-sm text-gray-600">Location: {resource.location}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(resource.status)}`}>
                      {resource.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patients Section */}
          <div className="border rounded-lg p-4">
            <h4 className="text-lg font-medium mb-4 flex items-center justify-between">
              <span>Waiting Patients</span>
              <span className="text-sm font-normal text-gray-500">
                {getFilteredPatients().length} patients waiting
              </span>
            </h4>
            
            <div className="mb-4 space-y-2">
              <div className="flex gap-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Priority
                </label>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  Sort by: Priority Score
                </span>
              </div>
              <select
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={patientPriorityFilter}
                onChange={(e) => setPatientPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="urgent">Urgent</option>
                <option value="non-urgent">Non-urgent</option>
                <option value="high-priority">High Priority (70+)</option>
                <option value="medium-priority">Medium Priority (40-69)</option>
                <option value="low-priority">Low Priority (0-39)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
              {getFilteredPatients().map(patient => (
                <div
                  key={patient.id}
                  onClick={() => {
                    setSelectedPatient(patient.id);
                    setSelectedPatientDetails(patient);
                  }}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPatient === patient.id
                      ? 'bg-blue-50 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          patient.triageLevel === 'Immediate'
                            ? 'bg-red-100'
                            : patient.triageLevel === 'Urgent'
                            ? 'bg-yellow-100'
                            : 'bg-green-100'
                        }`}>
                          <span className={`text-xl font-bold ${
                            patient.triageLevel === 'Immediate'
                              ? 'text-red-700'
                              : patient.triageLevel === 'Urgent'
                              ? 'text-yellow-700'
                              : 'text-green-700'
                          }`}>{calculatePatientPriority(patient).toFixed(0)}</span>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">Score</span>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{patient.name}</h5>
                        <p className="text-sm text-gray-600">
                          {patient.age} years | {patient.gender}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      patient.triageLevel === 'Immediate'
                        ? 'bg-red-100 text-red-800'
                        : patient.triageLevel === 'Urgent'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {patient.triageLevel.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div>
                      <p className="text-gray-600 font-medium">Chief Complaint</p>
                      <p className="text-gray-900">{patient.condition}</p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {patient.vitalSigns && (
                      <>
                        <div className={`p-2 rounded-lg ${
                          patient.vitalSigns.heartRate > 100 || patient.vitalSigns.heartRate < 60
                            ? 'bg-red-50'
                            : 'bg-gray-50'
                        }`}>
                          <p className="text-xs text-gray-600">Heart Rate</p>
                          <p className="text-sm font-medium">{patient.vitalSigns.heartRate} bpm</p>
                        </div>
                        <div className={`p-2 rounded-lg ${
                          patient.vitalSigns.oxygenSaturation < 95
                            ? 'bg-red-50'
                            : 'bg-gray-50'
                        }`}>
                          <p className="text-xs text-gray-600">O2 Sat</p>
                          <p className="text-sm font-medium">{patient.vitalSigns.oxygenSaturation}%</p>
                        </div>
                        <div className={`p-2 rounded-lg ${
                          patient.vitalSigns.temperature > 38 || patient.vitalSigns.temperature < 36
                            ? 'bg-red-50'
                            : 'bg-gray-50'
                        }`}>
                          <p className="text-xs text-gray-600">Temp</p>
                          <p className="text-sm font-medium">{patient.vitalSigns.temperature}°C</p>
                        </div>
                      </>
                    )}
                  </div>

                  {patient.allergies && patient.allergies.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Allergies: {patient.allergies.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Items Details */}
        {(selectedResourceDetails || selectedPatientDetails) && (
          <div className="mt-6 border-t pt-6">
            <h4 className="text-lg font-medium mb-4">Selection Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedResourceDetails && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium mb-2">Selected Resource</h5>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <dt className="text-gray-600">Name:</dt>
                    <dd>{selectedResourceDetails.name}</dd>
                    <dt className="text-gray-600">Type:</dt>
                    <dd>{selectedResourceDetails.type}</dd>
                    <dt className="text-gray-600">Location:</dt>
                    <dd>{selectedResourceDetails.location}</dd>
                    <dt className="text-gray-600">Status:</dt>
                    <dd>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(selectedResourceDetails.status)}`}>
                        {selectedResourceDetails.status}
                      </span>
                    </dd>
                  </dl>
                </div>
              )}
              
              {selectedPatientDetails && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium mb-2">Selected Patient</h5>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <dt className="text-gray-600">Name:</dt>
                    <dd>{selectedPatientDetails.name}</dd>
                    <dt className="text-gray-600">Age:</dt>
                    <dd>{selectedPatientDetails.age}</dd>
                    <dt className="text-gray-600">Triage Level:</dt>
                    <dd>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedPatientDetails.triageLevel === 'critical'
                          ? 'bg-red-100 text-red-800'
                          : selectedPatientDetails.triageLevel === 'urgent'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedPatientDetails.triageLevel}
                      </span>
                    </dd>
                    <dt className="text-gray-600">Priority Score:</dt>
                    <dd>{calculatePatientPriority(selectedPatientDetails).toFixed(1)}</dd>
                    <dt className="text-gray-600">Chief Complaint:</dt>
                    <dd>{selectedPatientDetails.condition}</dd>
                    {selectedPatientDetails.vitalSigns && (
                      <>
                        <dt className="text-gray-600">Heart Rate:</dt>
                        <dd>{selectedPatientDetails.vitalSigns.heartRate} bpm</dd>
                        <dt className="text-gray-600">Oxygen Saturation:</dt>
                        <dd>{selectedPatientDetails.vitalSigns.oxygenSaturation}%</dd>
                        <dt className="text-gray-600">Temperature:</dt>
                        <dd>{selectedPatientDetails.vitalSigns.temperature}°C</dd>
                      </>
                    )}
                  </dl>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => {
              setShowManualDialog(false);
              setSelectedResource(null);
              setSelectedPatient(null);
              setSelectedResourceDetails(null);
              setSelectedPatientDetails(null);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleManualAllocation}
            disabled={!selectedResource || !selectedPatient}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              selectedResource && selectedPatient
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-400 cursor-not-allowed'
            }`}
          >
            Allocate Resource
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800">Resources</h2>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowAllocationMenu(!showAllocationMenu)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Resource Allocation
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showAllocationMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu">
                  <button
                    onClick={() => {
                      allocateResourcesAutomatically();
                      setShowAllocationMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                  >
                    AI Optimized Allocation
                  </button>
                  <button
                    onClick={() => {
                      setShowManualDialog(true);
                      setShowAllocationMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                  >
                    Manual Allocation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {showManualDialog && renderManualAllocationDialog()}
        
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
            const unassignedPatients = getUnassignedPatients();
            const isAmbulance = resource.type === 'ambulance';
            
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
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadgeClass(resource.status)}`}>
                    {resource.status.charAt(0).toUpperCase() + resource.status.slice(1).replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {resource.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {resource.status === 'available' ? (
                    <select
                      className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      onChange={(e) => handleAssignPatient(resource.id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Select Patient</option>
                      {unassignedPatients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} - {patient.triageLevel} - Waiting since {patient.arrivalTime}
                        </option>
                      ))}
                    </select>
                  ) : resource.status === 'in-use' && assignedPatient ? (
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
                        className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border bg-green-100 text-green-800 border-green-200 hover:bg-green-200 transition-colors duration-200"
                        onClick={() => handleUpdateStatus(resource.id, 'available')}
                      >
                        Available
                      </button>
                    )}
                    {resource.status === 'available' && (
                      <button
                        className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border bg-red-100 text-red-800 border-red-200 hover:bg-red-200 transition-colors duration-200"
                        onClick={() => handleUpdateStatus(resource.id, 'maintenance')}
                      >
                        Maintenance
                      </button>
                    )}
                    {resource.status === 'maintenance' && (
                      <button
                        className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border bg-green-100 text-green-800 border-green-200 hover:bg-green-200 transition-colors duration-200"
                        onClick={() => handleUpdateStatus(resource.id, 'available')}
                      >
                        Available
                      </button>
                    )}
                    {resource.status === 'available' && (
                      <button
                        className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 transition-colors duration-200"
                        onClick={() => handleUpdateStatus(resource.id, 'in-use')}
                      >
                        In Use
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
  );
};

export default ResourcesList;