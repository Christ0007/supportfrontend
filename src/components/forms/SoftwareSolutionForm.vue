<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700">Nom de la solution</label>
      <input v-model="form.name" type="text" class="input-field mt-1" :class="{ 'border-red-500': errors.name }" required />
      <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Description</label>
      <textarea v-model="form.description" class="input-field mt-1" rows="4"></textarea>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Version</label>
      <input v-model="form.version" type="text" class="input-field mt-1" />
    </div>
<div>
      <label class="block text-sm font-medium text-gray-700">Techniciens responsables</label>
      <div class="mt-2 space-y-2 border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
        <label
          v-for="tech in technicians"
          :key="tech.id"
          class="flex items-center gap-2 text-sm cursor-pointer"
        >
          <input
            type="checkbox"
            :value="tech.id"
            v-model="form.technician_ids"
            class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          {{ tech.name }}
        </label>
      </div>
      <p v-if="!technicians.length" class="mt-1 text-sm text-gray-500">Aucun technicien disponible</p>
    </div>
    <div class="flex justify-end space-x-3">
      <button type="button" @click="$emit('cancel')" class="btn-secondary">Annuler</button>
      <button type="submit" class="btn-primary" :disabled="loading">
        <LoadingSpinner v-if="loading" :show="true" class="inline h-4 w-4 mr-2" />
        {{ isEditing ? 'Modifier' : 'Créer' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { userService } from '@/services/userService'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  isEditing: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['submit', 'cancel'])
const errors = ref({})
const technicians = ref([])

const form = ref({
  name: '',
  description: '',
  version: '',
  technician_ids: []
})

onMounted(async () => {
  try {
    const response = await userService.getAll({ role: 'technician' })
    technicians.value = response.data || response
  } catch (error) {
    console.error('Erreur chargement techniciens:', error)
  }
  if (props.initialData) {
    form.value.name = props.initialData.name || ''
    form.value.description = props.initialData.description || ''
    form.value.version = props.initialData.version || ''
    form.value.technician_ids = props.initialData.technician_ids || []
  }
})

function validateForm() {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'Le nom est requis'
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (validateForm()) emit('submit', { ...form.value })
}

</script>