import { useState, useEffect } from 'react'
import JSConfetti from 'js-confetti'
import TrainingSchedule from './TrainingSchedule'
import './App.css'

function App() {
  const [currentWeek, setCurrentWeek] = useState(null)
  const [jsConfetti, setJsConfetti] = useState(null)

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  }

  const changeWeek = (direction) => {
    setCurrentWeek(prev => {
      const newWeek = prev + direction
      return newWeek >= 1 && newWeek <= 53 ? newWeek : prev
    })
  }

  const handleClick = () => {
    if (jsConfetti) {
      jsConfetti.addConfetti({
        confettiColors: ['#1e40af', '#3b82f6', '#f97316', '#fbbf24', '#10b981', '#ef4444'],
        confettiNumber: 80,
        spread: 80,
        origin: { x: Math.random(), y: Math.random() * 0.7 }
      })
      
      // Add volleyball emojis
      jsConfetti.addConfetti({
        emojis: ['🏐'],
        emojiSize: 40,
        confettiNumber: 20,
        spread: 100,
        origin: { x: Math.random(), y: Math.random() * 0.7 }
      })
    }
  }

  useEffect(() => {
    const confetti = new JSConfetti()
    setJsConfetti(confetti)
    
    const now = new Date()
    const weekNum = getWeekNumber(now)
    setCurrentWeek(weekNum)
  }, [])

  return (
    <div className="app" onClick={handleClick}>
      <header className="app-header">
        <h1 className="main-title">When do we have practice this week?</h1>
        {currentWeek && (
          <div className="week-navigation">
            <button 
              className="week-nav-btn" 
              onClick={(e) => { e.stopPropagation(); changeWeek(-1); }}
              disabled={currentWeek <= 1}
            >
              ◀
            </button>
            <div className="week-number">
              Week {currentWeek}
            </div>
            <button 
              className="week-nav-btn" 
              onClick={(e) => { e.stopPropagation(); changeWeek(1); }}
              disabled={currentWeek >= 53}
            >
              ▶
            </button>
          </div>
        )}
      </header>
      
      <main className="app-main">
        <TrainingSchedule currentWeek={currentWeek} />
      </main>
      
      <footer className="app-footer">
        <p>Bislett Volleyball Club</p>
        <p className="version">v1.1.0</p>
      </footer>
    </div>
  )
}

export default App
