import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ResourceUtilizationTrendChart: React.FC = () => {
  // Mock data for resource utilization over time
  const labels = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Utilization (%)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time (24hr)',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Beds',
        data: [65, 70, 75, 70, 65, 75, 85, 90, 85, 80, 75, 70],
        borderColor: '#0ea5e9', // primary-500
        backgroundColor: '#0ea5e9',
        tension: 0.4,
      },
      {
        label: 'Ventilators',
        data: [40, 45, 50, 55, 60, 65, 70, 75, 70, 65, 60, 55],
        borderColor: '#22c55e', // success-500
        backgroundColor: '#22c55e',
        tension: 0.4,
      },
      {
        label: 'Staff',
        data: [80, 85, 90, 85, 80, 85, 90, 95, 90, 85, 80, 75],
        borderColor: '#f59e0b', // warning-500
        backgroundColor: '#f59e0b',
        tension: 0.4,
      },
    ],
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 h-full">
      <h3 className="font-semibold text-gray-800 mb-4">Resource Utilization Trends (24 Hours)</h3>
      <div className="h-64">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default ResourceUtilizationTrendChart;