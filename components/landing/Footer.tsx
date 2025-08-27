import { Github, Twitter, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-gray-400">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <div className="flex gap-4">
          <a href="#" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
          <a href="#" aria-label="GitHub"><Github className="h-5 w-5" /></a>
        </div>
        <div>&copy; {new Date().getFullYear()} Servicios SaaS</div>
        <div className="flex flex-col items-center gap-2 text-sm md:flex-row md:gap-4">
          <span className="flex items-center gap-1"><Mail className="h-4 w-4" /> contacto@example.com</span>
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Buenos Aires</span>
        </div>
      </div>
    </footer>
  );
}
