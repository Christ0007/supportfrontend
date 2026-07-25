<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">Tableau de bord technicien</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Incidents en attente" :value="pendingCount" icon="clock" color="yellow" />
      <StatCard title="Pris en charge" :value="takenOverCount" icon="refresh" color="blue" />
      <StatCard title="Résolus" :value="resolvedCount" icon="check-circle" color="green" />
    </div>

    <div class="card">
      <h3 class="text-lg font-semibold mb-4">Incidents récents</h3>
      <div v-if="incidents.length === 0" class="text-gray-500 text-center py-4">Aucun incident</div>
      <div v-else class="space-y-3">
        <div v-for="incident in incidents.slice(0, 5)" :key="incident.id"
          class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <div>
            <router-link :to="`/technician/incidents/${incident.id}`"
              class="font-medium text-primary-600 hover:text-primary-700">
              {{ incident.title }}
            </router-link>
            <p class="text-sm text-gray-500">{{ incident.company?.company_name }}</p>
          </div>
          <StatusBadge :status="incident.status" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { incidentService } from '@/services/incidentService'
import StatCard from '@/components/dashboard/StatCard.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'

const incidents = ref([])
const loading = ref(false)

const pendingCount = computed(() => incidents.value.filter(i => i.status === 'declared' || i.status === 'analyzed').length)
const takenOverCount = computed(() => incidents.value.filter(i => i.status === 'taken_over' || i.status === 'in_progress').length)
const resolvedCount = computed(() => incidents.value.filter(i => i.status === 'resolved').length)

onMounted(async () => {
  loading.value = true
  try {
    const response = await incidentService.getAll()
    incidents.value = response.data || response
  } finally {
    loading.value = false
  }
})
</script>