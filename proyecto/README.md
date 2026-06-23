# Sistema de Gestión de Caballería - Backend API

Este repositorio contiene el código fuente del backend para el Sistema de Gestión de Caballería, desarrollado en Spring Boot. El backend proporciona una API RESTful completa para la administración del personal, caballos, caballerizas, inventario y reservas.

## Requisitos
- **Java 17+**
- **Maven**
- **MySQL** (Base de datos corriendo en `localhost:3306` con base de datos `caballeria_db`)

## Ejecutar el Proyecto
Puedes ejecutar el backend directamente utilizando el wrapper de Maven:

```bash
./mvnw spring-boot:run
```

El servidor backend iniciará en `http://localhost:8080`.

## Documentación Interactiva (Swagger / OpenAPI)
La API cuenta con documentación automatizada generada mediante `springdoc-openapi`.
Una vez que el servidor backend esté ejecutándose, puedes acceder a la interfaz gráfica interactiva en:

👉 **[http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)**

### ¿Cómo probar la API en Swagger (Ejemplo de Autenticación)?

La mayoría de los endpoints están protegidos por seguridad JWT. Para probar los endpoints desde Swagger, sigue estos pasos:

1. **Obtener un Token:**
   - Abre la pestaña del controlador `usuario-controller` en Swagger.
   - Selecciona el endpoint `POST /api/usuarios/login`.
   - Presiona en **"Try it out"**.
   - En el `request body`, ingresa las credenciales de un administrador. (Ejemplo por defecto):
     ```json
     {
       "correo": "admin@caballeria.com",
       "password": "admin"
     }
     ```
   - Presiona **Execute**.
   - En la respuesta (Response body), copia el valor del `token` generado (sin las comillas).

2. **Autorizar Swagger:**
   - En la parte superior de la página de Swagger, busca el botón verde **"Authorize"** 🔒.
   - En el cuadro de texto etiquetado como `BearerAuth (http, Bearer)`, pega el token que copiaste.
   - Presiona el botón **Authorize** y luego **Close**.
   
3. **Ejecutar Consultas Seguras:**
   - ¡Listo! Ahora el candado de los demás endpoints estará cerrado y podrás enviar peticiones POST, PUT o DELETE como un usuario autenticado.

## Integración Móvil
Esta API está diseñada para un fácil consumo por aplicaciones móviles:
- Respuestas estandarizadas en JSON.
- Manejo de excepciones y errores consistentes (con respuestas HTTP como 400, 401, 403, 404 y 500).
- Soporte para endpoints paginados usando `Pageable` para optimizar la transferencia de datos masivos (ej. `GET /api/caballos/page?page=0&size=10`).
