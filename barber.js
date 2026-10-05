/* =========================================================
   VARIABLES PRINCIPALES
   ========================================================= */

/* Guarda el tipo de usuario que inició sesión */
let sesionActual = null;

/* Guarda el servicio seleccionado */
let servicioSeleccionado = "";

/* Guarda el precio del servicio */
let precioSeleccionado = 0;

/* Guarda el barbero seleccionado */
let barberoSeleccionado = "";

/* Guarda las citas realizadas */
let citas = [];

/* Guarda los productos del inventario */
let inventario = [
    {
        nombre: "Cera para cabello",
        cantidad: 12,
        precio: 180
    },
    {
        nombre: "Shampoo profesional",
        cantidad: 8,
        precio: 250
    },
    {
        nombre: "Aceite para barba",
        cantidad: 15,
        precio: 220
    }
];

/* Guarda los barberos disponibles */
let barberos = [
    "Carlos",
    "Luis",
    "Diego"
];


/* =========================================================
   CUANDO CARGA LA PÁGINA
   ========================================================= */

/* Espera hasta que todo el HTML haya sido cargado */
document.addEventListener("DOMContentLoaded", function () {

    /* Conecta el formulario de login con su función */
    document
        .getElementById("loginForm")
        .addEventListener("submit", iniciarSesion);

    /* Conecta el botón de cerrar sesión */
    document
        .getElementById("cerrarSesion")
        .addEventListener("click", cerrarSesion);

    /* Conecta todos los botones del menú */
    document
        .querySelectorAll(".nav-btn[data-pagina]")
        .forEach(function (boton) {

            /* Cuando se pulsa un botón se cambia de sección */
            boton.addEventListener("click", function () {

                mostrarPagina(
                    boton.dataset.pagina,
                    boton
                );

            });

        });


    /* Conecta los botones principales que cambian de sección */
    document
        .querySelectorAll("[data-pagina]")
        .forEach(function (boton) {

            /* Evita conectar dos veces los botones del menú */
            if (!boton.classList.contains("nav-btn")) {

                boton.addEventListener("click", function () {

                    mostrarPagina(
                        boton.dataset.pagina
                    );

                });

            }

        });


    /* Conecta los botones de servicios */
    document
        .querySelectorAll(".elegir-servicio")
        .forEach(function (boton) {

            /* Obtiene el nombre y precio guardados en HTML */
            boton.addEventListener("click", function () {

                seleccionarServicio(
                    boton.dataset.servicio,
                    Number(boton.dataset.precio)
                );

            });

        });


    /* Conecta el formulario de reserva */
    document
        .getElementById("reservaForm")
        .addEventListener(
            "submit",
            crearCita
        );


    /* Conecta el formulario de contacto */
    document
        .getElementById("contactoForm")
        .addEventListener(
            "submit",
            enviarMensaje
        );


    /* Conecta el menú de celular */
    document
        .getElementById("menuToggle")
        .addEventListener(
            "click",
            alternarMenu
        );


    /* Conecta el botón para agregar productos */
    document
        .getElementById("agregarProducto")
        .addEventListener(
            "click",
            agregarProducto
        );


    /* Conecta el botón para agregar barberos */
    document
        .getElementById("agregarBarbero")
        .addEventListener(
            "click",
            agregarBarbero
        );


    /* Prepara la fecha mínima para reservar */
    establecerFechaMinima();

});


/* =========================================================
   INICIAR SESIÓN
   ========================================================= */

/* Comprueba los datos introducidos por el usuario */
function iniciarSesion(event) {

    /* Evita que el formulario recargue la página */
    event.preventDefault();

    /* Obtiene el correo escrito */
    const correo =
        document
            .getElementById("loginCorreo")
            .value
            .trim();

    /* Obtiene la contraseña escrita */
    const password =
        document
            .getElementById("loginPassword")
            .value;

    /* Obtiene el lugar donde aparecerán los errores */
    const mensaje =
        document.getElementById("mensajeLogin");


    /* Comprueba las credenciales del administrador */
    if (
        correo === "admin@barberiaisa.com" &&
        password === "admin123"
    ) {

        /* Guarda que la sesión pertenece al administrador */
        sesionActual = "admin";

        /* Oculta el login */
        document
            .getElementById("login")
            .style.display = "none";

        /* Muestra toda la aplicación */
        document
            .getElementById("aplicacion")
            .style.display = "block";

        /* Carga los datos del administrador */
        actualizarAdministrador();

        /* Muestra el panel administrativo */
        mostrarPagina("admin");

        /* Limpia el formulario */
        document
            .getElementById("loginForm")
            .reset();

        /* Termina la función */
        return;
    }


    /* Comprueba las credenciales del usuario */
    if (
        correo === "usuario@barberiaisa.com" &&
        password === "1234"
    ) {

        /* Guarda que la sesión pertenece a un usuario */
        sesionActual = "usuario";

        /* Oculta el login */
        document
            .getElementById("login")
            .style.display = "none";

        /* Muestra la aplicación */
        document
            .getElementById("aplicacion")
            .style.display = "block";

        /* Muestra el inicio */
        mostrarPagina("inicio");

        /* Carga los barberos */
        mostrarBarberosUsuario();

        /* Limpia el formulario */
        document
            .getElementById("loginForm")
            .reset();

        /* Termina la función */
        return;
    }


    /* Muestra un mensaje si las credenciales son incorrectas */
    mensaje.textContent =
        "El correo o la contraseña son incorrectos.";

}


/* =========================================================
   CERRAR SESIÓN
   ========================================================= */

/* Cierra la sesión actual */
function cerrarSesion() {

    /* Elimina la sesión */
    sesionActual = null;

    /* Oculta la aplicación */
    document
        .getElementById("aplicacion")
        .style.display = "none";

    /* Muestra nuevamente el login */
    document
        .getElementById("login")
        .style.display = "flex";

    /* Limpia el mensaje de error */
    document
        .getElementById("mensajeLogin")
        .textContent = "";

    /* Limpia los campos */
    document
        .getElementById("loginForm")
        .reset();

}


/* =========================================================
   CAMBIAR DE PÁGINA
   ========================================================= */

/* Cambia entre las diferentes secciones */
function mostrarPagina(pagina, boton) {

    /* Comprueba si se intenta entrar al panel administrativo */
    if (
        pagina === "admin" &&
        sesionActual !== "admin"
    ) {

        /* Bloquea el acceso */
        return;

    }


    /* Oculta todas las secciones */
    document
        .querySelectorAll(".pagina")
        .forEach(function (seccion) {

            seccion.classList.remove("activa");

        });


    /* Busca la sección solicitada */
    const destino =
        document.getElementById(pagina);


    /* Comprueba que exista */
    if (destino) {

        /* Muestra la sección */
        destino.classList.add("activa");

    }


    /* Quita la clase activa de los botones */
    document
        .querySelectorAll(".nav-btn")
        .forEach(function (elemento) {

            elemento.classList.remove("activo");

        });


    /* Marca el botón seleccionado */
    if (boton) {

        boton.classList.add("activo");

    }


    /* Actualiza la pantalla */
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    /* Cierra el menú móvil */
    document
        .getElementById("menu")
        .classList.remove("mostrar");

}


/* =========================================================
   MENÚ PARA CELULAR
   ========================================================= */

/* Abre o cierra el menú */
function alternarMenu() {

    document
        .getElementById("menu")
        .classList.toggle("mostrar");

}


/* =========================================================
   SELECCIONAR SERVICIO
   ========================================================= */

/* Guarda el servicio que eligió el usuario */
function seleccionarServicio(nombre, precio) {

    /* Guarda el nombre */
    servicioSeleccionado = nombre;

    /* Guarda el precio */
    precioSeleccionado = precio;

    /* Actualiza el resumen */
    document
        .getElementById("resumenServicio")
        .textContent = nombre;

    /* Actualiza el precio */
    document
        .getElementById("resumenPrecio")
        .textContent = precio;

    /* Muestra la sección de barberos */
    mostrarPagina("barberos");

}


/* =========================================================
   MOSTRAR BARBEROS
   ========================================================= */

/* Crea las tarjetas de los barberos */
function mostrarBarberosUsuario() {

    /* Busca el contenedor */
    const contenedor =
        document.getElementById(
            "barberosUsuario"
        );


    /* Limpia el contenido */
    contenedor.innerHTML = "";


    /* Recorre todos los barberos */
    barberos.forEach(function (nombre) {

        /* Crea una tarjeta */
        const tarjeta =
            document.createElement("article");

        /* Agrega la clase */
        tarjeta.className =
            "barbero-card";


        /* Crea el contenido */
        tarjeta.innerHTML = `

            <div class="barbero-foto">
                ${nombre}
            </div>

            <h3>${nombre}</h3>

            <p>
                Barbero profesional de Barbería Isa.
            </p>

            <button>
                Elegir barbero
            </button>

        `;


        /* Busca el botón */
        const boton =
            tarjeta.querySelector("button");


        /* Conecta el botón */
        boton.addEventListener(
            "click",
            function () {

                seleccionarBarbero(nombre);

            }
        );


        /* Agrega la tarjeta */
        contenedor.appendChild(tarjeta);

    });

}


/* =========================================================
   SELECCIONAR BARBERO
   ========================================================= */

/* Guarda el barbero elegido */
function seleccionarBarbero(nombre) {

    /* Guarda el nombre */
    barberoSeleccionado = nombre;

    /* Actualiza el resumen */
    document
        .getElementById("resumenBarbero")
        .textContent = nombre;

    /* Muestra la reserva */
    mostrarPagina("reservar");

}


/* =========================================================
   FECHA MÍNIMA
   ========================================================= */

/* Evita seleccionar fechas anteriores a hoy */
function establecerFechaMinima() {

    /* Obtiene el campo de fecha */
    const campo =
        document.getElementById("fechaCita");

    /* Obtiene la fecha actual */
    const hoy =
        new Date();

    /* Convierte la fecha al formato correcto */
    const fecha =
        hoy.toISOString().split("T")[0];

    /* Establece la fecha mínima */
    campo.min = fecha;

}


/* =========================================================
   CREAR CITA
   ========================================================= */

/* Guarda una nueva cita */
function crearCita(event) {

    /* Evita recargar la página */
    event.preventDefault();


    /* Comprueba que exista servicio */
    if (!servicioSeleccionado) {

        alert(
            "Primero selecciona un servicio."
        );

        return;

    }


    /* Comprueba que exista barbero */
    if (!barberoSeleccionado) {

        alert(
            "Primero selecciona un barbero."
        );

        return;

    }


    /* Obtiene la fecha */
    const fecha =
        document
            .getElementById("fechaCita")
            .value;


    /* Obtiene la hora */
    const hora =
        document
            .getElementById("horaCita")
            .value;


    /* Crea el objeto de la cita */
    const nuevaCita = {

        id: Date.now(),

        cliente: "Usuario",

        servicio: servicioSeleccionado,

        precio: precioSeleccionado,

        barbero: barberoSeleccionado,

        fecha: fecha,

        hora: hora,

        estado: "Pendiente"

    };


    /* Agrega la cita al arreglo */
    citas.push(nuevaCita);


    /* Actualiza la lista del usuario */
    actualizarCitasUsuario();


    /* Actualiza la información del administrador */
    actualizarAdministrador();


    /* Limpia el formulario */
    document
        .getElementById("reservaForm")
        .reset();


    /* Muestra las citas */
    mostrarPagina("misCitas");


    /* Reinicia los datos seleccionados */
    servicioSeleccionado = "";

    precioSeleccionado = 0;

    barberoSeleccionado = "";


    /* Muestra confirmación */
    alert(
        "La cita fue registrada correctamente."
    );

}


/* =========================================================
   MOSTRAR CITAS DEL USUARIO
   ========================================================= */

/* Actualiza las citas que ve el cliente */
function actualizarCitasUsuario() {

    /* Busca el contenedor */
    const contenedor =
        document.getElementById(
            "listaCitasUsuario"
        );


    /* Comprueba si no hay citas */
    if (citas.length === 0) {

        contenedor.innerHTML = `
            <div class="cita-card">
                <div>
                    <h3>
                        No tienes citas registradas.
                    </h3>
                    <p>
                        Puedes reservar una desde Servicios.
                    </p>
                </div>
            </div>
        `;

        return;
    }


    /* Genera todas las citas */
    contenedor.innerHTML =
        citas.map(function (cita) {

            return `

                <div class="cita-card">

                    <div>

                        <h3>
                            ${cita.servicio}
                        </h3>

                        <p>
                            Fecha: ${cita.fecha}
                        </p>

                        <p>
                            Hora: ${cita.hora}
                        </p>

                        <p>
                            Barbero: ${cita.barbero}
                        </p>

                        <strong>
                            $${cita.precio} MXN
                        </strong>

                    </div>

                    <span class="estado">
                        ${cita.estado}
                    </span>

                </div>

            `;

        }).join("");

}


/* =========================================================
   ADMINISTRADOR
   ========================================================= */

/* Actualiza todo el panel */
function actualizarAdministrador() {

    /* Actualiza el número de citas */
    document
        .getElementById("totalCitas")
        .textContent = citas.length;


    /* Actualiza el número de barberos */
    document
        .getElementById("totalBarberos")
        .textContent = barberos.length;


    /* Actualiza productos */
    document
        .getElementById("totalProductos")
        .textContent = inventario.length;


    /* Actualiza la tabla */
    mostrarTablaCitas();


    /* Actualiza inventario */
    mostrarInventario();


    /* Actualiza barberos */
    mostrarBarberosAdmin();

}


/* =========================================================
   TABLA DE CITAS
   ========================================================= */

/* Crea la tabla de citas para el administrador */
function mostrarTablaCitas() {

    /* Busca el contenedor */
    const contenedor =
        document.getElementById(
            "tablaCitas"
        );


    /* Comprueba si no existen citas */
    if (citas.length === 0) {

        contenedor.innerHTML =
            "<p>No hay citas registradas.</p>";

        return;

    }


    /* Crea el inicio de la tabla */
    let tabla = `

        <table class="admin-table">

            <thead>

                <tr>

                    <th>Cliente</th>
                    <th>Servicio</th>
                    <th>Barbero</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Estado</th>
                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody>

    `;


    /* Recorre las citas */
    citas.forEach(function (cita) {

        /* Agrega una fila */
        tabla += `

            <tr>

                <td>
                    ${cita.cliente}
                </td>

                <td>
                    ${cita.servicio}
                </td>

                <td>
                    ${cita.barbero}
                </td>

                <td>
                    ${cita.fecha}
                </td>

                <td>
                    ${cita.hora}
                </td>

                <td>
                    ${cita.estado}
                </td>

                <td>

                    <button
                        class="admin-action confirmar"
                        onclick="cambiarEstado(${cita.id}, 'Confirmada')">
                        Confirmar
                    </button>

                    <button
                        class="admin-action cancelar"
                        onclick="cambiarEstado(${cita.id}, 'Cancelada')">
                        Cancelar
                    </button>

                </td>

            </tr>

        `;

    });


    /* Termina la tabla */
    tabla += `
            </tbody>
        </table>
    `;


    /* Inserta la tabla */
    contenedor.innerHTML = tabla;

}


/* =========================================================
   CAMBIAR ESTADO DE UNA CITA
   ========================================================= */

/* Modifica el estado de una cita */
function cambiarEstado(id, estado) {

    /* Busca la cita correspondiente */
    const cita =
        citas.find(function (elemento) {

            return elemento.id === id;

        });


    /* Comprueba que exista */
    if (cita) {

        /* Cambia el estado */
        cita.estado = estado;

    }


    /* Actualiza la vista del usuario */
    actualizarCitasUsuario();


    /* Actualiza el administrador */
    actualizarAdministrador();

}


/* =========================================================
   INVENTARIO
   ========================================================= */

/* Muestra los productos */
function mostrarInventario() {

    /* Busca el contenedor */
    const contenedor =
        document.getElementById(
            "inventario"
        );


    /* Crea cada producto */
    contenedor.innerHTML =
        inventario.map(function (producto, index) {

            return `

                <div class="producto">

                    <div>

                        <strong>
                            ${producto.nombre}
                        </strong>

                        <p>
                            Cantidad:
                            ${producto.cantidad}
                        </p>

                    </div>

                    <div>

                        $${producto.precio}

                        <button
                            class="admin-action cancelar"
                            onclick="eliminarProducto(${index})">

                            Eliminar

                        </button>

                    </div>

                </div>

            `;

        }).join("");

}


/* =========================================================
   AGREGAR PRODUCTO
   ========================================================= */

/* Permite al administrador agregar un producto */
function agregarProducto() {

    /* Solicita el nombre */
    const nombre =
        prompt("Nombre del producto:");


    /* Detiene la función si se cancela */
    if (!nombre) {
        return;
    }


    /* Solicita cantidad */
    const cantidad =
        Number(
            prompt("Cantidad disponible:")
        );


    /* Solicita precio */
    const precio =
        Number(
            prompt("Precio:")
        );


    /* Agrega el producto */
    inventario.push({

        nombre: nombre,

        cantidad: cantidad,

        precio: precio

    });


    /* Actualiza el administrador */
    actualizarAdministrador();

}


/* =========================================================
   ELIMINAR PRODUCTO
   ========================================================= */

/* Elimina un producto del inventario */
function eliminarProducto(index) {

    /* Solicita confirmación */
    const confirmar =
        confirm(
            "¿Deseas eliminar este producto?"
        );


    /* Comprueba la respuesta */
    if (confirmar) {

        /* Elimina el producto */
        inventario.splice(index, 1);

        /* Actualiza la pantalla */
        actualizarAdministrador();

    }

}


/* =========================================================
   BARBEROS DEL ADMINISTRADOR
   ========================================================= */

/* Muestra los barberos en administración */
function mostrarBarberosAdmin() {

    /* Busca el contenedor */
    const contenedor =
        document.getElementById(
            "listaBarberosAdmin"
        );


    /* Crea las filas */
    contenedor.innerHTML =
        barberos.map(function (nombre, index) {

            return `

                <div class="producto">

                    <strong>
                        ${nombre}
                    </strong>

                    <button
                        class="admin-action cancelar"
                        onclick="eliminarBarbero(${index})">

                        Eliminar

                    </button>

                </div>

            `;

        }).join("");

}


/* =========================================================
   AGREGAR BARBERO
   ========================================================= */

/* Permite registrar un nuevo barbero */
function agregarBarbero() {

    /* Solicita el nombre */
    const nombre =
        prompt("Nombre del nuevo barbero:");


    /* Comprueba que se haya escrito algo */
    if (!nombre) {
        return;
    }


    /* Agrega el barbero */
    barberos.push(nombre);


    /* Actualiza las vistas */
    mostrarBarberosUsuario();

    actualizarAdministrador();

}


/* =========================================================
   ELIMINAR BARBERO
   ========================================================= */

/* Elimina un barbero */
function eliminarBarbero(index) {

    /* Solicita confirmación */
    const confirmar =
        confirm(
            "¿Deseas eliminar este barbero?"
        );


    /* Comprueba la respuesta */
    if (confirmar) {

        /* Elimina el barbero */
        barberos.splice(index, 1);

        /* Actualiza las vistas */
        mostrarBarberosUsuario();

        actualizarAdministrador();

    }

}


/* =========================================================
   FORMULARIO DE CONTACTO
   ========================================================= */

/* Procesa el formulario de contacto */
function enviarMensaje(event) {

    /* Evita recargar la página */
    event.preventDefault();


    /* Muestra confirmación */
    alert(
        "El mensaje fue enviado correctamente."
    );


    /* Limpia el formulario */
    event.target.reset();

}