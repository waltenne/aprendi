"use client";

import { useEffect, useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { ProfileModal } from './ProfileModal';

export function FirstAccessModal() {
  const { hasProfiles, isLoaded } = useProfile();
  const [showModal, setShowModal] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (isLoaded && !hasProfiles && !hasChecked) {
      setShowModal(true);
      setHasChecked(true);
    }
  }, [isLoaded, hasProfiles, hasChecked]);

  return <ProfileModal open={showModal} onOpenChange={setShowModal} mode="create" />;
}
