import { useProfile } from '@/hooks/useProfile';

export function CertificadoNome() {
  const { profile } = useProfile();
  return <span>{profile?.name || 'Nome do Aluno'}</span>;
}
