# NutriApp - Backend API

Backend desarrollado para la aplicación de gestión nutricional. Provee una API RESTful construida con Node.js, Express y TypeScript, utilizando una base de datos PostgreSQL gestionada con Sequelize.

## Tecnologías

- **Runtime:** Node.js (v20+)
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL
- **ORM:** Sequelize (con Sequelize-CLI para migraciones)
- **Validación:** Zod
- **Autenticación:** JSON Web Tokens (JWT)
- **Entorno:** Docker & Docker Compose
- **Testing:** Vitest + Supertest
- **Calidad de Código:** ESLint + Prettier + Husky (pre-commit/pre-push hooks)

## Prerrequisitos

Asegúrate de tener instalado en tu máquina:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (Versión 20 o superior)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Debe estar corriendo)

## Instalación y Configuración (Paso a Paso)

Sigue este orden exacto para evitar errores de conexión.

### Paso 1: Configurar Variables de Entorno

El proyecto necesita un archivo .env en la **raíz del proyecto**.

\# En la terminal raíz (si aún no lo tienes y en caso de estar en Windows debes usar Powershell)
cp .env.example .env  

### Paso 2: Levantar la Base de Datos (Terminal 1)

Abre una terminal en la raíz del proyecto y enciende el motor de la base de datos. (Asegurarse antes de que Docker está corriendo)

`docker-compose up` o `docker-compose up -d` (en segundo plano)

Si usas la segunda opción, hay que asegurarse de luego "remover" el contenedor con `docker-compose down`

**Importante:** Espera unos 10-15 segundos después de ejecutar este comando para que PostgreSQL termine de iniciarse antes de continuar.

### Paso 3: Instalar y Migrar (Terminal 2)

Abre una **segunda terminal**, navega a la carpeta del backend y prepara el código.

\# 1. Entrar al backend  
cd backend  
<br/>\# 2. Instalar dependencias  
npm install
<br/>\# 3. Crear las tablas en la base de datos (Migraciones)  
\# (Esto requiere que el Paso 2 esté listo)  
npm run db:migrate  

_Deberías ver un mensaje de éxito indicando que se crearon las tablas Usuarios, Pesos, Alimentos, Comidas, Comidas-Alimentos_

## Ejecución

### Modo Desarrollo (con Hot-Reloading)

Para trabajar en el código y ver cambios en tiempo real. (Asegúrate de haber completado los pasos anteriores).

\# En la terminal de 'backend/'  
npm run dev  

La API estará disponible en: `<http://localhost:4000/api/v1>`

## Testing

El proyecto cuenta con tests de integración que prueban el flujo completo (Ruta -> Controlador -> BD).

\# Ejecutar todos los tests  
npm test o npm run test
<br/>\# Ejecutar tests con interfaz gráfica  
npm run test:ui  

## Documentación de la API

Todas las rutas están prefijadas con /api/v1.

### Autenticación (/auth)

- **POST** /auth/register: Registrar nuevo usuario.
- **POST** /auth/login: Iniciar sesión (Devuelve Token).

### Pesos (/pesos)

_(Requiere Header Authorization: Bearer &lt;token&gt;)_

- **POST** /: Registrar nuevo pesaje.
- **GET** /: Ver historial de pesos.
- **DELETE** /:id_peso: Eliminar un registro.

### Alimentos (/alimentos)

_(Requiere Header Authorization: Bearer &lt;token&gt;)_

- **POST** /: Crear un alimento base (ej. "Manzana").
- **GET** /: Listar alimentos disponibles.
- **DELETE** /:id_alimento: Borrar un alimento.

### Comidas (/comidas)

_(Requiere Header Authorization: Bearer &lt;token&gt;)_

- **POST** /: Crear una cabecera de comida (ej. "Almuerzo", fecha).
- **GET** /: Listar las comidas del usuario.
- **DELETE** /:id_comida: Borrar una comida entera.

### Detalle de Comidas (/comidas_alimentos)

_(Requiere Header Authorization: Bearer &lt;token&gt;)_

- **POST** /: Agregar un alimento a una comida (calcula macros automáticamente según cantidad).
- **GET** /: Ver qué alimentos tiene cada comida.
- **DELETE** /:id_comida_alimento: Quitar un alimento de una comida.

## Estructura del Proyecto

- src/app.ts: Configuración de Express y Rutas (Cerebro).
- src/index.ts: Punto de entrada, conexión a DB y servidor (Arrancador).
- src/config/: Configuración de base de datos y variables.
- src/controllers/: Lógica de negocio de cada módulo.
- src/models/: Definición de tablas Sequelize y relaciones.
- src/routes/: Definición de endpoints y middlewares.
- src/schemas/: Validaciones de datos con Zod.
- src/middlewares/: Protección de rutas (Auth) y validación.
- src/migrations/: Historial de cambios de la Base de Datos.
- src/tests/: Tests de integración con Vitest.