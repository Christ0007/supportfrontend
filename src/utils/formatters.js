// src/utils/formatters.js
export function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours === 0) return `${remainingMinutes} min`
  if (remainingMinutes === 0) return `${hours}h`
  return `${hours}h ${remainingMinutes}min`
}

export function formatStatus(status) {
  const statuses = {
    declared: 'Déclaré',
    analyzed: 'Analysé',
    taken_over: 'Pris en charge',
    in_progress: 'En traitement',
    resolved: 'Résolu',
    closed: 'Clôturé'
  }
  return statuses[status] || status
}