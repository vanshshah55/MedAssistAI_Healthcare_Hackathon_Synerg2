import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { formatTimeAgo } from '../../utils/format';
import { cn } from '../../utils/cn';
import { ChevronRight, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const RecentPatientsTable: React.FC = () => {
  const navigate = useNavigate();
  const { patients } = useAppStore();
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  
  // Sort patients by arrival time (most recent first) and get top 5
  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.arrivalTime).getTime() - new Date(a.arrivalTime).getTime())
    .slice(0, 5);

  const getRiskLevel = (riskScore: number) => {
    if (riskScore >= 80) return 'Critical';
    if (riskScore >= 60) return 'High';
    if (riskScore >= 40) return 'Moderate';
    return 'Low';
  };

  const getRiskLevelStyles = (riskScore: number) => {
    const level = getRiskLevel(riskScore);
    switch (level) {
      case 'Critical':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
          hover: 'hover:bg-red-100'
        };
      case 'High':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          border: 'border-orange-200',
          hover: 'hover:bg-orange-100'
        };
      case 'Moderate':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-700',
          border: 'border-yellow-200',
          hover: 'hover:bg-yellow-100'
        };
      default:
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          hover: 'hover:bg-green-100'
        };
    }
  };

  // Mock capacity data - in real app, this would come from your backend
  const locationCapacity: { [key: string]: { current: number; total: number } } = {
    'ER Bay 1': { current: 1, total: 1 },
    'ER Bay 2': { current: 1, total: 1 },
    'ER Bay 3': { current: 1, total: 1 },
    'ER Bay 4': { current: 0, total: 1 },
    'ER Bay 5': { current: 0, total: 1 },
    'ER Bay 6': { current: 1, total: 1 },
    'Waiting Room': { current: 3, total: 10 },
    'ICU': { current: 4, total: 5 },
    'General Ward': { current: 15, total: 20 },
  };

  const getLocationStatusStyles = (location: string) => {
    const capacity = locationCapacity[location];
    if (!capacity) return { text: 'text-gray-500' };

    const usage = capacity.current / capacity.total;
    
    if (usage >= 1) {
      return {
        text: 'text-red-700',
        icon: <XCircle className="h-4 w-4 text-red-500 ml-2" />,
        label: 'Full'
      };
    } else if (usage >= 0.8) {
      return {
        text: 'text-orange-700',
        icon: <AlertCircle className="h-4 w-4 text-orange-500 ml-2" />,
        label: 'Limited'
      };
    } else {
      return {
        text: 'text-green-700',
        icon: <CheckCircle className="h-4 w-4 text-green-500 ml-2" />,
        label: 'Available'
      };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Patients</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Triage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Arrival
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location & Status
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentPatients.map((patient) => {
              const riskStyles = getRiskLevelStyles(patient.riskScore);
              const locationStyles = getLocationStatusStyles(patient.location);
              const isHovered = hoveredRow === patient.id;

              return (
                <tr
                  key={patient.id}
                  className={cn(
                    "transition-colors duration-150 cursor-pointer",
                    isHovered ? riskStyles.hover : "hover:bg-gray-50"
                  )}
                  onMouseEnter={() => setHoveredRow(patient.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {patient.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {patient.age} yrs, {patient.gender}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      patient.triageLevel.toLowerCase() === 'immediate' && "bg-red-100 text-red-800",
                      patient.triageLevel.toLowerCase() === 'urgent' && "bg-orange-100 text-orange-800",
                      patient.triageLevel.toLowerCase() === 'delayed' && "bg-yellow-100 text-yellow-800",
                      patient.triageLevel.toLowerCase() === 'expectant' && "bg-gray-100 text-gray-800"
                    )}>
                      {patient.triageLevel}
                      {patient.triageLevel.toLowerCase() === 'immediate' && (
                        <AlertCircle className="ml-1 h-3 w-3" />
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      riskStyles.bg,
                      riskStyles.text
                    )}>
                      {getRiskLevel(patient.riskScore)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTimeAgo(patient.arrivalTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={cn("text-sm", locationStyles.text)}>
                        {patient.location}
                      </span>
                      {locationCapacity[patient.location] && (
                        <>
                          {locationStyles.icon}
                          <span className={cn(
                            "text-xs ml-2 px-2 py-0.5 rounded-full",
                            locationStyles.text === 'text-red-700' && "bg-red-50",
                            locationStyles.text === 'text-orange-700' && "bg-orange-50",
                            locationStyles.text === 'text-green-700' && "bg-green-50"
                          )}>
                            {locationCapacity[patient.location].current}/{locationCapacity[patient.location].total}
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className={cn(
                      "flex items-center justify-end transition-opacity",
                      isHovered ? "opacity-100" : "opacity-0"
                    )}>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
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

export default RecentPatientsTable;