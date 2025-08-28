import { Breadcrumbs } from '@/components/admin/Breadcrumbs';

export default function AjustesPage() {
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Ajustes' }]} />
      <div className="rounded-2xl bg-white p-6 shadow">
        <p className="text-sm text-gray-600">Configuración básica próximamente.</p>
      </div>
    </div>
  );
}
