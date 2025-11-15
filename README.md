# API Gateway (SOA)

Este proyecto es un API Gateway desarrollado con Node.js, Express.js y TypeScript. Su propósito principal es actuar como un punto de entrada único para una arquitectura de microservicios, enrutando las peticiones entrantes al servicio correspondiente.

## Descripción

El API Gateway centraliza el manejo de peticiones y las redirige a los diferentes microservicios que componen la aplicación (Autenticación, Chat, Publicaciones, etc.). Esto simplifica la arquitectura del cliente, mejora la seguridad y facilita la gestión de aspectos transversales como el logging, la autenticación y el enrutamiento.

## Funcionamiento

Utiliza la librería `http-proxy-middleware` para crear un proxy inverso. Las rutas están configuradas para que cualquier petición que llegue a un path específico (ej. `/api/auth`) sea redirigida al microservicio correspondiente. Las URLs de destino de los microservicios se gestionan a través de variables de entorno, lo que permite una configuración flexible para diferentes entornos (desarrollo, producción, etc.).

## Cómo Ejecutar el Proyecto

Existen dos maneras principales de ejecutar el API Gateway: para desarrollo local o usando Docker para un entorno de producción o contenerizado.

### 1. Desarrollo Local

Ideal para desarrollar y depurar.

1.  **Clonar el repositorio:**
    ```bash
    git clone <url-del-repositorio>
    cd gateway
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade las URLs de los microservicios. Puedes usar el siguiente ejemplo como plantilla:

    ```env
    # .env.example
    
    # Puerto para el API Gateway
    PORT=5000
    
    # URLs de los microservicios locales
    AUTH_URL=http://localhost:3001
    CHAT_URL=http://localhost:3002
    POSTS_URL=http://localhost:3003
    NOTIFICATIONS_URL=http://localhost:3004
    ```

4.  **Ejecutar el servidor de desarrollo:**
    Este comando utiliza `ts-node-dev` para compilar y reiniciar automáticamente el servidor cuando detecta cambios en el código.
    ```bash
    npm run dev
    ```

    El API Gateway estará disponible en `http://localhost:5000`.

### 2. Usando Docker

Este es el método recomendado para simular un entorno de producción y para ejecutar el gateway junto con el resto de microservicios de forma aislada.

1.  **Requisitos:**
    Asegúrate de tener Docker y Docker Compose instalados en tu sistema.

2.  **Construir y ejecutar el contenedor:**
    Desde la raíz del proyecto, ejecuta el siguiente comando:
    ```bash
    docker-compose up --build
    ```
    Este comando construirá la imagen de Docker para el API Gateway (usando el `Dockerfile`) y la iniciará. Las variables de entorno se inyectan directamente desde el archivo `docker-compose.yml`, por lo que no es necesario un archivo `.env`.

    El API Gateway estará disponible en `http://localhost:5000`.

## Futuras Actualizaciones

Este proyecto está en desarrollo activo. Las futuras actualizaciones pueden incluir:

-   Implementación de un mecanismo de autenticación y autorización centralizado (ej. JWT).
-   Añadir logging más robusto.
-   Implementar limitación de tasa (rate limiting) para proteger los servicios.
-   Integración con un servicio de descubrimiento para gestionar dinámicamente las rutas de los microservicios.