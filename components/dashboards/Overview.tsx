"use client";

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Overview: React.FC = () => {
  const investmentsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Investment Growth ($)',
        data: [65000, 59000, 80000, 81000, 56000, 55000, 40000],
        fill: false,
        borderColor: '#4b9cd3',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Total Investments</h3>
          <p className="text-4xl font-bold">$1,200,000</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Investment Performance</h3>
          <Line data={investmentsData} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
