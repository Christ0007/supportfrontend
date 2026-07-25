import Swal from 'sweetalert2'

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer
    toast.onmouseleave = Swal.resumeTimer
  }
})

export function showSuccess(message) {
  Toast.fire({ icon: 'success', title: message })
}

export function showError(message) {
  Toast.fire({ icon: 'error', title: message })
}
