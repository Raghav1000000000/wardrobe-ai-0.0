import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useWardrobe } from '../hooks/useWardrobe'
import { useStylist } from '../hooks/useStylist'
import { OutfitGrid } from '../components/Stylist/OutfitGrid'
import { EventSelector } from '../components/Stylist/EventSelector'
import { StylistChat } from '../components/Stylist/StylistChat'
import './TodayPage.css'

export default function TodayPage() {
  const { profile } = useProfile()
  const { wardrobe } = useWardrobe()
  const {
    dailyOutfits,
    eventOutfits,
    chatHistory,
    loading,
    error,
    generateDailyOutfits,
    generateEventOutfits,
    sendStylistMessage,
    clearChat,
  } = useStylist(profile, wardrobe)

  const [activeTab, setActiveTab] = useState('daily') // 'daily', 'event', 'chat'
  const [weather, setWeather] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)

  const handleGenerateDaily = () => {
    generateDailyOutfits(weather)
  }

  const handleSelectEvent = (eventId) => {
    setSelectedEvent(eventId)
    generateEventOutfits(eventId)
  }

  const handleSendMessage = async (message) => {
    await sendStylistMessage(message)
  }

  if (!profile?.completedOnboarding) {
    return (
      <div className="page-container">
        <div className="onboarding-prompt">
          <div className="prompt-icon">👤</div>
          <h2>Complete Your Profile First</h2>
          <p>Visit the Profile tab to complete your Style ID</p>
          <p>Then come back here to get outfit suggestions!</p>
        </div>
      </div>
    )
  }

  if (!wardrobe || wardrobe.length === 0) {
    return (
      <div className="page-container">
        <div className="onboarding-prompt">
          <div className="prompt-icon">👔</div>
          <h2>Add Wardrobe Items First</h2>
          <p>Visit the Wardrobe tab to add your clothing items</p>
          <p>Then come back here to get personalized outfit suggestions!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container today-page">
      {/* Header */}
      <div className="page-header">
        <h1>✨ Outfit Suggestions</h1>
        <p>Get personalized outfit recommendations from your AI stylist</p>
      </div>

      {/* Error */}
      {error && <div className="error-message">{error}</div>}

      {/* Tabs */}
      <div className="today-tabs">
        <button
          className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          📅 Today's Outfits
        </button>
        <button
          className={`tab ${activeTab === 'event' ? 'active' : ''}`}
          onClick={() => setActiveTab('event')}
        >
          🎯 Event Mode
        </button>
        <button
          className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Stylist Chat
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Daily Outfits Tab */}
        {activeTab === 'daily' && (
          <div className="tab-panel">
            <div className="controls-section">
              <div className="weather-input">
                <label>Weather/Context (optional):</label>
                <input
                  type="text"
                  placeholder="e.g., Sunny, rainy, warm day..."
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button
                className="btn-generate"
                onClick={handleGenerateDaily}
                disabled={loading}
              >
                {loading ? '⏳ Generating...' : '✨ Generate Outfits'}
              </button>
            </div>

            {dailyOutfits && (
              <OutfitGrid
                outfits={dailyOutfits.outfits}
                title="🎨 Your Daily Outfit Suggestions"
              />
            )}
          </div>
        )}

        {/* Event Mode Tab */}
        {activeTab === 'event' && (
          <div className="tab-panel">
            <EventSelector onSelectEvent={handleSelectEvent} loading={loading} />

            {eventOutfits && (
              <OutfitGrid
                outfits={eventOutfits.outfits}
                title={`👗 Outfits for ${eventOutfits.event}`}
              />
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="tab-panel">
            <StylistChat
              chatHistory={chatHistory}
              onSendMessage={handleSendMessage}
              loading={loading}
            />
            {chatHistory.length > 0 && (
              <button className="btn-clear-chat" onClick={clearChat}>
                Clear Chat
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
