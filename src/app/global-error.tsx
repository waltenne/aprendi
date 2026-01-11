'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md w-full rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold text-muted-foreground mb-2">Erro inesperado</div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Algo deu errado no aplicativo.</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Desculpe pelo inconveniente. Você pode tentar novamente ou voltar para a página inicial.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => reset()}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Tentar novamente
            </button>
            <a
              href="/"
              className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition"
            >
              Ir para início
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
