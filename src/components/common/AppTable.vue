<!-- src/components/common/AppTable.vue -->
<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            :class="column.key === 'id' ? 'cursor-pointer select-none' : ''"
            @click="column.key === 'id' && toggleSort()"
          >
            <span class="inline-flex items-center gap-1">
              {{ column.label }}
              <template v-if="column.key === 'id'">
                <svg v-if="sortDir === 'asc'" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                </svg>
                <svg v-else class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </template>
            </span>
          </th>
          <th v-if="$slots.actions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="loading">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="px-6 py-4 text-center">
            <LoadingSpinner />
          </td>
        </tr>
        <tr v-else-if="!data || data.length === 0">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="px-6 py-4">
            <EmptyState />
          </td>
        </tr>
        <tr v-else v-for="(row, index) in data" :key="row.id || index">
          <td v-for="column in columns" :key="column.key" class="px-6 py-4 whitespace-nowrap">
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ row[column.key] }}
            </slot>
          </td>
          <td v-if="$slots.actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <slot name="actions" :row="row" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import LoadingSpinner from './LoadingSpinner.vue'
import EmptyState from './EmptyState.vue'

import { ref } from 'vue'

defineProps({
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['sort'])
const sortDir = ref('desc')

function toggleSort() {
  sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  emit('sort', sortDir.value)
}
</script>