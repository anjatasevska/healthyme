import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_PROFILE = {
  username: "",
  age: "",
  avatar: "indigo",
  xp: 0,
  level: 1,
  streak: 0,
  last_active_date: null,
  badges: [],
  completed_challenges: 0,
  onboarding_complete: false,
  notifications: true,
  language: "en",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function mapProfile(row: Record<string, unknown> | null) {
  if (!row) return DEFAULT_PROFILE;
  return {
    username: row.username ?? "",
    age: row.age ?? "",
    avatar: row.avatar ?? "indigo",
    xp: row.xp ?? 0,
    level: row.level ?? 1,
    streak: row.streak ?? 0,
    lastActiveDate: row.last_active_date ?? null,
    badges: row.badges ?? [],
    completedChallenges: row.completed_challenges ?? 0,
    onboardingComplete: row.onboarding_complete ?? false,
    notifications: row.notifications ?? true,
    language: row.language ?? "en",
    email: row.email ?? "",
  };
}

function getAdminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

async function getUser(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");
  const admin = getAdminClient();
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await req.json();
    const { action, ...payload } = body;
    const admin = getAdminClient();

    // Public — no auth required (no confirmation email sent)
    if (action === "register") {
      const { email, password, username, age } = payload;
      if (!email || !password || !username) {
        return json({ error: "Email, password, and username are required." }, 400);
      }
      if (String(password).length < 6) {
        return json({ error: "Password must be at least 6 characters." }, 400);
      }
      const ageNum = Number(age);
      if (!age || ageNum < 11 || ageNum > 15) {
        return json({ error: "Age must be between 11 and 15." }, 400);
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const { data: userData, error: createError } = await admin.auth.admin.createUser({
        email: normalizedEmail,
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
      if (!userId) return json({ error: "Failed to create user." }, 500);

      const { error: profileError } = await admin.from("profiles").upsert({
        id: userId,
        email: normalizedEmail,
        ...DEFAULT_PROFILE,
        username: String(username).trim(),
        age: String(ageNum),
        badges: ["first_login"],
        streak: 1,
        last_active_date: new Date().toISOString().split("T")[0],
      });

      if (profileError) throw profileError;
      return json({ ok: true, userId });
    }

    const user = await getUser(req);
    if (!user) return json({ error: "Unauthorized" }, 401);

    const userId = user.id;

    switch (action) {
      case "getProfile": {
        const { data, error } = await admin
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          const meta = user.user_metadata ?? {};
          const insert = {
            id: userId,
            email: user.email,
            ...DEFAULT_PROFILE,
            username: meta.username ?? "",
            age: meta.age ?? "",
          };
          const { data: created, error: insertError } = await admin
            .from("profiles")
            .insert(insert)
            .select("*")
            .single();
          if (insertError) throw insertError;
          return json({ profile: mapProfile(created) });
        }

        return json({ profile: mapProfile(data) });
      }

      case "updateProfile": {
        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        const fieldMap: Record<string, string> = {
          username: "username",
          age: "age",
          avatar: "avatar",
          xp: "xp",
          level: "level",
          streak: "streak",
          lastActiveDate: "last_active_date",
          badges: "badges",
          completedChallenges: "completed_challenges",
          onboardingComplete: "onboarding_complete",
          notifications: "notifications",
          language: "language",
          email: "email",
        };

        for (const [key, col] of Object.entries(fieldMap)) {
          if (payload[key] !== undefined) updates[col] = payload[key];
        }

        const { data, error } = await admin
          .from("profiles")
          .upsert({ id: userId, email: user.email, ...updates })
          .select("*")
          .single();

        if (error) throw error;
        return json({ profile: mapProfile(data) });
      }

      case "getWellnessData": {
        const [moods, sleep, water, exercise, challenges] = await Promise.all([
          admin.from("moods").select("*").eq("user_id", userId).order("date", { ascending: false }),
          admin.from("sleep_entries").select("*").eq("user_id", userId).order("date", { ascending: false }),
          admin.from("water_entries").select("*").eq("user_id", userId).order("date", { ascending: false }),
          admin.from("exercise_entries").select("*").eq("user_id", userId).order("date", { ascending: false }),
          admin.from("challenge_completions").select("*").eq("user_id", userId).order("date", { ascending: false }),
        ]);

        if (moods.error) throw moods.error;
        if (sleep.error) throw sleep.error;
        if (water.error) throw water.error;
        if (exercise.error) throw exercise.error;
        if (challenges.error) throw challenges.error;

        return json({
          moods: (moods.data ?? []).map((r) => ({
            id: r.id,
            date: r.date,
            mood: r.mood,
            notes: r.notes,
            updatedAt: r.updated_at,
          })),
          sleepEntries: (sleep.data ?? []).map((r) => ({
            id: r.id,
            date: r.date,
            bedtime: r.bedtime,
            wakeTime: r.wake_time,
            hours: r.hours,
            updatedAt: r.updated_at,
          })),
          waterEntries: (water.data ?? []).map((r) => ({
            id: r.id,
            date: r.date,
            glasses: r.glasses,
            updatedAt: r.updated_at,
          })),
          exerciseEntries: (exercise.data ?? []).map((r) => ({
            id: r.id,
            date: r.date,
            type: r.type,
            minutes: r.minutes,
            calories: r.calories,
            createdAt: r.created_at,
          })),
          completedChallenges: (challenges.data ?? []).map((r) => ({
            id: r.id,
            date: r.date,
            challengeId: r.challenge_id,
            xp: r.xp,
            completedAt: r.completed_at,
          })),
        });
      }

      case "upsertMood": {
        const { id, date, mood, notes, updatedAt } = payload;
        const { error } = await admin.from("moods").upsert({
          id,
          user_id: userId,
          date,
          mood,
          notes: notes ?? "",
          updated_at: updatedAt ?? new Date().toISOString(),
        });
        if (error) throw error;
        return json({ ok: true });
      }

      case "deleteMood": {
        const { error } = await admin.from("moods").delete().eq("id", payload.id).eq("user_id", userId);
        if (error) throw error;
        return json({ ok: true });
      }

      case "upsertSleep": {
        const { id, date, bedtime, wakeTime, hours, updatedAt } = payload;
        const { error } = await admin.from("sleep_entries").upsert({
          id,
          user_id: userId,
          date,
          bedtime,
          wake_time: wakeTime,
          hours,
          updated_at: updatedAt ?? new Date().toISOString(),
        });
        if (error) throw error;
        return json({ ok: true });
      }

      case "upsertWater": {
        const { id, date, glasses, updatedAt } = payload;
        const { error } = await admin.from("water_entries").upsert({
          id,
          user_id: userId,
          date,
          glasses,
          updated_at: updatedAt ?? new Date().toISOString(),
        });
        if (error) throw error;
        return json({ ok: true });
      }

      case "upsertExercise": {
        const { id, date, type, minutes, calories, createdAt } = payload;
        const { error } = await admin.from("exercise_entries").upsert({
          id,
          user_id: userId,
          date,
          type,
          minutes,
          calories,
          created_at: createdAt ?? new Date().toISOString(),
        });
        if (error) throw error;
        return json({ ok: true });
      }

      case "deleteExercise": {
        const { error } = await admin.from("exercise_entries").delete().eq("id", payload.id).eq("user_id", userId);
        if (error) throw error;
        return json({ ok: true });
      }

      case "completeChallenge": {
        const { id, date, challengeId, xp, completedAt } = payload;
        const { error } = await admin.from("challenge_completions").upsert({
          id,
          user_id: userId,
          date,
          challenge_id: challengeId,
          xp,
          completed_at: completedAt ?? new Date().toISOString(),
        });
        if (error) throw error;
        return json({ ok: true });
      }

      default:
        return json({ error: `Unknown action: ${action}` }, 400);
    }
  } catch (err) {
    console.error(err);
    return json({ error: err instanceof Error ? err.message : "Internal server error" }, 500);
  }
});
