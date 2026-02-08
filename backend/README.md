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

---

## Instalación y Configuración (Paso a Paso)

Sigue este orden exacto para evitar errores de conexión.

### Paso 1: Configurar Variables de Entorno

El proyecto necesita un archivo .env en la **raíz del proyecto**.

En la terminal raíz (si aún no lo tienes y en caso de estar en Windows debes usar Powershell)
`cp .env.example .env`  

En caso de querer crear el archivo manualmente, utiliza los siguientes datos:
```markdown
## Configuración del Servidor
PORT=4000

## Configuración de la Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin_nutri
DB_PASSWORD=password_seguro_123
DB_NAME=nutricion_db
DB_DIALECT=postgres

## Configuración de Autenticación
## Usado por el backend
JWT_SECRET="un_secreto_muy_largo"
JWT_EXPIRES_IN="1d"
```
---
### Paso 2: Levantar la Base de Datos (Terminal 1)

Abre una terminal en la raíz del proyecto y enciende el motor de la base de datos. (Asegurarse antes de que Docker está corriendo)

`docker-compose up` o `docker-compose up -d` (en segundo plano)

Asegurate de usar `docker-compose down` cuando hayas finalizado con cada prueba, para asegurar que no haya conflictos con contenedores repetidos.

**Importante:** Espera unos 10-15 segundos después de ejecutar este comando para que PostgreSQL termine de iniciarse antes de continuar.

---
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

### Nota:
Como se está probando el sistema real, si el contenedor de docker no está activo, los tests fallarán

\# Ejecutar todos los tests  
npm test o npm run test
<br/>\# Ejecutar tests con interfaz gráfica  
npm run test:ui

---
## Pruebas con Postman (Automatizadas)

Hemos incluido una colección inteligente (NutriApp_Collection.json) que maneja la autenticación automaticamente con un script.

### 1. Importar la Colección

1. Abre Postman.

2. Haz clic en "Import".

3. Arrastra el archivo NutriApp_Collection.json (ubicado en la raíz).

### 2. Autenticación Automática

No necesitas copiar y pegar tokens manualmente. La colección tiene un script que lo hace automaticamente.

1. Abre la carpeta "1. Autenticación".

2. Ejecuta la petición "Login" (asegúrate de que el usuario ya esté registrado).

3. Un script automático capturará el token de la respuesta y lo guardará en la variable jwt_token.

4. Ahora puedes ejecutar cualquier otra petición (Pesos, Alimentos, etc.) y funcionará inmediatamente.

5. Todas las peticiones son inteligentes y tienen un script para usar el ID recién creado, y no tener que modificarlo manual.

### Advertencia sobre el Orden de Pruebas:
Ejecute las pruebas de eliminación (DELETE) al final.
Si borra un recurso (ej: un Alimento) antes de tiempo, otras pruebas que dependen de él (ej: "Agregar Alimento a Comida") fallarán con error 404 porque el recurso ya no existe.

### Nota sobre Datos de Prueba (Seeders):
Para esta entrega de prototipo, la carga de datos inicial se realiza manualmente utilizando esta colección de Postman.
Para la versión final, se implementarán Seeders automáticos (npm run db:seed) que van a rellenar la base de datos instantáneamente.

---
## Documentación de los Endpoints

Todas las rutas están prefijadas con /api/v1.

### Autenticación (/auth)

- **POST** /auth/register: Registrar nuevo usuario.
- **POST** /auth/login: Iniciar sesión (Devuelve Token).
- **POST** /auth/logout: Cerrar sesión

#### Gestión de Usuario
- **GET**    /usuarios/profile   Obtener perfil
- **PUT**    /usuarios/profile    Actualizar perfil
- **PUT**    /usuarios/change-password  Cambiar contraseña
- **DELETE** /usuarios/account   Eliminar cuenta

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

---
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