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
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PatientTrendChart: React.FC = () => {
  // Mock data for patient trends over time
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
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Patients',
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
        label: 'Immediate',
        data: [2, 3, 1, 2, 3, 4, 5, 4, 3, 4, 3, 2],
        borderColor: '#dc2626', // danger-600
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Urgent',
        data: [4, 3, 5, 6, 4, 5, 7, 8, 6, 5, 4, 3],
        borderColor: '#f59e0b', // warning-500
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Delayed',
        data: [8, 7, 6, 5, 7, 8, 10, 9, 7, 6, 5, 4],
        borderColor: '#0ea5e9', // primary-500
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 h-full">
      <h3 className="font-semibold text-gray-800 mb-4">Patient Trends (24 Hours)</h3>
      <div className="h-64">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default PatientTrendChart;