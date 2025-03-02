import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAppStore } from '../../store';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResourceUtilizationChart: React.FC = () => {
  const { getResourcesByType, getResourcesByStatus } = useAppStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const resourceTypes = ['bed', 'ventilator', 'monitor', 'ambulance', 'staff'];
  
  const availableCounts = resourceTypes.map(type => 
    getResourcesByStatus('available').filter(r => r.type === type).length
  );
  
  const inUseCounts = resourceTypes.map(type => 
    getResourcesByStatus('in-use').filter(r => r.type === type).length
  );
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };
  
  const data = {
    labels: resourceTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1) + 's'),
    datasets: [
      {
        label: 'Available',
        data: availableCounts,
        backgroundColor: '#22c55e', // success-500
      },
      {
        label: 'In Use',
        data: inUseCounts,
        backgroundColor: '#0ea5e9', // primary-500
      },
    ],
  };

  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 h-full">
        <h3 className="font-semibold text-gray-800 mb-4">Resource Utilization</h3>
        <div className="h-64 flex items-center justify-center">
          <p>Loading chart...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 h-full">
      <h3 className="font-semibold text-gray-800 mb-4">Resource Utilization</h3>
      <div className="h-64">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default ResourceUtilizationChart;