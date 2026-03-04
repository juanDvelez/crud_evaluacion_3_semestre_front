/**
 * ============================================
 * API UTILITIES - Funciones Reutilizables
 * ============================================
 * 
 * Este archivo centraliza todas las funciones 
 * para interactuar con la API REST
 * 
 * Requisitos técnicos:
 * ✅ Todas las peticiones a http://localhost:3000/api/
 * ✅ Uso de fetch() para todas las peticiones
 * ✅ Manejo de errores con try/catch
 * ✅ Validación de respuestas HTTP
 * ✅ Mensajes de error/éxito al usuario
 * ✅ Código limpio y documentado
 * ✅ Funciones reutilizables
 */

// Configuración base de la API
const API_CONFIG = {
    BASE_URL: 'http://localhost:3000/api',
    TIMEOUT: 10000, // 10 segundos
    HEADERS: {
        'Content-Type': 'application/json'
    }
};

/**
 * Función genérica para realizar peticiones HTTP
 * 
 * @param {string} endpoint - El endpoint de la API (ej: '/productos', '/clientes/1')
 * @param {string} metodo - Método HTTP: GET, POST, PUT, DELETE, PATCH
 * @param {object} datos - Datos a enviar en el body (para POST, PUT, PATCH)
 * @returns {Promise} Respuesta de la API
 * 
 * @example
 * // GET
 * const productos = await hacerPeticion('/productos', 'GET');
 * 
 * // POST
 * const nuevoProducto = await hacerPeticion('/productos', 'POST', {nombre: 'Pizza'});
 * 
 * // PUT
 * const productoActualizado = await hacerPeticion('/productos/1', 'PUT', {nombre: 'Pizza Italiana'});
 * 
 * // DELETE
 * const resultado = await hacerPeticion('/productos/1', 'DELETE');
 * 
 * // PATCH
 * const estadoActualizado = await hacerPeticion('/pedidos/1/estado', 'PATCH', {estado: 'completado'});
 */
async function hacerPeticion(endpoint, metodo = 'GET', datos = null) {
    try {
        // Construir opciones de la petición
        const opciones = {
            method: metodo,
            headers: API_CONFIG.HEADERS
        };

        // Agregar body si es necesario
        if (datos && (metodo === 'POST' || metodo === 'PUT' || metodo === 'PATCH')) {
            opciones.body = JSON.stringify(datos);
        }

        // Realizar la petición con timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
        
        opciones.signal = controller.signal;

        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, opciones);
        clearTimeout(timeoutId);

        // Validar respuesta HTTP
        if (!response.ok) {
            // Intentar obtener mensaje de error del servidor
            let mensajeError = `Error HTTP ${response.status}`;
            
            try {
                const errorData = await response.json();
                if (errorData.message) {
                    mensajeError = errorData.message;
                }
            } catch (e) {
                // Si no hay JSON, usar mensaje por defecto
                mensajeError = `${metodo} ${endpoint} falló con estado ${response.status}`;
            }

            throw new Error(mensajeError);
        }

        // Parsear JSON
        const resultado = await response.json();
        return resultado;

    } catch (error) {
        // Manejo de errores
        if (error.name === 'AbortError') {
            throw new Error('La solicitud tardó demasiado tiempo. Intente de nuevo.');
        }
        
        throw error;
    }
}

/**
 * Obtener lista de elementos
 * 
 * @param {string} recurso - Tipo de recurso: productos, clientes, pedidos, usuarios
 * @returns {Promise<Array>} Array con los elementos
 * 
 * @example
 * const productos = await obtenerLista('productos');
 * const clientes = await obtenerLista('clientes');
 */
async function obtenerLista(recurso) {
    return await hacerPeticion(`/${recurso}`);
}

/**
 * Obtener un elemento por ID
 * 
 * @param {string} recurso - Tipo de recurso
 * @param {number} id - ID del elemento
 * @returns {Promise<Object>} Objeto con los datos del elemento
 * 
 * @example
 * const producto = await obtenerPorId('productos', 1);
 * const cliente = await obtenerPorId('clientes', 5);
 */
async function obtenerPorId(recurso, id) {
    return await hacerPeticion(`/${recurso}/${id}`);
}

/**
 * Crear nuevo elemento
 * 
 * @param {string} recurso - Tipo de recurso
 * @param {Object} datos - Objeto con los datos a crear
 * @returns {Promise<Object>} Respuesta del servidor con ID
 * 
 * @example
 * const nuevoProducto = await crear('productos', {
 *     nombre: 'Pizza',
 *     precio: 25000,
 *     stock: 100
 * });
 */
async function crear(recurso, datos) {
    return await hacerPeticion(`/${recurso}`, 'POST', datos);
}

/**
 * Actualizar elemento existente
 * 
 * @param {string} recurso - Tipo de recurso
 * @param {number} id - ID del elemento a actualizar
 * @param {Object} datos - Objeto con los datos a actualizar
 * @returns {Promise<Object>} Respuesta del servidor
 * 
 * @example
 * const actualizado = await actualizar('productos', 1, {
 *     nombre: 'Pizza Italiana',
 *     precio: 28000
 * });
 */
async function actualizar(recurso, id, datos) {
    return await hacerPeticion(`/${recurso}/${id}`, 'PUT', datos);
}

/**
 * Actualizar estado (PATCH)
 * 
 * @param {string} recurso - Tipo de recurso
 * @param {number} id - ID del elemento
 * @param {string} campo - Nombre del campo a actualizar
 * @param {*} valor - Nuevo valor
 * @returns {Promise<Object>} Respuesta del servidor
 * 
 * @example
 * const resultado = await actualizarEstado('pedidos', 1, 'estado', 'completado');
 */
async function actualizarEstado(recurso, id, campo, valor) {
    const datos = {};
    datos[campo] = valor;
    return await hacerPeticion(`/${recurso}/${id}/${campo}`, 'PATCH', { [campo]: valor });
}

/**
 * Eliminar elemento
 * 
 * @param {string} recurso - Tipo de recurso
 * @param {number} id - ID del elemento a eliminar
 * @returns {Promise<Object>} Respuesta del servidor
 * 
 * @example
 * const resultado = await eliminar('productos', 1);
 * const resultado = await eliminar('clientes', 5);
 */
async function eliminar(recurso, id) {
    return await hacerPeticion(`/${recurso}/${id}`, 'DELETE');
}

/**
 * ============================================
 * FUNCIONES PARA ALERTAS Y NOTIFICACIONES
 * ============================================
 */

/**
 * Mostrar alerta en la página
 * 
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo: 'success', 'danger', 'warning', 'info'
 * @param {HTMLElement} contenedor - Elemento donde insertar la alerta (opcional)
 * @param {number} duracion - Tiempo en ms antes de remover (0 = no auto-remover)
 * 
 * @example
 * mostrarAlerta('Operación exitosa', 'success');
 * mostrarAlerta('Ocurrió un error', 'danger', document.getElementById('alertas'));
 * mostrarAlerta('Advertencia importante', 'warning', null, 5000);
 */
function mostrarAlerta(mensaje, tipo = 'info', contenedor = null, duracion = 5000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');

    let titulo = {
        'success': 'Éxito',
        'danger': 'Error',
        'warning': 'Advertencia',
        'info': 'Información'
    }[tipo] || 'Notificación';

    alertDiv.innerHTML = `
        <strong>${titulo}:</strong> ${mensaje}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `;

    // Determinar contenedor
    let cont = contenedor;
    if (!cont) {
        // Buscar contenedor por defecto
        cont = document.getElementById('alertContainer') || 
                document.querySelector('.container-fluid') ||
                document.body;
    }

    // Insertar alerta
    if (cont.id === 'alertContainer' || cont.className.includes('container-fluid')) {
        cont.innerHTML = '';
        cont.appendChild(alertDiv);
    } else {
        cont.insertBefore(alertDiv, cont.firstChild);
    }

    // Auto-remover si es necesario
    if (duracion > 0) {
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, duracion);
    }

    return alertDiv;
}

/**
 * ============================================
 * FUNCIONES PARA VALIDACIÓN
 * ============================================
 */

/**
 * Validar email
 * 
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 * 
 * @example
 * if (validarEmail('user@example.com')) {
 *     console.log('Email válido');
 * }
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validar contraseña
 * 
 * @param {string} contrasena - Contraseña a validar
 * @returns {Object} Objeto con detalles de validación
 * 
 * @example
 * const validacion = validarContrasena('Abc123');
 * if (validacion.esValida) {
 *     console.log('Contraseña cumple todos los requisitos');
 * }
 */
function validarContrasena(contrasena) {
    return {
        esValida: contrasena.length >= 6 && /[a-zA-Z]/.test(contrasena) && /[0-9]/.test(contrasena),
        tieneMinimo6: contrasena.length >= 6,
        tieneLetras: /[a-zA-Z]/.test(contrasena),
        tieneNumeros: /[0-9]/.test(contrasena)
    };
}

/**
 * Validar que dos valores coincidan
 * 
 * @param {*} valor1 - Primer valor
 * @param {*} valor2 - Segundo valor
 * @returns {boolean} True si coinciden
 * 
 * @example
 * if (validarCoincidencia(contrasena, confirmar)) {
 *     console.log('Las contraseñas coinciden');
 * }
 */
function validarCoincidencia(valor1, valor2) {
    return valor1 === valor2;
}

/**
 * ============================================
 * FUNCIONES PARA FORMATO DE DATOS
 * ============================================
 */

/**
 * Formatear fecha al formato local
 * 
 * @param {string|Date} fecha - Fecha a formatear
 * @param {string} locale - Código de idioma (ej: 'es-CO')
 * @returns {string} Fecha formateada
 * 
 * @example
 * const fechaFormato = formatearFecha('2026-03-01');
 * // Resultado: "1/3/2026"
 * 
 * const fechaFormato = formatearFecha('2026-03-01', 'es-CO');
 * // Resultado: "1/3/2026" (formato colombiano)
 */
function formatearFecha(fecha, locale = 'es-CO') {
    if (!fecha) return '-';
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString(locale);
}

/**
 * Formatear moneda
 * 
 * @param {number} cantidad - Cantidad a formatear
 * @param {string} moneda - Código de moneda (ej: 'COP', 'USD')
 * @returns {string} Cantidad formateada con símbolo
 * 
 * @example
 * const precio = formatearMoneda(25000, 'COP');
 * // Resultado: "$25,000.00"
 * 
 * const precio = formatearMoneda(100, 'USD');
 * // Resultado: "$100.00"
 */
function formatearMoneda(cantidad, moneda = 'COP') {
    if (moneda === 'COP') {
        return '$' + parseFloat(cantidad).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: moneda
    }).format(cantidad);
}

/**
 * Formatear número con decimales
 * 
 * @param {number} numero - Número a formatear
 * @param {number} decimales - Cantidad de decimales
 * @returns {string} Número formateado
 * 
 * @example
 * const precio = formatearNumero(25000.5, 2);
 * // Resultado: "25000.50"
 */
function formatearNumero(numero, decimales = 2) {
    return parseFloat(numero).toFixed(decimales);
}

/**
 * ============================================
 * FUNCIONES PARA MANIPULACIÓN DEL DOM
 * ============================================
 */

/**
 * Limpiar elemento HTML
 * 
 * @param {HTMLElement|string} elemento - Elemento o selector
 * @returns {HTMLElement} El elemento limpio
 * 
 * @example
 * limpiarElemento('#contenedor');
 * limpiarElemento(document.getElementById('tabla'));
 */
function limpiarElemento(elemento) {
    const el = typeof elemento === 'string' ? 
               document.querySelector(elemento) : 
               elemento;
    if (el) {
        el.innerHTML = '';
    }
    return el;
}

/**
 * Más alias útil para limpiar
 */
function vaciar(elemento) {
    return limpiarElemento(elemento);
}

/**
 * Deshabilitar botón y mostrar estado de carga
 * 
 * @param {HTMLElement} boton - Elemento botón
 * @param {string} textoLoading - Texto mostrar mientras carga
 * @returns {Function} Función para restaurar el botón
 * 
 * @example
 * const restaurar = deshabilitarBoton(btnEnviar, 'Procesando...');
 * // ... hacer algo ...
 * restaurar(); // Vuelve a estado normal
 */
function deshabilitarBoton(boton, textoLoading = 'Procesando...') {
    const textoOriginal = boton.innerHTML;
    boton.disabled = true;
    boton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${textoLoading}`;

    return function restaurar() {
        boton.disabled = false;
        boton.innerHTML = textoOriginal;
    };
}

/**
 * ============================================
 * FUNCIONES PARA MANEJO DE CONFIRMACIONES
 * ============================================
 */

/**
 * Mostrar confirmación y ejecutar función si es aceptada
 * 
 * @param {string} mensaje - Mensaje de confirmación
 * @param {Function} callback - Función a ejecutar si se confirma
 * @param {string} btAceptar - Texto del botón aceptar
 * @param {string} btCancelar - Texto del botón cancelar
 * 
 * @example
 * confirmarAccion('¿Eliminar este producto?', async () => {
 *     await eliminar('productos', 1);
 * });
 */
function confirmarAccion(mensaje, callback, btAceptar = 'Aceptar', btCancelar = 'Cancelar') {
    if (confirm(mensaje)) {
        callback();
    }
}

/**
 * ============================================
 * INICIALIZACIÓN Y EXPORTACIÓN
 * ============================================
 */

// Asegurar que las funciones están disponibles globalmente
window.API = {
    hacerPeticion,
    obtenerLista,
    obtenerPorId,
    crear,
    actualizar,
    actualizarEstado,
    eliminar,
    mostrarAlerta,
    validarEmail,
    validarContrasena,
    validarCoincidencia,
    formatearFecha,
    formatearMoneda,
    formatearNumero,
    limpiarElemento,
    vaciar,
    deshabilitarBoton,
    confirmarAccion
};

console.log('%c✅ API Utilities Cargado Correctamente', 'color: green; font-weight: bold; font-size: 14px;');
console.log('%cUsa window.API para acceder a las funciones', 'color: blue;');
