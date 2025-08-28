import crypto from 'node:crypto';
import Stripe from 'stripe';

export interface CheckoutSession {
  url: string;
}

export interface PaymentsProvider {
  createCheckout(params: { orderId: string; amountCents: number; currency: string }): Promise<CheckoutSession>;
  verifyWebhook(payload: string, signature: string): Promise<boolean>;
}

const coinbaseProvider: PaymentsProvider = {
  async createCheckout({ orderId, amountCents, currency }) {
    const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
    if (!apiKey) throw new Error('Missing Coinbase API key');
    const res = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': apiKey,
        'X-CC-Version': '2018-03-22'
      },
      body: JSON.stringify({
        name: `Order ${orderId}`,
        pricing_type: 'fixed_price',
        local_price: {
          amount: (amountCents / 100).toFixed(2),
          currency
        }
      })
    });
    if (!res.ok) throw new Error('Failed to create Coinbase charge');
    const data = await res.json();
    return { url: data.data.hosted_url };
  },
  async verifyWebhook(payload, signature) {
    const secret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;
    if (!secret) return false;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload, 'utf8');
    const expected = hmac.digest('hex');
    return expected === signature;
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

const stripeProvider: PaymentsProvider = {
  async createCheckout({ orderId, amountCents, currency }) {
    const success = `${process.env.PUBLIC_BASE_URL}/pago-exitoso`;
    const cancel = `${process.env.PUBLIC_BASE_URL}/pago-cancelado`;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: `Order ${orderId}` },
            unit_amount: amountCents
          },
          quantity: 1
        }
      ],
      success_url: success,
      cancel_url: cancel
    });
    if (!session.url) throw new Error('Failed to create Stripe session');
    return { url: session.url };
  },
  async verifyWebhook(payload, signature) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) return false;
    try {
      stripe.webhooks.constructEvent(payload, signature, secret);
      return true;
    } catch {
      return false;
    }
  }
};

export function getPaymentsProvider(provider?: string): PaymentsProvider {
  return provider === 'stripe' ? stripeProvider : coinbaseProvider;
}
