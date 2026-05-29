import { useState, useEffect } from 'react'
import { callAI } from '../lib/ai'
import { getDailyOutfits, setDailyOutfits } from '../lib/storage'

/**
 * Custom hook for Stylist Agent
 * Handles daily outfit suggestions and styling chat
 */
export const useStylist = (profile, wardrobe) => {
  const [dailyOutfits, setDailyOutfitsState] = useState(null)
  const [eventOutfits, setEventOutfitsState] = useState(null)
  const [chatHistory, setChatHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load cached outfits on mount
  useEffect(() => {
    const cached = getDailyOutfits()
    if (cached) {
      setDailyOutfitsState(cached)
    }
  }, [])

  // Generate daily outfit suggestions
  const generateDailyOutfits = async (weatherContext = '') => {
    if (!profile || !wardrobe || wardrobe.length === 0) {
      setError('Please complete your profile and add wardrobe items first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const systemPrompt = `You are an expert personal stylist. Generate 3 outfit suggestions based on the user's profile and wardrobe.

User Profile:
- Vibes: ${profile.vibes?.join(', ')}
- Fit Preference: ${profile.fitPreference}
- Colour Palette: ${profile.colourPalette?.join(', ')}
- Budget: ${profile.budget}
- Body Notes: ${profile.bodyNotes || 'None'}

Available Wardrobe Items:
${wardrobe
  .map(
    (item) =>
      `- ${item.name} (${item.category}, colours: ${item.colours?.join(', ')}, worn ${item.timesWorn || 0} times)`
  )
  .join('\n')}

Weather/Context: ${weatherContext || 'Casual day'}

Return a JSON array with exactly 3 outfit objects. Each outfit should have:
{
  "name": "Outfit name",
  "items": ["item1", "item2", "item3"],
  "reasoning": "Why this works for you",
  "vibe": "The vibe/mood",
  "occasion": "When to wear it"
}

Return ONLY valid JSON array, no other text.`

      const userMessage = `Generate 3 outfit suggestions for today${weatherContext ? ` (${weatherContext})` : ''}. Be creative and consider my style preferences.`

      const response = await callAI(systemPrompt, userMessage)

      // Parse JSON response
      let outfits
      try {
        const jsonMatch = response.match(/\[[\s\S]*\]/)
        if (!jsonMatch) {
          throw new Error('No JSON found')
        }
        outfits = JSON.parse(jsonMatch[0])
      } catch (parseError) {
        setError('Failed to parse outfit suggestions')
        setLoading(false)
        return
      }

      // Cache and set
      const result = {
        outfits,
        generatedAt: new Date().toISOString(),
        weather: weatherContext,
      }

      setDailyOutfitsState(result)
      setDailyOutfits(result)
    } catch (err) {
      console.error('Stylist error:', err)
      setError(`Failed to generate outfits: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Generate event-specific outfits
  const generateEventOutfits = async (eventType) => {
    if (!profile || !wardrobe || wardrobe.length === 0) {
      setError('Please complete your profile and add wardrobe items first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const eventPrompts = {
        'job-interview': 'Professional, polished, confident. Make a strong impression.',
        'date-night': 'Romantic, attractive, put-together. Show personality.',
        'casual-hangout': 'Comfortable, cool, approachable. Look like yourself.',
        'workout': 'Athletic, functional, energetic. Performance-focused.',
        'party': 'Bold, stylish, fun. Stand out and have confidence.',
        'formal-event': 'Elegant, sophisticated, refined. Black tie ready.',
      }

      const eventContext = eventPrompts[eventType] || eventType

      const systemPrompt = `You are an expert personal stylist specializing in event styling. Generate 3 outfit suggestions for a specific event.

User Profile:
- Vibes: ${profile.vibes?.join(', ')}
- Fit Preference: ${profile.fitPreference}
- Colour Palette: ${profile.colourPalette?.join(', ')}
- Style Persona: ${profile.stylePersona}

Available Wardrobe Items:
${wardrobe
  .map(
    (item) =>
      `- ${item.name} (${item.category}, colours: ${item.colours?.join(', ')})`
  )
  .join('\n')}

Event Context: ${eventContext}

Return a JSON array with exactly 3 outfit objects:
{
  "name": "Outfit name",
  "items": ["item1", "item2", "item3"],
  "reasoning": "Why this works for this event",
  "confidenceLevel": "High/Medium/Low",
  "tips": "Pro styling tips"
}

Return ONLY valid JSON array, no other text.`

      const userMessage = `Create 3 outfit options for a ${eventType} event. Make them appropriate and stylish.`

      const response = await callAI(systemPrompt, userMessage)

      let outfits
      try {
        const jsonMatch = response.match(/\[[\s\S]*\]/)
        if (!jsonMatch) throw new Error('No JSON found')
        outfits = JSON.parse(jsonMatch[0])
      } catch (parseError) {
        setError('Failed to parse event outfits')
        setLoading(false)
        return
      }

      setEventOutfitsState({ outfits, event: eventType })
    } catch (err) {
      console.error('Event styling error:', err)
      setError(`Failed to generate outfits: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Chat with stylist
  const sendStylistMessage = async (userMessage) => {
    if (!profile) {
      setError('Complete your profile first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const systemPrompt = `You are a friendly, expert personal stylist having a conversation with ${profile.name}.

Their style profile:
- Vibes: ${profile.vibes?.join(', ')}
- Fit: ${profile.fitPreference}
- Colours: ${profile.colourPalette?.join(', ')}
- Wardrobe items: ${wardrobe?.length || 0} items

Be conversational, give specific advice, and reference their style preferences. Keep responses concise (1-2 sentences).`

      const response = await callAI(
        systemPrompt,
        userMessage,
        chatHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }))
      )

      // Update chat history
      const newHistory = [
        ...chatHistory,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: response },
      ]

      setChatHistory(newHistory)
      return response
    } catch (err) {
      console.error('Chat error:', err)
      setError(`Failed to get response: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Clear chat
  const clearChat = () => {
    setChatHistory([])
  }

  return {
    dailyOutfits,
    eventOutfits,
    chatHistory,
    loading,
    error,
    generateDailyOutfits,
    generateEventOutfits,
    sendStylistMessage,
    clearChat,
  }
}
