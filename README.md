# 💳 **Wallet API**

Una API para gestionar usuarios, transacciones y balances en una aplicación de billetera virtual. Construida con **NestJS** y **PostgreSQL**, esta API incluye autenticación JWT, documentación Swagger y un sistema de inicialización automática de datos.

---

## 🚀 **Características**

- **Gestión de Usuarios**: Crear usuarios, obtener perfiles y cargar saldo.
- **Transacciones**: Realizar transferencias entre usuarios (CONSIDERACIONES: ACTUALMENTE EL STATUS DE LA TRANSACCION DE GENERA DE MANERA ALEATORIA, PARA FINES PRÁCTICOS Y EVALUAR VARIOS CASOS).
- **Autenticación JWT**: Endpoints protegidos con autenticación basada en tokens.
- **Swagger**: Documentación interactiva para explorar la API.

---

## 🛠️ **Requisitos Previos**

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)

---

## 📥 **Instalación**

Sigue estos pasos para configurar y ejecutar la aplicación:

### 1. Clonar el repositorio
```bash
git clone https://github.com/nestordqa/virtual-wallet-api
cd virtual-wallet-api
```

### 2. Instalar dependencias
```bash
npm install --legacy-peer-deps
```

### 3. Crear el archivo `.env`
Crea un archivo `.env` en la raíz del proyecto:
```bash
touch .env
```

### 4. Configurar las variables de entorno
Abre el archivo `.env` y agrega las siguientes configuraciones (Puedes agregar los valores que prefieras o creas conveniente):
```env
PORT=3000
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
```

⚠️ **Importante**: Asegúrate de que estas variables sean correctas; de lo contrario, la aplicación no funcionará.

---

## ▶️ **Inicialización**

### Levantar la aplicación con Docker:
```bash
npm run docker:up
```

Esto iniciará los contenedores para la API y PostgreSQL.

### Detener los contenedores:
```bash
npm run docker:down
```
---

## 🌐 **Acceso a la API**

- La API estará disponible en:  
  👉 `http://localhost:3000/`

- La documentación interactiva de Swagger estará disponible en:  
  👉 `http://localhost:3000/api`

---

## 🛠️ **Scripts Disponibles**

| Comando               | Descripción                                      |
|-----------------------|--------------------------------------------------|
| `npm run start`       | Inicia la aplicación localmente.                 |
| `npm run start:dev`   | Inicia la aplicación en modo desarrollo.         |
| `npm run build`       | Compila la aplicación.                           |
| `npm run docker:up`   | Levanta los contenedores Docker.                 |
| `npm run docker:down` | Detiene y elimina los contenedores Docker.       |

---

## ⚙️ **Tecnologías Utilizadas**

- [NestJS](https://nestjs.com/) - Framework backend.
- [PostgreSQL](https://www.postgresql.org/) - Base de datos relacional.
- [TypeORM](https://typeorm.io/) - ORM para manejar la base de datos.
- [Swagger](https://swagger.io/) - Documentación interactiva de APIs.
- [Docker](https://www.docker.com/) - Contenerización para desarrollo y despliegue.

---

## 🤝 **Contribuciones**

¡Las contribuciones son bienvenidas! Si encuentras algún problema o tienes sugerencias, por favor abre un issue o envía un pull request.

---

🎉 ¡Gracias por usar Wallet API! Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarme. 😊

--- 