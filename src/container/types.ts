// Um Symbol para cada dependência. A interface some ao compilar,
// então o container precisa de um identificador que exista em tempo de execução.
export const TYPES = {
  ProductRepository: Symbol.for('ProductRepository'),
  OrderRepository: Symbol.for('OrderRepository'),
  MailProvider: Symbol.for('MailProvider'),
  PaymentMethod: Symbol.for('PaymentMethod'),
  PaymentMethodRegistry: Symbol.for('PaymentMethodRegistry'),
  NotificationService: Symbol.for('NotificationService'),
  OrderService: Symbol.for('OrderService'),
  OrderController: Symbol.for('OrderController'),
};
