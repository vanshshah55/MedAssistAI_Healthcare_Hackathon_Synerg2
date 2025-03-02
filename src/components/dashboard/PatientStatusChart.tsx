import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAppStore } from '../../store';

ChartJS.register(ArcElement, Tooltip, Legend);

const PatientStatusChart: React.FC = () => {
  const { getPatientsByTriageLevel } = useAppStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const immediateCount = getPatientsByTriageLevel('immediate').length;
  const urgentCount = getPatientsByTriageLevel('urgent').length;
  const delayedCount = getPatientsByTriageLevel('delayed').length;
  const expectantCount = getPatientsByTriageLevel('expectant').length;
  
  const data = {
    labels: ['Immediate', 'Urgent', 'Delayed', 'Expectant'],
    datasets: [
      {
        data: [immediateCount, urgentCount, delayedCount, expectantCount],
        backgroundColor: [
          '#dc2626', // danger-600
          '#f59e0b', // warning-500
          '#0ea5e9', // primary-500
          '#6b7280', // gray-500
        ],
        borderColor: [
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
        position: 'bottom' as const,
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
    cutout: '70%',
  };

  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 h-full">
        <h3 className="font-semibold text-gray-800 mb-4">Patient Triage Status</h3>
        <div className="h-64 flex items-center justify-center">
          <p>Loading chart...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 h-full">
      <h3 className="font-semibold text-gray-800 mb-4">Patient Triage Status</h3>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default PatientStatusChart;