<!-- src/components/common/LoadingSpinner.vue -->
<template>
  <div v-if="show" class="flex justify-center items-center py-8">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: true
  }
})
</script>