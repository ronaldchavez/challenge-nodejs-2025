# OlaClick Orders API

API RESTful para manejo de órdenes usando NestJS, Sequelize, PostgreSQL y Redis.  

---

## 🚀 Requisitos

- Node.js >= 20
- Docker & Docker Compose
- Yarn o NPM
- PostgreSQL y Redis (contenedores Docker incluidos)

---

## 🐳 Correr la aplicación con Docker

1. Construir y levantar contenedores:

```bash
docker compose -f docker-compose.yml up -d

2. Revisar los contenedores activos:

```bash
docker compose ps

3. Ver logs:

```bash
docker compose logs -f app-app-1

##⚡ Variables de Entorno

Crea un archivo .env en la raíz:

```bash
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=orders_db
REDIS_HOST=redis
REDIS_PORT=6379
PORT=3000
DAYS_TO_KEEP=7

### Health check endpoint

- **GET /ping**
- Respuesta:
```json
{
  "status": "ok",
  "timestamp": "2025-09-03T15:00:00.000Z"
}

## 📖 Documentación de Endpoints

Todos los endpoints están bajo /orders.

| Método | Ruta               | Descripción                                                   |
|--------|--------------------|---------------------------------------------------------------|
| GET    | `/orders`          | Listar órdenes (paginado, filtrado por estado opcional)       |
| POST   | `/orders`          | Crear nueva orden                                             |
| GET    | `/orders/:id`      | Obtener detalle de una orden                                  |
| POST   | `/orders/:id/advance` | Avanzar estado de la orden (`initiated → sent → delivered`) |

- Swagger UI: http://localhost:3000/api

- Postman: Importa el archivo postman_collection.json si está en el repo.

- cURL ejemplos:

###Crear orden

``bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{
  "clientName": "Juan Pérez",
  "items": [
    { "name": "Pizza", "quantity": 2 },
    { "name": "Refresco", "quantity": 1 }
  ]
}'

###Listar órdenes

``bash
curl http://localhost:3000/orders

###Avanzar estado de una orden

``bash
curl -X POST http://localhost:3000/orders/1/advance

##🕒 Limpieza automática de órdenes entregadas

La aplicación incluye un cron job implementado con @nestjs/schedule que se ejecuta cada día a medianoche (0 0 * * *).

- Elimina automáticamente las órdenes con estado delivered cuya fecha de actualización (updatedAt) sea mayor al valor configurado en DAYS_TO_KEEP.

- Por defecto, se eliminan las órdenes entregadas con más de 7 días de antigüedad.

###Configuración

Puedes ajustar este valor en el archivo .env:

``bash
DAYS_TO_KEEP=7

###Logs

Cada vez que se ejecuta, el cron escribe en consola cuántas órdenes fueron eliminadas:

``bash
Cada vez que se ejecuta, el cron escribe en consola cuántas órdenes fueron eliminadas:

### 🧪 Pruebas automatizadas

- Se incluyen pruebas E2E con Jest.
 
``bash
yarn test:e2e

## 💡 Consideraciones técnicas

- NestJS modular: Modules, Controllers, Services, Repositories.

- Principios SOLID: cada módulo tiene responsabilidades claras.

- ORM Sequelize: usando sequelize-typescript con PostgreSQL.

- DTOs y Pipes: para validaciones de entrada.

- Redis: caché de consultas.

- Manejo de errores: NotFoundException, BadRequestException, y filtro global AllExceptionsFilter.

- Docker: contenerización completa.

- Jobs programados: eliminación automática de órdenes entregadas con @nestjs/schedule.

- Logging y observabilidad: interceptors y cron job logs.

## ️ Comandos útiles

- Levantar contenedores: docker compose up -d

- Parar contenedores: docker compose down

- Ejecutar migraciones: (si usas sequelize-cli)

## Correr la app local sin Docker:

``bash
yarn install
yarn start:dev

## ✅ Extras

- Paginación con nestjs-paginate

- Filtrado por estado opcional

- Cron job para limpieza de órdenes entregadas

- Swagger para documentación automática

## 4️⃣ Preguntas adicionales del challenge

###¿Cómo desacoplarías la lógica de negocio del framework NestJS?

- Crear servicios puros que no dependan de NestJS.

- Controllers solo reciben requests y llaman a los servicios.

- Los servicios pueden ser testeados de manera independiente usando Jest.

###¿Cómo escalarías esta API para soportar miles de órdenes concurrentes?

- Horizontal scaling: levantar múltiples instancias de la app con un load balancer.

- Base de datos: usar replicación y pooling de conexiones en PostgreSQL.

- Cache: Redis para reducir consultas repetitivas.

- Colas de procesamiento: para operaciones pesadas, usar BullMQ o RabbitMQ.

###¿Qué ventajas ofrece Redis en este caso y qué alternativas considerarías?

###Ventajas:

- Reduce carga en la base de datos con cache de consultas frecuentes (GET /orders).

- Alta velocidad y soporte para TTL (auto-expiración).

###Alternativas:

- Memcached (solo cache de key-value simple).

- Bases de datos en memoria como Hazelcast o Aerospike.

