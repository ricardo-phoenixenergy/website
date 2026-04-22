// src/components/tools/DCFBarChart.tsx
'use client';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface DCFBarChartProps {
  yrCashFlows: number[];
}

export function DCFBarChart({ yrCashFlows }: DCFBarChartProps) {
  const startYear = new Date().getFullYear();
  const labels = yrCashFlows.map((_, i) => String(startYear + i));

  const data = {
    labels,
    datasets: [
      {
        data: yrCashFlows,
        backgroundColor: '#39575C',
        borderRadius: 4,
        hoverBackgroundColor: '#2e474c',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { raw: unknown }) =>
            ` R ${Math.round(ctx.raw as number).toLocaleString('en-ZA')}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 }, color: '#9CA3AF' },
      },
      y: {
        grid: { color: '#F5F5F5' },
        border: { display: false },
        ticks: {
          font: { size: 10 },
          color: '#9CA3AF',
          callback: (value: number | string) =>
            `R ${(Number(value) / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  return (
    <div className="mb-6">
      <p className="font-display font-bold text-[13px] text-[#1A1A1A] mb-3">
        10-year projected annual savings
      </p>
      <div style={{ height: 180 }}>
        <Bar data={data} options={options as Parameters<typeof Bar>[0]['options']} />
      </div>
    </div>
  );
}
