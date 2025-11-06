# TUP-ProyectoFinal
# Nutrición App - Entorno de Desarrollo

Bienvenido al proyecto. Esta guía explica cómo levantar el entorno de desarrollo completo, incluyendo la base de datos, el backend y el frontend.

## Tecnologías Principales:

* **Frontend:** React, Vite, TypeScript
* **Backend:** Node.js, Express, Sequelize, TypeScript
* **Base de Datos:** PostgreSQL
* **Entorno:** Docker & Docker Compose

## Prerrequisitos:

Hay que tener instalado en la maquina local:

* Git
* [Node.js](https://nodejs.org/es) (versión 20+ recomendada)
* [Docker](https://www.docker.com/products/docker-desktop/)

## Configuración (Solo la primera vez)

Antes de levantar los servicios, necesitas configurar el proyecto.

### 1. Crear el archivo con las variables de entorno

Crear un archivo .env en la raíz del proyecto con el siguiente contenido:
# Puerto del Backend
PORT=4000
# Variables de la Base de Datos
DB_NAME=nutricion_db
DB_USER=postgres
DB_PASS=admin123
DB_DIALECT=postgres
DB_PORT=5432

### 2. Levantar el entorno

Todo el entorno se levanta con un solo comando en una sola terminal.
* 1. Asegurarse de estar en la carpeta raíz del proyecto (no dentro de frontend ni backend).
* 2. Ejecutar el siguiente comando: `docker-compose up --build`
* 3. Asegurarse de que el back está corriendo en: http://localhost:4000/
* 4. Asegurarse de que el front está corriendo en: http://localhost:5173/

### 3. Importante

La primera vez que se use el entorno, y cada vez que se modifique código, hay que usar:
`docker-compose up --build`
Luego, cada vez que se quiera levantar el servidor, simplemente puede usarse:
`docker-compose up`
