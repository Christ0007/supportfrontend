<!-- src/components/forms/IncidentForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700">Solution concernée</label>
      <select
        v-model="form.software_solution_id"
        class="input-field mt-1"
        :class="{ 'border-red-500': errors.software_solution_id }"
        required
      >
        <option value="">Sélectionner une solution</option>
        <option
          v-for="solution in availableSolutions"
          :key="solution.id"
          :value="solution.id"
        >
          {{ solution.name }}
        </option>
      </select>
      <p v-if="errors.software_solution_id" class="mt-1 text-sm text-red-600">
        {{ errors.software_solution_id }}
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Titre</label>
      <input
        v-model="form.title"
        type="text"
        class="input-field mt-1"
        :class="{ 'border-red-500': errors.title }"
        required
        placeholder="Titre de l'incident"
      />
      <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Description</label>
      <textarea
        v-model="form.description"
        class="input-field mt-1"
        :class="{ 'border-red-500': errors.description }"
        rows="5"
        required
        placeholder="Décrivez l'incident en détail..."
      ></textarea>
      <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Priorité</label>
        <select
          v-model="form.priority"
          class="input-field mt-1"
          :class="{ 'border-red-500': errors.priority }"
          required
        >
          <option value="">Sélectionner une priorité</option>
          <option value="low">Basse</option>
          <option value="medium">Moyenne</option>
          <option value="high">Haute</option>
          <option value="critical">Critique</option>
        </select>
        <p v-if="errors.priority" class="mt-1 text-sm text-red-600">{{ errors.priority }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Catégorie</label>
        <select
          v-model="form.category"
          class="input-field mt-1"
          :class="{ 'border-red-500': errors.category }"
          required
        >
          <option value="">Sélectionner une catégorie</option>
          <option value="bug">Bug</option>
          <option value="performance">Performance</option>
          <option value="security">Sécurité</option>
          <option value="feature">Fonctionnalité</option>
          <option value="other">Autre</option>
        </select>
        <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
      </div>
    </div>

    <div class="flex justify-end space-x-3">
      <button type="button" @click="$emit('cancel')" class="btn-secondary">
        Annuler
      </button>
      <button type="submit" class="btn-primary" :disabled="loading">
        <LoadingSpinner v-if="loading" :show="true" class="inline h-4 w-4 mr-2" />
        Déclarer l'incident
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
  availableSolutions: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  software_solution_id: '',
  title: '',
  description: '',
  priority: '',
  category: ''
})

const errors = ref({})

function validateForm() {
  errors.value = {}
  
  if (!form.value.software_solution_id) {
    errors.value.software_solution_id = 'Veuillez sélectionner une solution'
  }
  if (!form.value.title.trim()) {
    errors.value.title = 'Le titre est requis'
  }
  if (!form.value.description.trim()) {
    errors.value.description = 'La description est requise'
  }
  if (!form.value.priority) {
    errors.value.priority = 'La priorité est requise'
  }
  if (!form.value.category) {
    errors.value.category = 'La catégorie est requise'
  }
  
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (validateForm()) {
    emit('submit', { ...form.value })
  }
}
</script>