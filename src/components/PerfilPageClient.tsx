
"use client";

import { ProfileEditor } from '@/components/profile/ProfileEditor';
import { Suspense } from 'react';

export function PerfilPageClient() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center">Carregando perfil...</div>}>
      <div className="max-w-lg mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
        <ProfileEditor />
      </div>
    </Suspense>
  );
}

export default PerfilPageClient;
