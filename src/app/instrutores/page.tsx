
import { Metadata } from 'next';
import { getAllInstructors, getCoursesByInstructor } from '@/lib/loaders';
import { InstrutoresPageClient } from '@/components/InstrutoresPageClient';

export const metadata: Metadata = {
  title: 'Instrutores',
  description: 'Conheça os instrutores que criam conteúdo para a Aprendi.',
};

export default function InstrutoresPage() {
  const instructors = getAllInstructors();
  const courseCounts = instructors.map((instructor) => ({
    id: instructor.id,
    courseCount: getCoursesByInstructor(instructor.id).length,
  }));
  return <InstrutoresPageClient instructors={instructors} courseCounts={courseCounts} />;
}
