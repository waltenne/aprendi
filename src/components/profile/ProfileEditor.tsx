"use client";

import { useRef, useState } from 'react';
import { useProfile } from '@/hooks/useProfile';

export function ProfileEditor() {
  const { profile, activeProfileId, updateProfile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editedName, setEditedName] = useState(profile?.name || '');
  const [photoChanged, setPhotoChanged] = useState(false);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEditedName(e.target.value);
  }

  function handleSaveClick() {
    if (activeProfileId) {
      updateProfile(activeProfileId, { name: editedName });
      setTimeout(() => {
        window.location.reload();
      }, 300); // pequeno delay para garantir persistência
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && activeProfileId) {
      const reader = new FileReader();
      reader.onload = () => {
        updateProfile(activeProfileId, { photo: reader.result as string });
        setPhotoChanged(true);
        setTimeout(() => {
          window.location.reload();
        }, 300);
      };
      reader.readAsDataURL(file);
    }
  }

  function handlePhotoClick() {
    fileInputRef.current?.click();
  }

  return (
    <div className="max-w-sm mx-auto p-4 space-y-4">
      <h2 className="text-lg font-bold mb-2">Editar Perfil</h2>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <img
            src={profile?.photo || '/default-avatar.png'}
            alt="Foto do perfil"
            className="w-24 h-24 rounded-full object-cover border"
            onClick={handlePhotoClick}
            style={{ cursor: 'pointer' }}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
        </div>
        <input
          type="text"
          className="border rounded px-3 py-2 w-full"
          placeholder="Seu nome"
          value={editedName}
          onChange={handleNameChange}
        />
        {(editedName !== (profile?.name || '') || photoChanged) && (
          <button
            type="button"
            className="mt-4 px-6 py-2 rounded bg-primary text-white font-semibold shadow hover:bg-primary/90 transition"
            onClick={handleSaveClick}
          >
            Salvar
          </button>
        )}
      </div>
    </div>
  );
}
