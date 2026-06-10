import { useState } from 'react';
import Sidebar from './components/Sidebar';
import botanicalShadow from './assets/botanical-shadow.png';

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
  { label: 'Dining',      pct: 16, color: '#F2EBE3' },
];

const NEWS = [
  { text: 'Grand sleep patterns linked to better cognitive performance, new study finds.' },
  { text: 'Dane restores headlines: mindfulness routines correlate with lower cortisol…' },
  { text: 'LifeTrack news: new Trends insights available — check your weekly report.' },
];

/* ─── Semi-circle gauge ─────────────────────────────────── */
function Gauge({ pct, color, icon }) {
  const r = 32;
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
  const gap = 3;
  const arcs = [];
  let offset = 0;
  for (const seg of segments) {
    const len = (seg.pct / 100) * circ;
    arcs.push({ ...seg, len, offset });
    offset += len;
  }
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--sand-100)" strokeWidth={strokeW}/>
      {arcs.map((seg, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={seg.color}
          strokeWidth={strokeW}
          strokeDasharray={`${seg.len - gap} ${circ - seg.len + gap}`}
          strokeDashoffset={-seg.offset + circ * 0.25}
          strokeLinecap="butt"
        />
      ))}
    </svg>
  );
}

/* ─── Dashboard ─────────────────────────────────────────── */
export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState('Overview');

  const topNavLinks = ['Overview', 'History', 'Profile', 'Insights'];

  return (
    <div className="app-shell">
      {/* Decorative botanical overlay */}
      <div className="botanical-overlay" />

      {/* ── Sidebar ── */}
      <Sidebar active="dashboard" plan="Premium" />

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
                    {['0h', '1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h'].map(l => (
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
                      backgroundImage: `url(${botanicalShadow})`,
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
