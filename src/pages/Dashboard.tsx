import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Activity, 
  Target, 
  Calendar, 
  TrendingUp, 
  Dumbbell, 
  Apple, 
  Clock,
  Flame,
  Trophy,
  Play
} from 'lucide-react'
import { blink } from '@/blink/client'

export function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    workoutsThisWeek: 4,
    caloriesBurned: 1250,
    weeklyGoal: 5,
    currentStreak: 7
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  const quickActions = [
    {
      title: 'Start Workout',
      description: 'Begin your daily training',
      icon: Play,
      color: 'bg-primary',
      action: () => console.log('Start workout')
    },
    {
      title: 'Log Meal',
      description: 'Track your nutrition',
      icon: Apple,
      color: 'bg-green-500',
      action: () => console.log('Log meal')
    },
    {
      title: 'Book Session',
      description: 'Schedule training',
      icon: Calendar,
      color: 'bg-blue-500',
      action: () => console.log('Book session')
    }
  ]

  const recentWorkouts = [
    {
      name: 'Upper Body Strength',
      date: 'Today',
      duration: '45 min',
      calories: 320,
      completed: true
    },
    {
      name: 'HIIT Cardio',
      date: 'Yesterday',
      duration: '30 min',
      calories: 280,
      completed: true
    },
    {
      name: 'Leg Day',
      date: '2 days ago',
      duration: '50 min',
      calories: 380,
      completed: true
    }
  ]

  const weeklyProgress = Math.round((stats.workoutsThisWeek / stats.weeklyGoal) * 100)

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.displayName || 'Champion'}! 💪
            </h1>
            <p className="text-white/90">
              You're on a {stats.currentStreak}-day streak! Keep pushing your limits.
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.currentStreak}</div>
              <div className="text-sm text-white/80">Day Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Workouts</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.workoutsThisWeek}/{stats.weeklyGoal}</div>
            <Progress value={weeklyProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {weeklyProgress}% of weekly goal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.caloriesBurned.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentStreak} days</div>
            <p className="text-xs text-muted-foreground">
              Personal best!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2:00 PM</div>
            <p className="text-xs text-muted-foreground">
              Personal Training
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`${action.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recent Workouts</span>
            </CardTitle>
            <CardDescription>Your latest training sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentWorkouts.map((workout, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{workout.name}</h4>
                  <p className="text-sm text-muted-foreground">{workout.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{workout.duration}</div>
                  <div className="text-xs text-muted-foreground">{workout.calories} cal</div>
                </div>
                <Badge variant="secondary" className="ml-3">
                  ✓ Done
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Workouts
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>This Week's Goals</span>
            </CardTitle>
            <CardDescription>Track your progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Workout Sessions</span>
                  <span>{stats.workoutsThisWeek}/{stats.weeklyGoal}</span>
                </div>
                <Progress value={weeklyProgress} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Protein Intake</span>
                  <span>85/100g</span>
                </div>
                <Progress value={85} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Water Intake</span>
                  <span>6/8 glasses</span>
                </div>
                <Progress value={75} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Sleep Hours</span>
                  <span>7.5/8 hrs</span>
                </div>
                <Progress value={94} />
              </div>
            </div>
            
            <Button className="w-full">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}