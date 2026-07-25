// src/utils/constants.js
export const INCIDENT_STATUSES = {
  declared: 'Déclaré',
  analyzed: 'Analysé',
  taken_over: 'Pris en charge',
  in_progress: 'En traitement',
  resolved: 'Résolu',
  closed: 'Clôturé'
}

export const INCIDENT_PRIORITIES = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
  critical: 'Critique'
}

export const INCIDENT_CATEGORIES = [
  'Bug',
  'Performance',
  'Sécurité',
  'Fonctionnalité',
  'Autre'
]

export const USER_ROLES = {
  admin: 'Administrateur',
  technician: 'Technicien',
  company: 'Entreprise cliente'
}