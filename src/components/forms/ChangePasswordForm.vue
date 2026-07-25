<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
      <input v-model="form.current_password" type="password" class="input-field mt-1" :class="{ 'border-red-500': errors.current_password }" required />
      <p v-if="errors.current_password" class="mt-1 text-sm text-red-600">{{ errors.current_password }}</p>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
      <input v-model="form.new_password" type="password" class="input-field mt-1" :class="{ 'border-red-500': errors.new_password }" required />
      <p v-if="errors.new_password" class="mt-1 text-sm text-red-600">{{ errors.new_password }}</p>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
      <input v-model="form.new_password_confirmation" type="password" class="input-field mt-1" :class="{ 'border-red-500': errors.new_password_confirmation }" required />
      <p v-if="errors.new_password_confirmation" class="mt-1 text-sm text-red-600">{{ errors.new_password_confirmation }}</p>
    </div>
    <div class="flex justify-end space-x-3">
      <button type="button" @click="$emit('cancel')" class="btn-secondary">Annuler</button>
      <button type="submit" class="btn-primary" :disabled="loading">Changer le mot de passe</button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ loading: { type: Boolean, default: false } })
const emit = defineEmits(['submit', 'cancel'])
const errors = ref({})
const form = ref({ current_password: '', new_password: '', new_password_confirmation: '' })

function validateForm() {
  errors.value = {}
  if (!form.value.current_password) errors.value.current_password = 'Requis'
  if (!form.value.new_password) errors.value.new_password = 'Requis'
  else if (form.value.new_password.length < 8) errors.value.new_password = '8 caractères minimum'
  if (form.value.new_password !== form.value.new_password_confirmation) errors.value.new_password_confirmation = 'Les mots de passe ne correspondent pas'
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (validateForm()) emit('submit', { ...form.value })
}
</script>