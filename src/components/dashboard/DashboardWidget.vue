<template>
  <div class="card">
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <slot />
  </div>
</template>

<script setup>
defineProps({ title: String })
</script>