import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart({data}) {
    const options = {
        maintainAspectRatio: false, // This allows the chart to be responsive and not maintain a fixed aspect ratio
        responsive: true,
        // Other options for styling or labels
      };
  return <div style={{ width: '400px', height: '400px' }}> {/* Adjust width and height as needed */}
  <Pie data={data} options={options} />
</div>;
}
