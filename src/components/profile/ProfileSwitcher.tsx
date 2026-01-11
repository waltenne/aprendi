"use client";

import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { ProfileModal } from './ProfileModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Plus, Check, Edit, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProfileSwitcher() {
  const { profile, profiles, switchProfile, canAddMore, activeProfileId } = useProfile();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSwitchProfile = (profileId: string) => {
    if (profileId !== activeProfileId) {
      switchProfile(profileId);
      window.location.reload();
    }
  };

  // Se não há perfis, mostra botão de cadastro
  if (!profile || profiles.length === 0) {
    return (
      <>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-3 px-3 py-3 mx-2 mb-2 rounded-xl hover:bg-sidebar-accent transition-all group border border-transparent hover:border-primary/30"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="font-semibold text-sm text-primary">
              Cadastrar Perfil
            </p>
            <p className="text-xs text-muted-foreground truncate">Crie seu primeiro perfil</p>
          </div>
        </button>
        <ProfileModal open={showCreateModal} onOpenChange={setShowCreateModal} mode="create" />
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 px-3 py-3 mx-2 mb-2 rounded-xl hover:bg-sidebar-accent transition-all group border border-transparent hover:border-border">
          <div className="relative">
            <img
              src={profile?.photo || '/images/default-avatar.png'}
              alt="Foto do perfil"
              className="w-10 h-10 rounded-full object-cover border-2 border-border group-hover:border-primary transition-colors"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-sidebar rounded-full" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
              {profile?.name || 'Perfil'}
            </p>
            <p className="text-xs text-muted-foreground truncate">Meu Perfil</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground uppercase">
            <User className="h-3.5 w-3.5" />
            Perfis ({profiles.length}/5)
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {profiles.map((p) => (
            <DropdownMenuItem
              key={p.id}
              onClick={() => handleSwitchProfile(p.id)}
              className="flex items-center gap-3 py-2.5 cursor-pointer"
            >
              <div className="relative">
                <img
                  src={p.photo || '/images/default-avatar.png'}
                  alt={p.name}
                  className={cn(
                    "w-8 h-8 rounded-full object-cover border-2",
                    p.id === activeProfileId ? "border-primary" : "border-border"
                  )}
                />
                {p.id === activeProfileId && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full" />
                )}
              </div>
              <span className="flex-1 truncate font-medium">{p.name}</span>
              {p.id === activeProfileId && (
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Edit className="h-4 w-4 text-muted-foreground" />
            </div>
            <span>Editar Perfil Atual</span>
          </DropdownMenuItem>
          {canAddMore && (
            <DropdownMenuItem
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-3 text-primary cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium">Adicionar Perfil</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ProfileModal open={showCreateModal} onOpenChange={setShowCreateModal} mode="create" />
      <ProfileModal open={showEditModal} onOpenChange={setShowEditModal} mode="edit" />
    </>
  );
}
