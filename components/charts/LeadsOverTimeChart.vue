<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from 'chart.js'
import type { Lead } from '@/lib/types'
import { format, subDays, eachDayOfInterval } from 'date-fns'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
)

const props = defineProps<{
  leads: Lead[]
}>()

const chartData = computed(() => {
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  })

  const labels = last7Days.map(day => format(day, 'dd.MM'))
  const data = last7Days.map(day => {
    return props.leads.filter(lead => format(new Date(lead.createdAt), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).length
  })

  return {
    labels,
    datasets: [
      {
        label: 'Yeni Talepler',
        borderColor: '#3b82f6',
        backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            if (!ctx) return 'transparent';
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
            return gradient;
        },
        data,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3b82f6',
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: '#9ca3af',
        stepSize: 1,
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
      }
    },
    x: {
      ticks: {
        color: '#9ca3af',
      },
      grid: {
        display: false,
      }
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
}
</script> 