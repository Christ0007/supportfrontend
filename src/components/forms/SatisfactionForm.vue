<!-- src/components/forms/SatisfactionForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700">Note (1 à 5)</label>
      <div class="flex items-center space-x-2 mt-2">
        <button
          v-for="star in 5"
          :key="star"
          type="button"
          @click="form.rating = star"
          class="text-3xl focus:outline-none"
        >
          <span :class="star <= form.rating ? 'text-yellow-400' : 'text-gray-300'">★</span>
        </button>
      </div>
      <p v-if="errors.rating" class="mt-1 text-sm text-red-600">{{ errors.rating }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Commentaire</label>
      <textarea
        v-model="form.comment"
        class="input-field mt-1"
        rows="4"
        placeholder="Partagez votre expérience..."
      ></textarea>
    </div>

    <div class="flex justify-end space-x-3">
      <button type="button" @click="$emit('cancel')" class="btn-secondary">
        Annuler
      </button>
      <button type="submit" class="btn-primary" :disabled="loading">
        <LoadingSpinner v-if="loading" :show="true" class="inline h-4 w-4 mr-2" />
        Envoyer l'évaluation
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
  rating: 0,
  comment: ''
})

const errors = ref({})

function validateForm() {
  errors.value = {}
  
  if (!form.value.rating || form.value.rating < 1 || form.value.rating > 5) {
    errors.value.rating = 'Veuillez attribuer une note'
  }
  
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (validateForm()) {
    emit('submit', { ...form.value })
  }
}
</script>