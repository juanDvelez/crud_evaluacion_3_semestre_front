🍔 TIENDA DE COMIDAS - Examen Final
Sistema completo de tienda de comidas con carrito de compras, API REST y MySQL.

📁 Estructura del Proyecto
TIENDA_COMIDAS/
├── BACKEND_TIENDA_NODE_MYSQL/  # Backend con Node.js
│   ├── config/
│   │   └── database.js         # Configuración de BD
│   ├── controllers/            # Lógica de endpoints
│   ├── routes/                 # Rutas de la API
│   ├── scripts/
│   │   └── init-db.js         # Script para crear BD
│   ├── package.json
│   ├── .env                    # Variables de entorno
│   └── server.js              # Servidor principal
│
├── DASHBOARD/                  # Frontend administrativo
│   ├── js/
│   │   ├── main.js            # Funciones utilitarias
│   │   ├── productos.js       # CRUD Productos
│   │   ├── clientes.js        # CRUD Clientes
│   │   ├── pedidos.js         # CRUD Pedidos
│   │   └── usuarios.js        # CRUD Usuarios
│   ├── css/
│   │   └── style.css          # Estilos dashboard
│   ├── index.html             # Dashboard principal
│   ├── listado-pro.html       # Gestión productos
│   ├── listado-clientes.html  # Gestión clientes
│   ├── listado-pedidos.html   # Gestión pedidos
│   └── listado-usuarios.html  # Gestión usuarios
│
└── TIENDA_COMIDAS_COMPRAS/     # Frontend tienda
    ├── js/
    │   ├── carrito.js         # Lógica del carrito
    │   └── checkout.js        # Lógica del checkout
    ├── css/
    │   └── tienda.css         # Estilos tienda
    ├── index.html             # Página principal
    ├── cart.html              # Carrito
    ├── checkout.html          # Formulario compra
    ├── thankyou.html          # Confirmación
    └── images/                # Imágenes
🚀 Instalación y Ejecución
1️⃣ Requisitos Previos
Node.js v14+ (Descargar)
MySQL Server corriendo (Descargar)
npm (incluido con Node.js)
2️⃣ Configurar Backend
# Entrar a la carpeta del backend
cd BACKEND_TIENDA_NODE_MYSQL

# Instalar dependencias
npm install

# Crear variables de entorno (.env ya está configurado)
# Verificar que sean:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=tienda_db
# PORT=3000

# Inicializar base de datos
node scripts/init-db.js

# Iniciar servidor
npm start
# O en modo desarrollo:
npm run dev
✅ El servidor debe mostrar: ✓ Servidor corriendo en puerto 3000

3️⃣ Abrir Frontend
Dashboard (Administración):

Abrir: file:///C:/Users/desarrollo/Music/TIENDA_COMIDAS/DASHBOARD/index.html
Tienda (Cliente):

Abrir: file:///C:/Users/desarrollo/Music/TIENDA_COMIDAS/TIENDA_COMIDAS_COMPRAS/index.html
📋 Endpoints de la API
Productos
GET /api/productos - Listar todos
GET /api/productos/:id - Obtener uno
POST /api/productos - Crear
PUT /api/productos/:id - Actualizar
DELETE /api/productos/:id - Eliminar
Clientes
GET /api/clientes - Listar todos
GET /api/clientes/:id - Obtener uno
POST /api/clientes - Crear
PUT /api/clientes/:id - Actualizar
DELETE /api/clientes/:id - Eliminar
Pedidos
GET /api/pedidos - Listar todos
GET /api/pedidos/:id - Obtener uno
POST /api/pedidos - Crear
PUT /api/pedidos/:id - Actualizar
PATCH /api/pedidos/:id/estado - Cambiar estado
DELETE /api/pedidos/:id - Eliminar
Usuarios
GET /api/usuarios - Listar todos
GET /api/usuarios/:id - Obtener uno
POST /api/usuarios - Crear
PUT /api/usuarios/:id - Actualizar
DELETE /api/usuarios/:id - Eliminar
✨ Características Implementadas
✅ Backend
 Servidor Node.js con Express
 Conexión MySQL con pool
 CORS habilitado
 Validaciones en endpoints
 Transacciones en pedidos
 Manejo de errores
 Base de datos con datos iniciales
✅ Dashboard
 CRUD completo de Productos
 CRUD completo de Clientes
 CRUD completo de Pedidos
 Cambio de estado de pedidos
 CRUD completo de Usuarios
 Dashboard con estadísticas
 Validación de formularios
 Mensajes de éxito/error
 Interfaz responsiva
✅ Tienda de Compras
 Catálogo de productos desde API
 Carrito con localStorage
 Agregar/quitar productos
 Cambiar cantidad
 Cálculo de totales automático
 Domicilio incluido
 Formulario de checkout validado
 Creación automática de clientes
 Registro de pedidos en BD
 Página de confirmación
 Interfaz responsiva
🧪 Datos de Prueba
Usuarios Predefinidos
Usuario: admin
Contraseña: admin123
Rol: administrador

Usuario: vendedor1
Contraseña: vendor123
Rol: vendedor

Usuario: cajero1
Contraseña: cajero123
Rol: cajero
Productos de Prueba
Hamburguesa Clásica - $10.50
Pizza Margarita - $12.00
Pollo Frito - $8.99
Ensalada César - $7.50
Sandwich de Jamón - $6.99
Clientes de Prueba
Juan Pérez - juan@example.com
María González - maria@example.com
Carlos López - carlos@example.com
🐛 Solución de Problemas
Error: "Cannot find module"
npm install
Error: "Connection refused"
Verifica que MySQL esté corriendo
En Windows: Services → MySQL80 (o tu versión)
Error: "Database does not exist"
node scripts/init-db.js
Error: "CORS error" o "Cannot GET /api/"
Verifica que el backend esté corriendo en puerto 3000
Abre la consola (F12) para ver detalles del error
Carrito no persiste
Verifica que localStorage esté habilitado en el navegador
En la consola: console.log(JSON.parse(localStorage.getItem('carrito')))
📊 Checklist de Entrega
Backend ✅
 Servidor corriendo en puerto 3000
 Base de datos creada y poblada
 Todos los endpoints funcionan
 CORS habilitado
 Validaciones implementadas
Dashboard ✅
 Módulo Productos: CRUD completo
 Módulo Clientes: CRUD completo
 Módulo Pedidos: CRUD + cambio de estado
 Módulo Usuarios: CRUD
 Formularios validan datos
 Mensajes de error/éxito
 Interfaz responsiva
Tienda ✅
 Se pueden agregar productos
 Carrito persiste al cambiar página
 Se puede modificar cantidad
 Se pueden eliminar productos
 Totales calculan correctamente
 Checkout valida datos
 Pedido se guarda en BD
 Muestra confirmación
Código ✅
 Código indentado y legible
 Funciones documentadas
 Variables descriptivas
 Sin errores en consola
 Manejo de errores
💡 Consejos
Abre la consola (F12) para ver errores de conexión
Usa Network tab para ver peticiones a la API
Prueba primero en el Dashboard para entender los datos
Luego prueba la Tienda con los datos populados
Mantén la console abierta durante pruebas
📚 Recursos
Fetch API
localStorage
Express.js
MySQL
Bootstrap 4
👨‍💻 Autor
Examen Final - Desarrollo Web Full Stack

📅 Fecha
Marzo 2026

¡Éxito en el examen! 🎉
