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
            <div><span class="text-gray-500">Entreprise :</span> {{ incident?.company?.company_name }}</div>
            <div><span class="text-gray-500">Solution :</span> {{ incident?.software_solution?.name }}</div>
            <div><span class="text-gray-500">Date :</span> {{ formatDate(incident?.created_at) }}</div>
          </div>
          <div class="mt-4">
            <span class="text-gray-500">Description :</span>
            <p class="mt-2 text-gray-700">{{ incident?.description }}</p>
          </div>
        </div>

        <div class="card">
          <h3 class="text-lg font-semibold mb-4">Messages</h3>
          <EmptyState v-if="messages.length === 0" title="Aucun message"
            message="Aucun message n'a encore été échangé sur cet incident." />
          <div v-else class="space-y-3 max-h-80 overflow-y-auto mb-4">
            <div v-for="message in messages" :key="message.id" class="p-3 rounded-lg"
              :class="message.user_id === authStore.user?.id ? 'bg-primary-50 ml-8' : 'bg-gray-50 mr-8'">
              <div class="flex justify-between text-xs text-gray-500 mb-1">
                <span class="font-medium">{{ message.user?.name }}</span>
                <span>{{ formatDate(message.created_at) }}</span>
              </div>
              <p class="text-sm text-gray-700">{{ message.content }}</p>

              <template v-if="message.attachment">

                <a v-if="isImage(message.attachment.file_name)" :href="`/storage/${message.attachment.file_path}`"
                  target="_blank" class="block mt-2">
                  <img :src="`/storage/${message.attachment.file_path}`" :alt="message.attachment.file_name"
                    class="rounded-lg border border-gray-200" />
                </a>

                <a v-else :href="`/storage/${message.attachment.file_path}`" target="_blank"
                  class="mt-2 inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  {{ message.attachment.file_name }}
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
          <h3 class="text-lg font-semibold mb-4">Changer le statut</h3>
          <EmptyState v-if="!transitions.length" title="Aucune action disponible"
            message="Cet incident ne permet aucun changement de statut pour le moment." />
          <div v-else class="flex flex-col space-y-2">
            <button v-for="transition in transitions" :key="transition.status"
              @click="updateStatus(transition.status, transition.label)" class="btn-primary text-sm">
              {{ transition.label }}
            </button>
          </div>
        </div>

        <div class="card">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Interventions</h3>
            <button @click="showInterventionForm = true" class="btn-primary text-sm">Ajouter</button>
          </div>
          <div v-if="showInterventionForm" class="mb-4 p-4 bg-gray-50 rounded-lg">
            <InterventionForm :loading="interventionLoading" @submit="handleAddIntervention"
              @cancel="showInterventionForm = false" />
          </div>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { incidentService } from '@/services/incidentService'
import { interventionService } from '@/services/interventionService'
import { messageService } from '@/services/messageService'
import StatusBadge from '@/components/common/StatusBadge.vue'
import InterventionForm from '@/components/forms/InterventionForm.vue'
import Swal from 'sweetalert2'
import { showSuccess, showError } from '@/utils/toast'
import EmptyState from '@/components/common/EmptyState.vue'
import { formatDate } from '@/utils/formatters'

const route = useRoute()
const authStore = useAuthStore()
const incident = ref(null)
const transitions = ref([])
const interventions = ref([])
const messages = ref([])
const newMessage = ref('')
const selectedFile = ref(null)
const fileInput = ref(null)
const showInterventionForm = ref(false)
const interventionLoading = ref(false)

onMounted(async () => {
  await loadIncident()
})

async function loadIncident() {
  incident.value = await incidentService.getById(route.params.id)
  transitions.value = await incidentService.getTransitions(route.params.id)

  const intervResponse = await interventionService.getAll(route.params.id)
  interventions.value = intervResponse.data || intervResponse

  const msgResponse = await messageService.getAll(route.params.id)
  messages.value = msgResponse.data || msgResponse
}

async function updateStatus(status, label) {
  const result = await Swal.fire({
    title: 'Changer le statut ?',
    text: `Passer au statut "${label}" ?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui',
    cancelButtonText: 'Annuler'
  })
  if (result.isConfirmed) {
    try {
      await incidentService.updateStatus(route.params.id, status)
      Swal.fire({ icon: 'success', title: 'Statut mis à jour', timer: 1500, showConfirmButton: false })
      loadIncident()
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: error.response?.data?.message || 'Une erreur est survenue' })
    }
  }
}

async function handleAddIntervention(formData) {
  interventionLoading.value = true
  try {
    await interventionService.create(route.params.id, formData)
    Swal.fire({ icon: 'success', title: 'Intervention ajoutée', timer: 1500, showConfirmButton: false })
    showInterventionForm.value = false
    const response = await interventionService.getAll(route.params.id)
    interventions.value = response.data || response
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Erreur', text: error.response?.data?.message || 'Une erreur est survenue' })
  } finally {
    interventionLoading.value = false
  }
}

function handleFileSelect(event) {
  selectedFile.value = event.target.files[0] || null
}

function isImage(fileName) {
  return /\.(jpe?g|png|gif|webp|svg)$/i.test(fileName || '')
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
</script>