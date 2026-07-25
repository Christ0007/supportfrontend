<!-- src/components/common/AppPagination.vue -->
<template>
  <div v-if="total > 0" class="flex items-center justify-between px-4 py-3 sm:px-6">
    <div class="flex-1 flex justify-between sm:hidden">
      <button @click="$emit('page-change', currentPage - 1)" :disabled="currentPage === 1" class="btn-secondary">
        Précédent
      </button>
      <button @click="$emit('page-change', currentPage + 1)" :disabled="currentPage === lastPage" class="btn-secondary">
        Suivant
      </button>
    </div>
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Affichage de
          <span class="font-medium">{{ from }}</span>
          à
          <span class="font-medium">{{ to }}</span>
          sur
          <span class="font-medium">{{ total }}</span>
          résultats
        </p>
      </div>
      <div>
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button @click="$emit('page-change', currentPage - 1)" :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Précédent
          </button>
          <button v-for="page in pagesToShow" :key="page" @click="$emit('page-change', page)" :class="[
            page === currentPage
              ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
            'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
          ]">
            {{ page }}
          </button>
          <button @click="$emit('page-change', currentPage + 1)" :disabled="currentPage === lastPage"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Suivant
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  lastPage: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  perPage: {
    type: Number,
    default: 15
  }
})

defineEmits(['page-change'])

const from = computed(() => (props.currentPage - 1) * props.perPage + 1)
const to = computed(() => Math.min(props.currentPage * props.perPage, props.total))

const pagesToShow = computed(() => {
  const pages = []
  const maxPages = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxPages / 2))
  let end = Math.min(props.lastPage, start + maxPages - 1)

  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})
</script>