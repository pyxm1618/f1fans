
/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
// Note: These must be added to your Vercel Project Settings
const mcpSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const mcpSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Warn if keys are missing (for local dev safety)
if (!mcpSupabaseUrl || !mcpSupabaseAnonKey) {
    console.warn('Supabase keys are missing! Authentication will not work.');
}

export const supabase = createClient(
    mcpSupabaseUrl || '',
    mcpSupabaseAnonKey || ''
);

/**
 * Initiates WeChat Login Flow
 * This function calls the custom Edge Function to handle the OAuth handshake.
 */
export const signInWithWeChat = async () => {
    // 1. Redirect user to WeChat OAuth URL
    // NOTE: This usually needs to happen via a full page redirect or a popup
    const APP_ID = 'YOUR_WECHAT_APP_ID';
    const REDIRECT_URI = encodeURIComponent(window.location.origin + '/auth/callback/wechat');
    const state = 'random_state_string'; // Should be generated randomly

    const target = `https://open.weixin.qq.com/connect/qrconnect?appid=${APP_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`;

    window.location.href = target;
};

export const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin,
        }
    });
};
