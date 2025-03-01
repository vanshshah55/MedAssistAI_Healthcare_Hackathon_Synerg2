import React from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AIPredictionAccuracyChart: React.FC = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Accuracy (%)',
        },
      },
    },
  };
  
  const data = {
    labels: ['Triage Classification', 'Critical Condition Detection', 'Treatment Recommendations', 'Resource Allocation', 'Length of Stay Prediction'],
    datasets: [
      {
        label: 'AI Prediction Accuracy',
        data: [92, 88, 85, 90, 82],
        backgroundColor: '#0ea5e9', // primary-500
      },
    ],
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 h-full">
      <h3 className="font-semibold text-gray-800 mb-4">AI Prediction Accuracy</h3>
      <div className="h-64">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default AIPredictionAccuracyChart;