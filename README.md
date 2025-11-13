# TUP-ProyectoFinal
# Nutrición App - Entorno de Desarrollo

Bienvenido al proyecto. Esta guía explica cómo levantar el entorno de desarrollo completo, incluyendo la base de datos, el backend y el frontend.

## Tecnologías Principales:

* **Frontend:** React, Vite, TypeScript
* **Backend:** Node.js, Express, Sequelize, TypeScript, Zod, Jsonwebtoken
* **Base de Datos:** PostgreSQL
* **Entorno:** Docker & Docker Compose
* **Automatización:** Husky con hooks pre-commit

## Prerrequisitos:

Hay que tener instalado en la maquina local:

* Git
* [Node.js](https://nodejs.org/es) (versión 20+ recomendada)
* [Docker](https://www.docker.com/products/docker-desktop/)

## Configuración (Solo la primera vez)

Antes de levantar los servicios, necesitas configurar el proyecto.

### 1. Crear el archivo con las variables de entorno

Crear un archivo .env en la raíz del proyecto con el siguiente contenido:
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

### 2. Configuración por única vez para activar Husky
* 1. Desde la raíz, moverse con `cd backend` a la carpeta backend.
* 2. Ejecutar `npm install` para instalar las herramientas necesarias.
* 3. Listo! Volver a la carpeta raíz del proyecto con `cd ..` para levantar el entorno.

### 3. Levantar el entorno

* 1. Asegurarse de estar en la carpeta raíz del proyecto (no dentro de frontend ni backend).
* 2. Ejecutar el siguiente comando: `docker-compose up -d`
* 3. `cd backend` y `npm run dev`
* 4. Asegurarse de que el back está corriendo en: http://localhost:4000/
* 5. El back está listo para las consultas con postman

### 4. Importante