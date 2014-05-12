/**
 * Nombre:          notificationFactory
 * Descripcion:     Esta factory permite mostrar notificaciones simplemente llamando a los
 * 					métodos que retorna. Simplemente es inyectarlo en el componente y ya está.
 *					Incluye un json de configuración.
 */

app.factory('notificationFactory', function() {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-bottom-right",
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    return {
        success: function(text) {
            toastr.success(text);
        },
        error: function(text) {
            toastr.error(text, "Error");
        }
    };
});