<!-- src/components/common/StatusBadge.vue -->
<template>
  <span :class="badgeClass">
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: ''
  }
})

const statusConfig = {
  declared: { class: 'bg-gray-100 text-gray-800', label: 'Déclaré' },
  analyzed: { class: 'bg-blue-100 text-blue-800', label: 'Analysé' },
  taken_over: { class: 'bg-yellow-100 text-yellow-800', label: 'Pris en charge' },
  in_progress: { class: 'bg-purple-100 text-purple-800', label: 'En traitement' },
  resolved: { class: 'bg-green-100 text-green-800', label: 'Résolu' },
  closed: { class: 'bg-gray-100 text-gray-800', label: 'Clôturé' }
}

const priorityConfig = {
  low: { class: 'bg-gray-100 text-gray-800', label: 'Basse' },
  medium: { class: 'bg-blue-100 text-blue-800', label: 'Moyenne' },
  high: { class: 'bg-orange-100 text-orange-800', label: 'Haute' },
  critical: { class: 'bg-red-100 text-red-800', label: 'Critique' }
}

const roleConfig = {
  admin: { class: 'bg-indigo-100 text-indigo-800', label: 'Administrateur' },
  technician: { class: 'bg-teal-100 text-teal-800', label: 'Technicien' },
  company: { class: 'bg-pink-100 text-pink-800', label: 'Entreprise cliente' }
}

const badgeClass = computed(() => {
  const config = statusConfig[props.status] || priorityConfig[props.status] || roleConfig[props.status]
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.class || 'bg-gray-100 text-gray-800'}`
})

const label = computed(() => {
  const config = statusConfig[props.status] || priorityConfig[props.status] || roleConfig[props.status]
  return config?.label || props.status
})
</script>