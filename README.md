# E-commerce — Projeto 3

Este é o e-commerce do Projeto 2 já resolvido, com InversifyJS e os modos `dev` e `test`. Ele é o ponto de partida deste trabalho.

## Como rodar

```bash
cp .env.example .env
docker compose up --build
```

A API sobe em `http://localhost:3000`. Na primeira subida o `npm start` cria as tabelas no PostgreSQL e cadastra os produtos, então não há migração nem seed para rodar à mão.

Para parar, use `docker compose down`: os pedidos continuam no volume `dados-banco`. Para apagar também os dados, use `docker compose down -v`.

O modo continua sendo escolhido pelo `APP_ENV` no `.env`:

| | `APP_ENV=dev` (padrão) | `APP_ENV=test` |
|---|---|---|
| E-mail | Ethereal (precisa de internet), devolve `emailPreview` | impresso no log da api (`docker compose logs api`) |
| Pedidos | gravados no PostgreSQL | guardados em memória, somem ao reiniciar |

Os produtos vêm do PostgreSQL nos dois modos. Depois de mudar o `APP_ENV`, rode `docker compose up --build` de novo.

Crie um pedido:

```bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{
  "customer": "cliente@ethereal.email",
  "items": [{ "productId": 1, "quantity": 1 }],
  "paymentMethod": "pix"
}'
```

Busque o pedido pelo `orderId` que veio na resposta:

```bash
curl http://localhost:3000/orders/1
```

Um `id` que não existe devolve `404`.

## Estrutura

```
src/
├── container/     # types.ts (os Symbols) e container.ts (único lugar que escolhe as classes concretas)
├── domain/        # produtos e pedido
├── errors/        # AppError
├── repositories/  # IOrderRepository, IProductRepository, versões Prisma e InMemoryOrderRepository
├── providers/     # IMailProvider, EtherealMailProvider e ConsoleMailProvider
├── payments/      # IPaymentMethod, uma classe por forma de pagamento e o PaymentMethodRegistry
├── services/      # OrderService e NotificationService
├── controllers/   # OrderController: só HTTP
├── app.ts         # pede o OrderController ao container e registra as rotas
└── server.ts      # carrega reflect-metadata e .env e sobe o servidor
```

---

## O que foi feito

- **PostgreSQL:** no `prisma/schema.prisma`, o `provider` virou `postgresql` e a `url` passou a ser `env("DATABASE_URL")`. Apaguei a pasta `prisma/migrations`, que era do SQLite. Os dois modelos continuam iguais. Para a troca de banco não foi preciso mexer em nenhum arquivo de `services/` nem de `controllers/`.
- **Docker Compose:** o `compose.yaml` tem dois serviços. O `banco` usa o `postgres:16-alpine`, não publica porta e tem um `healthcheck` com `pg_isready`. A `api` é construída pelo `Dockerfile` e só sobe quando o banco está saudável (`depends_on` com `service_healthy`). Os dados ficam no volume `dados-banco`.
- **`npm start`:** roda `prisma db push`, o seed e o servidor. O seed usa `upsert`, então pode rodar a cada subida sem duplicar produtos.
- **`GET /orders/:id`:** passa pelas três camadas.
  - `OrderController.getOrderById` só lê o `id` e devolve a resposta.
  - `OrderService.getOrderById` tem a regra: pedido que não existe lança `AppError` 404, e um `id` que não é número lança 400.
  - `IOrderRepository.findById` foi implementado no `PrismaOrderRepository` (que converte os itens de JSON de volta para lista) e no `InMemoryOrderRepository`. A rota funciona nos dois modos.
- **Controller:** o tratamento de erro dos dois métodos foi para um método privado, `handleError`, para não repetir o `catch`.
