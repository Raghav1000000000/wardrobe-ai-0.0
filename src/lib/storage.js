// localStorage wrapper helpers

export function getItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

export function clear() {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

// Profile-specific helpers
export function getProfile() {
  return getItem("profile", null);
}

export function setProfile(profile) {
  setItem("profile", profile);
}

// Wardrobe-specific helpers
export function getWardrobe() {
  return getItem("wardrobe", []);
}

export function setWardrobe(wardrobe) {
  setItem("wardrobe", wardrobe);
}

// Daily outfits cache
export function getDailyOutfits() {
  return getItem("dailyOutfits", null);
}

export function setDailyOutfits(outfits) {
  setItem("dailyOutfits", outfits);
}
