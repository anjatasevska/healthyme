import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { isSupabaseConfigured, wellnessApi } from '../lib/api';
import { useAuth } from './AuthContext';
import { getDailyChallenge } from '../utils/challenges';
import { calculateSleepHours } from '../utils/wellnessHelpers';
import { checkAchievements } from '../utils/achievements';

const WellnessContext = createContext(null);

const today = () => new Date().toISOString().split('T')[0];

function getStorageKey(uid, collectionName) {
  return `healthyme_${collectionName}_${uid}`;
}

export function WellnessProvider({ children }) {
  const { user, profile, addXP, unlockBadge, updateStreak, updateUserProfile } = useAuth();
  const [moods, setMoods] = useState([]);
  const [sleepEntries, setSleepEntries] = useState([]);
  const [waterEntries, setWaterEntries] = useState([]);
  const [exerciseEntries, setExerciseEntries] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  const uid = user?.uid;

  const loadFromLocal = useCallback(() => {
    if (!uid) return;
    setMoods(JSON.parse(localStorage.getItem(getStorageKey(uid, 'moods')) || '[]'));
    setSleepEntries(JSON.parse(localStorage.getItem(getStorageKey(uid, 'sleep')) || '[]'));
    setWaterEntries(JSON.parse(localStorage.getItem(getStorageKey(uid, 'water')) || '[]'));
    setExerciseEntries(JSON.parse(localStorage.getItem(getStorageKey(uid, 'exercise')) || '[]'));
    setCompletedChallenges(JSON.parse(localStorage.getItem(getStorageKey(uid, 'challenges')) || '[]'));
  }, [uid]);

  const loadData = useCallback(async () => {
    if (!uid) {
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured) {
      try {
        const data = await wellnessApi.getWellnessData();
        setMoods(data.moods ?? []);
        setSleepEntries(data.sleepEntries ?? []);
        setWaterEntries(data.waterEntries ?? []);
        setExerciseEntries(data.exerciseEntries ?? []);
        setCompletedChallenges(data.completedChallenges ?? []);
      } catch (e) {
        console.warn('Edge Function load failed, using localStorage:', e);
        loadFromLocal();
      }
    } else {
      loadFromLocal();
    }
    setLoading(false);
  }, [uid, loadFromLocal]);

  const saveLocal = (col, data) => {
    if (!uid) return;
    localStorage.setItem(getStorageKey(uid, col), JSON.stringify(data));
  };

  const syncToApi = async (action, payload) => {
    if (isSupabaseConfigured) {
      await wellnessApi[action](payload);
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getTodayMood = () => moods.find((m) => m.date === today());
  const getTodaySleep = () => sleepEntries.find((s) => s.date === today());
  const getTodayWater = () => waterEntries.find((w) => w.date === today());
  const getTodayExercise = () => exerciseEntries.filter((e) => e.date === today());
  const getTodayChallenge = () => {
    const daily = getDailyChallenge();
    const completed = completedChallenges.find(
      (c) => c.date === today() && c.challengeId === daily.id
    );
    return { ...daily, completed: !!completed };
  };

  const checkAndUnlockAchievements = useCallback(() => {
    const stats = {
      moodStreak: calculateMoodStreak(moods),
      waterGoalDays: waterEntries.filter((w) => w.glasses >= 8).length,
      goodSleepDays: sleepEntries.filter((s) => (s.hours || 0) >= 7).length,
      exerciseCount: exerciseEntries.length,
      highScoreDays: 0,
    };
    const toUnlock = checkAchievements(stats, profile);
    toUnlock.forEach((badgeId) => unlockBadge(badgeId));
  }, [moods, waterEntries, sleepEntries, exerciseEntries, profile, unlockBadge]);

  const saveMood = async (moodData) => {
    const entry = { ...moodData, date: today(), updatedAt: new Date().toISOString() };
    const existing = moods.find((m) => m.date === today());
    const id = existing?.id || `mood_${Date.now()}`;

    const updated = existing
      ? moods.map((m) => (m.date === today() ? { ...entry, id } : m))
      : [entry, ...moods];

    setMoods(updated);
    saveLocal('moods', updated);
    await syncToApi('upsertMood', { ...entry, id });
    updateStreak();
    addXP(10);
    checkAndUnlockAchievements();
  };

  const deleteMood = async (id) => {
    const updated = moods.filter((m) => m.id !== id);
    setMoods(updated);
    saveLocal('moods', updated);
    await syncToApi('deleteMood', id);
  };

  const saveSleep = async (sleepData) => {
    const hours = calculateSleepHours(sleepData.bedtime, sleepData.wakeTime);
    const entry = {
      ...sleepData,
      hours,
      date: today(),
      updatedAt: new Date().toISOString(),
    };
    const existing = sleepEntries.find((s) => s.date === today());
    const id = existing?.id || `sleep_${Date.now()}`;

    const updated = existing
      ? sleepEntries.map((s) => (s.date === today() ? { ...entry, id } : s))
      : [entry, ...sleepEntries];

    setSleepEntries(updated);
    saveLocal('sleep', updated);
    await syncToApi('upsertSleep', { ...entry, id });
    updateStreak();
    addXP(10);
    checkAndUnlockAchievements();
  };

  const addWaterGlass = async () => {
    const existing = getTodayWater();
    const glasses = (existing?.glasses || 0) + 1;
    const entry = { glasses, date: today(), updatedAt: new Date().toISOString() };
    const id = existing?.id || `water_${Date.now()}`;

    const updated = existing
      ? waterEntries.map((w) => (w.date === today() ? { ...entry, id } : w))
      : [entry, ...waterEntries];

    setWaterEntries(updated);
    saveLocal('water', updated);
    await syncToApi('upsertWater', { ...entry, id });

    if (glasses === 8) {
      addXP(15);
      checkAndUnlockAchievements();
    }
    updateStreak();
  };

  const setWaterGlasses = async (glasses) => {
    const existing = getTodayWater();
    const entry = { glasses, date: today(), updatedAt: new Date().toISOString() };
    const id = existing?.id || `water_${Date.now()}`;

    const updated = existing
      ? waterEntries.map((w) => (w.date === today() ? { ...entry, id } : w))
      : [entry, ...waterEntries];

    setWaterEntries(updated);
    saveLocal('water', updated);
    await syncToApi('upsertWater', { ...entry, id });
  };

  const addExercise = async (exerciseData) => {
    const entry = {
      ...exerciseData,
      date: today(),
      id: `exercise_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [entry, ...exerciseEntries];
    setExerciseEntries(updated);
    saveLocal('exercise', updated);
    await syncToApi('upsertExercise', entry);
    updateStreak();
    addXP(15);
    checkAndUnlockAchievements();
  };

  const deleteExercise = async (id) => {
    const updated = exerciseEntries.filter((e) => e.id !== id);
    setExerciseEntries(updated);
    saveLocal('exercise', updated);
    await syncToApi('deleteExercise', id);
  };

  const completeChallenge = async (challengeId) => {
    const daily = getDailyChallenge();
    if (challengeId !== daily.id) return false;

    const existing = completedChallenges.find(
      (c) => c.date === today() && c.challengeId === challengeId
    );
    if (existing) return false;

    const entry = {
      challengeId,
      date: today(),
      id: `challenge_${Date.now()}`,
      xp: daily.xp,
      completedAt: new Date().toISOString(),
    };

    const updated = [entry, ...completedChallenges];
    setCompletedChallenges(updated);
    saveLocal('challenges', updated);
    await syncToApi('completeChallenge', entry);
    addXP(daily.xp);
    updateUserProfile({ completedChallenges: (profile.completedChallenges || 0) + 1 });
    checkAndUnlockAchievements();
    return true;
  };

  const getWeeklyData = (days = 7) => {
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const mood = moods.find((m) => m.date === dateStr);
      const sleep = sleepEntries.find((s) => s.date === dateStr);
      const water = waterEntries.find((w) => w.date === dateStr);
      const exercise = exerciseEntries.filter((e) => e.date === dateStr);
      const challenge = completedChallenges.find((c) => c.date === dateStr);

      result.push({
        date: dateStr,
        label: d.toLocaleDateString('en', { weekday: 'short' }),
        mood: mood ? MOOD_SCORES[mood.mood] || 50 : null,
        sleep: sleep?.hours || null,
        water: water?.glasses || 0,
        exercise: exercise.reduce((s, e) => s + (e.minutes || 0), 0),
        challenge: challenge ? 1 : 0,
      });
    }
    return result;
  };

  return (
    <WellnessContext.Provider
      value={{
        loading,
        moods,
        sleepEntries,
        waterEntries,
        exerciseEntries,
        completedChallenges,
        getTodayMood,
        getTodaySleep,
        getTodayWater,
        getTodayExercise,
        getTodayChallenge,
        saveMood,
        deleteMood,
        saveSleep,
        addWaterGlass,
        setWaterGlasses,
        addExercise,
        deleteExercise,
        completeChallenge,
        getWeeklyData,
        reload: loadData,
      }}
    >
      {children}
    </WellnessContext.Provider>
  );
}

const MOOD_SCORES = {
  very_happy: 100,
  happy: 80,
  neutral: 60,
  sad: 40,
  very_sad: 20,
  stressed: 30,
};

function calculateMoodStreak(moods) {
  if (!moods.length) return 0;
  let streak = 0;
  const sorted = [...moods].sort((a, b) => b.date.localeCompare(a.date));
  let checkDate = new Date();

  for (const mood of sorted) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (mood.date === dateStr) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (mood.date < dateStr) {
      break;
    }
  }
  return streak;
}

export function useWellness() {
  const context = useContext(WellnessContext);
  if (!context) throw new Error('useWellness must be used within WellnessProvider');
  return context;
}
