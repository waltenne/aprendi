"use client";

import { useState, useRef, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, User } from 'lucide-react';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit';
}

export function ProfileModal({ open, onOpenChange, mode = 'edit' }: ProfileModalProps) {
  const { profile, createProfile, updateProfile, activeProfileId } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');

  // Atualizar campos quando o modal abrir ou o perfil mudar
  useEffect(() => {
    if (open && mode === 'edit' && profile) {
      setName(profile.name);
      setPhoto(profile.photo);
    } else if (open && mode === 'create') {
      setName('');
      setPhoto('');
    }
  }, [open, mode, profile]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handlePhotoClick() {
    fileInputRef.current?.click();
  }

  function handleSave() {
    if (!name.trim()) return;
    if (mode === 'create') {
      createProfile(name.trim(), photo);
    } else if (activeProfileId) {
      updateProfile(activeProfileId, { name: name.trim(), photo });
    }
    onOpenChange(false);
    // Pequeno delay para garantir persistência antes do reload
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Criar Perfil' : 'Editar Perfil'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Configure seu nome e foto de perfil para começar'
              : 'Atualize seu nome e foto de perfil'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative group">
            <img
              src={photo || '/images/default-avatar.png'}
              alt="Foto do perfil"
              className="w-24 h-24 rounded-full object-cover border-2 border-border cursor-pointer group-hover:opacity-80 transition-opacity"
              onClick={handlePhotoClick}
            />
            <div 
              className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={handlePhotoClick}
            >
              <Camera className="h-6 w-6 text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />
          </div>
          
          <div className="w-full space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome Completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
