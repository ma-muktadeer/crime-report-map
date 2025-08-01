import Swal from 'sweetalert2';

export class Toast {
    public static show(msg: string) {
        Swal.fire({
            text: msg,
            showConfirmButton: false,
            background: '#b8d4e4',
            toast: true,
            position: 'bottom',
            timerProgressBar: true,
            timer: 2000
        });
    }
}