<!-- src/components/forms/UserForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700">Nom complet</label>
      <input
        v-model="form.name"
        type="text"
        class="input-field mt-1"
        :class="{ 'border-red-500': errors.name }"
        required
      />
      <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Email</label>
      <input
        v-model="form.email"
        type="email"
        class="input-field mt-1"
        :class="{ 'border-red-500': errors.email }"
        required
      />
      <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
    </div>

    <div v-if="!isEditing">
      <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
      <input
        v-model="form.password"
        type="password"
        class="input-field mt-1"
        :class="{ 'border-red-500': errors.password }"
        required
      />
      <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
    </div>

    <div v-if="!fixedRole">
      <label class="block text-sm font-medium text-gray-700">Rôle</label>
      <select
        v-model="form.role"
        class="input-field mt-1"
        :class="{ 'border-red-500': errors.role }"
        required
        @change="handleRoleChange"
      >
        <option value="">Sélectionner un rôle</option>
        <option value="admin">Administrateur</option>
        <option value="technician">Technicien</option>
        <option value="company">Entreprise cliente</option>
      </select>
      <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role }}</p>
    </div>

    <!-- Champs spécifiques à l'entreprise -->
    <template v-if="form.role === 'company'">
      <div>
        <label class="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
        <input
          v-model="form.company_name"
          type="text"
          class="input-field mt-1"
          :class="{ 'border-red-500': errors.company_name }"
          required
        />
        <p v-if="errors.company_name" class="mt-1 text-sm text-red-600">{{ errors.company_name }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Nom du contact</label>
        <input
          v-model="form.contact_name"
          type="text"
          class="input-field mt-1"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Téléphone</label>
        <input
          v-model="form.phone"
          type="text"
          class="input-field mt-1"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Adresse</label>
        <textarea
          v-model="form.address"
          class="input-field mt-1"
          rows="3"
        ></textarea>
      </div>
    </template>

    <!-- Solutions pour les techniciens et les entreprises clientes -->
    <div v-if="form.role === 'technician' || form.role === 'company'">
      <label class="block text-sm font-medium text-gray-700">
        {{ form.role === 'technician' ? 'Solutions supportées' : 'Solutions souscrites' }}
      </label>
      <div class="mt-2 space-y-2 border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
        <label
          v-for="solution in availableSolutions"
          :key="solution.id"
          class="flex items-center gap-2 text-sm cursor-pointer"
        >
          <input
            type="checkbox"
            :value="solution.id"
            v-model="form.software_solution_ids"
            class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          {{ solution.name }}
        </label>
      </div>
      <p v-if="!availableSolutions.length" class="mt-1 text-sm text-gray-500">Aucune solution disponible</p>
    </div>

    <div class="flex justify-end space-x-3">
      <button type="button" @click="$emit('cancel')" class="btn-secondary">
        Annuler
      </button>
      <button type="submit" class="btn-primary" :disabled="loading">
        <LoadingSpinner v-if="loading" :show="true" class="inline h-4 w-4 mr-2" />
        {{ isEditing ? 'Modifier' : 'Créer' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { solutionService } from '@/services/solutionService'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fixedRole: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  name: '',
  email: '',
  password: '',
  role: props.fixedRole || '',
  company_name: '',
  contact_name: '',
  phone: '',
  address: '',
  software_solution_ids: []
})

const errors = ref({})
const availableSolutions = ref([])

onMounted(async () => {
  try {
    const response = await solutionService.getAll()
    availableSolutions.value = response.data || response
  } catch (error) {
    console.error('Erreur chargement solutions:', error)
  }
  
  if (props.initialData) {
    const data = {
      name: props.initialData.name || '',
      email: props.initialData.email || '',
      role: props.initialData.role || '',
    }
    if (props.initialData.role === 'company') {
      data.company_name = props.initialData.company?.company_name || props.initialData.company_name || ''
      data.contact_name = props.initialData.company?.contact_name || props.initialData.contact_name || ''
      data.phone = props.initialData.company?.phone || props.initialData.phone || ''
      data.address = props.initialData.company?.address || props.initialData.address || ''
      data.software_solution_ids = props.initialData.company?.software_solutions?.map(s => s.id) || props.initialData.software_solution_ids || []
    }
    if (props.initialData.role === 'technician') {
      data.software_solution_ids = props.initialData.supported_solutions?.map(s => s.id) || props.initialData.software_solution_ids || []
    }
    form.value = { ...form.value, ...data }
  }
})

function handleRoleChange() {
  form.value.software_solution_ids = []
}

function validateForm() {
  errors.value = {}
  
  if (!form.value.name.trim()) {
    errors.value.name = 'Le nom est requis'
  }
  
  if (!form.value.email.trim()) {
    errors.value.email = 'L\'email est requis'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Email invalide'
  }
  
  if (!props.isEditing && !form.value.password) {
    errors.value.password = 'Le mot de passe est requis'
  } else if (!props.isEditing && form.value.password && form.value.password.length < 8) {
    errors.value.password = 'Le mot de passe doit contenir au moins 8 caractères'
  }
  
  if (!form.value.role) {
    errors.value.role = 'Le rôle est requis'
  }
  
  if (form.value.role === 'company' && !form.value.company_name.trim()) {
    errors.value.company_name = 'Le nom de l\'entreprise est requis'
  }
  
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (validateForm()) {
    const data = {
      name: form.value.name,
      email: form.value.email,
      role: form.value.role
    }
    if (!props.isEditing || form.value.password) {
      data.password = form.value.password
    }
    if (form.value.role === 'company') {
      data.company_name = form.value.company_name
      data.contact_name = form.value.contact_name
      data.phone = form.value.phone
      data.address = form.value.address
      if (form.value.software_solution_ids.length) data.software_solution_ids = form.value.software_solution_ids
    }
    if (form.value.role === 'technician' && form.value.software_solution_ids.length) {
      data.software_solution_ids = form.value.software_solution_ids
    }
    emit('submit', data)
  }
}
</script>