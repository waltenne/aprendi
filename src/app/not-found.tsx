import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-9xl font-bold text-muted-foreground/30">404</h1>
      <h2 className="text-2xl font-bold mt-4 mb-2">Página não encontrada</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        A página que você está procurando não existe ou foi movida.
      </p>
      <div className="flex gap-4 justify-center">
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Início
          </Link>
        </Button>
        <Button asChild>
          <Link href="/cursos">
            Explorar Cursos
          </Link>
        </Button>
      </div>
    </div>
  );
}
