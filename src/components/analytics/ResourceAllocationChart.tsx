import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAppStore } from '../../store';

ChartJS.register(ArcElement, Tooltip, Legend);

const ResourceAllocationChart: React.FC = () => {
  const { resources } = useAppStore();
  
  // Count resources by type
  const resourceCounts = resources.reduce((acc, resource) => {
    const type = resource.type;
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type]++;
    return acc;
  }, {} as Record<string, number>);
  
  const data = {
    labels: Object.keys(resourceCounts).map(type => type.charAt(0).toUpperCase() + type.slice(1) + 's'),
    datasets: [
      {
        data: Object.values(resourceCounts),
        backgroundColor: [
          '#0ea5e9', // primary-500
          '#22c55e', // success-500
          '#f59e0b', // warning-500
          '#ef4444', // danger-500
          '#6b7280', // gray-500
          '#8b5cf6', // purple-500
          '#ec4899', // pink-500
        ],
        borderColor: [
          '#ffffff',
          '#ffffff',
          '#ffffff',
          '#ffffff',
          '#ffffff',
          '#ffffff',
          '#ffffff',
        ],
        borderWidth: 2,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 h-full">
      <h3 className="font-semibold text-gray-800 mb-4">Resource Allocation by Type</h3>
      <div className="h-64">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default ResourceAllocationChart;