import { Metadata } from 'next';
import { getAllCourses, getAllAreas, getAllTags, getAllLevels, getAllInstructors } from '@/lib/loaders';
import { getCoursesListMetadata } from '@/lib/seo';
import { CursosPageClient } from '@/components/CursosPageClient';

export const metadata: Metadata = getCoursesListMetadata();

export default function CursosPage() {
  const courses = getAllCourses();
  const areas = getAllAreas();
  const tags = getAllTags();
  const levels = getAllLevels();
  const allInstructors = getAllInstructors();
  const instructors = allInstructors.map((i) => ({ id: i.id, name: i.name }));
  return <CursosPageClient courses={courses} areas={areas} tags={tags} levels={levels} instructors={instructors} />;
}
