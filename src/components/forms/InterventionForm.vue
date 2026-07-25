<!-- src/components/forms/InterventionForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700">Date de l'intervention</label>
      <input
        v-model="form.intervention_date"
        type="datetime-local"
        class="input-field mt-1"
        :class="{ 'border-red-500': errors.intervention_date }"
        required
      />
      <p v-if="errors.intervention_date" class="mt-1 text-sm text-red-600">
        {{ errors.intervention_date }}
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Durée (en minutes)</label>
      <input
        v-model.number="form.duration"
        type="number"
        class="input-field mt-1"
        :class="{ 'border-red-500': errors.duration }"
        min="1"
        required
      />
      <p v-if="errors.duration" class="mt-1 text-sm text-red-600">{{ errors.duration }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Description de l'intervention</label>
      <textarea
        v-model="form.description"
        class="input-field mt-1"
        :class="{ 'border-red-500': errors.description }"
        rows="5"
        required
        placeholder="Décrivez l'action effectuée..."
      ></textarea>
      <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
    </div>

    <div class="flex justify-end space-x-3">
      <button type="button" @click="$emit('cancel')" class="btn-secondary">
        Annuler
      </button>
      <button type="submit" class="btn-primary" :disabled="loading">
        <LoadingSpinner v-if="loading" :show="true" class="inline h-4 w-4 mr-2" />
        Enregistrer
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  intervention_date: new Date().toISOString().slice(0, 16),
  duration: 30,
  description: ''
})

const errors = ref({})

function validateForm() {
  errors.value = {}
  
  if (!form.value.intervention_date) {
    errors.value.intervention_date = 'La date est requise'
  }
  if (!form.value.duration || form.value.duration < 1) {
    errors.value.duration = 'La durée doit être supérieure à 0'
  }
  if (!form.value.description.trim()) {
    errors.value.description = 'La description est requise'
  }
  
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (validateForm()) {
    emit('submit', { ...form.value })
  }
}
</script>