import React from 'react';
import { Link } from 'react-router-dom';
import TriageStatusCard from '../components/dashboard/TriageStatusCard';
import ResourceUtilizationChart from '../components/dashboard/ResourceUtilizationChart';
import PatientStatusChart from '../components/dashboard/PatientStatusChart';
import RecentPatientsTable from '../components/dashboard/RecentPatientsTable';
import { useAppStore } from '../store';
import { formatTimeAgo } from '../utils/format';

const Dashboard: React.FC = () => {
  const { patients, resources, notifications } = useAppStore();

  const criticalAlerts = notifications
    .filter(n => n.type === 'alert' && !n.read)
    .slice(0, 3);

  // Calculate resource availability
  const getResourceStats = (type: string) => {
    const typeResources = resources.filter(r => r.type === type);
    const available = typeResources.filter(r => r.status === 'available').length;
    const total = typeResources.length;
    return { available, total, percentage: Math.round((available / total) * 100) };
  };

  const bedStats = getResourceStats('bed');
  const ventilatorStats = getResourceStats('ventilator');
  const staffStats = getResourceStats('staff');

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Total Patients</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{patients.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Available Resources</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {resources.filter(r => r.status === 'available').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Critical Cases</h3>
          <p className="mt-2 text-3xl font-bold text-danger-600">
            {patients.filter(p => p.triageLevel.toLowerCase() === 'immediate').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Alerts</h3>
          <p className="mt-2 text-3xl font-bold text-warning-600">{criticalAlerts.length}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PatientStatusChart />
        <ResourceUtilizationChart />
      </div>

      {/* Resource Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-700 font-medium">Beds</h3>
          <div className="mt-2">
            <div className="flex justify-between mb-1">
              <span className="text-2xl font-bold">{bedStats.available}</span>
              <span className="text-gray-500">/ {bedStats.total}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-primary-500 rounded-full" 
                style={{ width: `${bedStats.percentage}%` }} 
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Available</p>
            <Link 
              to="/resources" 
              className="text-primary-600 hover:text-primary-800 text-sm mt-3 inline-block"
            >
              Manage resources →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-700 font-medium">Ventilators</h3>
          <div className="mt-2">
            <div className="flex justify-between mb-1">
              <span className="text-2xl font-bold">{ventilatorStats.available}</span>
              <span className="text-gray-500">/ {ventilatorStats.total}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-primary-500 rounded-full" 
                style={{ width: `${ventilatorStats.percentage}%` }} 
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Available</p>
            <Link 
              to="/resources" 
              className="text-primary-600 hover:text-primary-800 text-sm mt-3 inline-block"
            >
              Manage resources →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-700 font-medium">Staffs</h3>
          <div className="mt-2">
            <div className="flex justify-between mb-1">
              <span className="text-2xl font-bold">{staffStats.available}</span>
              <span className="text-gray-500">/ {staffStats.total}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-primary-500 rounded-full" 
                style={{ width: `${staffStats.percentage}%` }} 
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Available</p>
            <Link 
              to="/resources" 
              className="text-primary-600 hover:text-primary-800 text-sm mt-3 inline-block"
            >
              Manage resources →
            </Link>
          </div>
        </div>
      </div>

      {/* Triage Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TriageStatusCard level="immediate" />
        <TriageStatusCard level="urgent" />
        <TriageStatusCard level="delayed" />
        <TriageStatusCard level="expectant" />
      </div>

      {/* Recent Patients */}
      <RecentPatientsTable />

      {/* Critical Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Critical Alerts</h3>
        <div className="space-y-4">
          {criticalAlerts.map(alert => (
            <div 
              key={alert.id} 
              className="flex items-center justify-between p-4 bg-danger-50 rounded-lg border border-danger-200"
            >
              <div>
                <p className="text-danger-800 font-medium">{alert.message}</p>
                <p className="text-danger-600 text-sm">{formatTimeAgo(alert.timestamp)}</p>
              </div>
            </div>
          ))}
          {criticalAlerts.length === 0 && (
            <p className="text-gray-500 text-center py-4">No critical alerts</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;