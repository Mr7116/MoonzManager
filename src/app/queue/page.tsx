'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import MemberQueueView from '@/components/queue/MemberQueueView';
import AdminQueueView from '@/components/queue/AdminQueueView';

export default function QueuePage() {
  const { isAuthenticated } = useAuth();
  const [viewAsMember, setViewAsMember] = useState(false);

  // Sync viewAsMember with authentication status on initial load
  useEffect(() => {
    if (!isAuthenticated) {
      setViewAsMember(true);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || viewAsMember) {
    return (
      <MemberQueueView
        onSwitchToAdmin={isAuthenticated ? () => setViewAsMember(false) : undefined}
      />
    );
  }

  return <AdminQueueView onSwitchToMember={() => setViewAsMember(true)} />;
}
