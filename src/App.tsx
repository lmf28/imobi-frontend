import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '@/pages/Login'
import Properties from '@/pages/Properties'
import PropertyDetail from '@/pages/PropertyDetail'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  return token ? <>{children}</> : <Navigate to="/" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/properties" element={<PrivateRoute><Properties /></PrivateRoute>} />
        <Route path="/properties/:id" element={<PrivateRoute><PropertyDetail /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App