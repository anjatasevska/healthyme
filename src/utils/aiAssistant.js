/**
 * Rule-based AI Wellness Assistant
 * Structured for easy OpenAI/Gemini API integration later
 */

const RESPONSES = {
  stressed: {
    keywords: ['stress', 'stressed', 'overwhelmed', 'pressure', 'burnout'],
    responses: [
      "It's completely normal to feel stressed sometimes. Try the 4-7-8 breathing technique: breathe in for 4 seconds, hold for 7, exhale for 8. Repeat 3 times.",
      "When you're stressed, take a 5-minute break. Step away from your screen, stretch, or listen to calming music. Small breaks make a big difference.",
      "Writing down what's stressing you can help. Try our mood tracker to note your feelings — it really helps process emotions.",
    ],
  },
  sleep: {
    keywords: ['sleep', 'insomnia', 'tired', 'can\'t sleep', 'cant sleep', 'exhausted'],
    responses: [
      "Good sleep is essential for your wellbeing. Try going to bed at the same time each night and avoid screens 30 minutes before bed.",
      "If you can't sleep, don't force it. Get up, read something calm, and try again in 20 minutes. Check our Sleep Tracker to monitor your patterns.",
      "A cool, dark room helps sleep quality. Aim for 8-9 hours — teenagers need more sleep than adults!",
    ],
  },
  anxious: {
    keywords: ['anxious', 'anxiety', 'worried', 'nervous', 'panic'],
    responses: [
      "Anxiety is your body's alarm system — it's trying to protect you. Ground yourself: name 5 things you see, 4 you hear, 3 you touch.",
      "Try progressive muscle relaxation: tense each muscle group for 5 seconds, then release. Start from your toes and work up.",
      "Remember: anxious thoughts aren't facts. Challenge them — ask 'What's the evidence?' and 'What would I tell a friend?'",
    ],
  },
  sad: {
    keywords: ['sad', 'depressed', 'down', 'lonely', 'unhappy', 'crying'],
    responses: [
      "I'm sorry you're feeling sad. Your feelings are valid. Consider talking to someone you trust — a friend, family member, or counselor.",
      "Sometimes sadness needs expression. Try writing 3 things you're grateful for, even small ones. Our daily challenge can help with this!",
      "Physical activity can boost mood — even a 10-minute walk helps. You don't have to feel better immediately; be patient with yourself.",
    ],
  },
  exams: {
    keywords: ['exam', 'test', 'school', 'grades', 'study', 'homework'],
    responses: [
      "Exam stress is common! Break studying into 25-minute blocks (Pomodoro technique) with 5-minute breaks.",
      "Prepare well, but also rest well. Sleep helps memory consolidation — pulling all-nighters often hurts more than it helps.",
      "Remember: one exam doesn't define you. Do your best, manage your time, and be kind to yourself regardless of the outcome.",
    ],
  },
  general: {
    responses: [
      "I'm here to support your wellness journey. Tell me how you're feeling — stressed, tired, anxious, or sad — and I'll offer some tips.",
      "HealthyMe is designed to help you build small, daily habits. Which tracker would you like to explore today?",
      "Remember: taking care of your mental health is just as important as physical health. What would you like to talk about?",
    ],
  },
};

function matchCategory(message) {
  const lower = message.toLowerCase();
  for (const [category, data] of Object.entries(RESPONSES)) {
    if (category === 'general') continue;
    if (data.keywords?.some((kw) => lower.includes(kw))) {
      return category;
    }
  }
  return 'general';
}

function pickResponse(category) {
  const data = RESPONSES[category] || RESPONSES.general;
  const pool = data.responses;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Rule-based response (default) */
export function getRuleBasedResponse(message) {
  const category = matchCategory(message);
  return {
    text: pickResponse(category),
    category,
    source: 'rule-based',
  };
}

/**
 * API-ready function — swap implementation when API key is available
 * Usage: const response = await getAIResponse(message);
 */
export async function getAIResponse(message) {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (openaiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are a supportive wellness assistant for teenagers. Give warm, practical, evidence-based advice about mental and physical health. Keep responses concise (2-3 sentences). Never diagnose medical conditions.',
            },
            { role: 'user', content: message },
          ],
          max_tokens: 200,
        }),
      });
      const data = await res.json();
      if (data.choices?.[0]?.message?.content) {
        return { text: data.choices[0].message.content, source: 'openai' };
      }
    } catch (e) {
      console.warn('OpenAI API failed, falling back to rule-based:', e);
    }
  }

  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `As a teen wellness assistant: ${message}` }] }],
          }),
        }
      );
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return { text, source: 'gemini' };
    } catch (e) {
      console.warn('Gemini API failed, falling back to rule-based:', e);
    }
  }

  return getRuleBasedResponse(message);
}

export const SUGGESTED_QUESTIONS = [
  "I'm stressed",
  "I can't sleep",
  "I'm feeling anxious",
  "I'm sad",
  "I'm nervous about exams",
];
