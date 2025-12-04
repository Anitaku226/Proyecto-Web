// =====================================================
//  SISTEMA COMPLETO: HORARIOS + BD + CORREO + ANIMACIÓN
//  (Integrado y sin funciones duplicadas)
// =====================================================


// --- FUNCIONES GENERALES ---
function resetFechasYHorarios() {
    console.log("🔄 Reseteando fechas y horarios...");

    // Ocultar fechas
    const fechaP = document.getElementById("fechaPresencial");
    const fechaV = document.getElementById("fechaVirtual");
    if (fechaP) fechaP.style.display = "none";
    if (fechaV) fechaV.style.display = "none";

    // Limpiar inputs
    const inputP = document.getElementById("inputFechaPresencial");
    const inputV = document.getElementById("inputFechaVirtual");
    if (inputP) inputP.value = "";
    if (inputV) inputV.value = "";

    // Ocultar horarios
    const horariosP = document.getElementById("horariosContainerPresencial");
    const horariosV = document.getElementById("horariosContainerVirtual");
    if (horariosP) horariosP.classList.add("hidden");
    if (horariosV) horariosV.classList.add("hidden");

    // Ocultar datos personales
    const datosP = document.getElementById("datosPersonalesPresencial");
    const datosV = document.getElementById("datosPersonalesVirtual");
    if (datosP) datosP.style.display = "none";
    if (datosV) datosV.style.display = "none";
}



// =====================================================
//      CAMBIO ENTRE FORM PRESENCIAL Y VIRTUAL
// =====================================================

const btnPresencial = document.getElementById("btnPresencial");
const btnVirtual = document.getElementById("btnVirtual");

const formPresencial = document.getElementById("formPresencial");
const formVirtual = document.getElementById("formVirtual");

btnPresencial.addEventListener("click", () => {
    resetFechasYHorarios();
    btnPresencial.classList.add("active");
    btnVirtual.classList.remove("active");
    formPresencial.style.display = "block";
    formVirtual.style.display = "none";
});

btnVirtual.addEventListener("click", () => {
    resetFechasYHorarios();
    btnVirtual.classList.add("active");
    btnPresencial.classList.remove("active");
    formVirtual.style.display = "block";
    formPresencial.style.display = "none";
});



// =====================================================
//      MANEJO DE SELECTS
// =====================================================

const selectPresencial = document.getElementById("selectPresencial");
const selectVirtual = document.getElementById("selectVirtual");

const fechaPresencial = document.getElementById("fechaPresencial");
const fechaVirtual = document.getElementById("fechaVirtual");

const horasPresencial = ["08:00", "10:00", "12:00", "15:00", "17:00"];
const horasVirtual = ["18:00", "19:00", "20:00"];


// --- Mostrar Horarios ---
// ====================================================================
//   MOSTRAR HORARIOS + BLOQUEO DINÁMICO (CONSULTA A BD)
// ====================================================================
async function mostrarHorarios(tipo) {

    let contenedor, lista, inputFecha;

    if (tipo === "Presencial") {
        contenedor = document.getElementById("horariosContainerPresencial");
        lista = document.getElementById("listaHorariosPresencial");
        inputFecha = document.getElementById("inputFechaPresencial");
    } else {
        contenedor = document.getElementById("horariosContainerVirtual");
        lista = document.getElementById("listaHorariosVirtual");
        inputFecha = document.getElementById("inputFechaVirtual");
    }

    const fechaSeleccionada = inputFecha.value.trim();
    if (!fechaSeleccionada) return;

    // Horarios base
    const horarios = tipo === "Presencial" ? horasPresencial : horasVirtual;

    // =====================================================
    // 1. CONSULTAR HORARIOS OCUPADOS EN PHP
    // =====================================================
    const response = await fetch(
        `../php/horarios_ocupados.php?fecha=${fechaSeleccionada}&tipo=${tipo.toLowerCase()}`
    );

    const ocupados = await response.json(); // Ej: ["10:00", "15:00"]

    // =====================================================
    // 2. GENERAR BOTONES
    // =====================================================
    lista.innerHTML = "";

    horarios.forEach(h => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = h;

        const isOcupado = ocupados.includes(h);

if (isOcupado) {
    // 1) atributos accesibilidad / bloqueo
    btn.disabled = true;
    btn.setAttribute('aria-disabled', 'true');
    btn.setAttribute('tabindex', '-1');

    // 2) clase semántica
    btn.classList.add('ocupado');

    // 3) estilo inline FORZADO con !important (atributo style completo)
    //    — usamos setAttribute para poder incluir !important
    btn.setAttribute('style',
        'background: var(--color-gray-300) !important; ' +
        'color: var(--color-gray-500) !important; ' +
        'cursor: not-allowed !important; ' +
        'opacity: 0.6 !important; ' +
        'pointer-events: none !important; ' +
        'transition: none !important; ' +
        'box-shadow: none !important; ' +
        'transform: none !important;'
    );

} else {
    // disponible (igual que antes)
    btn.className =
        "px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200";

    btn.addEventListener("click", () => {
        const datos = document.getElementById(
            tipo === "Presencial"
                ? "datosPersonalesPresencial"
                : "datosPersonalesVirtual"
        );

        if (datos) datos.style.display = "block";

        const resumenHora = document.getElementById(
            tipo === "Presencial"
                ? "resumenHoraPresencial"
                : "resumenHoraVirtual"
        );

        if (resumenHora) resumenHora.textContent = h;

        const hiddenInput = document.getElementById(
            tipo === "Presencial"
                ? "horaSeleccionadaPresencial"
                : "horaSeleccionadaVirtual"
        );

        if (hiddenInput) hiddenInput.value = h;

        // Quitar "active" de todos
        lista.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
}


        lista.appendChild(btn);
    });

    contenedor.classList.remove("hidden");
}


// --- Eventos select ---
selectPresencial.addEventListener("change", () => {
    resetFechasYHorarios();

    if (selectPresencial.value !== "") {
        fechaPresencial.style.display = "block";

        const resumenDistrito = document.getElementById("resumenDistritoPresencial");
        if (resumenDistrito) resumenDistrito.textContent = selectPresencial.value;

        const hiddenDistrito = document.getElementById("distritoSeleccionadoPresencial");
        if (hiddenDistrito) hiddenDistrito.value = selectPresencial.value;
    }
});

selectVirtual.addEventListener("change", () => {
    resetFechasYHorarios();

    if (selectVirtual.value !== "") {
        fechaVirtual.style.display = "block";

        const resumenDistrito = document.getElementById("resumenDistritoVirtual");
        if (resumenDistrito) resumenDistrito.textContent = selectVirtual.value;

        const hiddenZona = document.getElementById("zonaSeleccionadaVirtual");
        if (hiddenZona) hiddenZona.value = selectVirtual.value;
    }
});



// =====================================================
//      FLATPICKR - FECHAS
// =====================================================

flatpickr("#inputFechaPresencial", {
    dateFormat: "Y-m-d",
    minDate: new Date().fp_incr(1),
    locale: "es",
    disable: [(date) => date.getDay() === 0],

    onChange: function (selectedDates, dateStr) {
        if (!dateStr) return;

        mostrarHorarios("Presencial");
        document.getElementById("resumenFechaPresencial").textContent = dateStr;

        const hiddenFecha = document.getElementById("fechaSeleccionadaPresencial");
        hiddenFecha.value = dateStr;
    }
});

flatpickr("#inputFechaVirtual", {
    dateFormat: "Y-m-d",
    minDate: new Date().fp_incr(1),
    locale: "es",
    disable: [(date) => date.getDay() === 0],

    onChange: function (selectedDates, dateStr) {
        if (!dateStr) return;

        mostrarHorarios("Virtual");
        document.getElementById("resumenFechaVirtual").textContent = dateStr;

        const hiddenFecha = document.getElementById("fechaSeleccionadaVirtual");
        hiddenFecha.value = dateStr;
    }
});



// =====================================================
//      ANIMACIÓN ORIGINAL DE CONFIRMACIÓN
// =====================================================

function mostrarMensajeConfirmacion(tipo) {

    const formulario = tipo === 'virtual'
        ? document.getElementById("DatosVirtual")
        : document.getElementById("DatosPresencial");

    const mensaje = document.getElementById("mensajeConfirmacion");

    formulario.classList.add("hidden");

    mensaje.innerHTML = `
        <div class="card">
            <div class="icono">
                <i class="fa-regular fa-circle-check fa-3x text-white"></i>
            </div>
            <h3>¡Reserva Confirmada!</h3>
            <p>Hemos recibido tu solicitud. Te contactaremos pronto para confirmar tu cita.</p>
        </div>
    `;

    mensaje.classList.remove("hidden");
    setTimeout(() => mensaje.classList.add("activo"), 10);

    setTimeout(() => {
        mensaje.classList.remove("activo");

        setTimeout(() => {
            mensaje.classList.add("hidden");
            formulario.classList.remove("hidden");
        }, 400);

    }, 3000);
}



// =====================================================
//      SISTEMA FINAL DE ENVÍO (BD + CORREO + ANIMACIÓN)
// =====================================================

// ⭐ ESTE ES EL ÚNICO SISTEMA DE ENVÍO AHORA ⭐
async function procesarFormulario(formId, tipo) {

    const form = document.getElementById(formId);

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(form);

        // 1) Guardar cita en BD
        const respuesta = await fetch("../php/guardarCita.php", {
            method: "POST",
            body: formData
        });

        const data = await respuesta.json();

        if (data.status === "ocupado") {
            alert("❌ El horario ya está reservado.");
            return;
        }

        if (data.status === "error") {
            alert("❌ Error al guardar la cita.");
            return;
        }

        // 2) Mostrar animación en pantalla
        mostrarMensajeConfirmacion(tipo);   // ⭐ ANIMACIÓN ORIGINAL

        // 3) Enviar correo
        const respCorreo = await fetch("../php/enviarCorreo.php", {
            method: "POST",
            body: formData
        });

        // (No reducimos la animación por esperar correo, se mantiene igual)

        // 4) Reset visual
        form.reset();
        resetFechasYHorarios();
    });
}



// Activar ambos formularios
procesarFormulario("DatosPresencial", "presencial");
procesarFormulario("DatosVirtual", "virtual");



// =====================================================
//      ANIMACIONES DE SCROLL (SIGUE IGUAL)
// =====================================================

const revealElements = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("show"), index * 200);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => observer.observe(el));

const reveals = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-bottom');

const revealOnScroll = () => {
    const trigger = window.innerHeight * 0.85;

    reveals.forEach(el => {
        if (el.getBoundingClientRect().top < trigger) {
            el.classList.add('show');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
