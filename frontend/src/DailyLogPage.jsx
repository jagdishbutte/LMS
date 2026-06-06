import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './styles/daily-log.css';

/* ── Inline SVG icons for sidebar nav ── */
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="7" height="7" rx="1.5" />
    <rect x="11" y="2" width="7" height="7" rx="1.5" />
    <rect x="2" y="11" width="7" height="7" rx="1.5" />
    <rect x="11" y="11" width="7" height="7" rx="1.5" />
  </svg>
);

const DailyLogIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="2" width="14" height="16" rx="2" />
    <path d="M7 2V4" />
    <path d="M13 2V4" />
    <line x1="6" y1="8" x2="14" y2="8" />
    <line x1="6" y1="11" x2="14" y2="11" />
    <line x1="6" y1="14" x2="10" y2="14" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="10" width="3" height="8" rx="1" />
    <rect x="8.5" y="5" width="3" height="13" rx="1" />
    <rect x="15" y="2" width="3" height="16" rx="1" />
  </svg>
);

const ExpensesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="8" />
    <path d="M10 5V15" />
    <path d="M7 7.5C7 7.5 8 6.5 10 6.5C12 6.5 13 7.5 13 8.5C13 9.5 12 10 10 10C8 10 7 10.5 7 11.5C7 12.5 8 13.5 10 13.5C12 13.5 13 12.5 13 12.5" />
  </svg>
);

const JournalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 3C4 2.44772 4.44772 2 5 2H15C15.5523 2 16 2.44772 16 3V17C16 17.5523 15.5523 18 15 18H5C4.44772 18 4 17.5523 4 17V3Z" />
    <line x1="7" y1="6" x2="13" y2="6" />
    <line x1="7" y1="9" x2="13" y2="9" />
    <line x1="7" y1="12" x2="10" y2="12" />
  </svg>
);

/* ── Speedometer-style Gauge Component ── */
function Gauge({ value = 0, max = 100 }) {
  const pct = Math.min(Math.max(value / max, 0), 1);

  // Needle angle: 0% → 180° (left), 100% → 0° (right)
  const needleAngleDeg = 180 - pct * 180;
  const needleAngleRad = (needleAngleDeg * Math.PI) / 180;

  // Needle tip position (on the arc, radius ~13 so it sits inside the thick arc)
  const needleLen = 13;
  const cx = 20;
  const cy = 22;
  const tipX = cx + needleLen * Math.cos(needleAngleRad);
  const tipY = cy - needleLen * Math.sin(needleAngleRad);

  return (
    <div className="gauge" title={`${Math.round(pct * 100)}%`}>
      <svg className="gauge__svg" viewBox="0 0 40 26" overflow="visible">
        <defs>
          {/* Gradient from light sand (left) to dark clay (right) */}
          <linearGradient id={`gaugeGrad`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D9A88E" />
            <stop offset="100%" stopColor="#6E6052" />
          </linearGradient>
        </defs>

        {/* Thick background track arc */}
        <path
          d="M4,22 A16,16 0 0,1 36,22"
          fill="none"
          stroke="var(--sand-200)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Filled progress arc with gradient */}
        <path
          d="M4,22 A16,16 0 0,1 36,22"
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={Math.PI * 16}
          strokeDashoffset={Math.PI * 16 * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 500ms ease' }}
        />

        {/* Needle line — tapered from center-bottom to tip */}
        <line
          x1={cx}
          y1={cy}
          x2={tipX}
          y2={tipY}
          stroke="var(--clay-700)"
          strokeWidth="1.8"
          strokeLinecap="round"
          style={{ transition: 'x2 500ms ease, y2 500ms ease' }}
        />

        {/* Center pivot dot */}
        <circle cx={cx} cy={cy} r="2" fill="var(--clay-700)" />
      </svg>
    </div>
  );
}

/* ── Default data ── */
const DEFAULT_MEALS = [
  { id: 1, name: 'Breakfast', items: ['Oatmeal'] },
  { id: 2, name: 'Lunch', items: ['Chicken Salad'] },
  { id: 3, name: 'Dinner', items: ['Fish Taco'] },
  { id: 4, name: 'Snacks', items: ['Fruit'] },
];

const TRANSACTIONAL_HABITS = [
  'Drink Water Before Coffee',
  'Meditation (10 min)',
  'Steps Goal Met',
  'Journal Entry Written',
];

const EMBEDDED_HABITS = [
  'Drink Water Before Coffee',
  'Meditation (10 min)',
  'Steps Goal Met',
  'Journal Entry Written',
  'Evening Stretch',
];

const MOOD_OPTIONS = [
  { value: '', label: 'Select mood…' },
  { value: 'great', label: '😊 Great' },
  { value: 'good', label: '🙂 Good' },
  { value: 'okay', label: '😐 Okay' },
  { value: 'meh', label: '😕 Meh' },
  { value: 'bad', label: '😞 Bad' },
];


export default function DailyLogPage() {
  /* Activity Metrics */
  const [sleepHours, setSleepHours] = useState('');
  const [stepTarget, setStepTarget] = useState('');
  const [waterIntake, setWaterIntake] = useState('');

  /* Transactional habits */
  const [transChecked, setTransChecked] = useState({});

  /* Embedded habits */
  const [embeddedChecked, setEmbeddedChecked] = useState({});

  /* Meals */
  const [meals, setMeals] = useState(DEFAULT_MEALS);
  const [addingTo, setAddingTo] = useState(null); // meal id being edited
  const [newItemText, setNewItemText] = useState('');
  const addInputRef = useRef(null);

  /* Moods */
  const [morningMood, setMorningMood] = useState('great');
  const [afternoonMood, setAfternoonMood] = useState('okay');
  const [eveningMood, setEveningMood] = useState('great');

  /* ── Handlers ── */

  const toggleTrans = (habit) => {
    setTransChecked((prev) => ({ ...prev, [habit]: !prev[habit] }));
  };

  const toggleEmbedded = (habit) => {
    setEmbeddedChecked((prev) => ({ ...prev, [habit]: !prev[habit] }));
  };

  const addMealItem = (mealId) => {
    if (!newItemText.trim()) return;
    setMeals((prev) =>
      prev.map((m) =>
        m.id === mealId ? { ...m, items: [...m.items, newItemText.trim()] } : m
      )
    );
    setNewItemText('');
    setAddingTo(null);
  };

  const removeMealItem = (mealId, idx) => {
    setMeals((prev) =>
      prev.map((m) =>
        m.id === mealId ? { ...m, items: m.items.filter((_, i) => i !== idx) } : m
      )
    );
  };

  const addNewMeal = () => {
    const nextId = meals.length ? Math.max(...meals.map((m) => m.id)) + 1 : 1;
    const name = prompt('Meal name (e.g. "Mid-morning Snack"):');
    if (!name?.trim()) return;
    setMeals((prev) => [...prev, { id: nextId, name: name.trim(), items: [] }]);
  };

  const startAdding = (mealId) => {
    setAddingTo(mealId);
    setNewItemText('');
    setTimeout(() => addInputRef.current?.focus(), 50);
  };

  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar" id="daily-log-sidebar">
        <div className="sidebar__header">
          <Link to="/" className="sidebar__logo" id="daily-log-logo">
            <svg
              className="sidebar__logo-mark"
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M16 2C14 8 8 14 4 18C8 17 12 18 14 22C14 18 16 12 22 6C20 8 18 6 16 2Z"
                fill="#241F1A"
              />
            </svg>
            <span className="sidebar__logo-text">LifeTrack</span>
          </Link>
        </div>

        <nav className="sidebar__nav" aria-label="Main navigation">
          <ul className="sidebar__nav-list">
            <li>
              <Link to="/dashboard" className="sidebar__nav-item" id="nav-dashboard">
                <span className="sidebar__nav-icon"><DashboardIcon /></span>
                <span className="sidebar__nav-label">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/daily-log" className="sidebar__nav-item sidebar__nav-item--active" id="nav-daily-log">
                <span className="sidebar__nav-icon"><DailyLogIcon /></span>
                <span className="sidebar__nav-label">Daily Log</span>
              </Link>
            </li>
            <li>
              <Link to="/analytics" className="sidebar__nav-item" id="nav-analytics">
                <span className="sidebar__nav-icon"><AnalyticsIcon /></span>
                <span className="sidebar__nav-label">Analytics</span>
              </Link>
            </li>
            <li>
              <Link to="/expenses" className="sidebar__nav-item" id="nav-expenses">
                <span className="sidebar__nav-icon"><ExpensesIcon /></span>
                <span className="sidebar__nav-label">Expenses</span>
              </Link>
            </li>
            <li>
              <Link to="/journal" className="sidebar__nav-item" id="nav-journal">
                <span className="sidebar__nav-icon"><JournalIcon /></span>
                <span className="sidebar__nav-label">Journal</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar__user">
          <div className="sidebar__avatar sidebar__avatar--fallback">AJ</div>
          <span className="sidebar__username">Alex J.</span>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="app-main">
        <div className="app-main__content">
          {/* Page Header */}
          <header className="daily-log__header">
            <h1 className="daily-log__title" id="daily-log-page-title">
              Daily Log Page: Commit to Balance
            </h1>
          </header>

          {/* Three-column layout */}
          <div className="daily-log__grid">

            {/* ── Column 1: Activity Metrics + Transactional ── */}
            <div className="card" id="card-activity-metrics">
              <h2 className="daily-log-card__title">Today's Activity Metrics</h2>

              {/* Sleep Hours */}
              <div className="metric-row">
                <div className="metric-row__input-group">
                  <label className="metric-row__label" htmlFor="sleep-hours">
                    Sleep Hours (Last Night)
                  </label>
                  <input
                    type="number"
                    id="sleep-hours"
                    className="metric-row__input"
                    placeholder="hours"
                    min="0"
                    max="24"
                    step="0.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)}
                  />
                </div>
                <Gauge value={sleepHours ? parseFloat(sleepHours) : 0} max={10} />
              </div>

              {/* Step Target */}
              <div className="metric-row">
                <div className="metric-row__input-group">
                  <label className="metric-row__label" htmlFor="step-target">
                    Step Target (Daily Goal)
                  </label>
                  <input
                    type="number"
                    id="step-target"
                    className="metric-row__input"
                    placeholder="steps"
                    min="0"
                    value={stepTarget}
                    onChange={(e) => setStepTarget(e.target.value)}
                  />
                </div>
                <Gauge value={stepTarget ? parseFloat(stepTarget) : 0} max={15000} />
              </div>

              {/* Water Intake */}
              <div className="metric-row">
                <div className="metric-row__input-group">
                  <label className="metric-row__label" htmlFor="water-intake">
                    Water Intake
                  </label>
                  <input
                    type="number"
                    id="water-intake"
                    className="metric-row__input"
                    placeholder="ml/oz"
                    min="0"
                    value={waterIntake}
                    onChange={(e) => setWaterIntake(e.target.value)}
                  />
                </div>
              </div>

              {/* Transactional Habits */}
              <h3 className="daily-log-card__section-title">Transactional</h3>
              <div className="checklist" id="transactional-checklist">
                {TRANSACTIONAL_HABITS.map((habit) => (
                  <label
                    key={habit}
                    className={`checklist__item ${transChecked[habit] ? 'checklist__item--checked' : ''}`}
                  >
                    <input
                      type="checkbox"
                      className="checklist__checkbox"
                      checked={!!transChecked[habit]}
                      onChange={() => toggleTrans(habit)}
                    />
                    <span className="checklist__label">{habit}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ── Column 2: Today's Meal Log ── */}
            <div className="card" id="card-meal-log">
              <h2 className="daily-log-card__title">Today's Meal Log</h2>

              <div className="meal-section">
                {meals.map((meal) => (
                  <div className="meal-card" key={meal.id}>
                    <div className="meal-card__name">{meal.name}</div>
                    <div className="meal-card__items">
                      {meal.items.map((item, idx) => (
                        <div className="meal-card__item" key={idx}>
                          <span className="meal-card__item-text">{item}</span>
                          <button
                            className="meal-card__remove-btn"
                            onClick={() => removeMealItem(meal.id, idx)}
                            title="Remove item"
                            aria-label={`Remove ${item}`}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    {addingTo === meal.id ? (
                      <div className="meal-card__add-row">
                        <input
                          ref={addInputRef}
                          type="text"
                          className="meal-card__add-input"
                          placeholder="Item name…"
                          value={newItemText}
                          onChange={(e) => setNewItemText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') addMealItem(meal.id);
                            if (e.key === 'Escape') setAddingTo(null);
                          }}
                        />
                        <button
                          className="meal-card__add-confirm"
                          onClick={() => addMealItem(meal.id)}
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <button
                        className="meal-card__add"
                        onClick={() => startAdding(meal.id)}
                      >
                        Add {meal.name === 'Snacks' ? 'Item' : 'meal Item'}
                      </button>
                    )}
                  </div>
                ))}

                <button
                  className="meal-section__add-btn"
                  id="add-meal-btn"
                  onClick={addNewMeal}
                >
                  + Add Item
                </button>
              </div>
            </div>

            {/* ── Column 3: Embedded Habits + Mood ── */}
            <div className="daily-log__right-stack">
              {/* Embedded Habits */}
              <div className="card" id="card-embedded-habits">
                <h2 className="daily-log-card__title">Embedded Habits</h2>
                <div className="checklist" id="embedded-checklist">
                  {EMBEDDED_HABITS.map((habit) => (
                    <label
                      key={habit}
                      className={`checklist__item ${embeddedChecked[habit] ? 'checklist__item--checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        className="checklist__checkbox"
                        checked={!!embeddedChecked[habit]}
                        onChange={() => toggleEmbedded(habit)}
                      />
                      <span className="checklist__label">{habit}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Daily Mood Parameters */}
              <div className="card" id="card-mood-parameters">
                <h2 className="daily-log-card__title">Daily Mood Parameters</h2>
                <div className="mood-group">
                  <div className="mood-item">
                    <label className="mood-item__label" htmlFor="morning-mood">Morning Mood</label>
                    <select
                      id="morning-mood"
                      className="mood-item__select"
                      value={morningMood}
                      onChange={(e) => setMorningMood(e.target.value)}
                    >
                      {MOOD_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mood-item">
                    <label className="mood-item__label" htmlFor="afternoon-mood">Afternoon Mood</label>
                    <select
                      id="afternoon-mood"
                      className="mood-item__select"
                      value={afternoonMood}
                      onChange={(e) => setAfternoonMood(e.target.value)}
                    >
                      {MOOD_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mood-item">
                    <label className="mood-item__label" htmlFor="evening-mood">Evening Mood</label>
                    <select
                      id="evening-mood"
                      className="mood-item__select"
                      value={eveningMood}
                      onChange={(e) => setEveningMood(e.target.value)}
                    >
                      {MOOD_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
