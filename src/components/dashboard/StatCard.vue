<template>
  <div class="card">
    <div class="flex items-center">
      <div :class="`bg-${color}-100 rounded-lg p-3`">
        <svg class="h-6 w-6" :class="`text-${color}-600`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="icon === 'exclamation-triangle'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          <path v-if="icon === 'clock'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path v-if="icon === 'refresh'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          <path v-if="icon === 'check-circle'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path v-if="icon === 'users'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          <path v-if="icon === 'cube'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <div class="ml-4">
        <p class="text-sm text-gray-500">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [Number, String],
  icon: String,
  color: { type: String, default: 'blue' }
})
</script>