# E-commerce SOLID — Projeto 2

Este é o e-commerce do Projeto 1 já refatorado (SRP, OCP e LSP). Ele é o ponto de partida deste trabalho.

## Como rodar

```bash
npm install
cp .env.example .env
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

A API sobe em `http://localhost:3000`. O modo de execução é escolhido pela variável `APP_ENV` no arquivo `.env` (se ela não existir, vale `dev`). Para trocar de modo, mude só essa linha e reinicie o servidor.

| | `APP_ENV=dev` (padrão) | `APP_ENV=test` |
|---|---|---|
| E-mail | `EtherealMailProvider`: envia pelo Ethereal e devolve o link `emailPreview` | `ConsoleMailProvider`: imprime o e-mail no console |
| Pedidos | `PrismaOrderRepository`: grava no SQLite | `InMemoryOrderRepository`: guarda num array, some ao reiniciar |
| Internet | necessária (Ethereal) | **não** é necessária |

Nos dois modos os produtos continuam vindo do SQLite local, então rode `prisma:migrate` e `prisma:seed` antes.

Teste com:

```bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-d '{
  "customer": "cliente@ethereal.email",
  "items": [{ "productId": 1, "quantity": 1 }],
  "paymentMethod": "credit_card",
  "paymentDetails": { "cardNumber": "1234567812345678", "cvv": "123" }
}'
```

Produto `1` é o livro físico (R$ 100 + R$ 10 de frete), produto `2` é o e-book (R$ 50, sem frete). Formas de pagamento: `credit_card`, `debit_card` e `pix`.

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
├── app.ts         # pede o OrderController ao container e registra a rota
└── server.ts      # carrega reflect-metadata e .env e sobe o servidor
```

Os services e o controller recebem tudo pelo construtor (`@inject`), e o InversifyJS monta o grafo. As classes concretas só aparecem em `container/container.ts`.

---

---

## O que foi feito com base no projeto refatorado já enviado

Antes, as dependências eram montadas na mão, com `new`, no `app.ts`. Troquei isso pelo InversifyJS: o `container/container.ts` é o único arquivo que conhece as classes concretas, e o resto recebe o que precisa pelo construtor.

- **Container:** o `types.ts` tem um Symbol para cada dependência e o `container.ts` faz os `bind`. O provider de e-mail e os repositórios são singleton.
- **Decorators:** `@injectable()` nas classes e `@inject(TYPES.X)` em todos os parâmetros de construtor, porque o `tsx` não gera os metadados de tipo.
- **Pagamentos:** cada forma de pagamento ganhou um `name` e todas são registradas com o mesmo identificador. O `PaymentMethodRegistry` recebe a lista por `@multiInject` e acha a certa pelo nome. Para aceitar uma forma nova, basta criar a classe e adicionar um `bind`.
- **Modo `test`:** criei o `ConsoleMailProvider` (imprime o e-mail no console) e o `InMemoryOrderRepository` (guarda os pedidos num array). Com `APP_ENV=test` a aplicação roda sem internet.
- **`app.ts` e `server.ts`:** o `app.ts` só pede o `OrderController` ao container e registra a rota. O `server.ts` carrega o `reflect-metadata` e o `dotenv` e sobe o servidor.

A regra de negócio (`OrderService`, produtos, frete) não mudou, só a forma como as dependências chegam.
