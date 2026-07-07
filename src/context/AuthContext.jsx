import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { wellnessApi, registerViaEdge } from '../lib/api';
import { getDisplayName, getProfileAge, looksLikeEmail, normalizeUsername } from '../utils/profileHelpers';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext(null);

const DEFAULT_PROFILE = {
  username: '',
  age: '',
  avatar: 'indigo',
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: null,
  badges: [],
  completedChallenges: 0,
  onboardingComplete: false,
  notifications: true,
  language: 'en',
};

function createLocalUser(email, password, profileData) {
  const users = JSON.parse(localStorage.getItem('healthyme-local-users') || '{}');
  if (users[email]) throw new Error('Email already registered');
  const user = {
    uid: `local_${Date.now()}`,
    email,
    password,
    ...DEFAULT_PROFILE,
    ...profileData,
    createdAt: new Date().toISOString(),
  };
  users[email] = user;
  localStorage.setItem('healthyme-local-users', JSON.stringify(users));
  return user;
}

function getLocalUser(email, password) {
  const users = JSON.parse(localStorage.getItem('healthyme-local-users') || '{}');
  const user = users[email];
  if (!user || user.password !== password) throw new Error('Invalid email or password');
  return user;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [localSession, setLocalSession] = useLocalStorage('healthyme-session', null);

  const loadProfile = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { profile: remoteProfile } = await wellnessApi.getProfile();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const merged = {
          ...DEFAULT_PROFILE,
          ...remoteProfile,
          username:
            normalizeUsername(remoteProfile.username) ||
            normalizeUsername(authUser?.user_metadata?.username) ||
            '',
          age: getProfileAge(remoteProfile, authUser),
        };
        setProfile(merged);

        // Backfill profile when metadata has fields the DB row is missing
        const metaUsername = normalizeUsername(authUser?.user_metadata?.username);
        const metaAge = authUser?.user_metadata?.age?.toString().trim();
        const backfill = {};
        if (metaUsername && !normalizeUsername(remoteProfile.username)) {
          backfill.username = metaUsername;
        }
        if (metaAge && !remoteProfile.age?.toString().trim()) {
          backfill.age = metaAge;
        }
        if (Object.keys(backfill).length > 0) {
          wellnessApi.updateProfile(backfill).catch(() => {});
        }
      } catch (e) {
        console.warn('Failed to load profile from Edge Function:', e);
      }
      return;
    }
    if (localSession?.profile) {
      setProfile({ ...DEFAULT_PROFILE, ...localSession.profile });
    }
  }, [localSession]);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            uid: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata,
          });
          loadProfile();
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            uid: session.user.id,
            email: session.user.email,
            user_metadata: session.user.user_metadata,
          });
          loadProfile();
        } else {
          setUser(null);
          setProfile(DEFAULT_PROFILE);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    }

    if (localSession) {
      setUser({ uid: localSession.uid, email: localSession.email });
      setProfile({ ...DEFAULT_PROFILE, ...localSession.profile });
    }
    setLoading(false);
  }, [localSession, loadProfile]);

  const saveProfile = async (data) => {
    const updated = { ...profile, ...data };
    setProfile(updated);

    if (isSupabaseConfigured) {
      try {
        const { profile: remoteProfile } = await wellnessApi.updateProfile(data);
        setProfile({ ...DEFAULT_PROFILE, ...remoteProfile, ...data });

        if (supabase && (data.username !== undefined || data.age !== undefined)) {
          const metaPatch = {};
          if (data.username !== undefined) {
            metaPatch.username = normalizeUsername(data.username);
          }
          if (data.age !== undefined) {
            metaPatch.age = String(data.age).trim();
          }
          const { data: authData } = await supabase.auth.updateUser({ data: metaPatch });
          if (authData?.user) {
            setUser({
              uid: authData.user.id,
              email: authData.user.email,
              user_metadata: authData.user.user_metadata,
            });
          }
        }
      } catch (e) {
        console.error('Failed to save profile via Edge Function:', e);
      }
    } else {
      const session = { ...localSession, profile: updated };
      setLocalSession(session);
      const users = JSON.parse(localStorage.getItem('healthyme-local-users') || '{}');
      if (users[localSession?.email]) {
        users[localSession.email] = { ...users[localSession.email], ...updated };
        localStorage.setItem('healthyme-local-users', JSON.stringify(users));
      }
    }
  };

  const register = async (email, password, username, age) => {
    if (isSupabaseConfigured && supabase) {
      const normalizedEmail = email.trim().toLowerCase();
      const profileData = { username, age: String(age), email: normalizedEmail };

      // Edge Function creates user + profile without sending confirmation emails
      await registerViaEdge({
        email: normalizedEmail,
        password,
        username,
        age: String(age),
      });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });
      if (error) throw error;

      const today = new Date().toISOString().split('T')[0];
      const initialProfile = {
        ...profileData,
        badges: ['first_login'],
        streak: 1,
        lastActiveDate: today,
      };

      setUser({
        uid: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata,
      });
      setProfile({ ...DEFAULT_PROFILE, ...initialProfile });
      await loadProfile();

      // Ensure username and age are persisted (edge function + metadata)
      const profilePatch = {};
      if (username?.trim()) profilePatch.username = username.trim();
      if (age) profilePatch.age = String(age);
      if (Object.keys(profilePatch).length > 0) {
        await wellnessApi.updateProfile(profilePatch);
        if (supabase) {
          await supabase.auth.updateUser({ data: profilePatch });
        }
      }

      return { user: data.user, needsEmailConfirmation: false };
    }

    const localUser = createLocalUser(email, password, { username, age: String(age), email });
    setLocalSession({ uid: localUser.uid, email, profile: localUser });
    setUser({ uid: localUser.uid, email });
    setProfile(localUser);
    unlockBadge('first_login');
    updateStreak();
    return { user: localUser, needsEmailConfirmation: false };
  };

  const login = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });
      if (error) throw error;
      setUser({
        uid: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata,
      });
      await loadProfile();
      unlockBadge('first_login');
      updateStreak();
      return data.user;
    }

    const localUser = getLocalUser(normalizedEmail, password);
    setLocalSession({ uid: localUser.uid, email: normalizedEmail, profile: localUser });
    setUser({ uid: localUser.uid, email: normalizedEmail });
    setProfile(localUser);
    unlockBadge('first_login');
    updateStreak();
    return localUser;
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setLocalSession(null);
    setUser(null);
    setProfile(DEFAULT_PROFILE);
  };

  const resetPassword = async (email) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      return;
    }
    await new Promise((r) => setTimeout(r, 800));
  };

  const updateUserProfile = (data) => saveProfile(data);

  const addXP = (amount) => {
    const newXP = (profile.xp || 0) + amount;
    const newLevel = Math.floor(newXP / 100) + 1;
    saveProfile({ xp: newXP, level: newLevel });
    return { xp: newXP, level: newLevel };
  };

  const unlockBadge = (badgeId) => {
    const badges = profile.badges || [];
    if (badges.includes(badgeId)) return false;
    saveProfile({ badges: [...badges, badgeId] });
    return true;
  };

  const updateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const last = profile.lastActiveDate;
    let streak = profile.streak || 0;

    if (last === today) return streak;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (last === yesterdayStr) {
      streak += 1;
    } else if (last !== today) {
      streak = 1;
    }

    saveProfile({ streak, lastActiveDate: today });
    return streak;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        register,
        login,
        logout,
        resetPassword,
        updateUserProfile,
        addXP,
        unlockBadge,
        updateStreak,
        isSupabaseConfigured,
        displayName: getDisplayName(profile, user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
