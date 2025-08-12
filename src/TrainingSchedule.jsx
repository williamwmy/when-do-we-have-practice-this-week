import { useState, useEffect } from 'react'

const TrainingSchedule = ({ currentWeek }) => {
  const [trainingSessions, setTrainingSessions] = useState([])

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  }

  const getDateFromWeekNumber = (weekNum, year = 2025) => {
    const jan1 = new Date(year, 0, 1)
    const daysToAdd = (weekNum - 1) * 7
    const targetDate = new Date(jan1.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
    
    // Adjust to get Monday of that week
    const day = targetDate.getDay()
    const diff = targetDate.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(targetDate.setDate(diff))
  }

  const isChristmasHolidays = (date) => {
    const year = date.getFullYear()
    const christmas = new Date(year, 11, 24) // December 24
    const newYear = new Date(year + 1, 0, 7) // January 7 next year
    return date >= christmas && date <= newYear
  }

  const isAscensionDay = (date) => {
    const year = date.getFullYear()
    const easter = getEasterDate(year)
    const ascension = new Date(easter.getTime() + 39 * 24 * 60 * 60 * 1000) // 39 days after Easter
    return date.toDateString() === ascension.toDateString()
  }

  const isInSeason = (date) => {
    const seasonStart = new Date(2025, 7, 18) // August 18, 2025 (month is 0-indexed)
    const seasonEnd = new Date(2026, 4, 31) // May 31, 2026
    return date >= seasonStart && date <= seasonEnd
  }

  const getEasterDate = (year) => {
    const f = Math.floor
    const G = year % 19
    const C = f(year / 100)
    const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30
    const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11))
    const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7
    const L = I - J
    const month = 3 + f((L + 40) / 44)
    const day = L + 28 - 31 * f(month / 4)
    return new Date(year, month - 1, day)
  }

  const getTrainingSessions = (date) => {
    const sessions = []
    const weekNumber = getWeekNumber(date)
    const isOddWeek = weekNumber % 2 === 1

    // Find Tuesday of this week
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay() + 1) // Monday
    const tuesday = new Date(startOfWeek)
    tuesday.setDate(startOfWeek.getDate() + 1) // Tuesday

    // Find Thursday of this week
    const thursday = new Date(startOfWeek)
    thursday.setDate(startOfWeek.getDate() + 3) // Thursday

    // Check if we're in training season
    const tuesdayInSeason = isInSeason(tuesday)
    const thursdayInSeason = isInSeason(thursday)

    // Tuesday training (only odd weeks, in season, not holidays)
    if (isOddWeek && tuesdayInSeason && !isChristmasHolidays(tuesday) && !isAscensionDay(tuesday)) {
      sessions.push({
        day: 'Tuesday',
        date: tuesday.toLocaleDateString('en-US'),
        time: '18:00 - 19:30',
        active: true
      })
    }

    // Thursday training (every week, in season, not holidays)
    if (thursdayInSeason && !isChristmasHolidays(thursday) && !isAscensionDay(thursday)) {
      sessions.push({
        day: 'Thursday',
        date: thursday.toLocaleDateString('en-US'),
        time: '19:30 - 21:00',
        active: true
      })
    }

    return sessions
  }

  useEffect(() => {
    if (currentWeek) {
      const weekDate = getDateFromWeekNumber(currentWeek)
      setTrainingSessions(getTrainingSessions(weekDate))
    }
  }, [currentWeek])

  return (
    <div className="training-schedule">
      {trainingSessions.length > 0 ? (
        <div className="sessions">
          {trainingSessions.map((session, index) => (
            <div key={index} className="session-card">
              <h3>{session.day}</h3>
              <p className="date">{session.date}</p>
              <p className="time">{session.time}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-training">
          <p>No practice this week</p>
          <p className="holiday-info">
            {isChristmasHolidays(new Date()) && "Christmas holidays"}
            {!isInSeason(new Date()) && "Training season: August 18, 2025 - May 31, 2026"}
          </p>
        </div>
      )}
    </div>
  )
}

export default TrainingSchedule