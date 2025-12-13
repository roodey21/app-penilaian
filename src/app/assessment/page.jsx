"use client";
import React from 'react';
import AssessmentPage from '../../pages/AssessmentPage';
import { useAuth } from '../../hooks/useAuth';

export default function AssessmentRoute() {
  const { user, ready } = useAuth({ requireAuth: true });
  if (!ready) return null;
  if (!user) return null; // redirect handled in hook
  return <AssessmentPage user={user} />;
}
