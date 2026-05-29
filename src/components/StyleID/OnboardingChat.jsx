import { useState, useRef, useEffect } from 'react'
import { callAI } from '../../lib/ai'
import { getStyleOnboardingPrompt } from '../../lib/prompts'
import { VIBES, FIT_PREFERENCES, COLOUR_PALETTES, OCCASIONS, BUDGET_BANDS } from '../../data/defaults'
import './OnboardingChat.css'

const QUESTIONS = [
  { id: 'name', text: 'First, what\'s your name?', type: 'text' },
  { id: 'vibes', text: 'What style vibes resonate with you? (select one or more)', type: 'chips', options: VIBES },
  { id: 'fitPreference', text: 'How do you prefer your clothes to fit?', type: 'chips', options: FIT_PREFERENCES },
  { id: 'colourPalette', text: 'What colour palette do you love? (select one or more)', type: 'chips', options: COLOUR_PALETTES },
  { id: 'occasions', text: 'Which occasions do you dress for most? (select one or more)', type: 'chips', options: OCCASIONS },
  { id: 'budget', text: 'What\'s your typical shopping budget level?', type: 'chips', options: BUDGET_BANDS },
]

export default function OnboardingChat({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [persona, setPersona] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const messagesEnd = useRef(null)

  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentStep, loading])

  const currentQuestion = QUESTIONS[currentStep]
  const isLastQuestion = currentStep === QUESTIONS.length - 1

  const handleTextInput = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
  }

  const handleChipSelect = (value) => {
    setAnswers((prev) => {
      const current = prev[currentQuestion.id] || []
      if (Array.isArray(current) && current.includes(value)) {
        return { ...prev, [currentQuestion.id]: current.filter((v) => v !== value) }
      } else if (Array.isArray(current)) {
        return { ...prev, [currentQuestion.id]: [...current, value] }
      } else {
        // Single select (fit preference, budget)
        return { ...prev, [currentQuestion.id]: value }
      }
    })
  }

  const isAnswerComplete = () => {
    const answer = answers[currentQuestion.id]
    if (currentQuestion.type === 'text') {
      return typeof answer === 'string' && answer.trim().length > 0
    }
    if (currentQuestion.type === 'chips') {
      return Array.isArray(answer) ? answer.length > 0 : Boolean(answer)
    }
    return false
  }

  const handleNext = async () => {
    if (!isAnswerComplete()) return

    if (isLastQuestion) {
      // All answers collected - generate persona
      await generatePersona()
      setShowConfirm(true)
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const generatePersona = async () => {
    setLoading(true)
    try {
      const systemPrompt = getStyleOnboardingPrompt()
      const summaryText = formatAnswersSummary()
      const message = `Based on these style profile answers, generate a warm 2-line style persona description that captures who this person is style-wise:\n\n${summaryText}`

      const response = await callAI(systemPrompt, message)
      setPersona(response)
    } catch (error) {
      console.error('Error generating persona:', error)
      setPersona('Your unique style awaits exploration. Let\'s get styling!')
    } finally {
      setLoading(false)
    }
  }

  const formatAnswersSummary = () => {
    const lines = []
    Object.entries(answers).forEach(([key, value]) => {
      const question = QUESTIONS.find((q) => q.id === key)
      if (question) {
        const displayValue = Array.isArray(value) ? value.join(', ') : value
        lines.push(`${question.text}: ${displayValue}`)
      }
    })
    return lines.join('\n')
  }

  const handleConfirm = () => {
    onComplete({
      name: answers.name || 'User',
      vibes: answers.vibes || [],
      fitPreference: answers.fitPreference || null,
      colourPalette: answers.colourPalette || [],
      occasions: answers.occasions || [],
      budget: answers.budget || null,
      stylePersona: persona,
    })
  }

  if (showConfirm) {
    return (
      <div className="onboarding-chat">
        <div className="chat-container">
          <div className="persona-confirm">
            <h2>Your Style Identity</h2>
            <p className="persona-text">{persona}</p>

            <div className="summary-box">
              <h3>Profile Summary</h3>
              <ul>
                <li><strong>Name:</strong> {answers.name}</li>
                <li><strong>Vibes:</strong> {Array.isArray(answers.vibes) ? answers.vibes.join(', ') : answers.vibes}</li>
                <li><strong>Fit:</strong> {answers.fitPreference}</li>
                <li><strong>Colours:</strong> {Array.isArray(answers.colourPalette) ? answers.colourPalette.join(', ') : answers.colourPalette}</li>
                <li><strong>Occasions:</strong> {Array.isArray(answers.occasions) ? answers.occasions.join(', ') : answers.occasions}</li>
                <li><strong>Budget:</strong> {answers.budget}</li>
              </ul>
            </div>

            <div className="confirm-actions">
              <button className="btn-confirm" onClick={handleConfirm}>
                Perfect! Save My Profile
              </button>
              <button className="btn-redo" onClick={() => { setCurrentStep(0); setShowConfirm(false); setPersona('') }}>
                Let Me Redo This
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="onboarding-chat">
      <div className="chat-header">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}></div>
        </div>
        <p className="progress-text">
          Question {currentStep + 1} of {QUESTIONS.length}
        </p>
      </div>

      <div className="chat-container">
        {/* Question */}
        <div className="message assistant">
          <div className="message-content">
            <p>{currentQuestion.text}</p>
          </div>
        </div>

        {/* Answer Input */}
        <div className="message-input-section">
          {currentQuestion.type === 'text' && (
            <div className="text-input-wrapper">
              <input
                type="text"
                placeholder="Your answer..."
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleTextInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && isAnswerComplete() && handleNext()}
                autoFocus
                className="text-input"
              />
            </div>
          )}

          {currentQuestion.type === 'chips' && (
            <div className="chips-wrapper">
              {currentQuestion.options.map((option) => {
                const isSelected = Array.isArray(answers[currentQuestion.id])
                  ? answers[currentQuestion.id].includes(option)
                  : answers[currentQuestion.id] === option
                return (
                  <button
                    key={option}
                    className={`chip ${isSelected ? 'active' : ''}`}
                    onClick={() => handleChipSelect(option)}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          )}

          {/* Next Button */}
          <button
            className="btn-next"
            onClick={handleNext}
            disabled={!isAnswerComplete() || loading}
          >
            {loading ? 'Generating Persona...' : isLastQuestion ? 'Complete Profile' : 'Next'}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="onboarding-summary">
        <p className="summary-text">
          {Object.keys(answers).length} / {QUESTIONS.length} questions answered
        </p>
      </div>

      <div ref={messagesEnd} />
    </div>
  )
}
