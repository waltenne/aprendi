'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { ProfileModal } from './ProfileModal';

export function ProfileSidebarUser() {
  const { profile, hasProfiles } = useProfile();
  const [showModal, setShowModal] = useState(false);

  // Função para fechar o modal e recarregar a página após salvar
  const handleModalChange = (open: boolean) => {
    setShowModal(open);
    if (!open) {
      // Pequeno delay para garantir persistência antes do reload
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  };
  
  if (!hasProfiles) return null;
  
  return (
    <>
      <div className="flex items-center gap-3 px-4 pb-2">
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 group w-full">
          <img
            src={profile?.photo || '/default-avatar.png'}
            alt="Foto do perfil"
            className="w-8 h-8 rounded-full object-cover border group-hover:ring-2 group-hover:ring-primary"
          />
          <span className="font-medium text-sm truncate">
            {profile?.name || 'Perfil'}
          </span>
        </button>
      </div>
      <ProfileModal open={showModal} onOpenChange={handleModalChange} mode="edit" />
    </>
  );
}