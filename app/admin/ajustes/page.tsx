import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { prisma } from '@/lib/db';
import { PaymentProvider } from '@prisma/client';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export default async function AjustesPage() {
  const settings = await prisma.setting.findUnique({ where: { id: 1 } });

  async function save(formData: FormData) {
    'use server';
    const network = String(formData.get('network') || '');
    const wallet = String(formData.get('wallet') || '');
    const qr = formData.get('qr') as File | null;
    const existing = await prisma.setting.findUnique({ where: { id: 1 } });
    let qrCodeUrl = existing?.qrCodeUrl;
    if (qr && qr.size > 0) {
      const bytes = await qr.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(qr.name) || '.png';
      const filename = `qr${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'payments');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      qrCodeUrl = `/payments/${filename}`;
    }
    await prisma.setting.upsert({
      where: { id: 1 },
      update: {
        cryptoNetwork: network,
        walletAddress: wallet,
        qrCodeUrl,
      },
      create: {
        id: 1,
        paymentProvider: PaymentProvider.COINBASE,
        defaultCurrency: 'USD',
        cryptoNetwork: network,
        walletAddress: wallet,
        qrCodeUrl,
      },
    });
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Ajustes' }]} />
      <form
        action={save}
        encType="multipart/form-data"
        className="space-y-4 rounded-2xl bg-white p-6 shadow"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Red</label>
          <input
            name="network"
            defaultValue={settings?.cryptoNetwork ?? ''}
            className="mt-1 w-full border p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Billetera</label>
          <input
            name="wallet"
            defaultValue={settings?.walletAddress ?? ''}
            className="mt-1 w-full border p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Código QR</label>
          {settings?.qrCodeUrl && (
            <img
              src={settings.qrCodeUrl}
              alt="QR actual"
              className="mb-2 h-32 w-32 object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            name="qr"
            className="mt-1 w-full border p-2"
          />
        </div>
        <button type="submit" className="btn">
          Guardar
        </button>
      </form>
    </div>
  );
}
