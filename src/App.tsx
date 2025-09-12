import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from '@/pages/Index'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import { AppHeader } from '@/components/AppHeader'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { AuthProvider } from '@/context/AuthContext'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppHeader />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App