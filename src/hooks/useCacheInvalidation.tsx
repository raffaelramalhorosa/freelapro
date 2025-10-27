import { useCallback } from 'react';
import { invalidateCacheKeys } from './useCache';
import { supabase } from '@/integrations/supabase/client';

export const useCacheInvalidation = () => {
  const getUserId = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
  }, []);

  const invalidateProjectsCache = useCallback(async () => {
    const userId = await getUserId();
    if (!userId) return;
    
    invalidateCacheKeys([
      `projects-${userId}`,
      `dashboard-stats-${userId}`,
    ]);
  }, [getUserId]);

  const invalidateProposalsCache = useCallback(async () => {
    const userId = await getUserId();
    if (!userId) return;
    
    invalidateCacheKeys([
      `proposals-${userId}`,
      `projects-${userId}`, // Propostas podem afetar projetos
    ]);
  }, [getUserId]);

  const invalidateAllUserCache = useCallback(async () => {
    const userId = await getUserId();
    if (!userId) return;
    
    invalidateCacheKeys([
      `projects-${userId}`,
      `proposals-${userId}`,
      `dashboard-stats-${userId}`,
    ]);
  }, [getUserId]);

  return {
    invalidateProjectsCache,
    invalidateProposalsCache,
    invalidateAllUserCache,
  };
};
