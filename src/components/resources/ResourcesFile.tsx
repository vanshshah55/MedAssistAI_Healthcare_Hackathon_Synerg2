import React, { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../store';
import ResourcesList from './ResourcesList';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { AlertTriangle, Activity, Clock, Users } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Simulation settings type
interface SimulationSettings {
  crisisMode: boolean;
  patientInfluxRate: number; // patients per hour
  resourceFailureRate: number; // % chance of resource becoming unavailable
  simulationSpeed: number; // multiplier for time
  peakHours: boolean; // whether current time is during peak hours
  weatherConditions: 'normal' | 'severe'; // affects patient influx
  massIncidentMode: boolean; // simulates mass casualty incidents
}

const ResourcesFile: React.FC = () => {
  const { resources, updateResourceStatus } = useAppStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [simulationStats, setSimulationStats] = useState<{
    waitingPatients: number[];
    resourceUtilization: number[];
    avgWaitTime: number[];
    timeLabels: string[];
    emergencyCases: number[];
    resourceDowntime: number[];
  }>({
    waitingPatients: [],
    resourceUtilization: [],
    avgWaitTime: [],
    timeLabels: [],
    emergencyCases: [],
    resourceDowntime: []
  });
  
  const [settings, setSettings] = useState<SimulationSettings>({
    crisisMode: false,
    patientInfluxRate: 8, // Average 8 patients per hour in normal conditions
    resourceFailureRate: 2, // 2% chance of equipment failure
    simulationSpeed: 1,
    peakHours: false,
    weatherConditions: 'normal',
    massIncidentMode: false
  });
  
  // Calculate resource statistics
  const totalResources = resources.length;
  const availableResources = resources.filter(r => r.status === 'available').length;
  const inUseResources = resources.filter(r => r.status === 'in-use').length;
  const maintenanceResources = resources.filter(r => r.status === 'maintenance').length;

  // Simulation metrics
  const utilizationRate = (inUseResources / totalResources) * 100;
  const criticalThreshold = 85; // 85% utilization is considered critical

  // Filter resources based on selected status
  const filteredResources = statusFilter === 'all' 
    ? resources 
    : resources.filter(r => r.status === statusFilter);

  // Calculate realistic patient influx based on time and conditions
  const calculatePatientInflux = useCallback(() => {
    let baseRate = settings.patientInfluxRate;
    const hour = new Date().getHours();
    
    // Peak hours adjustment (typically 9AM-11AM and 6PM-9PM)
    const isPeakHour = (hour >= 9 && hour <= 11) || (hour >= 18 && hour <= 21);
    if (isPeakHour) {
      baseRate *= 1.5;
    }
    
    // Weekend adjustment
    const isWeekend = [0, 6].includes(new Date().getDay());
    if (isWeekend) {
      baseRate *= 1.3;
    }
    
    // Weather conditions impact
    if (settings.weatherConditions === 'severe') {
      baseRate *= 1.8;
    }
    
    // Crisis mode impact
    if (settings.crisisMode) {
      baseRate *= 2.5;
    }
    
    // Mass incident mode
    if (settings.massIncidentMode) {
      baseRate *= 4;
    }
    
    // Add random variation (±20%)
    const variation = 0.8 + Math.random() * 0.4;
    return Math.round(baseRate * variation);
  }, [settings]);

  // Calculate realistic resource failure rate
  const calculateResourceFailure = useCallback(() => {
    let baseRate = settings.resourceFailureRate;
    
    // Age-based failure rate increase
    const resourceAge = Math.random() * 5; // Simulated age in years
    baseRate *= (1 + resourceAge * 0.1);
    
    // Usage intensity impact
    const usageIntensity = utilizationRate / 100;
    baseRate *= (1 + usageIntensity * 0.5);
    
    // Crisis mode impact
    if (settings.crisisMode) {
      baseRate *= 1.5;
    }
    
    return baseRate;
  }, [settings, utilizationRate]);

  // Simulation effect with realistic timing
  useEffect(() => {
    let simulationInterval: NodeJS.Timeout;

    if (isSimulationRunning) {
      simulationInterval = setInterval(() => {
        // Update simulation time
        setSimulationTime(prev => prev + settings.simulationSpeed);

        // Simulate resource failures with realistic probability
        const failureRate = calculateResourceFailure();
        if (Math.random() * 100 < failureRate) {
          const availableResourceIds = resources
            .filter(r => r.status === 'available')
            .map(r => r.id);
          
          if (availableResourceIds.length > 0) {
            const randomResourceId = availableResourceIds[
              Math.floor(Math.random() * availableResourceIds.length)
            ];
            updateResourceStatus(randomResourceId, 'maintenance');
          }
        }

        // Update simulation statistics with realistic metrics
        setSimulationStats(prev => {
          const newPatients = calculatePatientInflux();
          const currentUtilization = (resources.filter(r => r.status === 'in-use').length / resources.length) * 100;
          const avgWaitTimeMinutes = Math.round(15 + (currentUtilization / 100) * 45); // 15-60 minutes based on utilization
          
          const newWaitingPatients = [...prev.waitingPatients, newPatients];
          const newUtilization = [...prev.resourceUtilization, currentUtilization];
          const newWaitTime = [...prev.avgWaitTime, avgWaitTimeMinutes];
          const newEmergencyCases = [...prev.emergencyCases, Math.round(newPatients * 0.3)]; // 30% are emergencies
          const newDowntime = [...prev.resourceDowntime, resources.filter(r => r.status === 'maintenance').length];
          const newTimeLabels = [...prev.timeLabels, new Date().toLocaleTimeString()];

          // Keep last 20 data points for rolling window
          return {
            waitingPatients: newWaitingPatients.slice(-20),
            resourceUtilization: newUtilization.slice(-20),
            avgWaitTime: newWaitTime.slice(-20),
            timeLabels: newTimeLabels.slice(-20),
            emergencyCases: newEmergencyCases.slice(-20),
            resourceDowntime: newDowntime.slice(-20)
          };
        });
      }, 1000 / settings.simulationSpeed); // Adjust interval based on simulation speed
    }

    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [isSimulationRunning, settings, resources, updateResourceStatus, calculatePatientInflux, calculateResourceFailure]);

  // Enhanced chart data with emergency cases
  const utilizationChartData = {
    labels: simulationStats.timeLabels,
    datasets: [
      {
        label: 'Resource Utilization (%)',
        data: simulationStats.resourceUtilization,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Waiting Patients',
        data: simulationStats.waitingPatients,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
      {
        label: 'Emergency Cases',
        data: simulationStats.emergencyCases,
        borderColor: 'rgb(255, 159, 64)',
        tension: 0.1,
      },
      {
        label: 'Resource Downtime',
        data: simulationStats.resourceDowntime,
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1,
      }
    ],
  };
  
  return (
    <div className="resources-container bg-gray-50 p-6 rounded-xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Resource Management</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsSimulationRunning(!isSimulationRunning)}
            className={`px-4 py-2 rounded-md font-medium ${
              isSimulationRunning
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isSimulationRunning ? 'Stop Simulation' : 'Start Simulation'}
          </button>
          <button
            onClick={() => setSettings(prev => ({ ...prev, crisisMode: !prev.crisisMode }))}
            className={`px-4 py-2 rounded-md font-medium ${
              settings.crisisMode
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            Crisis Mode: {settings.crisisMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Simulation Settings */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold mb-4">Simulation Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient Influx Rate</label>
            <div className="mt-1">
              <input
                type="range"
                min="1"
                max="20"
                value={settings.patientInfluxRate}
                onChange={(e) => setSettings(prev => ({ ...prev, patientInfluxRate: Number(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Low (1/hr)</span>
                <span>{settings.patientInfluxRate} patients/hour</span>
                <span>High (20/hr)</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Weather Conditions</label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={settings.weatherConditions}
              onChange={(e) => setSettings(prev => ({ 
                ...prev, 
                weatherConditions: e.target.value as 'normal' | 'severe'
              }))}
            >
              <option value="normal">Normal</option>
              <option value="severe">Severe</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Crisis Mode</label>
              <button
                onClick={() => setSettings(prev => ({ ...prev, crisisMode: !prev.crisisMode }))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.crisisMode ? 'bg-red-500' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                  settings.crisisMode ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Mass Incident</label>
              <button
                onClick={() => setSettings(prev => ({ ...prev, massIncidentMode: !prev.massIncidentMode }))}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings.massIncidentMode ? 'bg-red-500' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                  settings.massIncidentMode ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Simulation Speed</label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={settings.simulationSpeed}
              onChange={(e) => setSettings(prev => ({ ...prev, simulationSpeed: Number(e.target.value) }))}
            >
              <option value="0.5">0.5x (Slow)</option>
              <option value="1">1x (Real-time)</option>
              <option value="2">2x</option>
              <option value="5">5x</option>
              <option value="10">10x</option>
            </select>
          </div>
        </div>
      </div>

      {/* Current Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`bg-gradient-to-br p-5 rounded-xl shadow-md border ${
          utilizationRate > criticalThreshold
            ? 'from-red-100 to-red-50 border-red-200'
            : 'from-blue-50 to-indigo-50 border-blue-100'
        }`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-blue-600">Current Load</p>
            {utilizationRate > criticalThreshold && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Critical</span>
            )}
          </div>
          <p className="text-3xl font-bold text-gray-800 mt-2">{utilizationRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-500 mt-1">Resource Utilization</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl shadow-md border border-green-200">
          <p className="text-sm font-medium text-green-600">Average Wait Time</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {simulationStats.avgWaitTime.length > 0 
              ? `${simulationStats.avgWaitTime[simulationStats.avgWaitTime.length - 1]}m` 
              : '0m'}
          </p>
          <p className="text-sm text-gray-500 mt-1">Minutes per Patient</p>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-xl shadow-md border border-amber-200">
          <p className="text-sm font-medium text-amber-600">Emergency Cases</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {simulationStats.emergencyCases.length > 0 
              ? simulationStats.emergencyCases[simulationStats.emergencyCases.length - 1] 
              : '0'}
          </p>
          <p className="text-sm text-gray-500 mt-1">Active Critical Cases</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-5 rounded-xl shadow-md border border-purple-200">
          <p className="text-sm font-medium text-purple-600">Resource Health</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {((resources.filter(r => r.status !== 'maintenance').length / resources.length) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500 mt-1">Operational Resources</p>
        </div>
      </div>

      {/* Simulation Charts */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold mb-4">Real-time Metrics</h2>
        <div className="h-80">
          <Line 
            data={utilizationChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                },
              },
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: 'Resource Utilization & Patient Wait Times',
                },
              },
            }}
          />
        </div>
      </div>
      
      {/* AI Recommendations */}
      {utilizationRate > criticalThreshold && (
        <div className="bg-red-50 p-6 rounded-xl shadow-md border border-red-200 mb-8">
          <h2 className="text-xl font-semibold text-red-700 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Critical Resource Alert
          </h2>
          <div className="space-y-4">
            <p className="text-red-600">Resource utilization has exceeded critical threshold ({utilizationRate.toFixed(1)}%)</p>
            <div className="bg-white p-4 rounded-lg border border-red-100">
              <h3 className="font-medium text-gray-800 mb-2">AI Recommendations:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Activate emergency resource allocation protocol</li>
                <li>Redistribute {Math.ceil(inUseResources * 0.2)} resources from non-critical areas</li>
                <li>Request additional {Math.ceil(totalResources * 0.3)} resources from nearby facilities</li>
                <li>Implement triage-based resource prioritization</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Resources List */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Resources List</h2>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="available" className="text-green-700">Available</option>
              <option value="in-use" className="text-blue-700">In Use</option>
              <option value="maintenance" className="text-red-700">Maintenance</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        <ResourcesList resources={filteredResources} />
      </div>
    </div>
  );
};

export default ResourcesFile;