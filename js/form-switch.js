// --- FUNCIONES ---
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

// --- BOTONES ---
const btnPresencial = document.getElementById("btnPresencial");
const btnVirtual = document.getElementById("btnVirtual");

// FORMULARIOS
const formPresencial = document.getElementById("formPresencial");
const formVirtual = document.getElementById("formVirtual");

// --- CAMBIO A PRESENCIAL ---
btnPresencial.addEventListener("click", () => {
    resetFechasYHorarios();
    btnPresencial.classList.add("active");
    btnVirtual.classList.remove("active");
    formPresencial.style.display = "block";
    formVirtual.style.display = "none";
});

// --- CAMBIO A VIRTUAL ---
btnVirtual.addEventListener("click", () => {
    resetFechasYHorarios();
    btnVirtual.classList.add("active");
    btnPresencial.classList.remove("active");
    formVirtual.style.display = "block";
    formPresencial.style.display = "none";
});

// --- SELECTS ---
const selectPresencial = document.getElementById("selectPresencial");
const selectVirtual = document.getElementById("selectVirtual");

const fechaPresencial = document.getElementById("fechaPresencial");
const fechaVirtual = document.getElementById("fechaVirtual");

// --- HORAS SEPARADAS ---
const horasPresencial = [
    "08:00", "10:00", "12:00", "15:00", "17:00"
];

const horasVirtual = [
    "18:00", "19:00", "20:00"
];

// --- MOSTRAR HORARIOS ---
function mostrarHorarios(tipo) {
    let contenedor, lista;

    if (tipo === "Presencial") {
        contenedor = document.getElementById("horariosContainerPresencial");
        lista = document.getElementById("listaHorariosPresencial");
    } else {
        contenedor = document.getElementById("horariosContainerVirtual");
        lista = document.getElementById("listaHorariosVirtual");
    }

    lista.innerHTML = "";
    const horarios = tipo === "Presencial" ? horasPresencial : horasVirtual;
    horarios.forEach(h => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200";
        btn.textContent = h;

        // Al hacer click en la hora, mostrar datos personales y actualizar resumen
        btn.addEventListener("click", () => {
            const datos = document.getElementById(tipo === "Presencial" ? "datosPersonalesPresencial" : "datosPersonalesVirtual");
            if (datos) datos.style.display = "block";

            const resumenHora = document.getElementById(tipo === "Presencial" ? "resumenHoraPresencial" : "resumenHoraVirtual");
            if (resumenHora) resumenHora.textContent = h;

            // --- Manejar el estado activo ---
            // Quitar 'active' de todos los botones de este contenedor
            const lista = tipo === "Presencial" ? document.getElementById("listaHorariosPresencial") : document.getElementById("listaHorariosVirtual");
            lista.querySelectorAll("button").forEach(b => b.classList.remove("active"));

            // Agregar 'active' al botón clickeado
            btn.classList.add("active");
        });

        lista.appendChild(btn);
    });

    contenedor.classList.remove("hidden");
}

// --- EVENTOS SELECT ---
selectPresencial.addEventListener("change", () => {
    resetFechasYHorarios();
    if (selectPresencial.value !== "") {
        fechaPresencial.style.display = "block";
        fechaPresencial.classList.remove("fecha-animada");
        void fechaPresencial.offsetWidth;
        fechaPresencial.classList.add("fecha-animada");

        const resumenDistrito = document.getElementById("resumenDistritoPresencial");
        if (resumenDistrito) resumenDistrito.textContent = selectPresencial.value;
    }
});

selectVirtual.addEventListener("change", () => {
    resetFechasYHorarios();
    if (selectVirtual.value !== "") {
        fechaVirtual.style.display = "block";
        fechaVirtual.classList.remove("fecha-animada");
        void fechaVirtual.offsetWidth;
        fechaVirtual.classList.add("fecha-animada");

        const resumenDistrito = document.getElementById("resumenDistritoVirtual");
        if (resumenDistrito) resumenDistrito.textContent = selectVirtual.value;
    }
});

// --- FLATPICKR ---
flatpickr("#inputFechaPresencial", {
    dateFormat: "Y-m-d",
    minDate: new Date().fp_incr(1),
    allowInput: true,
    disableMobile: false,
    locale: "es",

    disable: [
        function (date) {
            return date.getDay() === 0;
        }
    ],

    onChange: function (selectedDates, dateStr) {
        if (!dateStr) return;
        mostrarHorarios("Presencial");
        const resumenFecha = document.getElementById("resumenFechaPresencial");
        if (resumenFecha) resumenFecha.textContent = dateStr;
    }
});

flatpickr("#inputFechaVirtual", {
    dateFormat: "Y-m-d",
    minDate: new Date().fp_incr(1), 
    allowInput: true,
    disableMobile: false,
    locale: "es",

    disable: [
        function (date) {
            return date.getDay() === 0;
        }
    ],

    onChange: function (selectedDates, dateStr) {
        if (!dateStr) return;
        mostrarHorarios("Virtual");
        const resumenFecha = document.getElementById("resumenFechaVirtual");
        if (resumenFecha) resumenFecha.textContent = dateStr;
    }
});


// --- FUNCION PARA MANEJAR ENVÍO DE FORMULARIO ---
function handleFormSubmit(formId) {
    const form = document.getElementById(formId);

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita que se recargue la página

        // Validación nativa de HTML
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Aquí puedes personalizar tu mensaje de éxito
        alert("✅ Tu cita ha sido registrada correctamente.");

        // Opcional: limpiar formulario después de enviar
        form.reset();

        // Ocultar secciones de horarios y datos si quieres reiniciar el flujo
        if (formId === "DatosVirtual") {
            document.getElementById("fechaVirtual").style.display = "none";
            document.getElementById("horariosContainerVirtual").classList.add("hidden");
            document.getElementById("datosPersonalesVirtual").style.display = "none";
        } else if (formId === "DatosPresencial") {
            document.getElementById("fechaPresencial").style.display = "none";
            document.getElementById("horariosContainerPresencial").classList.add("hidden");
            document.getElementById("datosPersonalesPresencial").style.display = "none";
        }

        // Limpiar resumen
        const resumenSpans = form.querySelectorAll("span");
        resumenSpans.forEach(span => span.textContent = "");
    });
}

// --- LLAMADAS PARA AMBOS FORMULARIOS ---
handleFormSubmit("DatosVirtual");
handleFormSubmit("DatosPresencial");


function mostrarMensajeConfirmacion(tipo) {
    // Selecciona el formulario activo según el tipo
    const formulario = tipo === 'virtual'
        ? document.getElementById("DatosVirtual")
        : document.getElementById("DatosPresencial");

    const mensaje = document.getElementById("mensajeConfirmacion");

    // Oculta solo el formulario
    formulario.classList.add("hidden");

    // Insertar HTML del mensaje
    mensaje.innerHTML = `
<div class="card">
  <div class="icono">
    <i class="fa-regular fa-circle-check fa-3x text-white"></i>
  </div>
  <h3>¡Reserva Confirmada!</h3>
  <p>Hemos recibido tu solicitud. Te contactaremos pronto para confirmar tu cita.</p>
</div>
    `;

    // Mostrar mensaje
    mensaje.classList.remove("hidden");
    setTimeout(() => mensaje.classList.add("activo"), 10);

    // Después de 3 segundos vuelve todo a la normalidad
    setTimeout(() => {
        mensaje.classList.remove("activo");
        setTimeout(() => {
            mensaje.classList.add("hidden");
            formulario.classList.remove("hidden");
        }, 500);
    }, 3000);
}

// FORMULARIO VIRTUAL
document.getElementById("DatosVirtual").addEventListener("submit", function (e) {
    e.preventDefault();
    mostrarMensajeConfirmacion('virtual');
});

// FORMULARIO PRESENCIAL
document.getElementById("DatosPresencial").addEventListener("submit", function (e) {
    e.preventDefault();
    mostrarMensajeConfirmacion('presencial');
});

const revealElements = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add("show");
            }, index * 200); // Retraso para animación escalonada

            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

revealElements.forEach(el => observer.observe(el));



const reveals = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-bottom');

const revealOnScroll = () => {
    const trigger = window.innerHeight * 0.85;

    reveals.forEach(el => {
        const top = el.getBoundingClientRect().top;

        if (top < trigger) {
            el.classList.add('show');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);