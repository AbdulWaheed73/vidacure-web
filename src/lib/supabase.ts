import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

// Store the current access token
let currentAccessToken: string | null = null;
let supabaseClient: SupabaseClient | null = null;

// Create Supabase client with proper auth configuration
const createSupabaseClientWithToken = (token?: string): SupabaseClient => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const options: Parameters<typeof createClient>[2] = {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  };

  // If we have a custom token, add it to global headers for REST
  if (token) {
    options.global = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, options);

  // If we have a token, set it for realtime as well
  if (token) {
    client.realtime.setAuth(token);
  }

  return client;
};

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClientWithToken(currentAccessToken || undefined);
  }
  return supabaseClient;
};

// Set custom access token (JWT from our server)
export const setSupabaseAccessToken = async (token: string): Promise<void> => {
  currentAccessToken = token;

  // Always recreate the client because REST API headers can't be updated
  // The chat service will handle re-subscribing to channels
  if (supabaseClient) {
    await supabaseClient.removeAllChannels();
  }
  supabaseClient = createSupabaseClientWithToken(token);
  console.log("Supabase client recreated with new token");
};

// Clear Supabase session
export const clearSupabaseSession = async (): Promise<void> => {
  if (supabaseClient) {
    await supabaseClient.removeAllChannels();
    supabaseClient = null;
  }
  currentAccessToken = null;
};

// Get current access token (for debugging)
export const getCurrentAccessToken = (): string | null => currentAccessToken;

export default getSupabaseClient;
