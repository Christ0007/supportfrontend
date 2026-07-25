<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">Tableau de bord</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total incidents" :value="stats.total_incidents" icon="exclamation-triangle" color="blue" />
      <StatCard title="En attente" :value="getStatusCount('declared')" icon="clock" color="yellow" />
      <StatCard title="En cours" :value="getStatusCount('in_progress')" icon="refresh" color="purple" />
      <StatCard title="Résolus" :value="getStatusCount('resolved')" icon="check-circle" color="green" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Incidents par statut</h3>
        <IncidentChart v-if="stats.incidents_by_status?.length" type="doughnut" :data="incidentsByStatusChart" />
        <EmptyState v-else title="Aucune donnée" message="Aucun incident enregistré pour l'instant." />
      </div>
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Incidents par priorité</h3>
        <IncidentChart v-if="stats.incidents_by_priority?.length" type="doughnut" :data="incidentsByPriorityChart" />
        <EmptyState v-else title="Aucune donnée" message="Aucun incident enregistré pour l'instant." />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Top 5 des solutions</h3>
        <div v-if="stats.top_solutions?.length" class="space-y-3">
          <div v-for="solution in stats.top_solutions.slice(0, 5)" :key="solution.id"
            class="flex justify-between items-center">
            <span class="text-sm">{{ solution.name }}</span>
            <span class="text-sm font-semibold">{{ solution.incidents_count }} incidents</span>
          </div>
        </div>
        <EmptyState v-else title="Aucune donnée" message="Aucune solution utilisée pour l'instant." />
      </div>
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Satisfaction</h3>
        <div v-if="stats.satisfaction_stats" class="text-center">
          <p class="text-4xl font-bold text-primary-600">{{ stats.satisfaction_stats.average_rating?.toFixed(1) || '0.0'
            }}/5</p>
          <p class="text-sm text-gray-500 mt-2">{{ stats.satisfaction_stats.total_evaluations }} évaluations</p>
        </div>
        <EmptyState v-else title="Aucune évaluation" message="Aucune évaluation de satisfaction pour l'instant." />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { dashboardService } from '@/services/dashboardService'
import StatCard from '@/components/dashboard/StatCard.vue'
import IncidentChart from '@/components/dashboard/IncidentChart.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const stats = ref({})

const getStatusCount = (status) => {
  const statusItem = stats.value.incidents_by_status?.find(s => s.status === status)
  return statusItem?.count || 0
}

const statusLabels = {
  declared: 'Déclaré',
  analyzed: 'Analysé',
  taken_over: 'Pris en charge',
  in_progress: 'En traitement',
  resolved: 'Résolu',
  closed: 'Clôturé'
}

const priorityLabels = {
  low: 'Faible',
  medium: 'Moyenne',
  high: 'Élevée',
  critical: 'Critique'
}

const incidentsByStatusChart = computed(() => ({
  labels: stats.value.incidents_by_status?.map(s => statusLabels[s.status] || s.status) || [],
  datasets: [{
    label: 'Nombre d\'incidents',
    data: stats.value.incidents_by_status?.map(s => s.count) || [],
    backgroundColor: ['#6b7280', '#3b82f6', '#eab308', '#a855f7', '#22c55e', '#374151']
  }]
}))

const incidentsByPriorityChart = computed(() => ({
  labels: stats.value.incidents_by_priority?.map(p => priorityLabels[p.priority] || p.priority) || [],
  datasets: [{
    data: stats.value.incidents_by_priority?.map(p => p.count) || [],
    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
  }]
}))

onMounted(async () => {
  stats.value = await dashboardService.getStats()
})
</script>