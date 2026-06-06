import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/* ─── Data ──────────────────────────────────────────────── */
const SLEEP_DATA = [
  { day: 'Mon', hours: 5.2, pct: 65 },
  { day: 'Tue', hours: 4.6, pct: 57 },
  { day: 'Wed', hours: 6.8, pct: 85 },
  { day: 'Thu', hours: 3.5, pct: 44 },
  { day: 'Fri', hours: 6.5, pct: 81 },
  { day: 'Sat', hours: 2.4, pct: 30 },
  { day: 'Sun', hours: 5.0, pct: 62 },
];

const DONUT_SEGMENTS = [
  { label: 'Groceries',   pct: 32, color: '#7E9469' },
  { label: 'Wellness App',pct: 18, color: '#A9B894' },
  { label: 'Savings',     pct: 12, color: '#B5734F' },
  { label: 'Utilities',   pct: 22, color: '#D2C4B4' },
  { label: 'Savings',     pct: 16, color: '#F2EBE3' },
];

const NEWS = [
  { text: 'Grand sleep patterns linked to better cognitive performance, new study finds.' },
  { text: 'Dane restores headlines: mindfulness routines correlate with lower cortisol…' },
  { text: 'LifeTrack news: new Trends insights available — check your weekly report.' },
];

const NAV_ITEMS = [
  {
    id: 'dashboard', label: 'Dashboard', path: '/dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="2" width="7" height="7" rx="1.5"/>
        <rect x="11" y="2" width="7" height="7" rx="1.5"/>
        <rect x="2" y="11" width="7" height="7" rx="1.5"/>
        <rect x="11" y="11" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    id: 'daily-log', label: 'Daily Log', path: '/daily-log',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="2" width="14" height="16" rx="2"/>
        <line x1="7" y1="7" x2="13" y2="7"/>
        <line x1="7" y1="10" x2="13" y2="10"/>
        <line x1="7" y1="13" x2="10" y2="13"/>
      </svg>
    ),
  },
  {
    id: 'analytics', label: 'Analytics', path: '/analytics',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
        <polyline points="2 14 7 9 11 12 18 5"/>
        <line x1="2" y1="18" x2="18" y2="18"/>
      </svg>
    ),
  },
  {
    id: 'expenses', label: 'Expenses', path: '/expenses',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="10" cy="10" r="8"/>
        <path d="M10 6v1m0 6v1m-2.5-4.5c0-1.1.9-2 2-2h1a2 2 0 0 1 0 4h-1a2 2 0 0 0 0 4h1a2 2 0 0 0 2-2"/>
      </svg>
    ),
  },
  {
    id: 'journal', label: 'Journal', path: '/journal',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 2h9l3 3v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/>
        <polyline points="13 2 13 5 16 5"/>
        <line x1="6" y1="9" x2="14" y2="9"/>
        <line x1="6" y1="12" x2="11" y2="12"/>
      </svg>
    ),
  },
];

/* ─── Semi-circle gauge ─────────────────────────────────── */
function Gauge({ pct, color, icon }) {
  const r = 32, cx = 40, cy = 40;
  const circ = Math.PI * r; // half circle circumference
  const dash = (pct / 100) * circ;
  return (
    <svg width="80" height="46" viewBox="0 0 80 50">
      {/* Track */}
      <path d={`M8,40 A${r},${r} 0 0,1 72,40`}
        fill="none" stroke="var(--sand-200)" strokeWidth="6" strokeLinecap="round"/>
      {/* Fill */}
      <path d={`M8,40 A${r},${r} 0 0,1 72,40`}
        fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}/>
      {/* Icon */}
      <text x="40" y="44" textAnchor="middle" fontSize="14">{icon}</text>
    </svg>
  );
}

/* ─── Donut chart (SVG) ─────────────────────────────────── */
function DonutChart({ segments }) {
  const r = 52, cx = 70, cy = 70, strokeW = 22;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--sand-100)" strokeWidth={strokeW}/>
      {segments.map((seg, i) => {
        const len = (seg.pct / 100) * circ;
        const gap = 3;
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeW}
            strokeDasharray={`${len - gap} ${circ - len + gap}`}
            strokeDashoffset={-offset + circ * 0.25}
            strokeLinecap="butt"
          />
        );
        offset += len;
        return el;
      })}
    </svg>
  );
}

/* ─── Dashboard ─────────────────────────────────────────── */
export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState('Overview');
  const navigate = useNavigate();

  const topNavLinks = ['Overview', 'History', 'Profile', 'Insights'];

  return (
    <div className="app-shell">
      {/* Decorative botanical overlay */}
      <div className="botanical-overlay" />

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar__header">
          <Link to="/" className="sidebar__logo" id="dashboard-logo">
            <svg className="sidebar__logo-mark" width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M16 2C14 8 8 14 4 18C8 17 12 18 14 22C14 18 16 12 22 6C20 8 18 6 16 2Z" fill="#241F1A"/>
            </svg>
            <span className="sidebar__logo-text">LifeTrack</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="sidebar__nav">
          <ul className="sidebar__nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  id={`sidebar-${item.id}`}
                  className={`sidebar__nav-item${item.id === 'dashboard' ? ' sidebar__nav-item--active' : ''}`}
                >
                  <span className="sidebar__nav-icon">{item.icon}</span>
                  <span className="sidebar__nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User block */}
        <div className="sidebar__user">
          <div className="avatar avatar--md avatar--fallback" id="sidebar-avatar"
            style={{ fontSize: 'var(--text-sm)' }}>
            AJ
          </div>
          <div>
            <div className="sidebar__username">Alex J.</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--taupe-400)' }}>Premium</div>
          </div>
        </div>
      </aside>

      {/* ── Top Nav ── */}
      <nav className="topnav" id="dashboard-topnav">
        <div className="topnav__left">
          <div className="topnav__links">
            {topNavLinks.map((link) => (
              <button
                key={link}
                id={`topnav-${link.toLowerCase()}`}
                className={`topnav__link${activeNav === link ? ' topnav__link--active' : ''}`}
                onClick={() => setActiveNav(link)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
        <div className="topnav__right">
          <div className="avatar avatar--md avatar--fallback" id="topnav-avatar"
            style={{ fontSize: 'var(--text-sm)' }}>
            AJ
          </div>
          <span className="topnav__user-name">Alex J. ▾</span>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="app-main">
        <div className="app-main__content">

          {/* 3-column grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr 260px',
            gap: 'var(--space-5)',
            alignItems: 'start',
          }}>

            {/* ══ LEFT COLUMN ══ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

              {/* Quick Actions */}
              <div className="card" id="card-quick-actions">
                <div className="card__header">
                  <h2 className="card__title">Quick Actions</h2>
                </div>
                <div className="card__body">
                  <button className="btn btn--secondary btn--full" id="btn-new-goal">New Goal</button>
                  <button className="btn btn--secondary btn--full" id="btn-log-wellness">Log Wellness</button>
                  <button className="btn btn--primary btn--full" id="btn-log-wellness-primary">Log Wellness</button>
                </div>
              </div>

              {/* Health At A Glance */}
              <div className="card" id="card-health-glance">
                <div className="card__header">
                  <h2 className="card__title">Health At A Glance</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', alignItems: 'center', paddingTop: 'var(--space-2)' }}>
                  {[
                    { label: 'Stress Level', pct: 60, color: 'var(--clay-500)', icon: '↑' },
                    { label: 'Hydration',    pct: 75, color: 'var(--sage-500)', icon: '💧' },
                    { label: 'Heart Rate',   pct: 80, color: 'var(--clay-600)', icon: '♥' },
                  ].map(({ label, pct, color, icon }) => (
                    <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-1)' }}>
                      <Gauge pct={pct} color={color} icon={icon} />
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-800)', fontWeight: 'var(--weight-medium)' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* LifeTrack Compass teaser */}
              <div className="card" id="card-compass">
                <div className="card__header">
                  <h2 className="card__title">LifeTrack Compass</h2>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-2)' }}>
                  {/* Simple compass SVG */}
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" fill="none" stroke="var(--sand-200)" strokeWidth="2"/>
                    <circle cx="40" cy="40" r="36" fill="none" stroke="var(--sand-300)" strokeWidth="1" strokeDasharray="4 4"/>
                    <text x="40" y="12" textAnchor="middle" fontSize="10" fill="var(--ink-800)" fontWeight="600">N</text>
                    <text x="40" y="74" textAnchor="middle" fontSize="10" fill="var(--taupe-400)">S</text>
                    <text x="74" y="44" textAnchor="middle" fontSize="10" fill="var(--taupe-400)">E</text>
                    <text x="8"  y="44" textAnchor="middle" fontSize="10" fill="var(--taupe-400)">W</text>
                    {/* Needle */}
                    <polygon points="40,14 43,40 40,46 37,40" fill="var(--clay-500)"/>
                    <polygon points="40,66 43,40 40,34 37,40" fill="var(--sand-300)"/>
                    <circle cx="40" cy="40" r="4" fill="var(--sand-0)" stroke="var(--ink-800)" strokeWidth="1.5"/>
                  </svg>
                </div>
                <p className="text-sm text-secondary" style={{ textAlign: 'center', marginTop: 'var(--space-3)', maxWidth: '100%' }}>
                  Your weekly balance score is <strong style={{ color: 'var(--clay-500)' }}>72</strong>
                </p>
              </div>
            </div>

            {/* ══ CENTER COLUMN ══ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

              {/* Weekly Sleep Duration chart */}
              <div className="card" id="card-sleep-chart">
                <div className="card__header">
                  <h2 className="card__title">Weekly Sleep Duration</h2>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <span className="chip chip--sage">Sleep Health</span>
                    <span className="chip chip--success">Optimal</span>
                  </div>
                </div>

                {/* Y-axis + bars */}
                <div style={{ display: 'flex', gap: 'var(--space-3)', paddingTop: 'var(--space-3)' }}>
                  {/* Y labels */}
                  <div style={{
                    display: 'flex', flexDirection: 'column-reverse',
                    justifyContent: 'space-between',
                    paddingBottom: '24px',
                    fontSize: 'var(--text-xs)', color: 'var(--taupe-400)',
                    textAlign: 'right', minWidth: '24px',
                  }}>
                    {['0', '1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k'].map(l => (
                      <span key={l}>{l}</span>
                    ))}
                  </div>
                  {/* Chart area */}
                  <div style={{ flex: 1 }}>
                    {/* Horizontal grid lines */}
                    <div style={{ position: 'relative', height: '180px', display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
                      {/* Grid lines overlay */}
                      {[0, 25, 50, 75, 100].map(p => (
                        <div key={p} style={{
                          position: 'absolute', bottom: `${p}%`, left: 0, right: 0,
                          borderTop: '1px dashed var(--sand-200)',
                          zIndex: 0,
                        }}/>
                      ))}
                      {/* Bars */}
                      {SLEEP_DATA.map((d, i) => (
                        <div key={d.day} style={{
                          flex: 1, display: 'flex', flexDirection: 'column',
                          alignItems: 'center', gap: 'var(--space-1)',
                          height: '100%', justifyContent: 'flex-end', position: 'relative', zIndex: 1,
                        }}>
                          <div style={{
                            width: '100%',
                            height: `${d.pct}%`,
                            background: i % 2 === 0 ? 'var(--sage-500)' : 'var(--sand-300)',
                            borderRadius: '4px 4px 0 0',
                            transition: 'opacity 200ms',
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                          title={`${d.hours}h`}
                          />
                        </div>
                      ))}
                    </div>
                    {/* X labels */}
                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                      {SLEEP_DATA.map(d => (
                        <div key={d.day} style={{
                          flex: 1, textAlign: 'center',
                          fontSize: 'var(--text-xs)', color: 'var(--taupe-400)',
                        }}>
                          {d.day}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mindfulness & Journalling */}
              <div className="card" id="card-mindfulness">
                <div className="card__header">
                  <h2 className="card__title">Mindfulness &amp; Journalling</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 'var(--space-4)' }}>
                  {/* Photo */}
                  <div style={{
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: 'var(--sand-200)',
                    aspectRatio: '1',
                    position: 'relative',
                  }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      backgroundImage: 'url(/src/assets/botanical-shadow.png)',
                      backgroundSize: 'cover', backgroundPosition: 'center',
                      opacity: 0.7,
                    }}/>
                  </div>
                  {/* Journal prompts */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div className="card" style={{
                      background: 'var(--sand-50)',
                      border: '1px solid var(--sand-200)',
                      padding: 'var(--space-3)',
                      cursor: 'pointer',
                    }}>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--taupe-600)' }}>
                        Today's Journal Entry
                      </span>
                    </div>
                    <div className="card" style={{
                      background: 'var(--sand-50)',
                      border: '1px solid var(--sand-200)',
                      padding: 'var(--space-3)',
                      cursor: 'pointer',
                    }}>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--taupe-600)' }}>
                        Recent Reflections
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Begin Your Daily Reflection CTA */}
              <div className="card" id="card-reflection-cta"
                style={{ textAlign: 'center', background: 'var(--sand-100)' }}>
                <h2 className="card__title" style={{ marginBottom: 'var(--space-2)' }}>
                  Begin Your Daily Reflection
                </h2>
                <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-5)', maxWidth: '100%' }}>
                  Leading on daily features and other wellbeing insights.
                </p>
                <button className="btn btn--primary" id="btn-start-reflection">
                  Start Reflection
                </button>
              </div>
            </div>

            {/* ══ RIGHT COLUMN ══ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

              {/* Financial Wellness donut */}
              <div className="card" id="card-financial-wellness">
                <div className="card__header">
                  <h2 className="card__title">Financial Wellness</h2>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', margin: 'var(--space-3) 0' }}>
                  <DonutChart segments={DONUT_SEGMENTS} />
                </div>
                {/* Legend */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: 'var(--space-2)',
                }}>
                  {DONUT_SEGMENTS.map(seg => (
                    <div key={seg.label + seg.color} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <div style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: seg.color, flexShrink: 0,
                      }}/>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--taupe-600)' }}>{seg.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* LifeTrack News */}
              <div className="card" id="card-news">
                <div className="card__header">
                  <h2 className="card__title">LifeTrack News</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {NEWS.map((item, i) => (
                    <div key={i}>
                      <p style={{
                        fontSize: 'var(--text-sm)', color: 'var(--ink-800)',
                        lineHeight: 'var(--lh-sm)', maxWidth: '100%',
                      }}>
                        {item.text}
                      </p>
                      {i < NEWS.length - 1 && <div className="card__divider"/>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick stat chips */}
              <div className="card" id="card-stats" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <h2 className="card__title">Today's Stats</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  <span className="chip chip--sage">Steps: 8,240</span>
                  <span className="chip chip--clay">Sleep: 6.8h</span>
                  <span className="chip chip--info">Mood: Calm</span>
                  <span className="chip chip--success">Goals: 3/4</span>
                </div>
              </div>
            </div>

          </div>{/* /grid */}
        </div>{/* /app-main__content */}
      </main>
    </div>
  );
}
