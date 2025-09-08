import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { prisma } from '@/lib/db';
import { ImageUploadField } from '@/components/admin/ImageUploadField';

export default async function AjustesPage() {
  const configs = await prisma.paymentsConfig.findMany();

  async function create(formData: FormData) {
    'use server';
    const network = String(formData.get('network') || '');
    const wallet = String(formData.get('wallet') || '');
    const qrUrl = formData.get('imageUrl') as string | null;
    await prisma.paymentsConfig.create({
      data: { network, wallet, qrUrl: qrUrl || undefined },
    });
  }

  async function update(formData: FormData) {
    'use server';
    const id = Number(formData.get('id'));
    const network = String(formData.get('network') || '');
    const wallet = String(formData.get('wallet') || '');
    const qrUrl = formData.get('imageUrl') as string | null;
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
          <form action={update} className="space-y-4">
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
              <ImageUploadField folder="payments" initialUrl={cfg.qrUrl || undefined} />
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

      <form action={create} className="space-y-4 rounded-2xl bg-white p-6 shadow">
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
          <ImageUploadField folder="payments" />
        </div>
        <button type="submit" className="btn">
          Agregar
        </button>
      </form>
    </div>
  );
}
