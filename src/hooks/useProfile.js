import { useState, useCallback, useEffect } from 'react'
import { getProfile, setProfile } from '../lib/storage'
import { DEFAULT_PROFILE } from '../data/defaults'

export function useProfile() {
  const [profile, setProfileState] = useState(DEFAULT_PROFILE)
  const [loading, setLoading] = useState(true)

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = getProfile()
    if (savedProfile) {
      setProfileState(savedProfile)
    }
    setLoading(false)
  }, [])

  // Update a single field
  const updateField = useCallback((field, value) => {
    setProfileState((prev) => {
      const updated = { ...prev, [field]: value }
      setProfile(updated)
      return updated
    })
  }, [])

  // Update multiple fields at once
  const updateFields = useCallback((fields) => {
    setProfileState((prev) => {
      const updated = { ...prev, ...fields }
      setProfile(updated)
      return updated
    })
  }, [])

  // Mark onboarding as complete
  const completeOnboarding = useCallback(() => {
    updateField('completedOnboarding', true)
  }, [updateField])

  // Reset profile to defaults
  const reset = useCallback(() => {
    setProfileState(DEFAULT_PROFILE)
    setProfile(DEFAULT_PROFILE)
  }, [])

  return {
    profile,
    updateField,
    updateFields,
    completeOnboarding,
    reset,
    loading,
    isComplete: profile.completedOnboarding,
  }
}
