import { Metadata } from 'next';
import { getAllCourses } from '@/lib/loaders/courses';
import { FavoritosPageClient } from '@/components/FavoritosPageClient';

export const metadata: Metadata = {
  title: 'Favoritos',
  description: 'Seus cursos favoritados na Aprendi.',
};

export default async function FavoritosPage() {
  const allCourses = await getAllCourses();
  return <FavoritosPageClient courses={allCourses} />;
}
