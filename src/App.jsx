import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import ProfilePage from './pages/ProfilePage'
import WardrobePage from './pages/WardrobePage'
import TodayPage from './pages/TodayPage'
import ShopPage from './pages/ShopPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wardrobe" element={<WardrobePage />} />
        <Route path="/today" element={<TodayPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/" element={<Navigate to="/profile" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

