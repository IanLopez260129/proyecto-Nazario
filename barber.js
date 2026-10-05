/* ============================================================
   BARBERÍA ISA - JAVASCRIPT
   Este archivo controla:
   - Inicio de sesión
   - Separación Usuario / Administrador
   - Servicios
   - Barberos
   - Reservaciones
   - Citas
   - Calendario
   - Inventario
   - Formularios
   - Menús
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    /* ============================================================
       ELEMENTOS PRINCIPALES
       ============================================================ */

    const login = document.getElementById("login");
    const loginForm = document.getElementById("loginForm");
    const loginCorreo = document.getElementById("loginCorreo");
    const loginPassword = document.getElementById("loginPassword");
    const mensajeLogin = document.getElementById("mensajeLogin");

    const aplicacion = document.getElementById("aplicacion");
    const interfazUsuario = document.getElementById("interfazUsuario");
    const interfazAdmin = document.getElementById("interfazAdmin");

    const cerrarSesion = document.getElementById("cerrarSesion");
    const cerrarSesionAdmin = document.getElementById("cerrarSesionAdmin");

    /* ============================================================
       CREDENCIALES DE DEMOSTRACIÓN
       ============================================================ */

    const USUARIO = {
        correo: "usuario@barberiaisa.com",
        password: "1234"
    };

    const ADMIN = {
        correo: "admin@barberiaisa.com",
        password: "admin123"
    };

    /* ============================================================
       DATOS INICIALES
       ============================================================ */

    let servicios = JSON.parse(
        localStorage.getItem("barberiaServicios")
    ) || [
        {
            id: Date.now(),
            nombre: "Corte tradicional",
            categoria: "Corte",
            precio: 150,
            descripcion: "Corte clásico, moderno y personalizado."
        },
        {
            id: Date.now() + 1,
            nombre: "Corte + barba",
            categoria: "Combo",
            precio: 220,
            descripcion: "Corte de cabello acompañado de arreglo de barba."
        },
        {
            id: Date.now() + 2,
            nombre: "Arreglo de barba",
            categoria: "Barba",
            precio: 100,
            descripcion: "Perfilado y cuidado de barba profesional."
        }
    ];

    let barberos = JSON.parse(
        localStorage.getItem("barberiaBarberos")
    ) || [
        {
            id: Date.now(),
            nombre: "Carlos",
            especialidad: "Cortes clásicos"
        },
        {
            id: Date.now() + 1,
            nombre: "Luis",
            especialidad: "Fade y barba"
        },
        {
            id: Date.now() + 2,
            nombre: "Miguel",
            especialidad: "Cortes modernos"
        }
    ];

    let citas = JSON.parse(
        localStorage.getItem("barberiaCitas")
    ) || [];

    let inventario = JSON.parse(
        localStorage.getItem("barberiaInventario")
    ) || [
        {
            id: Date.now(),
            nombre: "Cera para cabello",
            cantidad: 10
        },
        {
            id: Date.now() + 1,
            nombre: "Shampoo",
            cantidad: 15
        }
    ];

    let usuarioActual = null;

    let servicioSeleccionado = null;
    let precioSeleccionado = 0;
    let barberoSeleccionado = null;

    let fechaCalendario = new Date();

    /* ============================================================
       GUARDAR DATOS
       ============================================================ */

    function guardarDatos() {

        localStorage.setItem(
            "barberiaServicios",
            JSON.stringify(servicios)
        );

        localStorage.setItem(
            "barberiaBarberos",
            JSON.stringify(barberos)
        );

        localStorage.setItem(
            "barberiaCitas",
            JSON.stringify(citas)
        );

        localStorage.setItem(
            "barberiaInventario",
            JSON.stringify(inventario)
        );
    }

    /* ============================================================
       OCULTAR TODAS LAS INTERFACES AL INICIAR
       ============================================================ */

    if (login) {
        login.style.display = "flex";
    }

    if (aplicacion) {
        aplicacion.style.display = "none";
    }

    if (interfazUsuario) {
        interfazUsuario.style.display = "none";
    }

    if (interfazAdmin) {
        interfazAdmin.style.display = "none";
    }

    /* ============================================================
       INICIAR SESIÓN
       ============================================================ */

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const correo = loginCorreo.value.trim().toLowerCase();
            const password = loginPassword.value.trim();

            /* Login de administrador */
            if (
                correo === ADMIN.correo &&
                password === ADMIN.password
            ) {

                usuarioActual = {
                    tipo: "admin",
                    correo: correo
                };

                entrarComoAdmin();

                return;
            }

            /* Login de usuario */
            if (
                correo === USUARIO.correo &&
                password === USUARIO.password
            ) {

                usuarioActual = {
                    tipo: "usuario",
                    correo: correo
                };

                entrarComoUsuario();

                return;
            }

            /* Datos incorrectos */
            if (mensajeLogin) {

                mensajeLogin.textContent =
                    "Correo o contraseña incorrectos.";

                mensajeLogin.style.color = "#c0392b";
            }

        });
    }

    /* ============================================================
       ENTRAR COMO USUARIO
       ============================================================ */

    function entrarComoUsuario() {

        if (login) {
            login.style.display = "none";
        }

        if (aplicacion) {
            aplicacion.style.display = "block";
        }

        if (interfazAdmin) {
            interfazAdmin.style.display = "none";
        }

        if (interfazUsuario) {
            interfazUsuario.style.display = "block";
        }

        mostrarPaginaUsuario("inicio");

        renderizarServicios();

        renderizarBarberos();

        renderizarCitasUsuario();
    }

    /* ============================================================
       ENTRAR COMO ADMINISTRADOR
       ============================================================ */

    function entrarComoAdmin() {

        if (login) {
            login.style.display = "none";
        }

        if (aplicacion) {
            aplicacion.style.display = "block";
        }

        if (interfazUsuario) {
            interfazUsuario.style.display = "none";
        }

        if (interfazAdmin) {
            interfazAdmin.style.display = "block";
        }

        mostrarPaginaAdmin("admin");

        renderizarServiciosAdmin();

        renderizarBarberosAdmin();

        renderizarInventario();

        renderizarCitasAdmin();

        renderizarCalendario();

        actualizarEstadisticas();
    }

    /* ============================================================
       CERRAR SESIÓN USUARIO
       ============================================================ */

    if (cerrarSesion) {

        cerrarSesion.addEventListener("click", function () {

            usuarioActual = null;

            if (aplicacion) {
                aplicacion.style.display = "none";
            }

            if (interfazUsuario) {
                interfazUsuario.style.display = "none";
            }

            if (interfazAdmin) {
                interfazAdmin.style.display = "none";
            }

            if (login) {
                login.style.display = "flex";
            }

            loginForm.reset();

            if (mensajeLogin) {
                mensajeLogin.textContent = "";
            }

        });
    }

    /* ============================================================
       CERRAR SESIÓN ADMIN
       ============================================================ */

    if (cerrarSesionAdmin) {

        cerrarSesionAdmin.addEventListener("click", function () {

            usuarioActual = null;

            if (aplicacion) {
                aplicacion.style.display = "none";
            }

            if (interfazUsuario) {
                interfazUsuario.style.display = "none";
            }

            if (interfazAdmin) {
                interfazAdmin.style.display = "none";
            }

            if (login) {
                login.style.display = "flex";
            }

            loginForm.reset();

            if (mensajeLogin) {
                mensajeLogin.textContent = "";
            }

        });
    }

    /* ============================================================
       NAVEGACIÓN DEL USUARIO
       ============================================================ */

    const botonesUsuario =
        document.querySelectorAll(
            "#interfazUsuario [data-pagina]"
        );

    botonesUsuario.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const pagina = boton.dataset.pagina;

            mostrarPaginaUsuario(pagina);

        });

    });

    /* ============================================================
       NAVEGACIÓN DEL ADMIN
       ============================================================ */

    const botonesAdmin =
        document.querySelectorAll(
            "#interfazAdmin [data-pagina]"
        );

    botonesAdmin.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const pagina = boton.dataset.pagina;

            mostrarPaginaAdmin(pagina);

        });

    });

    /* ============================================================
       MOSTRAR PÁGINA DEL USUARIO
       ============================================================ */

    function mostrarPaginaUsuario(nombrePagina) {

        if (!interfazUsuario) {
            return;
        }

        const paginas =
            interfazUsuario.querySelectorAll(".pagina");

        paginas.forEach(function (pagina) {

            pagina.classList.remove("activa");

        });

        const pagina =
            document.getElementById(nombrePagina);

        if (pagina) {

            pagina.classList.add("activa");

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

    }

    /* ============================================================
       MOSTRAR PÁGINA ADMIN
       ============================================================ */

    function mostrarPaginaAdmin(nombrePagina) {

        if (!interfazAdmin) {
            return;
        }

        const paginas =
            interfazAdmin.querySelectorAll(".pagina");

        paginas.forEach(function (pagina) {

            pagina.classList.remove("activa");

        });

        const pagina =
            document.getElementById(nombrePagina);

        if (pagina) {

            pagina.classList.add("activa");

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

        if (nombrePagina === "adminCitas") {
            renderizarCitasAdmin();
            renderizarCalendario();
        }

        if (nombrePagina === "adminServicios") {
            renderizarServiciosAdmin();
        }

        if (nombrePagina === "adminBarberos") {
            renderizarBarberosAdmin();
        }

        if (nombrePagina === "adminInventario") {
            renderizarInventario();
        }

    }

    /* ============================================================
       SERVICIOS PARA EL USUARIO
       ============================================================ */

    function renderizarServicios() {

        const contenedor =
            document.getElementById("serviciosUsuario");

        if (!contenedor) {
            return;
        }

        contenedor.innerHTML = "";

        servicios.forEach(function (servicio) {

            const tarjeta =
                document.createElement("article");

            tarjeta.className = "servicio-card";

            tarjeta.innerHTML = `
                <div class="servicio-info">

                    <p class="categoria">
                        ${escapeHTML(servicio.categoria)}
                    </p>

                    <h3>
                        ${escapeHTML(servicio.nombre)}
                    </h3>

                    <p>
                        ${escapeHTML(servicio.descripcion)}
                    </p>

                    <div class="servicio-bottom">

                        <strong>
                            $${Number(servicio.precio).toFixed(0)} MXN
                        </strong>

                        <button
                            class="elegir-servicio"
                            type="button"
                            data-id="${servicio.id}">
                            Elegir
                        </button>

                    </div>

                </div>
            `;

            contenedor.appendChild(tarjeta);

        });

        contenedor
            .querySelectorAll(".elegir-servicio")
            .forEach(function (boton) {

                boton.addEventListener("click", function () {

                    const id =
                        Number(boton.dataset.id);

                    seleccionarServicio(id);

                    mostrarPaginaUsuario("reservar");

                });

            });

    }

    /* ============================================================
       SELECCIONAR SERVICIO
       ============================================================ */

    function seleccionarServicio(id) {

        const servicio =
            servicios.find(function (item) {

                return item.id === id;

            });

        if (!servicio) {
            return;
        }

        servicioSeleccionado = servicio.nombre;

        precioSeleccionado = servicio.precio;

        const resumenServicio =
            document.getElementById("resumenServicio");

        const resumenPrecio =
            document.getElementById("resumenPrecio");

        if (resumenServicio) {

            resumenServicio.textContent =
                servicio.nombre;

        }

        if (resumenPrecio) {

            resumenPrecio.textContent =
                Number(servicio.precio).toFixed(0);

        }

    }

    /* ============================================================
       BARBEROS PARA USUARIO
       ============================================================ */

    function renderizarBarberos() {

        const contenedor =
            document.getElementById("barberosUsuario");

        if (!contenedor) {
            return;
        }

        contenedor.innerHTML = "";

        barberos.forEach(function (barbero) {

            const tarjeta =
                document.createElement("article");

            tarjeta.className = "servicio-card";

            tarjeta.innerHTML = `
                <div class="servicio-info">

                    <p class="categoria">
                        BARBERO
                    </p>

                    <h3>
                        ${escapeHTML(barbero.nombre)}
                    </h3>

                    <p>
                        ${escapeHTML(barbero.especialidad)}
                    </p>

                    <div class="servicio-bottom">

                        <button
                            type="button"
                            class="elegir-barbero"
                            data-id="${barbero.id}">
                            Elegir
                        </button>

                    </div>

                </div>
            `;

            contenedor.appendChild(tarjeta);

        });

        contenedor
            .querySelectorAll(".elegir-barbero")
            .forEach(function (boton) {

                boton.addEventListener("click", function () {

                    const id =
                        Number(boton.dataset.id);

                    seleccionarBarbero(id);

                    mostrarPaginaUsuario("reservar");

                });

            });

    }

    /* ============================================================
       SELECCIONAR BARBERO
       ============================================================ */

    function seleccionarBarbero(id) {

        const barbero =
            barberos.find(function (item) {

                return item.id === id;

            });

        if (!barbero) {
            return;
        }

        barberoSeleccionado =
            barbero.nombre;

        const resumen =
            document.getElementById("resumenBarbero");

        if (resumen) {

            resumen.textContent =
                barbero.nombre;

        }

    }

    /* ============================================================
       RESERVAR CITA
       ============================================================ */

    const reservaForm =
        document.getElementById("reservaForm");

    if (reservaForm) {

        reservaForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const fecha =
                    document.getElementById("fechaCita");

                const hora =
                    document.getElementById("horaCita");

                if (!servicioSeleccionado) {

                    alert(
                        "Primero selecciona un servicio."
                    );

                    return;
                }

                if (!barberoSeleccionado) {

                    alert(
                        "Primero selecciona un barbero."
                    );

                    return;
                }

                if (!fecha.value || !hora.value) {

                    alert(
                        "Selecciona fecha y hora."
                    );

                    return;
                }

                /* Evitar citas repetidas del mismo barbero */
                const ocupada =
                    citas.some(function (cita) {

                        return (
                            cita.fecha === fecha.value &&
                            cita.hora === hora.value &&
                            cita.barbero === barberoSeleccionado
                        );

                    });

                if (ocupada) {

                    alert(
                        "Ese barbero ya tiene una cita en ese horario."
                    );

                    return;
                }

                const nuevaCita = {

                    id: Date.now(),

                    usuario:
                        usuarioActual
                            ? usuarioActual.correo
                            : USUARIO.correo,

                    servicio:
                        servicioSeleccionado,

                    precio:
                        precioSeleccionado,

                    barbero:
                        barberoSeleccionado,

                    fecha:
                        fecha.value,

                    hora:
                        hora.value,

                    estado:
                        "Pendiente"

                };

                citas.push(nuevaCita);

                guardarDatos();

                alert(
                    "Cita reservada correctamente."
                );

                reservaForm.reset();

                servicioSeleccionado = null;
                precioSeleccionado = 0;
                barberoSeleccionado = null;

                const resumenServicio =
                    document.getElementById("resumenServicio");

                const resumenPrecio =
                    document.getElementById("resumenPrecio");

                const resumenBarbero =
                    document.getElementById("resumenBarbero");

                if (resumenServicio) {
                    resumenServicio.textContent =
                        "No seleccionado";
                }

                if (resumenPrecio) {
                    resumenPrecio.textContent =
                        "0";
                }

                if (resumenBarbero) {
                    resumenBarbero.textContent =
                        "No seleccionado";
                }

                renderizarCitasUsuario();

            }
        );

    }

    /* ============================================================
       MIS CITAS DEL USUARIO
       ============================================================ */

    function renderizarCitasUsuario() {

        const contenedor =
            document.getElementById("listaCitasUsuario");

        if (!contenedor) {
            return;
        }

        contenedor.innerHTML = "";

        const correo =
            usuarioActual
                ? usuarioActual.correo
                : USUARIO.correo;

        const misCitas =
            citas.filter(function (cita) {

                return cita.usuario === correo;

            });

        if (misCitas.length === 0) {

            contenedor.innerHTML = `
                <div class="admin-card">
                    <h3>No tienes citas registradas.</h3>
                    <p>
                        Cuando reserves una cita aparecerá aquí.
                    </p>
                </div>
            `;

            return;
        }

        misCitas.forEach(function (cita) {

            const tarjeta =
                document.createElement("div");

            tarjeta.className = "admin-card";

            tarjeta.innerHTML = `
                <h3>
                    ${escapeHTML(cita.servicio)}
                </h3>

                <p>
                    <strong>Barbero:</strong>
                    ${escapeHTML(cita.barbero)}
                </p>

                <p>
                    <strong>Fecha:</strong>
                    ${escapeHTML(cita.fecha)}
                </p>

                <p>
                    <strong>Hora:</strong>
                    ${escapeHTML(cita.hora)}
                </p>

                <p>
                    <strong>Precio:</strong>
                    $${Number(cita.precio).toFixed(0)} MXN
                </p>

                <p>
                    <strong>Estado:</strong>
                    ${escapeHTML(cita.estado)}
                </p>
            `;

            contenedor.appendChild(tarjeta);

        });

    }

    /* ============================================================
       ADMIN - AGREGAR SERVICIO
       ============================================================ */

    const agregarServicio =
        document.getElementById("agregarServicio");

    if (agregarServicio) {

        agregarServicio.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const nombre =
                    document.getElementById(
                        "nombreServicio"
                    ).value.trim();

                const categoria =
                    document.getElementById(
                        "categoriaServicio"
                    ).value.trim();

                const precio =
                    Number(
                        document.getElementById(
                            "precioServicio"
                        ).value
                    );

                const descripcion =
                    document.getElementById(
                        "descripcionServicio"
                    ).value.trim();

                if (
                    !nombre ||
                    !categoria ||
                    !precio ||
                    !descripcion
                ) {

                    alert(
                        "Completa todos los campos."
                    );

                    return;
                }

                servicios.push({

                    id: Date.now(),

                    nombre: nombre,

                    categoria: categoria,

                    precio: precio,

                    descripcion: descripcion

                });

                guardarDatos();

                agregarServicio.reset();

                renderizarServiciosAdmin();

                renderizarServicios();

                actualizarEstadisticas();

                alert(
                    "Servicio agregado correctamente."
                );

            }
        );

    }

    /* ============================================================
       ADMIN - MOSTRAR SERVICIOS
       ============================================================ */

    function renderizarServiciosAdmin() {

        const contenedor =
            document.getElementById(
                "listaServiciosAdmin"
            );

        if (!contenedor) {
            return;
        }

        contenedor.innerHTML = "";

        servicios.forEach(function (servicio) {

            const tarjeta =
                document.createElement("div");

            tarjeta.className = "admin-card";

            tarjeta.innerHTML = `
                <h3>
                    ${escapeHTML(servicio.nombre)}
                </h3>

                <p>
                    ${escapeHTML(servicio.descripcion)}
                </p>

                <p>
                    Categoría:
                    ${escapeHTML(servicio.categoria)}
                </p>

                <p>
                    Precio actual:
                    $${Number(servicio.precio).toFixed(0)} MXN
                </p>

                <div class="admin-actions">

                    <input
                        type="number"
                        min="0"
                        value="${servicio.precio}"
                        id="precio-${servicio.id}">

                    <button
                        type="button"
                        class="admin-action guardar-precio"
                        data-id="${servicio.id}">
                        Cambiar precio
                    </button>

                    <button
                        type="button"
                        class="admin-action eliminar-servicio"
                        data-id="${servicio.id}">
                        Eliminar
                    </button>

                </div>
            `;

            contenedor.appendChild(tarjeta);

        });

        contenedor
            .querySelectorAll(".guardar-precio")
            .forEach(function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        const id =
                            Number(boton.dataset.id);

                        const input =
                            document.getElementById(
                                "precio-" + id
                            );

                        const nuevoPrecio =
                            Number(input.value);

                        if (
                            isNaN(nuevoPrecio) ||
                            nuevoPrecio < 0
                        ) {

                            alert(
                                "Introduce un precio válido."
                            );

                            return;
                        }

                        const servicio =
                            servicios.find(function (item) {

                                return item.id === id;

                            });

                        if (servicio) {

                            servicio.precio =
                                nuevoPrecio;

                            guardarDatos();

                            renderizarServiciosAdmin();

                            renderizarServicios();

                            actualizarEstadisticas();

                            alert(
                                "Precio actualizado."
                            );

                        }

                    }
                );

            });

        contenedor
            .querySelectorAll(".eliminar-servicio")
            .forEach(function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        const id =
                            Number(boton.dataset.id);

                        const confirmar =
                            confirm(
                                "¿Deseas eliminar este servicio?"
                            );

                        if (!confirmar) {
                            return;
                        }

                        servicios =
                            servicios.filter(
                                function (servicio) {

                                    return servicio.id !== id;

                                }
                            );

                        guardarDatos();

                        renderizarServiciosAdmin();

                        renderizarServicios();

                        actualizarEstadisticas();

                    }
                );

            });

    }

    /* ============================================================
       ADMIN - AGREGAR BARBERO
       ============================================================ */

    const agregarBarbero =
        document.getElementById("agregarBarbero");

    if (agregarBarbero) {

        agregarBarbero.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const nombre =
                    document.getElementById(
                        "nombreBarbero"
                    ).value.trim();

                const especialidad =
                    document.getElementById(
                        "especialidadBarbero"
                    ).value.trim();

                if (!nombre || !especialidad) {

                    alert(
                        "Completa todos los campos."
                    );

                    return;
                }

                barberos.push({

                    id: Date.now(),

                    nombre: nombre,

                    especialidad: especialidad

                });

                guardarDatos();

                agregarBarbero.reset();

                renderizarBarberosAdmin();

                renderizarBarberos();

                actualizarEstadisticas();

                alert(
                    "Barbero agregado correctamente."
                );

            }
        );

    }

    /* ============================================================
       ADMIN - MOSTRAR BARBEROS
       ============================================================ */

    function renderizarBarberosAdmin() {

        const contenedor =
            document.getElementById(
                "listaBarberosAdmin"
            );

        if (!contenedor) {
            return;
        }

        contenedor.innerHTML = "";

        barberos.forEach(function (barbero) {

            const tarjeta =
                document.createElement("div");

            tarjeta.className = "admin-card";

            tarjeta.innerHTML = `
                <h3>
                    ${escapeHTML(barbero.nombre)}
                </h3>

                <p>
                    Especialidad:
                    ${escapeHTML(barbero.especialidad)}
                </p>

                <button
                    type="button"
                    class="admin-action eliminar-barbero"
                    data-id="${barbero.id}">
                    Eliminar
                </button>
            `;

            contenedor.appendChild(tarjeta);

        });

        contenedor
            .querySelectorAll(".eliminar-barbero")
            .forEach(function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        const id =
                            Number(boton.dataset.id);

                        const confirmar =
                            confirm(
                                "¿Deseas eliminar este barbero?"
                            );

                        if (!confirmar) {
                            return;
                        }

                        barberos =
                            barberos.filter(
                                function (barbero) {

                                    return barbero.id !== id;

                                }
                            );

                        guardarDatos();

                        renderizarBarberosAdmin();

                        renderizarBarberos();

                        actualizarEstadisticas();

                    }
                );

            });

    }

    /* ============================================================
       ADMIN - INVENTARIO
       ============================================================ */

    const agregarProducto =
        document.getElementById("agregarProducto");

    if (agregarProducto) {

        agregarProducto.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const nombre =
                    document.getElementById(
                        "nombreProducto"
                    ).value.trim();

                const cantidad =
                    Number(
                        document.getElementById(
                            "cantidadProducto"
                        ).value
                    );

                if (
                    !nombre ||
                    isNaN(cantidad) ||
                    cantidad < 1
                ) {

                    alert(
                        "Introduce datos válidos."
                    );

                    return;
                }

                inventario.push({

                    id: Date.now(),

                    nombre: nombre,

                    cantidad: cantidad

                });

                guardarDatos();

                agregarProducto.reset();

                renderizarInventario();

                actualizarEstadisticas();

                alert(
                    "Producto agregado correctamente."
                );

            }
        );

    }

    /* ============================================================
       ADMIN - MOSTRAR INVENTARIO
       ============================================================ */

    function renderizarInventario() {

        const contenedor =
            document.getElementById("inventario");

        if (!contenedor) {
            return;
        }

        contenedor.innerHTML = "";

        inventario.forEach(function (producto) {

            const tarjeta =
                document.createElement("div");

            tarjeta.className = "admin-card";

            tarjeta.innerHTML = `
                <h3>
                    ${escapeHTML(producto.nombre)}
                </h3>

                <p>
                    Cantidad:
                    ${producto.cantidad}
                </p>

                <button
                    type="button"
                    class="admin-action eliminar-producto"
                    data-id="${producto.id}">
                    Eliminar
                </button>
            `;

            contenedor.appendChild(tarjeta);

        });

        contenedor
            .querySelectorAll(".eliminar-producto")
            .forEach(function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        const id =
                            Number(boton.dataset.id);

                        inventario =
                            inventario.filter(
                                function (producto) {

                                    return producto.id !== id;

                                }
                            );

                        guardarDatos();

                        renderizarInventario();

                        actualizarEstadisticas();

                    }
                );

            });

    }

    /* ============================================================
       ADMIN - MOSTRAR CITAS
       ============================================================ */

    function renderizarCitasAdmin() {

        const contenedor =
            document.getElementById("tablaCitas");

        if (!contenedor) {
            return;
        }

        if (citas.length === 0) {

            contenedor.innerHTML = `
                <div class="admin-card">
                    <p>No hay citas registradas.</p>
                </div>
            `;

            return;
        }

        let html = `
            <div class="tabla-contenedor">

                <table>

                    <thead>

                        <tr>

                            <th>Usuario</th>
                            <th>Servicio</th>
                            <th>Barbero</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Precio</th>
                            <th>Estado</th>
                            <th>Acción</th>

                        </tr>

                    </thead>

                    <tbody>
        `;

        citas.forEach(function (cita) {

            html += `
                <tr>

                    <td>
                        ${escapeHTML(cita.usuario)}
                    </td>

                    <td>
                        ${escapeHTML(cita.servicio)}
                    </td>

                    <td>
                        ${escapeHTML(cita.barbero)}
                    </td>

                    <td>
                        ${escapeHTML(cita.fecha)}
                    </td>

                    <td>
                        ${escapeHTML(cita.hora)}
                    </td>

                    <td>
                        $${Number(cita.precio).toFixed(0)}
                    </td>

                    <td>
                        ${escapeHTML(cita.estado)}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="admin-action cancelar-cita"
                            data-id="${cita.id}">
                            Cancelar
                        </button>

                    </td>

                </tr>
            `;

        });

        html += `
                    </tbody>

                </table>

            </div>
        `;

        contenedor.innerHTML = html;

        contenedor
            .querySelectorAll(".cancelar-cita")
            .forEach(function (boton) {

                boton.addEventListener(
                    "click",
                    function () {

                        const id =
                            Number(boton.dataset.id);

                        const confirmar =
                            confirm(
                                "¿Deseas cancelar esta cita?"
                            );

                        if (!confirmar) {
                            return;
                        }

                        citas =
                            citas.filter(
                                function (cita) {

                                    return cita.id !== id;

                                }
                            );

                        guardarDatos();

                        renderizarCitasAdmin();

                        renderizarCalendario();

                        actualizarEstadisticas();

                    }
                );

            });

    }

    /* ============================================================
       CALENDARIO ADMIN
       ============================================================ */

    function renderizarCalendario() {

        const calendario =
            document.getElementById(
                "calendarioAdmin"
            );

        const titulo =
            document.getElementById(
                "tituloCalendario"
            );

        if (!calendario) {
            return;
        }

        const año =
            fechaCalendario.getFullYear();

        const mes =
            fechaCalendario.getMonth();

        const nombresMeses = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
        ];

        if (titulo) {

            titulo.textContent =
                nombresMeses[mes] +
                " " +
                año;

        }

        const primerDia =
            new Date(
                año,
                mes,
                1
            ).getDay();

        const diasMes =
            new Date(
                año,
                mes + 1,
                0
            ).getDate();

        calendario.innerHTML = "";

        const nombresDias = [
            "Dom",
            "Lun",
            "Mar",
            "Mié",
            "Jue",
            "Vie",
            "Sáb"
        ];

        nombresDias.forEach(function (dia) {

            const encabezado =
                document.createElement("div");

            encabezado.className =
                "dia-calendario encabezado";

            encabezado.textContent = dia;

            calendario.appendChild(
                encabezado
            );

        });

        for (
            let i = 0;
            i < primerDia;
            i++
        ) {

            const vacio =
                document.createElement("div");

            vacio.className =
                "dia-calendario vacio";

            calendario.appendChild(vacio);

        }

        for (
            let dia = 1;
            dia <= diasMes;
            dia++
        ) {

            const celda =
                document.createElement("div");

            celda.className =
                "dia-calendario";

            celda.innerHTML = `
                <strong>${dia}</strong>
            `;

            const mesNumero =
                String(mes + 1).padStart(
                    2,
                    "0"
                );

            const diaNumero =
                String(dia).padStart(
                    2,
                    "0"
                );

            const fecha =
                `${año}-${mesNumero}-${diaNumero}`;

            const citasDelDia =
                citas.filter(
                    function (cita) {

                        return cita.fecha === fecha;

                    }
                );

            if (citasDelDia.length > 0) {

                celda.classList.add(
                    "tiene-citas"
                );

                const cantidad =
                    document.createElement("span");

                cantidad.textContent =
                    citasDelDia.length +
                    " cita(s)";

                celda.appendChild(
                    cantidad
                );

            }

            calendario.appendChild(celda);

        }

    }

    /* ============================================================
       CAMBIAR MES DEL CALENDARIO
       ============================================================ */

    const mesAnterior =
        document.getElementById("mesAnterior");

    const mesSiguiente =
        document.getElementById("mesSiguiente");

    if (mesAnterior) {

        mesAnterior.addEventListener(
            "click",
            function () {

                fechaCalendario.setMonth(
                    fechaCalendario.getMonth() - 1
                );

                renderizarCalendario();

            }
        );

    }

    if (mesSiguiente) {

        mesSiguiente.addEventListener(
            "click",
            function () {

                fechaCalendario.setMonth(
                    fechaCalendario.getMonth() + 1
                );

                renderizarCalendario();

            }
        );

    }

    /* ============================================================
       ESTADÍSTICAS DEL ADMIN
       ============================================================ */

    function actualizarEstadisticas() {

        const totalCitas =
            document.getElementById("totalCitas");

        const totalBarberos =
            document.getElementById("totalBarberos");

        const totalProductos =
            document.getElementById("totalProductos");

        const totalServicios =
            document.getElementById("totalServicios");

        if (totalCitas) {
            totalCitas.textContent =
                citas.length;
        }

        if (totalBarberos) {
            totalBarberos.textContent =
                barberos.length;
        }

        if (totalProductos) {
            totalProductos.textContent =
                inventario.length;
        }

        if (totalServicios) {
            totalServicios.textContent =
                servicios.length;
        }

    }

    /* ============================================================
       FORMULARIO DE CONTACTO
       ============================================================ */

    const contactoForm =
        document.getElementById("contactoForm");

    if (contactoForm) {

        contactoForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                alert(
                    "Mensaje enviado correctamente."
                );

                contactoForm.reset();

            }
        );

    }

    /* ============================================================
       BOTÓN DE MENÚ MÓVIL
       ============================================================ */

    const menuToggle =
        document.getElementById("menuToggle");

    const menu =
        document.getElementById("menu");

    if (menuToggle && menu) {

        menuToggle.addEventListener(
            "click",
            function () {

                menu.classList.toggle(
                    "menu-abierto"
                );

            }
        );

    }

    /* ============================================================
       FECHA MÍNIMA PARA RESERVAR
       ============================================================ */

    const fechaCita =
        document.getElementById("fechaCita");

    if (fechaCita) {

        const hoy =
            new Date();

        const año =
            hoy.getFullYear();

        const mes =
            String(
                hoy.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                hoy.getDate()
            ).padStart(2, "0");

        fechaCita.min =
            `${año}-${mes}-${dia}`;

    }

    /* ============================================================
       FUNCIÓN DE SEGURIDAD PARA TEXTO
       Evita insertar HTML no deseado desde formularios.
       ============================================================ */

    function escapeHTML(texto) {

        return String(texto)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }

    /* ============================================================
       INICIALIZAR DATOS
       ============================================================ */

    guardarDatos();

    renderizarServicios();
    renderizarBarberos();
    renderizarServiciosAdmin();
    renderizarBarberosAdmin();
    renderizarInventario();
    renderizarCitasAdmin();
    renderizarCalendario();
    actualizarEstadisticas();

});