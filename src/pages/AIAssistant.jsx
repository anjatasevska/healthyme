import { useState, useRef, useEffect } from 'react';
import { HiPaperAirplane } from 'react-icons/hi';
import { getAIResponse, SUGGESTED_QUESTIONS } from '../utils/aiAssistant';
import Card from '../components/ui/Card';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: "Hi — I'm here to help with stress, sleep, anxiety, or anything on your mind. What's going on?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { id: Date.now(), role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const response = await getAIResponse(text.trim());
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', text: response.text }]);
    } catch {
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', text: "I couldn't respond right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto h-[calc(100vh-5rem)] flex flex-col">
      <header className="page-header mb-4">
        <h1>Assistant</h1>
        <p>Supportive guidance for everyday wellness.</p>
      </header>

      <Card hover={false} className="flex-1 flex flex-col !p-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] px-3.5 py-2.5 rounded-lg text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-stone-200/70 dark:bg-stone-700/50 text-stone-800 dark:text-stone-200'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-3.5 py-2.5 rounded-lg bg-stone-200/70 dark:bg-stone-700/50 text-sm text-stone-500">Thinking...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="whitespace-nowrap px-3 py-1 rounded-md border border-border-soft dark:border-border-dark text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-700/40 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="p-4 border-t border-border-soft dark:border-border-dark flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="input-field flex-1 px-3 py-2"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center disabled:opacity-50 hover:bg-indigo-700 transition-colors"
          >
            <HiPaperAirplane className="w-4 h-4" />
          </button>
        </form>
      </Card>
    </div>
  );
}
