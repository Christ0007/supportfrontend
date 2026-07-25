<template>
  <div class="chart-wrapper">
    <Bar v-if="type === 'bar'" :data="styledData" :options="barOptions" />
    <Pie v-if="type === 'pie'" :data="styledData" :options="ringOptions" />
    <Doughnut v-if="type === 'doughnut'" :data="styledData" :options="ringOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar, Pie, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const props = defineProps({
  type: { type: String, default: 'bar' },
  data: { type: Object, required: true }
})

const modernPalette = ['#6366f1', '#14b8a6', '#f59e0b', '#f43f5e', '#8b5cf6', '#0ea5e9']

const styledData = computed(() => ({
  ...props.data,
  datasets: props.data.datasets.map(ds => ({
    ...ds,
    backgroundColor: ds.backgroundColor || modernPalette,
    borderWidth: props.type === 'bar' ? 0 : 2,
    borderColor: '#ffffff',
    borderRadius: props.type === 'bar' ? 8 : 0,
    hoverOffset: props.type === 'bar' ? 0 : 8
  }))
}))

const baseTooltip = {
  backgroundColor: '#111827',
  padding: 10,
  cornerRadius: 8,
  titleFont: { size: 12, weight: '600' },
  bodyFont: { size: 12 },
  displayColors: true,
  boxPadding: 4
}

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: baseTooltip
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: '#f3f4f6' }, beginAtZero: true, ticks: { precision: 0 } }
  }
}

const ringOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 16,
        font: { size: 12 }
      }
    },
    tooltip: baseTooltip
  }
}
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  height: 260px;
}
</style>