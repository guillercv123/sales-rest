# Sale REST API

Sale REST es una API desarrollada en Node.js, Express, TypeScript, y utiliza MySQL como base de datos. El proyecto está configurado para un flujo de trabajo moderno con Jest para testing, tsyringe para inyección de dependencias y Prisma como ORM.

### 📦 Instalación

Clona el repositorio:

`git clone https://github.com/tu_usuario/sale-rest.git`

Instala las dependencias:

`npm install`

Configura las variables de entorno:

Crea un archivo .env basado en el .env.example si existe, y define las variables necesarias (como la conexión a la base de datos, JWT secret, etc).

cp .env.example .env

### 🚀 Scripts disponibles


| Script | Descripción |
|:-------|:------------|
| `npm run dev` | Ejecuta el servidor en modo desarrollo con **Nodemon** y **ts-node**. |
| `npm run build` | Compila el proyecto **TypeScript** a **JavaScript** en la carpeta `dist/`. |
| `npm start` | Corre el proyecto ya compilado (`dist/server.js`). |
| `npm run test` | Ejecuta todos los tests usando **Jest**. |

### 🛠️ Tecnologías principales

* Node.js + Express
* TypeScript
* MySQL (mysql2)
* Prisma ORM
* JWT para autenticación
* Bcrypt para hash de contraseñas
* Jest y Supertest para pruebas
* tsyringe para inyección de dependencias
* nodemailer para envíos de correos
* dotenv para manejo de variables de entorno

### 📂 Estructura básica del proyecto
```
src/
├── config/
├── constants/
├── controllers/
├──── test/
├── db/
├── dto/
├── middlewares/
├── repositories/
├── routes/
├── services/
├──── test/
├── types/
├── utils/
├── server.ts
├── app.ts
.env
package.json
tsconfig.json
jest.config.ts
```

### ✅ Testing

El proyecto usa Jest para unit tests e integración.
Para correr los tests:

`npm run test`

Puedes crear tus tests en la carpeta /tests.

👨‍💻 Autor
Proyecto desarrollado por Segundo Guillermo Crespin Villarreal.