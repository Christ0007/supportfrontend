<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">{{ incident?.title }}</h2>
      <StatusBadge :status="incident?.status" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="card">
          <h3 class="text-lg font-semibold mb-4">Détails</h3>
          <div class="grid grid-cols-2 gap-4">
            <div><span class="text-gray-500">Priorité :</span>
              <StatusBadge :status="incident?.priority" />
            </div>
            <div><span class="text-gray-500">Catégorie :</span> {{ incident?.category }}</div>
            <div><span class="text-gray-500">Solution :</span> {{ incident?.software_solution?.name }}</div>
            <div><span class="text-gray-500">Technicien :</span> {{ incident?.technician?.name || 'Non assigné' }}</div>
            <div><span class="text-gray-500">Date :</span> {{ formatDate(incident?.created_at) }}</div>
          </div>
          <div class="mt-4">
            <span class="text-gray-500">Description :</span>
            <p class="mt-2 text-gray-700">{{ incident?.description }}</p>
          </div>
        </div>

        <div class="card">
          <h3 class="text-lg font-semibold mb-4">Interventions</h3>
          <EmptyState v-if="interventions.length === 0" title="Aucune intervention"
            message="Aucune intervention n'a encore été enregistrée pour cet incident." />
          <div v-else class="space-y-3">
            <div v-for="intervention in interventions" :key="intervention.id" class="p-3 bg-gray-50 rounded-lg">
              <div class="flex justify-between text-sm text-gray-500">
                <span>{{ intervention.user?.name }}</span>
                <span>{{ formatDate(intervention.intervention_date) }} - {{ intervention.duration }} min</span>
              </div>
              <p class="mt-1">{{ intervention.description }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="text-lg font-semibold mb-4">Messages</h3>
          <EmptyState v-if="messages.length === 0" title="Aucun message"
            message="Aucun message n'a encore été échangé sur cet incident." />
          <div v-else class="space-y-3 max-h-96 overflow-y-auto mb-4">
            <div v-for="msg in messages" :key="msg.id"
              :class="['p-3 rounded-lg', msg.user_id === authStore.user?.id ? 'bg-primary-50 ml-8' : 'bg-gray-50 mr-8']">
              <div class="flex justify-between text-sm text-gray-500">
                <span>{{ msg.user?.name }}</span>
                <span>{{ formatDate(msg.created_at) }}</span>
              </div>
              <p class="mt-1">{{ msg.content }}</p>
              <template v-if="msg.attachment">

                <a v-if="isImage(msg.attachment.file_name)" :href="`/storage/${msg.attachment.file_path}`"
                  target="_blank" class="block mt-2">
                  <img :src="`/storage/${msg.attachment.file_path}`" :alt="msg.attachment.file_name"
                    class="rounded-lg border border-gray-200" />
                </a>

                <a v-else :href="`/storage/${msg.attachment.file_path}`" target="_blank"
                  class="mt-2 inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  {{ msg.attachment.file_name }}
                </a>
              </template>
            </div>
          </div>

          <div v-if="selectedFile" class="flex items-center gap-2 mb-2 px-3 py-2 bg-gray-100 rounded-lg text-sm">
            <svg class="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span class="flex-1 truncate">{{ selectedFile.name }}</span>
            <button @click="selectedFile = null" class="text-gray-400 hover:text-red-600">✕</button>
          </div>

          <div class="flex items-center space-x-2">
            <button type="button" @click="fileInput.click()"
              class="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              title="Joindre un fichier">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <input ref="fileInput" type="file" class="hidden" @change="handleFileSelect" />
            <input v-model="newMessage" type="text" class="input-field flex-1" placeholder="Votre message..."
              @keyup.enter="sendMessage" />
            <button @click="sendMessage" class="btn-primary">Envoyer</button>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="card">
          <h3 class="text-lg font-semibold mb-4">Historique</h3>
          <div v-if="!incident?.status_histories?.length" class="text-gray-500 text-sm">Aucun changement de statut</div>
          <div v-else class="space-y-0">
            <div v-for="(history, index) in incident.status_histories" :key="history.id" class="flex">
              <div class="flex flex-col items-center mr-4">
                <span class="w-4 h-4 rounded-full bg-primary-600 flex-shrink-0"></span>
                <span v-if="index < incident.status_histories.length - 1"
                  class="w-0.5 flex-1 bg-primary-600 min-h-[40px]"></span>
              </div>
              <div class="pb-6">
                <StatusBadge :status="history.new_status" />
                <p class="text-xs text-gray-500 mt-1">{{ formatDate(history.created_at) }}</p>
                <p class="text-xs text-gray-500">Par {{ history.changer?.name || 'Système' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="canEvaluate" class="card">
          <h3 class="text-lg font-semibold mb-4">Évaluer le support</h3>
          <SatisfactionForm v-if="!incident?.satisfaction" :loading="satisfactionLoading"
            @submit="handleSatisfactionSubmit" @cancel="() => { }" />
          <div v-else class="text-center">
            <p class="text-2xl font-bold text-yellow-400">{{ '★'.repeat(incident.satisfaction.rating) }}</p>
            <p class="text-sm text-gray-500 mt-2">{{ incident.satisfaction.comment }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { incidentService } from '@/services/incidentService'
import { interventionService } from '@/services/interventionService'
import { messageService } from '@/services/messageService'
import { satisfactionService } from '@/services/satisfactionService'
import StatusBadge from '@/components/common/StatusBadge.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import SatisfactionForm from '@/components/forms/SatisfactionForm.vue'
import { showSuccess, showError } from '@/utils/toast'
import { formatDate } from '@/utils/formatters'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const incident = ref(null)
const interventions = ref([])
const messages = ref([])
const newMessage = ref('')
const selectedFile = ref(null)
const fileInput = ref(null)
const satisfactionLoading = ref(false)
const canEvaluate = computed(() => incident.value?.status === 'closed' && !incident.value?.satisfaction)

onMounted(async () => {
  await loadIncident()
})

async function loadIncident() {
  try {
    incident.value = await incidentService.getById(route.params.id)
  } catch (error) {
    showError('Vous n\'avez pas accès à cet incident.')
    router.push('/company/incidents')
    return
  }

  const intervResponse = await interventionService.getAll(route.params.id)
  interventions.value = intervResponse.data || intervResponse

  const msgResponse = await messageService.getAll(route.params.id)
  messages.value = msgResponse.data || msgResponse
}

function isImage(fileName) {
  return /\.(jpe?g|png|gif|webp|svg)$/i.test(fileName || '')
}

function handleFileSelect(event) {
  selectedFile.value = event.target.files[0] || null
}

async function sendMessage() {
  if (!newMessage.value.trim()) return
  try {
    await messageService.create(route.params.id, newMessage.value, selectedFile.value)
    newMessage.value = ''
    selectedFile.value = null
    if (fileInput.value) fileInput.value.value = ''
    const response = await messageService.getAll(route.params.id)
    messages.value = response.data || response
  } catch (error) {
    showError('Erreur lors de l\'envoi du message')
  }
}

async function handleSatisfactionSubmit(formData) {
  satisfactionLoading.value = true
  try {
    await satisfactionService.create(route.params.id, formData)
    showSuccess('Évaluation envoyée')
    loadIncident()
  } catch (error) {
    showError(error.response?.data?.message || 'Une erreur est survenue')
  } finally {
    satisfactionLoading.value = false
  }
}
</script>