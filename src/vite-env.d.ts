/// <reference types="vite/client" />

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './db/database.types';

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}