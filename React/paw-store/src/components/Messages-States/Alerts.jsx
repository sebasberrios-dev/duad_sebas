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
