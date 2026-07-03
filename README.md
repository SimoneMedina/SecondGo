# 🛍️ SecondGo

SecondGo es una plataforma web de compra y venta de articulos de segunda mano.
El proyecto separa la experiencia por rol:

- `Comprador`: explora productos, revisa tiendas y consulta reseñas.
- `Vendedor`: crea su tienda, publica productos y gestiona su catalogo.

Actualmente el proyecto corre con `Next.js` en frontend, `NestJS` en backend, `PostgreSQL` como base de datos y `MinIO` para almacenar imagenes.

## ✨ Funcionalidades actuales

### Autenticacion y roles

- Registro con seleccion de rol `comprador` o `vendedor`.
- Login con JWT.
- Persistencia de sesion en frontend.
- Identificacion de rol en backend y frontend.
- IDs de usuario generados con `UUID`.

### Flujo de vendedor

- Creacion de una tienda por vendedor.
- Carga opcional de logo de tienda.
- Creacion de productos con:
  - nombre
  - descripcion
  - color
  - talla
  - estado
  - multiples fotos
- Validacion para impedir publicar productos si el vendedor aun no tiene tienda.
- Vista de `Mis Productos`.
- Vista de `Mi Tienda`.

### Flujo de comprador

- Catalogo general de productos.
- Vista de tiendas registradas.
- Vista de reseñas.
- Navegacion adaptada al rol.

### Fotos y almacenamiento

- Subida de fotos con `multipart/form-data`.
- Almacenamiento de imagenes en `MinIO`.
- URLs publicas para logos y fotos.
- Estructura por vendedor dentro del bucket:
  - `vendedores/{id_vendedor}/tienda/...`
  - `vendedores/{id_vendedor}/productos/{id_producto}/...`

### Productos

- Multiples fotos por producto.
- Vista previa local antes de subir imagenes.
- Galeria simple por producto en el catalogo.
- Tallas configuradas:
  - `XXS`
  - `XS`
  - `S`
  - `M`
  - `L`
  - `XL`
  - `XXL`
  - `XXXL`
- Estados disponibles:
  - `Como nuevo`
  - `Usado`
  - `Reacondicionado`

## 🧱 Stack

### Frontend

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `Axios`

### Backend

- `NestJS`
- `TypeORM`
- `PostgreSQL`
- `JWT`
- `MinIO SDK`

### Infra local

- `Docker Compose`
- `PostgreSQL 16`
- `MinIO`

## 🗂️ Estructura del proyecto

```text
SecondGo/
├─ backend/              # API NestJS
├─ frontend/             # App Next.js
├─ docker-compose.yml    # PostgreSQL + MinIO
└─ README.md
```

## 🔌 Puertos locales

| Servicio | URL / Puerto |
| --- | --- |
| Frontend | `http://localhost:3130` |
| Backend API | `http://localhost:3131/api` |
| Health check | `http://localhost:3131/api/health` |
| PostgreSQL | `localhost:25432` |
| MinIO API | `http://localhost:29100` |
| MinIO Console | `http://localhost:29101` |

## 🔐 Credenciales locales

### PostgreSQL

- Usuario: `postgres`
- Password: `postgres`
- Base de datos: `secondgo`

### MinIO

- Usuario: `minioadmin`
- Password: `minioadminpassword`
- Bucket usado por la app: `secondgo-fotos`

## 🚀 Ejecucion local

### 1. Levantar servicios de infraestructura

```bash
docker compose up -d
```

### 2. Iniciar backend

```bash
cd backend
npm install
npm run start:dev
```

### 3. Iniciar frontend

```bash
cd frontend
npm install
npm run dev
```

## ⚙️ Variables de entorno actuales

### Backend: `backend/.env`

```env
DB_HOST=localhost
DB_PORT=25432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=secondgo

JWT_SECRET=SecondGo_JWT_SuperSecretKey_2026_Migration
JWT_EXPIRES_IN=60m

PORT=3131

MINIO_ENDPOINT=localhost
MINIO_PORT=29100
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadminpassword
MINIO_BUCKET=secondgo-fotos
MINIO_PUBLIC_URL=http://localhost:29100
```

### Frontend: `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3131/api
```

## 🧭 Rutas principales

### Frontend

- `/login`
- `/registro`
- `/`
- `/tiendas`
- `/tiendas/crear`
- `/productos`
- `/productos/crear`
- `/resenas`

### Backend API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tiendas`
- `GET /api/tiendas/mi-tienda`
- `POST /api/tiendas`
- `GET /api/productos`
- `GET /api/productos/tienda/:usuarioTienda`
- `POST /api/productos`
- `GET /api/resenas`
- `POST /api/resenas`

## 🧠 Reglas de negocio implementadas

- Un `vendedor` puede tener una sola tienda.
- Los productos quedan ligados automaticamente a la tienda del vendedor autenticado.
- Un `comprador` no puede publicar productos.
- Las fotos de productos y logos de tienda se guardan fuera de la base de datos.
- El backend usa `synchronize: true` con TypeORM en el estado actual del proyecto.

## 📦 Estado actual del proyecto

SecondGo ya permite probar un flujo funcional de punta a punta:

1. Registrar un vendedor.
2. Crear su tienda.
3. Publicar productos con imagenes.
4. Registrar un comprador.
5. Explorar catalogo, tiendas y reseñas desde el frontend.

## 🛠️ Scripts utiles

### Backend

```bash
npm run build
npm run start:dev
npm run test
```

### Frontend

```bash
npm run dev
npm run build
npm run lint
```

## 📌 Nota

El proyecto esta en una etapa funcional de desarrollo. La base actual prioriza flujo real y validaciones del negocio principal sobre acabados finales, migraciones formales o paneles administrativos completos.
