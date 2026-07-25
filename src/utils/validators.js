export function required(value, fieldName) {
  return value && value.toString().trim() !== '' ? null : `${fieldName} est requis`
}

export function email(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Email invalide'
}

export function minLength(value, min, fieldName) {
  return value && value.length >= min ? null : `${fieldName} doit contenir au moins ${min} caractères`
}

export function passwordMatch(password, confirmation) {
  return password === confirmation ? null : 'Les mots de passe ne correspondent pas'
}

export function validateForm(rules) {
  const errors = {}
  for (const [field, validators] of Object.entries(rules)) {
    for (const validator of validators) {
      const error = validator()
      if (error) {
        errors[field] = error
        break
      }
    }
  }
  return { isValid: Object.keys(errors).length === 0, errors }
}