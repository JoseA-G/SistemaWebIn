

$(document).ready(function () {


    jQuery.ajax({
        url: $.MisUrls.url.UrlGetRoles,
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            if (data != null) {

                $.each(data.data, function (i, item) {
                    if (item.Activo) {
                        $("<option>").attr({ "value": item.IdRol }).text(item.Descripcion).appendTo("#cboRol");

                    }
                })
            }
            
        },
        error: function (error) {
            console.log(error)
        },
        beforeSend: function () {

        },
    });
})


function btnBuscar() {

    $("#tbpermiso tbody").html("");
    jQuery.ajax({
        url: $.MisUrls.url.UrlGetRolPermisos + "?IdRol=" + $("#cboRol").val(),
        type: "GET",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            if (data != null) {
                $.each(data, function (i, row) {

                    $("<tr>").append(
                        $("<td>").text(i + 1),
                        $("<td>").append(
                            $("<input>").attr({ "type": "checkbox" }).data("IdPermiso", row.IdPermisos).prop('checked', row.Activo)
                        ),
                        $("<td>").text(row.Menu),
                        $("<td>").text(row.SubMenu)
                    ).appendTo("#tbpermiso tbody");
                    
                })
            }
            
        },
        error: function (error) {
            console.log(error)
        },
        beforeSend: function () {

        },
    });

}


function GuardarCambios() {


    if ($("#tbpermiso tbody tr").length < 1) {
        alert("Primero debe seleccionar un rol y añadir los permisos");
        return;
    }

    var $xml = "<DETALLE>"
    var permiso = "";
    $('input[type="checkbox"]').each(function () {
        var idpermiso = $(this).data("IdPermiso").toString();
        var activo = $(this).prop("checked") == true ? "1" : "0";


        permiso = permiso + "<PERMISO><IdPermisos>" + idpermiso + "</IdPermisos><Activo>" + activo + "</Activo></PERMISO>";

    });
    $xml = $xml + permiso;
    $xml = $xml + "</DETALLE>"

    var request = { xml: $xml };


    jQuery.ajax({
        url: $.MisUrls.url.UrlPostGuardarCambios,
        type: "POST",
        data: JSON.stringify(request),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        
        success: function (data) {
            if (data.resultado) {
                // Muestra un mensaje de éxito
                swal("Mensaje", "Se guardaron los permisos", "success").then(function() {
                    // Una vez que el usuario haya cerrado la alerta, se cierra sesión y redirige
                   
                    
                });
                
                    
                    // Una vez que el usuario haya cerrado la alerta (con el botón de OK), se cierra sesión y redirige
                   
                
            } else {
                swal("Mensaje", "No se pudo registrar los permisos", "warning");
            }

            
        },

       
        // Mostrar un loading durante el cierre de sesión
            
        error: function (error) {
            console.log(error);
            swal("Mensaje", "Error al intentar guardar los permisos", "warning");
        }
    });
    //beforeSend: function () {
    //    DesloguearYRedirigir();
    //}
    setTimeout(function () {
        DesloguearYRedirigir();
    }, 2000); // 2000 milisegundos =  segundos
  
           


    function DesloguearYRedirigir() {
        // Realizar llamada AJAX para cerrar sesión en el servidor
        jQuery.ajax({
            url: $.MisUrls.url.UrlPostGuardarCambios,  // Ajusta esta URL a la ruta correcta de tu servidor para cerrar sesión
            type: "POST",
            data: JSON.stringify(request),
            dataType: "json",
            contentType: "application/json; charset=utf-8",

            success: function (data) {
                // Si la respuesta es exitosa, limpiar sesión local y redirigir a login
                if (data.resultado) {
                    // Limpiar la sesión en el navegador (dependiendo de cómo manejes la sesión)
                    sessionStorage.clear();  // Si estás usando sessionStorage
                    localStorage.clear();    // Si usas localStorage
                    // O si usas cookies, puedes borrar las cookies
                    // document.cookie = "nombre_cookie=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";

                    // Redirigir al login después de cerrar sesión
                    window.location.href = "/Login";  // Ajusta la URL según tu página de login
                } else {
                    // Si no se pudo cerrar sesión correctamente, muestra un mensaje de error
                    swal("Mensaje", "No se pudo cerrar la sesión", "warning");
                }
            },
            error: function (error) {
                console.log(error);
                swal("Mensaje", "Error al intentar cerrar la sesión", "warning");
            }
        });



    }
}
