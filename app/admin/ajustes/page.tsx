import { Breadcrumbs } from '@/components/admin/Breadcrumbs';
import { prisma } from '@/lib/db';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { revalidatePath } from 'next/cache';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    const result = await prisma.paymentsConfig.deleteMany({ where: { id } });
    if (!result.count) {
      return;
    }
    revalidatePath('/admin/ajustes');
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
        <div className="flex flex-col gap-2">
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Ajustes' }]} />
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Ajustes de pagos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Configura redes, billeteras y códigos QR para tus métodos de pago.</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {configs.map((cfg) => (
          <Card key={cfg.id} className="border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
            <CardHeader className="border-b border-white/10 pb-6 dark:border-slate-800/60">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Configuración #{cfg.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <form action={update} className="space-y-4">
                <input type="hidden" name="id" value={cfg.id} />
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Red</label>
                  <Input name="network" defaultValue={cfg.network} placeholder="Ej. Ethereum" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Billetera</label>
                  <Input name="wallet" defaultValue={cfg.wallet} placeholder="Dirección de la billetera" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Código QR</label>
                  <ImageUploadField folder="payments" initialUrl={cfg.qrUrl || undefined} />
                </div>
                <Button type="submit">Guardar cambios</Button>
              </form>
              <form action={remove} className="flex justify-end">
                <input type="hidden" name="id" value={cfg.id} />
                <Button type="submit" variant="ghost" className="text-red-600 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-500/20">
                  Eliminar configuración
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/60">
        <CardHeader className="border-b border-white/10 pb-6 dark:border-slate-800/60">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Nueva red de pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <form action={create} className="grid gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Red</label>
              <Input name="network" placeholder="Nombre de la red" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Billetera</label>
              <Input name="wallet" placeholder="Dirección de recepción" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Código QR</label>
              <ImageUploadField folder="payments" />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Agregar configuración</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
