/**
 * ============================================
 * SISTEMA DE CARRITO DE COMPRAS
 * Carrito Dinámico con localStorage
 * ============================================
 */

// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================
const CONFIG = {
    API_BASE: 'http://localhost:3000/api',
    STORAGE_KEY: 'carrito_compras',
    TIMEOUT: 10000,
    DOMICILIO_COSTO: 5.00,
    IMPUESTO_PORCENTAJE: 0.19
};

// ============================================
// FUNCIONES DE CARRITO
// ============================================

/**
 * Obtener carrito desde localStorage
 * @returns {Array} Array de items del carrito
 */
function obtenerCarrito() {
    const carrito = localStorage.getItem(CONFIG.STORAGE_KEY);
    return carrito ? JSON.parse(carrito) : [];
}

/**
 * Guardar carrito en localStorage
 * @param {Array} carrito - Array de items del carrito
 */
function guardarCarrito(carrito) {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(carrito));
}

/**
 * Agregar producto al carrito
 * @param {Object} producto - {id, nombre, precio, imagen}
 */
function agregarAlCarrito(producto) {
    const carrito = obtenerCarrito();
    const itemExistente = carrito.find(item => item.id === producto.id);
    
    if (itemExistente) {
        // Si existe, aumentar cantidad
        itemExistente.cantidad++;
    } else {
        // Si no existe, agregar nuevo
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: parseFloat(producto.precio),
            cantidad: 1,
            imagen: producto.imagen
        });
    }
    
    guardarCarrito(carrito);
    actualizarContadorCarrito();
    mostrarNotificacion(`${producto.nombre} agregado al carrito`);
}

/**
 * Eliminar producto del carrito
 * @param {Number} productoId - ID del producto
 */
function eliminarDelCarrito(productoId) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.id !== productoId);
    guardarCarrito(carrito);
    actualizarContadorCarrito();
}

/**
 * Actualizar cantidad de un producto
 * @param {Number} productoId - ID del producto
 * @param {Number} nuevaCantidad - Nueva cantidad
 */
function actualizarCantidad(productoId, nuevaCantidad) {
    const carrito = obtenerCarrito();
    const item = carrito.find(item => item.id === productoId);
    
    if (item) {
        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(productoId);
        } else {
            item.cantidad = nuevaCantidad;
            guardarCarrito(carrito);
            actualizarContadorCarrito();
        }
    }
}

/**
 * Actualizar contador del carrito en la navbar
 */
function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    const contadores = document.querySelectorAll('.contar-pro');
    contadores.forEach(contador => {
        contador.textContent = total;
    });
}

/**
 * Obtener cantidad total de items en carrito
 * @returns {Number} Cantidad total
 */
function obtenerTotalProductos() {
    const carrito = obtenerCarrito();
    return carrito.reduce((sum, item) => sum + item.cantidad, 0);
}

/**
 * Obtener subtotal del carrito
 * @returns {Number} Subtotal
 */
function obtenerSubtotal() {
    const carrito = obtenerCarrito();
    return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
}

/**
 * Calcular impuesto sobre subtotal
 * @returns {Number} Monto de impuesto
 */
function calcularImpuesto() {
    const subtotal = obtenerSubtotal();
    return subtotal * CONFIG.IMPUESTO_PORCENTAJE;
}

/**
 * Calcular total con impuesto y domicilio
 * @param {Number} descuento - Descuento opcional (por defecto 0)
 * @returns {Number} Total final
 */
function calcularTotal(descuento = 0) {
    const subtotal = obtenerSubtotal();
    const impuesto = calcularImpuesto();
    const domicilio = CONFIG.DOMICILIO_COSTO;
    
    return subtotal + impuesto + domicilio - descuento;
}

/**
 * Limpiar carrito
 */
function limpiarCarrito() {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    actualizarContadorCarrito();
}

// ============================================
// FUNCIONES DE API
// ============================================

/**
 * Crear pedido en el API
 * @param {Object} datosPedido - Datos del pedido
 * @returns {Promise} Respuesta del API
 */
async function crearPedido(datosPedido) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);
        
        const response = await fetch(`${CONFIG.API_BASE}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPedido),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.mensaje || `Error HTTP ${response.status}`);
        }
        
        return await response.json();
        
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('La solicitud tardó demasiado tiempo');
        }
        throw error;
    }
}

/**
 * Obtener lista de productos del API
 * @returns {Promise<Array>} Lista de productos
 */
async function obtenerProductosAPI() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);
        
        const response = await fetch(`${CONFIG.API_BASE}/productos`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error('Error al cargar productos');
        
        return await response.json();
        
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

/**
 * Obtener cliente por email (verificar si existe)
 * @param {String} email - Email del cliente
 * @returns {Promise<Object|null>} Cliente encontrado o null
 */
async function obtenerClientePorEmail(email) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);
        
        const response = await fetch(`${CONFIG.API_BASE}/clientes?email=${email}`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) return null;
        
        const clientes = await response.json();
        return clientes.find(c => c.email === email) || null;
        
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================

/**
 * Validar email
 * @param {String} email - Email a validar
 * @returns {Boolean} True si es válido
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validar teléfono
 * @param {String} telefono - Teléfono a validar
 * @returns {Boolean} True si es válido (11-15 dígitos)
 */
function validarTelefono(telefono) {
    const regex = /^\d{11,15}$/;
    return regex.test(telefono);
}

/**
 * Validar que un campo no esté vacío
 * @param {String} texto - Texto a validar
 * @returns {Boolean} True si no está vacío
 */
function validarRequerido(texto) {
    return texto && texto.trim().length > 0;
}

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

/**
 * Mostrar notificación al usuario
 * @param {String} mensaje - Mensaje a mostrar
 * @param {String} tipo - Tipo de alerta (success, danger, warning, info)
 * @param {Number} duracion - Duración en ms (por defecto 3000)
 */
function mostrarNotificacion(mensaje, tipo = 'success', duracion = 3000) {
    // Crear elemento alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    
    alertDiv.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remover después de duracion
    setTimeout(() => {
        alertDiv.remove();
    }, duracion);
}

/**
 * Formatear número como moneda
 * @param {Number} numero - Número a formatear
 * @returns {String} Número formateado (ej: $1,234.56)
 */
function formatearMoneda(numero) {
    return '$' + parseFloat(numero).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Formatear número con 2 decimales
 * @param {Number} numero - Número a formatear
 * @returns {String} Número con 2 decimales
 */
function formatearNumero(numero) {
    return parseFloat(numero).toFixed(2);
}

// ============================================
// INICIALIZACIÓN
// ============================================

/**
 * Inicializar el sistema de carrito
 * Debe llamarse al cargar cada página
 */
function inicializarCarrito() {
    actualizarContadorCarrito();
    
    // Event listener para navegación al carrito
    const carritoIcons = document.querySelectorAll('.fa-cart-shopping');
    carritoIcons.forEach(icon => {
        const clickHandler = (e) => {
            // Evitar conflicto si estamos en esa página
            if (!window.location.pathname.includes('cart.html')) {
                window.location.href = 'cart.html';
            }
        };
        
        // Agregar al elemento padre si no está ya asignado
        if (!icon.onclick) {
            icon.style.cursor = 'pointer';
            icon.addEventListener('click', clickHandler);
        }
    });
    
    // Event listener para logo (volver a inicio)
    const logos = document.querySelectorAll('#logo');
    logos.forEach(logo => {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            if (!window.location.pathname.includes('index.html') && !window.location.pathname.endsWith('/')) {
                window.location.href = 'index.html';
            }
        });
    });
}

// ============================================
// EXPORTAR PARA USO GLOBAL
// ============================================

// Hacer disponible en window para uso global
window.Carrito = {
    obtenerCarrito,
    guardarCarrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    obtenerTotalProductos,
    obtenerSubtotal,
    calcularImpuesto,
    calcularTotal,
    limpiarCarrito,
    crearPedido,
    obtenerProductosAPI,
    obtenerClientePorEmail,
    validarEmail,
    validarTelefono,
    validarRequerido,
    mostrarNotificacion,
    formatearMoneda,
    formatearNumero,
    inicializarCarrito,
    CONFIG
};

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', inicializarCarrito);
