"use client"

import * as React from "react";

type Toast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  duration?: number; // ms
};

const listeners: Array<React.Dispatch<React.SetStateAction<Toast[]>>> = [];
let toasts: Toast[] = [];
let counter = 0;

function genId() {
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
  return String(counter);
}

export function toast({ title, description, duration = 4000 }: Omit<Toast, 'id'>) {
  const id = genId();
  const t: Toast = { id, title, description, duration };
  toasts = [...toasts, t];
  listeners.forEach((l) => l([...toasts]));

  if (duration > 0) {
    setTimeout(() => {
      dismiss(id);
    }, duration);
  }

  return {
    id,
    dismiss: () => dismiss(id),
  };
}

export function dismiss(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  listeners.forEach((l) => l([...toasts]));
}

export function useToast() {
  const [state, setState] = React.useState<Toast[]>(toasts);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const idx = listeners.indexOf(setState);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return {
    toasts: state,
    toast,
    dismiss,
  } as const;
}
