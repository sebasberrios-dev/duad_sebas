import Swal from 'sweetalert2';

export const showAlertError = (title, text) => {
  return Swal.fire({
    icon: 'error',
    title: title,
    text: text,
    timer: 2000,
  });
};

export const showAlertSuccess = (title, text) => {
  return Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    timer: 2000,
  });
};

export const showAlertConfirm = (title, text) => {
  return Swal.fire({
    icon: 'warning',
    title: title,
    text: text,
    showCancelButton: true,
    confirmButtonColor: '#636ae8ff',
    cancelButtonColor: '#cc0000',
    confirmButtonText: 'Confirmar',
  });
};

export const showAlertLoading = (title) => {
  return Swal.fire({
    title: title,
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });
};

export const closeAlert = () => {
  Swal.close();
};

// --- Auth alerts ---

const ToastMixin = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const showLoginSuccess = (name) => {
  return ToastMixin.fire({
    icon: 'success',
    title: name ? `Bienvenido, ${name}` : 'Sesión iniciada',
  });
};

export const showSessionExpired = () => {
  return Swal.fire({
    icon: 'info',
    title: 'Sesión expirada',
    text: 'Tu sesión ha caducado. Por favor, inicia sesión nuevamente.',
    confirmButtonColor: '#636ae8ff',
    confirmButtonText: 'Ir al login',
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = '/login';
    }
  });
};

export const showLogoutSuccess = () => {
  return Swal.fire({
    icon: 'success',
    title: 'Hasta pronto!',
    text: 'Has cerrado sesión correctamente.',
    timer: 1800,
    showConfirmButton: false,
  });
};
