import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import OnboardingChat from '../components/StyleID/OnboardingChat'
import StyleIDCard from '../components/StyleID/StyleIDCard'
import ProfileEditor from '../components/StyleID/ProfileEditor'

export default function ProfilePage() {
  const { profile, updateFields, completeOnboarding, loading } = useProfile()
  const [showEditor, setShowEditor] = useState(false)

  const handleOnboardingComplete = (newProfile) => {
    updateFields(newProfile)
    completeOnboarding()
  }

  const handleProfileUpdate = (updatedProfile) => {
    updateFields(updatedProfile)
    setShowEditor(false)
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="skeleton" style={{ height: '200px', borderRadius: '8px' }}></div>
      </div>
    )
  }

  if (!profile.completedOnboarding) {
    return (
      <div className="page-container">
        <OnboardingChat onComplete={handleOnboardingComplete} />
      </div>
    )
  }

  return (
    <div className="page-container">
      <h2>Your Style Identity</h2>
      <StyleIDCard profile={profile} />

      {showEditor ? (
        <div style={{ marginTop: '2rem' }}>
          <ProfileEditor
            profile={profile}
            onUpdate={handleProfileUpdate}
            onClose={() => setShowEditor(false)}
          />
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <ProfileEditor profile={profile} onUpdate={handleProfileUpdate} onClose={() => {}} />
        </div>
      )}
    </div>
  )
}

