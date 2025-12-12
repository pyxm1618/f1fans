
// This file is a GUIDANCE/TEMPLATE for your Supabase Edge Function.
// You need to deploy this to your Supabase project using the Supabase CLI.
// Command: supabase functions new wechat-login

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const WECHAT_APP_ID = Deno.env.get("WECHAT_APP_ID")!;
const WECHAT_SECRET = Deno.env.get("WECHAT_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
    // 1. Get the "code" passed from the frontend (after WeChat redirect)
    const { code } = await req.json();

    if (!code) {
        return new Response(JSON.stringify({ error: "No code provided" }), { status: 400 });
    }

    try {
        // 2. Exchange Code for Access Token & OpenID from WeChat API
        const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WECHAT_APP_ID}&secret=${WECHAT_SECRET}&code=${code}&grant_type=authorization_code`;
        const tokenResp = await fetch(tokenUrl);
        const tokenData = await tokenResp.json();

        if (tokenData.errcode) {
            throw new Error(`WeChat API Error: ${tokenData.errmsg}`);
        }

        const { openid, access_token } = tokenData;

        // 3. Get User Info (Optional, to get nickname/avatar)
        const userUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}`;
        const userResp = await fetch(userUrl);
        const userData = await userResp.json();

        // 4. Create or Update User in Supabase
        // We use the admin client (Service Role) to bypass RLS
        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Check if user exists by OpenID (Stored in a specialized table or metadata)
        // Strategy: We can query a 'profiles' table where we store the wechat_openid
        const { data: existingProfile } = await supabaseAdmin
            .from('profiles')
            .select('id, user_id')
            .eq('wechat_openid', openid)
            .single();

        let userId;

        if (existingProfile) {
            userId = existingProfile.user_id;
        } else {
            // Create new Auth User (Dummy email approach usually needed if not using custom auth fully)
            // Or create a completely custom JWT.
            // Simplified: Create a user with a generated email based on openid
            const email = `${openid}@wechat.f1fans.cn`;
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: email,
                email_confirm: true,
                user_metadata: {
                    nickname: userData.nickname,
                    avatar_url: userData.headimgurl,
                    wechat_openid: openid
                }
            });

            if (createError) throw createError;
            userId = newUser.user.id;

            // Create Profile record
            await supabaseAdmin.from('profiles').insert({
                user_id: userId,
                wechat_openid: openid,
                nickname: userData.nickname
            });
        }

        // 5. Generate Session Token for Frontend
        // We sign in as this user to get a session
        const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: `${openid}@wechat.f1fans.cn`
        });

        // Note: generateLink returns a link. In a real app, you might want to create a session directly 
        // using createSession if permitted, or just return a custom JWT.
        // For simplicity in this template, we return user info. 
        // *Production Tip*: Best to use Custom Claims or standard Supabase Auth flow.

        return new Response(
            JSON.stringify({
                user: userData,
                supabase_user_id: userId,
                message: "Login successful. Logic needs custom session handling here."
            }),
            { headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
});
