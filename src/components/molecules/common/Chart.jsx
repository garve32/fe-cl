import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Chart({ history }) {
  const data = {
    labels: ['정답', '오답'],
    datasets: [
      {
        label: history.category_nm,
        data: [Number(history.correct_cnt), Number(history.wrong_cnt)],
        backgroundColor: ['rgb(79 70 229)', 'rgb(225 29 72)'],
        color: ['rgb(79 70 229)', 'rgb(225 29 72)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 8,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 11,
            weight: '500',
          },
          color: '#374151',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 4,
        displayColors: true,
        callbacks: {
          label(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = Number(history.correct_cnt) + Number(history.wrong_cnt);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value}개 (${percentage}%)`;
          }
        }
      },
    },
    cutout: '50%',
    radius: '100%',
  };

  return (
    <div className="h-32 sm:h-36 lg:h-44">
      <Doughnut data={data} options={options} />
    </div>
  );
}

export default Chart;
