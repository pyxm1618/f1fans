
/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

// Safe environment variable retrieval for both Browser (Vite) and Node (Prerender)
const getEnvVar = (key: string) => {
    // 1. Try Vite's import.meta.env (Browser)
    try {
        // @ts-ignore
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
            // @ts-ignore
            return import.meta.env[key];
        }
    } catch (e) {
        // Ignore
    }

    // 2. Try Node's process.env (Server/Prerender)
    try {
        if (typeof process !== 'undefined' && process.env && process.env[key]) {
            return process.env[key];
        }
    } catch (e) {
        // Ignore
    }
    return '';
};

const mcpSupabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const mcpSupabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

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
