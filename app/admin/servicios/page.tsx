import { prisma } from '@/lib/db';
import Link from 'next/link';

export const revalidate = 0;

export default async function AdminServicios() {
  const servicios = await prisma.service.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Servicios</h1>
      <Link className="btn" href="/admin/servicios/nuevo">Nuevo servicio</Link>
      <table className="mt-4">
        <thead><tr><th>Nombre</th><th>Slug</th><th>Activo</th><th></th></tr></thead>
        <tbody>
          {servicios.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.slug}</td>
              <td>{s.isActive ? 'Sí' : 'No'}</td>
              <td><Link href={`/admin/servicios/${s.id}`}>Editar</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
