"use client";

import { Suspense } from 'react';

interface FavoritosPageClientProps {
  courses: any;
}

export function FavoritosPageClient({ courses }: FavoritosPageClientProps) {
  // O FavoritosClient já é client, mas padronizamos o wrapper
  const FavoritosClient = require('../app/favoritos/FavoritosClient').FavoritosClient;
  return (
    <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center">Carregando favoritos...</div>}>
      <FavoritosClient courses={courses} />
    </Suspense>
  );
}
