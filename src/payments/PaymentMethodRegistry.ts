import { injectable, multiInject } from 'inversify';
import { TYPES } from '../container/types';
import { IPaymentMethod } from './IPaymentMethod';


@injectable()
export class PaymentMethodRegistry {
  private methods = new Map<string, IPaymentMethod>();

  constructor(@multiInject(TYPES.PaymentMethod) paymentMethods: IPaymentMethod[]) {
    for (const method of paymentMethods) {
      this.methods.set(method.name, method);
    }
  }

  get(name: string): IPaymentMethod | undefined {
    return this.methods.get(name);
  }
}
