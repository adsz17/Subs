import { NextRequest, NextResponse } from 'next/server';
import coinbase from 'coinbase-commerce-node';
import { env } from '@/env.mjs';
import { prisma } from '@/lib/db';

const { Webhook } = coinbase;

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-cc-webhook-signature');

  try {
    const event = Webhook.verifyEventBody(
      rawBody,
      signature ?? '',
      env.COINBASE_COMMERCE_WEBHOOK_SECRET || ''
    );

    if (event.type === 'charge:confirmed') {
      const charge = event.data;
      // TODO: mapear a orderId/metadata y marcarla como PAID
      // await prisma.order.update({ where: { id }, data: { status: 'PAID' } });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return new NextResponse('Invalid signature', { status: 400 });
  }
}

