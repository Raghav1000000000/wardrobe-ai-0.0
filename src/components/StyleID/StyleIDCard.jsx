import './StyleIDCard.css'

export default function StyleIDCard({ profile }) {
  if (!profile || !profile.name) return null

  // Generate initials for avatar
  const initials = profile.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  // Get colour palette preview (just the first word of each)
  const colourPreview = Array.isArray(profile.colourPalette)
    ? profile.colourPalette.map((c) => c.split(' ')[0])
    : []

  return (
    <div className="style-id-card">
      <div className="card-header">
        <div className="avatar">{initials}</div>
        <div className="header-info">
          <h2 className="name">{profile.name}</h2>
          <p className="persona">{profile.stylePersona}</p>
        </div>
      </div>

      <div className="card-body">
        {/* Vibes */}
        {Array.isArray(profile.vibes) && profile.vibes.length > 0 && (
          <div className="section">
            <h3 className="section-title">Vibes</h3>
            <div className="tags">
              {profile.vibes.map((vibe) => (
                <span key={vibe} className="tag vibe-tag">
                  {vibe}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Fit Preference */}
        {profile.fitPreference && (
          <div className="section">
            <h3 className="section-title">Fit Preference</h3>
            <div className="badge fit-badge">{profile.fitPreference}</div>
          </div>
        )}

        {/* Colour Palette */}
        {colourPreview.length > 0 && (
          <div className="section">
            <h3 className="section-title">Colour Palette</h3>
            <div className="colour-dots">
              {colourPreview.map((colour, idx) => (
                <div key={idx} className="colour-chip" title={profile.colourPalette[idx]}>
                  {colour}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Occasions */}
        {Array.isArray(profile.occasions) && profile.occasions.length > 0 && (
          <div className="section">
            <h3 className="section-title">Occasions</h3>
            <div className="tags">
              {profile.occasions.map((occasion) => (
                <span key={occasion} className="tag occasion-tag">
                  {occasion}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Budget */}
        {profile.budget && (
          <div className="section">
            <h3 className="section-title">Budget</h3>
            <div className="badge budget-badge">{profile.budget}</div>
          </div>
        )}
      </div>
    </div>
  )
}
