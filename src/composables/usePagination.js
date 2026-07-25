// src/composables/usePagination.js
import { ref, computed } from 'vue'

export function usePagination(fetchFunction, initialParams = {}) {
  const items = ref([])
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0
  })
  const loading = ref(false)
  const filters = ref({ ...initialParams })

  const hasMore = computed(() => pagination.value.currentPage < pagination.value.lastPage)

  async function fetchItems() {
    loading.value = true
    try {
      const params = {
        page: pagination.value.currentPage,
        per_page: pagination.value.perPage,
        ...filters.value
      }
      
      const response = await fetchFunction(params)
      items.value = response.data
      pagination.value = {
        currentPage: response.current_page,
        lastPage: response.last_page,
        perPage: response.per_page,
        total: response.total
      }
    } finally {
      loading.value = false
    }
  }

  async function changePage(page) {
    pagination.value.currentPage = page
    await fetchItems()
  }

  async function applyFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.currentPage = 1
    await fetchItems()
  }

  async function resetFilters() {
    filters.value = {}
    pagination.value.currentPage = 1
    await fetchItems()
  }

  return {
    items,
    pagination,
    loading,
    filters,
    hasMore,
    fetchItems,
    changePage,
    applyFilters,
    resetFilters
  }
}