import { createContext, useContext } from 'react';
import { supabaseClient } from '../db/supabase.client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../db/database.types';

const SupabaseContext = createContext<SupabaseClient<Database> | null>(null);

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => (
  <SupabaseContext.Provider value={supabaseClient}>
    {children}
  </SupabaseContext.Provider>
);

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
