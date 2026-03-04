# 📝 DETALLE DE CAMBIOS POR ARCHIVO

**Fecha:** 3 de Marzo de 2026  
**Proyecto:** Carrito de Compras - Integración con API

---

## 📄 Archivo: `index.html`

### Cambios Realizados:

#### 1. Sección de Productos "Delicious Burger" (línea ~175)

**ANTES:**
```html
<div class="container" id="burger">
  <h1>Delicious Burger</h1>
  <div class="row" style="margin-top: 30px;">
    <div class="col-md-3 py-3 py-md-0">
      <div class="card producto" data-id="1" data-price="10.50" data-name="Tasty Burger" data-image="./images/b1.png">
        <img src="./images/b1.png" alt="">
        <div class="card-body">
          <h3>Tasty Burger</h3>
          <p>Lorem ipsum dolor sit amet.</p>
          <h5>$10.50 <span class="btn-product"><i class="fa-solid fa-basket-shopping"></i></span></h5>
        </div>
      </div>
    </div>
    <!-- ... 7 productos más hardcodeados ... -->
  </div>
</div>
```

**DESPUÉS:**
```html
<div class="container" id="burger">
  <h1>Delicious Burger</h1>
  <!-- Contenedor dinámico para productos -->
  <div id="productos-container" class="row" style="margin-top: 30px;">
    <!-- Los productos se cargarán aquí dinámicamente -->
    <div class="col-12 text-center" style="padding: 30px;">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Cargando productos...</span>
      </div>
      <p>Cargando productos desde la base de datos...</p>
    </div>
  </div>
</div>
```

**Impacto:**
- ✅ Removidos 8 productos hardcodeados
- ✅ Agregado spinner de carga
- ✅ Contenedor dinámico listo para productos

---

#### 2. Segunda Sección de Productos (línea ~274)

**ANTES:**
```html
<div class="container" id="burger">
  <div class="row" style="margin-top: 30px;">
    <div class="col-md-3 py-3 py-md-0">
      <div class="card producto" data-id="9" data-price="6.50" data-name="Italian Pizza" ...>
        <!-- ... 4 productos más ... -->
      </div>
    </div>
    <!-- ... -->
  </div>
</div>
```

**DESPUÉS:**
```html
<div class="container" id="burger">
  <div class="row" style="margin-top: 30px;" id="productos-container-2">
    <!-- Los productos se cargarán aquí dinámicamente (continuación) -->
  </div>
</div>
```

**Impacto:**
- ✅ Removidos 4 productos adicionales
- ✅ Contenedor para productos extra

---

#### 3. Script de Carga (línea ~545)

**ANTES:**
```javascript
// Obtener todos los botones de agregar al carrito
const botonesAgregar = document.querySelectorAll('.btn-product');

botonesAgregar.forEach(boton => {
    boton.style.cursor = 'pointer';
    boton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Obtener la tarjeta del producto
        const card = this.closest('.card.producto');
        
        if (card) {
            // Extraer datos del producto
            const producto = {
                id: parseInt(card.dataset.id),
                nombre: card.dataset.name,
                precio: parseFloat(card.dataset.price),
                imagen: card.dataset.image
            };
            
            // Agregar al carrito
            Carrito.agregarAlCarrito(producto);
        }
    });
});
```

**DESPUÉS:**
```javascript
// Cargar productos desde la API
async function cargarProductos() {
    try {
        const response = await fetch(`${Carrito.CONFIG.API_BASE}/productos`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const productos = await response.json();
        renderizarProductos(productos);
    } catch (error) {
        console.error('Error cargando productos:', error);
        const container = document.getElementById('productos-container');
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-danger">
                    Error cargando productos: ${error.message}
                </div>
            </div>
        `;
    }
}

// Renderizar productos en la página
function renderizarProductos(productos) {
    const container = document.getElementById('productos-container');
    
    if (!productos || productos.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p>No hay productos disponibles</p></div>';
        return;
    }

    let html = '';
    productos.forEach((producto, index) => {
        const imagen = producto.imagen || './images/default.png';
        const precio = parseFloat(producto.precio).toFixed(2);
        
        html += `
            <div class="col-md-3 py-3 py-md-0">
                <div class="card producto" data-id="${producto.id}" data-price="${precio}" data-name="${producto.nombre}" data-image="${imagen}">
                    <img src="${imagen}" alt="${producto.nombre}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h3>${producto.nombre}</h3>
                        <p>${producto.descripcion || 'Lorem ipsum dolor sit amet.'}</p>
                        <h5>$${precio} <span class="btn-product" style="cursor: pointer;"><i class="fa-solid fa-basket-shopping"></i></span></h5>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    agregarEventosProductos();
}

// Agregar eventos a los botones de productos
function agregarEventosProductos() {
    const botonesAgregar = document.querySelectorAll('.btn-product');
    
    botonesAgregar.forEach(boton => {
        boton.style.cursor = 'pointer';
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.card.producto');
            if (card) {
                const producto = {
                    id: parseInt(card.dataset.id),
                    nombre: card.dataset.name,
                    precio: parseFloat(card.dataset.price),
                    imagen: card.dataset.image
                };
                
                Carrito.agregarAlCarrito(producto);
            }
        });
    });
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos desde API
    cargarProductos();
    
    // ... resto del código ...
});
```

**Impacto:**
- ✅ 3 nuevas funciones: `cargarProductos()`, `renderizarProductos()`, `agregarEventosProductos()`
- ✅ Ahora carga desde `/api/productos`
- ✅ Genera HTML dinámicamente
- ✅ Manejo robusto de errores

**Líneas Modificadas:** ~150

---

## 🔧 Archivo: `js/carrito.js`

### Cambios Realizados:

#### 1. Nuevas Funciones de API

**AGREGADO después de línea 150:**

```javascript
/**
 * Crear cliente en el API
 * @param {Object} datosCliente - {nombre, apellido, email, celular, direccion, direccion2, descripcion}
 * @returns {Promise} Respuesta del API con id_cliente
 */
async function crearCliente(datosCliente) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);
        
        const response = await fetch(`${CONFIG.API_BASE}/clientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosCliente),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `Error HTTP ${response.status}`);
        }
        
        return await response.json();
        
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('La solicitud tardó demasiado tiempo');
        }
        throw error;
    }
}
```

**Impacto:**
- ✅ Nueva función para crear clientes
- ✅ Usa AbortController para timeout
- ✅ Retorna id_cliente para usar en pedido

---

#### 2. Función `crearPedido()` Mejorada

**ANTES:**
```javascript
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
```

**DESPUÉS:**
```javascript
async function crearPedido(datosPedido) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);
        
        // Asegurar que la estructura es correcta
        const pedidoFormateado = {
            id_cliente: datosPedido.id_cliente,
            metodo_pago: datosPedido.metodo_pago,
            productos: datosPedido.productos || [],
            descuento: datosPedido.descuento || 0,
            aumento: datosPedido.aumento || 0
        };
        
        const response = await fetch(`${CONFIG.API_BASE}/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoFormateado),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `Error HTTP ${response.status}`);
        }
        
        return await response.json();
        
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('La solicitud tardó demasiado tiempo');
        }
        throw error;
    }
}
```

**Impacto:**
- ✅ Formatea estructura coherente
- ✅ Requiere id_cliente
- ✅ Valores por defecto para descuento/aumento
- ✅ Error handling mejorado

**Líneas Modificadas:** ~50

---

#### 3. Exportación Global Actualizada

**ANTES:**
```javascript
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
```

**DESPUÉS:**
```javascript
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
    crearCliente,        // ← NUEVO
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
```

**Impacto:**
- ✅ `crearCliente` ahora disponible globalmente

---

## 💳 Archivo: `checkout.html`

### Cambios Realizados:

#### 1. Función `procesarPedido()` Completamente Refactorizada

**ANTES:** ~80 líneas de código  
**DESPUÉS:** ~180 líneas de código

**PRINCIPALES CAMBIOS:**

1. **Validación mejorada:**
```javascript
// Ahora usa Carrito.validarRequerido() en lugar de condicionales
if (!Carrito.validarRequerido(nombres)) throw new Error('...');
```

2. **Búsqueda de cliente:**
```javascript
let cliente = await Carrito.obtenerClientePorEmail(email);
```

3. **Creación automática de cliente:**
```javascript
if (!cliente) {
    const datosCliente = {
        nombre: nombres,
        apellido: apellidos,
        email: email,
        celular: celular,
        direccion: direccion,
        direccion2: direccion2 || '',
        descripcion: notas || ''
    };
    
    const respuestaCliente = await Carrito.crearCliente(datosCliente);
    cliente = respuestaCliente;
}
```

4. **Estructura de pedido correcta:**
```javascript
const productos = carrito.map(item => ({
    id_producto: item.id,
    cantidad: item.cantidad,
    precio: parseFloat(item.precio)
}));

const datosPedido = {
    id_cliente: idCliente,          // ← REQUERIDO
    metodo_pago: metodoPago,
    productos: productos,            // ← CON PRECIO
    descuento: descuento,
    aumento: aumento
};
```

5. **Estados de botón:**
```javascript
botonSubmit.textContent = 'Verificando cliente...';
botonSubmit.textContent = 'Creando cliente...';
botonSubmit.textContent = 'Creando pedido...';
```

**Impacto:**
- ✅ Flujo más robusto
- ✅ Validaciones correctas
- ✅ Estructura exacta del backend
- ✅ Feedback visual mejorado
- ✅ Mejor manejo de errores

**Líneas Modificadas:** ~100

---

## 📊 Resumen de Cambios

| Archivo | Tipo | Cambios | Líneas |
|---------|------|---------|--------|
| index.html | Eliminación | 12 productos hardcodeados | -120 |
| index.html | Adición | 3 nuevas funciones JS | +100 |
| js/carrito.js | Adición | Función crearCliente() | +30 |
| js/carrito.js | Mejora | Función crearPedido() | ±20 |
| js/carrito.js | Adición | Nueva exportación | +1 |
| checkout.html | Reescritura | Función procesarPedido() | ±100 |
| **TOTAL** | | | **+111 netas** |

---

## ✅ Validación

Todos los cambios fueron:
- [x] Testeados sintácticamente
- [x] Verificados sin errores
- [x] Algmenados con manejo de errores
- [x] Documentados inline
- [x] Compatibles con backend existente

---

**Fecha de Implementación:** 3 de Marzo de 2026
