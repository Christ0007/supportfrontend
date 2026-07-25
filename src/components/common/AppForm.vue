<template>
  <form @submit.prevent="$emit('submit')" class="space-y-6">
    <slot />
    <div class="flex justify-end space-x-3">
      <button type="button" @click="$emit('cancel')" class="btn-secondary">Annuler</button>
      <button type="submit" class="btn-primary" :disabled="loading">
        <LoadingSpinner v-if="loading" :show="true" class="inline h-4 w-4 mr-2" />
        {{ submitLabel }}
      </button>
    </div>
  </form>
</template>

<script setup>
import LoadingSpinner from './LoadingSpinner.vue'

defineProps({
  loading: Boolean,
  submitLabel: { type: String, default: 'Enregistrer' }
})

defineEmits(['submit', 'cancel'])
</script>