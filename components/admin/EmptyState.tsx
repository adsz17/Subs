import Link from "next/link";
import { Plus } from "lucide-react";

interface Props {
  title: string;
  href: string;
}

export function EmptyState({ title, href }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border p-10 text-center">
      <p className="mb-4 text-gray-600">{title}</p>
      <Link
        href={href}
        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white"
      >
        <Plus className="mr-2 h-4 w-4" /> Nuevo
      </Link>
    </div>
  );
}
