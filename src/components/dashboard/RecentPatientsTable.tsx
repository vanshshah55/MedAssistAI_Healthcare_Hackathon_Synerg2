import React from 'react';
import { useAppStore } from '../../store';
import { formatTimeAgo, getTriageLevelColor, getRiskLevelText, getRiskLevelColor } from '../../utils/format';
import { cn } from '../../utils/cn';
import { ArrowRight } from 'lucide-react';

const RecentPatientsTable: React.FC = () => {
  const { patients, setSelectedPatientId, setActiveView } = useAppStore();
  
  // Sort patients by arrival time (most recent first)
  const sortedPatients = [...patients].sort((a, b) => 
    new Date(b.arrivalTime).getTime() - new Date(a.arrivalTime).getTime()
  ).slice(0, 5); // Get only the 5 most recent
  
  const handleViewPatient = (id: string) => {
    setSelectedPatientId(id);
    setActiveView('patients');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Recent Patients</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Triage
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Arrival
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.age} yrs, {patient.gender}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                    getTriageLevelColor(patient.triageLevel),
                    "text-white"
                  )}>
                    {patient.triageLevel.charAt(0).toUpperCase() + patient.triageLevel.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "text-sm font-medium",
                    getRiskLevelColor(patient.riskScore)
                  )}>
                    {getRiskLevelText(patient.riskScore)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatTimeAgo(patient.arrivalTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="text-primary-600 hover:text-primary-900"
                    onClick={() => handleViewPatient(patient.id)}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentPatientsTable;