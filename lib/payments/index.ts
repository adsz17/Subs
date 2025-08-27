export interface CheckoutSession {
  url: string;
}

export interface PaymentsProvider {
  createCheckout(params: { orderId: string; amountCents: number; currency: string }): Promise<CheckoutSession>;
  verifyWebhook(payload: string, signature: string): Promise<boolean>;
}

const coinbaseProvider: PaymentsProvider = {
  async createCheckout() {
    return { url: 'https://commerce.coinbase.com/checkout' };
  },
  async verifyWebhook() {
    return true;
  }
};

const stripeProvider: PaymentsProvider = {
  async createCheckout() {
    return { url: 'https://stripe.com/payments/checkout' };
  },
  async verifyWebhook() {
    return true;
  }
};

export function getPaymentsProvider(provider?: string): PaymentsProvider {
  return provider === 'stripe' ? stripeProvider : coinbaseProvider;
}
