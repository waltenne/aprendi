import { Metadata } from 'next';
import { SobrePageClient } from '@/components/SobrePageClient';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Conheça a Aprendi, nossa missão, visão, valores e objetivos educacionais.',
};

export default function SobrePage() {
  return <SobrePageClient />;
}
