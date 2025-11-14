# **TUP-ProyectoFinal**

# **Nutrición App \- Entorno de Desarrollo**

Bienvenido al proyecto. Esta guía explica cómo levantar el entorno de desarrollo completo, incluyendo la base de datos, el backend y el frontend.

## **Tecnologías Principales:**

* **Frontend:** React, Vite, TypeScript  
* **Backend:** Node.js, Express, Sequelize, TypeScript, Zod, Jsonwebtoken  
* **Base de Datos:** PostgreSQL  
* **Entorno:** Docker & Docker Compose  
* **Automatización:** Husky con hooks pre-commit

## **Prerrequisitos:**

Hay que tener instalado en la maquina local:

* Git  
* [Node.js](https://nodejs.org/es) (versión 20+ recomendada)  
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (¡Asegúrate de que esté **corriendo** antes de empezar\!)

## **Configuración y Primer Arranque**

Sigue estos pasos la primera vez que clonas el repositorio.

### **1\. Configurar Variables de Entorno**

Este proyecto necesita un archivo .env en la raíz para funcionar.

1. Busca el archivo .env.example en la raíz del proyecto.  
2. Copia ese archivo y renuévalo a .env. (El archivo .env está ignorado por Git y nunca se subirá).  
3. Revisa el contenido. Los valores por defecto deberían funcionar para desarrollo local.

\# En la terminal raíz (solo la primera vez)  
cp .env.example .env

### **2\. Levantar la Base de Datos (Docker)**

Nos aseguramos de que la base de datos PostgreSQL esté corriendo.

\# En la terminal raíz  
docker-compose up \-d

### **3\. Instalar Dependencias del Backend**

En una terminal separada, navega al backend e instala todo.

cd backend  
npm install

### **4\. Ejecutar las Migraciones (¡Paso Clave\!)**

Ahora que la BD está corriendo y las dependencias están instaladas, necesitamos "construir" las tablas (Usuarios, Pesos, etc.).

\# En la terminal de 'backend/'  
npm run db:migrate

*(Deberías ver un mensaje de éxito diciendo que las migraciones se ejecutaron).*

## **Desarrollo Día a Día**

Una vez que has hecho la configuración inicial, este es tu flujo de trabajo diario:

1. **Terminal 1 (Base de Datos):** Asegúrate de que tu contenedor esté corriendo.  
   \# En la terminal raíz  
   docker-compose up \-d

2. **Terminal 2 (Backend):** Inicia el servidor de Node.js con hot-reload.  
   \# En la terminal de 'backend/'  
   npm run dev

   *(Espera a que diga: "Servidor corriendo en http://localhost:4000")*  

## **Documentación de la API (Endpoints)**

### **Módulo: Autenticación (/api/v1/auth)**

#### **POST /api/v1/auth/register**

Registra un nuevo usuario.

* **Body (JSON):**  
  {  
    "nombre\_usuario": "Usuario de Prueba",  
    "email": "prueba@correo.com",  
    "password": "password123",  
    "fecha\_nacimiento": "1995-01-01T00:00:00.000Z"  
  }

* **Respuesta (201):** El objeto del usuario creado (sin la contraseña).

#### **POST /api/v1/auth/login**

Inicia sesión y devuelve un token JWT.

* **Body (JSON):**  
  {  
    "email": "prueba@correo.com",  
    "password": "password123"  
  }

* **Respuesta (200):**  
  {  
    "message": "Inicio de sesión exitoso",  
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  
    "usuario": { "id": 1, "email": "prueba@correo.com", ... }  
  }

### **Módulo: Pesos (/api/v1/pesos)**

*Todas las rutas de este módulo requieren un Token (Authorization: Bearer \<token\>)*

#### **POST /api/v1/pesos**

Crea un nuevo registro de peso para el usuario autenticado.

* **Body (JSON):**  
  {  
    "peso\_kg": 75.5,  
    "comentario": "Mi primer peso"  
  }

* **Respuesta (201):** El objeto del peso creado.

#### **GET /api/v1/pesos**

Obtiene todos los registros de peso del usuario autenticado.

* **Respuesta (200):** Un array \[\] de objetos de peso.

#### **DELETE /api/v1/pesos/:id\_peso**

Elimina un registro de peso específico.

* **Respuesta (204):** Sin contenido.