import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xcviglbadmguprahlqqh.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_YZpc1CdIpBwN74AX03Pobw_RfUeH8i7';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

