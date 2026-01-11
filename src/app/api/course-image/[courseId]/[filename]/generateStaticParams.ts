// Gera os parâmetros estáticos para todas as imagens conhecidas dos cursos
export async function generateStaticParams() {
  return [
    { courseId: 'docker-basico', filename: 'cover.png' },
    { courseId: 'cicd', filename: 'cover.png' }
  ];
}
