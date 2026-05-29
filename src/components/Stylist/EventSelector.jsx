import './EventSelector.css'

/**
 * EventSelector: Choose event type for outfit suggestions
 */
export const EventSelector = ({ onSelectEvent, loading }) => {
  const events = [
    { id: 'job-interview', label: '👔 Job Interview', emoji: '👔' },
    { id: 'date-night', label: '🌹 Date Night', emoji: '🌹' },
    { id: 'casual-hangout', label: '😎 Casual Hangout', emoji: '😎' },
    { id: 'workout', label: '💪 Workout', emoji: '💪' },
    { id: 'party', label: '🎉 Party', emoji: '🎉' },
    { id: 'formal-event', label: '✨ Formal Event', emoji: '✨' },
  ]

  return (
    <div className="event-selector">
      <h3>Choose an Event</h3>
      <div className="event-buttons">
        {events.map((event) => (
          <button
            key={event.id}
            className="event-btn"
            onClick={() => onSelectEvent(event.id)}
            disabled={loading}
            title={event.label}
          >
            <span className="event-emoji">{event.emoji}</span>
            <span className="event-name">{event.label.split(' ')[1]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
