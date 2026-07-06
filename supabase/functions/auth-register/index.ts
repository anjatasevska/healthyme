import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getAdminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const { email, password, username, age } = await req.json();

    if (!email || !password || !username) {
      return json({ error: "Email, password, and username are required." }, 400);
    }
    if (password.length < 6) {
      return json({ error: "Password must be at least 6 characters." }, 400);
    }
    const ageNum = Number(age);
    if (!age || ageNum < 10 || ageNum > 19) {
      return json({ error: "Age must be between 10 and 19." }, 400);
    }

    const admin = getAdminClient();

    const { data: userData, error: createError } = await admin.auth.admin.createUser({
      email: String(email).trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { username: String(username).trim(), age: String(ageNum) },
    });

    if (createError) {
      const msg = createError.message.toLowerCase();
      if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
        return json({ error: "This email is already registered. Try signing in instead." }, 409);
      }
      return json({ error: createError.message }, 400);
    }

    const userId = userData.user?.id;
    if (!userId) {
      return json({ error: "Failed to create user." }, 500);
    }

    const { error: profileError } = await admin.from("profiles").upsert({
      id: userId,
      email: String(email).trim().toLowerCase(),
      username: String(username).trim(),
      age: String(ageNum),
      avatar: "indigo",
      xp: 0,
      level: 1,
      streak: 0,
      badges: [],
      completed_challenges: 0,
      onboarding_complete: false,
      notifications: true,
      language: "en",
    });

    if (profileError) {
      console.error("Profile create error:", profileError);
      return json({ error: "Account created but profile setup failed. Try signing in." }, 500);
    }

    return json({ ok: true, userId });
  } catch (err) {
    console.error(err);
    return json({ error: err instanceof Error ? err.message : "Registration failed." }, 500);
  }
});
