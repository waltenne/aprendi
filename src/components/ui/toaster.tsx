"use client"

import React from 'react';
import { useToast } from '@/hooks/use-toast';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="max-w-sm w-full bg-background/90 border border-border shadow-lg rounded-lg p-3 backdrop-blur"
        >
          {t.title && <div className="font-medium">{t.title}</div>}
          {t.description && <div className="text-sm text-muted-foreground mt-1">{t.description}</div>}
          <div className="mt-2 text-right">
            <button
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => dismiss(t.id)}
            >
              Fechar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
