import { useState, useEffect, useRef } from 'react'
import './StylistChat.css'

/**
 * StylistChat: Freeform chat with AI stylist
 */
export const StylistChat = ({ chatHistory, onSendMessage, loading }) => {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    onSendMessage(input)
    setInput('')
  }

  return (
    <div className="stylist-chat">
      <div className="chat-header">
        <h3>💬 Ask Your Stylist</h3>
        <p>Get personalized styling advice</p>
      </div>

      <div className="chat-messages">
        {chatHistory.length === 0 ? (
          <div className="chat-empty">
            <div className="chat-empty-icon">👗</div>
            <p>Start a conversation with your AI stylist!</p>
            <p className="chat-hint">
              Ask about outfit ideas, styling tips, or anything fashion-related
            </p>
          </div>
        ) : (
          <>
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'user' ? '👤' : '💅'}
                </div>
                <div className="message-content">
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-message assistant loading">
                <div className="message-avatar">💅</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about fashion..."
          disabled={loading}
          className="chat-input"
        />
        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? '⏳' : '→'}
        </button>
      </form>
    </div>
  )
}
