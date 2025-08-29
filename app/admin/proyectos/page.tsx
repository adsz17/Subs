import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { Breadcrumbs } from '@/components/admin/Breadcrumbs';

export const revalidate = 0;

export default async function ProyectosPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Proyectos' }]} />
      <div className="mt-4">
        <Link href="/admin/proyectos/nuevo" className="btn mb-4 inline-block">
          Nuevo
        </Link>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Título</th>
              <th className="p-2">Imagen</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.title}</td>
                <td className="p-2">
                  {p.imageUrl && <Image src={p.imageUrl} alt="" width={100} height={60} />}
                </td>
                <td className="p-2 text-right">
                  <Link href={`/admin/proyectos/${p.id}`} className="text-blue-600">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={3} className="p-2 text-center">
                  No hay proyectos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
