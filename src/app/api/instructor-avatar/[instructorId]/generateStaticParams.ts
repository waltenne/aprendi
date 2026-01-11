// Gera os parâmetros estáticos para todos os instrutores conhecidos
export async function generateStaticParams() {
  return [
    { instructorId: 'waltenne' },
    { instructorId: 'comunidade-aprendi' }
  ];
}
