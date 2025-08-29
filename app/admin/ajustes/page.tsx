import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { prisma } from '@/lib/db';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export default async function AjustesPage() {
  const configs = await prisma.paymentsConfig.findMany();

  async function create(formData: FormData) {
    'use server';
    const network = String(formData.get('network') || '');
    const wallet = String(formData.get('wallet') || '');
    const qr = formData.get('qr') as File | null;
    let qrUrl: string | undefined;
    if (qr && qr.size > 0) {
      const bytes = await qr.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(qr.name) || '.png';
      const filename = `${Date.now()}${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'payments');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      qrUrl = `/payments/${filename}`;
    }
    await prisma.paymentsConfig.create({
      data: { network, wallet, qrUrl },
    });
  }

  async function update(formData: FormData) {
    'use server';
    const id = Number(formData.get('id'));
    const network = String(formData.get('network') || '');
    const wallet = String(formData.get('wallet') || '');
    const qr = formData.get('qr') as File | null;
    let qrUrl: string | undefined;
    if (qr && qr.size > 0) {
      const bytes = await qr.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = path.extname(qr.name) || '.png';
      const filename = `${Date.now()}${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'payments');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, filename), buffer);
      qrUrl = `/payments/${filename}`;
    }
    await prisma.paymentsConfig.update({
      where: { id },
      data: {
        network,
        wallet,
        ...(qrUrl ? { qrUrl } : {}),
      },
    });
  }

  async function remove(formData: FormData) {
    'use server';
    const id = Number(formData.get('id'));
    await prisma.paymentsConfig.delete({ where: { id } });
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Ajustes' }]} />

      {configs.map((cfg) => (
        <div key={cfg.id} className="space-y-2 rounded-2xl bg-white p-6 shadow">
          <form action={update} encType="multipart/form-data" className="space-y-4">
            <input type="hidden" name="id" value={cfg.id} />
            <div>
              <label className="block text-sm font-medium text-gray-700">Red</label>
              <input
                name="network"
                defaultValue={cfg.network}
                className="mt-1 w-full border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Billetera</label>
              <input
                name="wallet"
                defaultValue={cfg.wallet}
                className="mt-1 w-full border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Código QR</label>
              {cfg.qrUrl && (
                <img src={cfg.qrUrl} alt="QR actual" className="mb-2 h-32 w-32 object-cover" />
              )}
              <input type="file" accept="image/*" name="qr" className="mt-1 w-full border p-2" />
            </div>
            <button type="submit" className="btn">
              Guardar
            </button>
          </form>
          <form action={remove}>
            <input type="hidden" name="id" value={cfg.id} />
            <button type="submit" className="btn bg-red-600 text-white">
              Eliminar
            </button>
          </form>
        </div>
      ))}

      <form action={create} encType="multipart/form-data" className="space-y-4 rounded-2xl bg-white p-6 shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Red</label>
          <input name="network" className="mt-1 w-full border p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Billetera</label>
          <input name="wallet" className="mt-1 w-full border p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Código QR</label>
          <input type="file" accept="image/*" name="qr" className="mt-1 w-full border p-2" />
        </div>
        <button type="submit" className="btn">
          Agregar
        </button>
      </form>
    </div>
  );
}
