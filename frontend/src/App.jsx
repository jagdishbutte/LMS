import { useState } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    alert(`Thank you for signing up with: ${email}`)
    setEmail('')
  }

  return (
    <div className="lms-landing">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">✨ LifeSync</div>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#metrics">Metrics</a></li>
          <li><button className="btn-secondary">Log In</button></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h1>Master Your Day, <br /><span className="highlight">Elevate Your Life</span></h1>
        <p>Track your health, habits, time, and goals in one unified, beautiful dashboard.</p>
        <form onSubmit={handleSubscribe} className="cta-form">
          <input 
            type="email" 
            placeholder="Enter your email for early access" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">Get Started</button>
        </form>
      </header>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2>Everything you need to thrive</h2>
        <div className="grid">
          <div className="card">
            <h3>📅 Habit Architecture</h3>
            <p>Build streak-based daily routines that stick with smart reminders.</p>
          </div>
          <div className="card">
            <h3>🥗 Holistic Wellness</h3>
            <p>Log nutrition, hydration, and sleep patterns effortlessly.</p>
          </div>
          <div className="card">
            <h3>⏱️ Focus & Time</h3>
            <p>Integrated Pomodoro timers and deep work analytics to track productivity.</p>
          </div>
        </div>
      </section>

      {/* Quick Dashboard Preview / Metrics */}
      <section id="metrics" className="metrics-section">
        <h2>Your day at a glance</h2>
        <div className="metrics-preview">
          <div className="metric-pill completed">✓ Daily Meds</div>
          <div className="metric-pill completed">✓ 8,000 Steps</div>
          <div className="metric-pill pending">○ Read 10 Pages</div>
          <div className="metric-pill progress">💧 Hydration: 75%</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} LifeSync LMS. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
