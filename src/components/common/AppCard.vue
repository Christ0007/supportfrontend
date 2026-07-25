<template>
  <div class="card">
    <div v-if="title" class="border-b border-gray-200 pb-4 mb-4">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
    </div>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>