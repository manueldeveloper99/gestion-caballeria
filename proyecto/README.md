# Sistema de Gestión de Caballeriza

## Descripción

Sistema web desarrollado para la administración de una caballeriza. Permite gestionar caballos, personal, inventario, planes de alimentación, suministros, reservas y usuarios.

## Tecnologías Utilizadas

### Backend

* Java 21
* Spring Boot
* Spring Data JPA
* Hibernate
* MySQL
* Maven

### Frontend

* React
* Vite
* JavaScript
* CSS

## Funcionalidades

### Gestión de Caballos

* Registro de caballos
* Consulta y edición de información
* Historial médico

### Gestión de Personal

* Registro de empleados
* Asignación de roles
* Gestión de turnos y tareas

### Alimentación e Inventario

* Planes de alimentación
* Registro de suministros
* Control de inventario
* Alertas de stock bajo

### Seguridad

* Inicio de sesión
* Roles de usuario
* Control de acceso según permisos

## Instalación

### Base de Datos

1. Crear una base de datos MySQL llamada:

sql
caballeriza_db


2. Configurar las credenciales en:

properties
application.properties


### Backend

bash
cd proyecto
./mvnw spring-boot:run


Servidor disponible en:

text
http://localhost:8080


### Frontend

bash
cd frontend
npm install
npm run dev


Aplicación disponible en:

text
http://localhost:5173


## API

La documentación de la API se encuentra disponible mediante Swagger:

```text
http://localhost:8080/swagger-ui/index.html
```

## Integrantes

* Manuel
* Ashly
* Carolina

## Arquitectura

El proyecto utiliza una arquitectura en capas:

Controller → Service → Repository → Base de Datos

y una arquitectura Cliente-Servidor basada en API REST.
