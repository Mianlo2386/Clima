import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './hooks/useSettings'
import { ActiveCityProvider } from './hooks/useActiveCity'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import FavoritesPage from './pages/FavoritesPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <ThemeProvider>
      <ActiveCityProvider>
        <div className="min-h-dvh text-gray-900 dark:text-gray-100 transition-colors">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ActiveCityProvider>
    </ThemeProvider>
  )
}
