"use client";
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import session from '../utils/session';
import { isManagerRole } from '../constants/managerRoles';

export function useAuth(options = {}) {
  const { requireAuth = false, redirectTo = '/login' } = options;
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [roleName, setRoleName] = useState(null);
  const [isManager, setIsManager] = useState(false);

  const redirectFlag = useRef(false);

  useEffect(() => {
    // Only evaluate once on mount (dependencies intentionally empty)
    const s = session.getSession();
    if (s?.user) {
      setUser(s.user);
      const rName = s.user?.role?.name || null;
      setRoleName(rName);
      setIsManager(isManagerRole(rName));
      setReady(true);
      return;
    }
    setReady(true);
    if (requireAuth && !redirectFlag.current) {
      redirectFlag.current = true;
      router.replace(redirectTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(() => {
    session.clearSession();
    setUser(null);
    redirectFlag.current = false;
    router.replace('/login');
  }, [router]);

  return { user, ready, logout, pathname, roleName, isManager };
}

export default useAuth;
