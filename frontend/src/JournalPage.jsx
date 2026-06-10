import { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import './styles/journal.css';

/* ── Mood options ── */
const MOODS = [
  { id: 'happy',    emoji: '😄', label: 'Happy' },
  { id: 'calm',     emoji: '😌', label: 'Calm' },
  { id: 'anxious',  emoji: '😢', label: 'Anxious' },
  { id: 'grateful', emoji: '❤️', label: 'Grateful' },
  { id: 'tired',    emoji: '😪', label: 'Tired' },
];

const MOOD_BY_ID = Object.fromEntries(MOODS.map((m) => [m.id, m]));

const TOPNAV_LINKS = ['Overview', 'History', 'Profile', 'Insights'];

/* ── Seed journal entries ── */
const INITIAL_ENTRIES = [
  { id: 1, date: '3/8/2023', mood: 'grateful', text: 'Grateful for a slow morning and good coffee. Felt centered before work.' },
  { id: 2, date: '3/7/2023', mood: 'calm',     text: 'Long walk after lunch cleared my head. Sleep has been steadier this week.' },
  { id: 3, date: '3/6/2023', mood: 'anxious',  text: 'Busy day, lots of context-switching. Need to protect deep-work blocks.' },
  { id: 4, date: '3/5/2023', mood: 'happy',    text: 'Hit my step goal and journaled two days running. Small wins stacking up.' },
  { id: 5, date: '3/4/2023', mood: 'tired',    text: 'Short night. Reminding myself rest is part of the plan, not a failure.' },
];

/* ── Canned assistant replies (local, no backend) ── */
const ASSISTANT_REPLIES = [
  "Looking at your last week, your calmer days line up with earlier sleep. Want to set a wind-down reminder?",
  "Your 'grateful' entries cluster on mornings you logged water before coffee — a nice pattern to keep.",
  "I notice anxious moods on high-expense days. Want me to surface your spending trend alongside mood?",
  "You've journaled 4 of the last 5 days. That consistency is the strongest signal in your data right now.",
];

export default function JournalPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [draft, setDraft] = useState('');
  const [mood, setMood] = useState('happy');
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const [editingId, setEditingId] = useState(null);

  const [chat, setChat] = useState([
    { from: 'bot', text: 'Ask me about your lifestyle context — sleep, mood, habits or spending.' },
    { from: 'user', text: "What's the link between my mood and routine?" },
    { from: 'bot', text: 'Your calmer days follow nights with 7h+ sleep and a logged morning habit. Keep the streak going.' },
  ]);
  const [message, setMessage] = useState('');
  const [botTyping, setBotTyping] = useState(false);
  const bodyRef = useRef(null);
  const replyIdx = useRef(0);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [chat, botTyping]);

  const todayLabel = () => new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });

  const saveEntry = () => {
    if (!draft.trim()) return;
    if (editingId !== null) {
      setEntries((prev) => prev.map((e) => (e.id === editingId ? { ...e, mood, text: draft.trim() } : e)));
      setEditingId(null);
    } else {
      const nextId = entries.length ? Math.max(...entries.map((e) => e.id)) + 1 : 1;
      setEntries((prev) => [{ id: nextId, date: todayLabel(), mood, text: draft.trim() }, ...prev]);
    }
    setDraft('');
    setMood('happy');
  };

  const editEntry = (e) => {
    setEditingId(e.id);
    setDraft(e.text);
    setMood(e.mood);
    document.getElementById('journal-textarea')?.focus();
  };

  const deleteEntry = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (editingId === id) { setEditingId(null); setDraft(''); setMood('happy'); }
  };

  const sendMessage = () => {
    if (!message.trim() || botTyping) return;
    const userMsg = { from: 'user', text: message.trim() };
    const reply = ASSISTANT_REPLIES[replyIdx.current % ASSISTANT_REPLIES.length];
    replyIdx.current += 1;
    setChat((prev) => [...prev, userMsg]);
    setMessage('');
    setBotTyping(true);
    setTimeout(() => {
      setChat((prev) => [...prev, { from: 'bot', text: reply }]);
      setBotTyping(false);
    }, 900);
  };

  return (
    <div className="app-shell" data-screen-label="Journal">
      <div className="botanical-overlay" />
      <Sidebar active="journal" />

      <main className="app-main">
        <div className="app-main__content">
          {/* Top bar */}
          <div className="journal__topbar">
            <div className="journal__brand">
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="M16 2C14 8 8 14 4 18C8 17 12 18 14 22C14 18 16 12 22 6C20 8 18 6 16 2Z" fill="#241F1A" />
              </svg>
              <span className="sidebar__logo-text">LifeTrack</span>
            </div>
            <nav className="journal__topnav">
              {TOPNAV_LINKS.map((link) => (
                <button
                  key={link}
                  className={`journal__topnav-link${activeTab === link ? ' journal__topnav-link--active' : ''}`}
                  onClick={() => setActiveTab(link)}
                >
                  {link}
                </button>
              ))}
            </nav>
            <button
              className="btn btn--primary"
              id="btn-create-entry"
              style={{ height: 44 }}
              onClick={() => { setEditingId(null); setDraft(''); document.getElementById('journal-textarea')?.focus(); }}
            >
              Create New Entry
            </button>
          </div>

          <div className="journal__grid">
            {/* ── Column 1: New reflection ── */}
            <section className="card" id="card-new-reflection">
              <h2 className="journal-card__title">Add New Journal Reflection</h2>
              <textarea
                id="journal-textarea"
                className="journal-textarea"
                placeholder="My Thoughts Today…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />

              <p className="journal__mood-prompt">Select your daily mood…</p>
              <div className="mood-pills" role="radiogroup" aria-label="Daily mood">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={mood === m.id}
                    className={`mood-pill${mood === m.id ? ' mood-pill--active' : ''}`}
                    onClick={() => setMood(m.id)}
                  >
                    <span className="mood-pill__emoji">{m.emoji}</span>
                    <span className="mood-pill__label">{m.label}</span>
                  </button>
                ))}
              </div>

              <button className="btn btn--primary btn--full" id="btn-save-entry" onClick={saveEntry}>
                {editingId !== null ? 'Update Entry' : 'Save Entry'}
              </button>
            </section>

            {/* ── Column 2: Previous journals ── */}
            <section className="card" id="card-previous-journals">
              <h2 className="journal-card__title">Previous Journals (Last 30 Days)</h2>
              <div className="journal-list">
                {entries.length === 0 && (
                  <div className="txn-empty">No reflections yet — write your first one on the left.</div>
                )}
                {entries.map((e) => {
                  const m = MOOD_BY_ID[e.mood] || MOODS[0];
                  return (
                    <div className="journal-entry" key={e.id}>
                      <div className="journal-entry__icon" title={m.label}>
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 3h9l3 3v11a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" />
                          <line x1="6.5" y1="8" x2="12" y2="8" /><line x1="6.5" y1="11" x2="10" y2="11" />
                        </svg>
                      </div>
                      <div className="journal-entry__body">
                        <div className="journal-entry__date">Date: {e.date}</div>
                        <div className="journal-entry__preview">{m.emoji} {m.label} · {e.text}</div>
                      </div>
                      <div className="journal-entry__actions">
                        <button className="journal-entry__action" onClick={() => editEntry(e)}>
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2l3 3-8 8H3v-3z" /></svg>
                          Edit
                        </button>
                        <button className="journal-entry__action journal-entry__action--delete" onClick={() => deleteEntry(e.id)}>
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h10M6 4V2.5h4V4M5 4l.5 9h5L11 4" /></svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── Column 3: Grok AI Assistant ── */}
            <aside className="ai-panel" id="ai-assistant">
              <div className="ai-panel__header">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="10" cy="10" r="7.5" /><path d="M7 8.5l3 3 3-5" />
                </svg>
                Grok AI Assistant
              </div>
              <div className="ai-panel__body" ref={bodyRef}>
                {chat.map((c, i) => (
                  <div key={i} className={`ai-bubble ${c.from === 'bot' ? 'ai-bubble--bot' : 'ai-bubble--user'}`}>
                    {c.text}
                  </div>
                ))}
                {botTyping && (
                  <div className="ai-bubble ai-bubble--bot ai-bubble--typing" aria-label="Assistant is typing">
                    <span className="ai-typing-dot" />
                    <span className="ai-typing-dot" />
                    <span className="ai-typing-dot" />
                  </div>
                )}
              </div>
              <div className="ai-panel__footer">
                <input
                  className="ai-panel__input"
                  placeholder="Interactive AI Chatbot…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  aria-label="Message the assistant"
                />
                <button className="ai-panel__send" onClick={sendMessage} aria-label="Send message">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 10h12M10 5l5 5-5 5" />
                  </svg>
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
