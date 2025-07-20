import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Header } from './components/layout/Header'
import { Dashboard } from './pages/Dashboard'
import { Workouts } from './pages/Workouts'
import { Nutrition } from './pages/Nutrition'
import { Services } from './pages/Services'
import { Toaster } from './components/ui/toaster'

type Page = 'dashboard' | 'workouts' | 'nutrition' | 'services'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading FitHub...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">FitHub</h1>
            <p className="text-xl text-muted-foreground">Your Personal Fitness Platform</p>
          </div>
          <div className="bg-card rounded-lg p-8 shadow-lg border">
            <h2 className="text-2xl font-semibold mb-4">Welcome to FitHub</h2>
            <p className="text-muted-foreground mb-6">
              Access personalized workouts, nutrition plans, and fitness services tailored just for you.
            </p>
            <button
              onClick={() => blink.auth.login()}
              className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Sign In to Get Started
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'workouts':
        return <Workouts />
      case 'nutrition':
        return <Nutrition />
      case 'services':
        return <Services />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
      />
      <main className="pt-16">
        {renderPage()}
      </main>
      <Toaster />
    </div>
  )
}

export default App