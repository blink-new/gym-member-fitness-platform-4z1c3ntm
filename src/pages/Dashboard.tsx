import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  Play,
  Plus
} from 'lucide-react'
import { blink } from '@/blink/client'

interface WorkoutLog {
  id: string
  name: string
  category: string
  duration: number
  completed_at: string
}

interface NutritionData {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutLog[]>([])
  const [todayNutrition, setTodayNutrition] = useState<NutritionData>({ calories: 0, protein: 0, carbs: 0, fat: 0 })
  const [showQuickLog, setShowQuickLog] = useState(false)
  const [showNutritionLog, setShowNutritionLog] = useState(false)
  const [quickWorkout, setQuickWorkout] = useState({ name: '', category: 'strength', duration: 30 })
  const [quickMeal, setQuickMeal] = useState({ 
    foodName: '', 
    mealType: 'breakfast', 
    calories: 0, 
    protein: 0, 
    carbs: 0, 
    fat: 0 
  })
  const [stats, setStats] = useState({
    workoutsThisWeek: 0,
    caloriesBurned: 0,
    weeklyGoal: 5,
    currentStreak: 0
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      if (state.user) {
        setUser(state.user)
        await loadDashboardData(state.user.id)
      }
      setIsLoading(state.isLoading)
    })
    return unsubscribe
  }, [loadDashboardData])

  const loadDashboardData = useCallback(async (userId: string) => {
    try {
      // Load recent workouts
      const workouts = await blink.db.workouts.list({
        where: { userId },
        orderBy: { completedAt: 'desc' },
        limit: 5
      })
      const completedWorkouts = workouts.filter(w => w.completed_at)
      setRecentWorkouts(completedWorkouts)

      // Calculate weekly stats
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const weekStartStr = weekStart.toISOString().split('T')[0]
      
      const weeklyWorkouts = await blink.db.workouts.list({
        where: { userId }
      })
      const thisWeekWorkouts = weeklyWorkouts.filter(w => 
        w.completed_at && w.completed_at >= weekStartStr
      )

      // Load today's nutrition
      const today = new Date().toISOString().split('T')[0]
      const nutritionLogs = await blink.db.nutritionLogs.list({
        where: { userId, date: today }
      })
      
      const totalNutrition = nutritionLogs.reduce((acc, log) => ({
        calories: acc.calories + (log.calories || 0),
        protein: acc.protein + (log.protein || 0),
        carbs: acc.carbs + (log.carbs || 0),
        fat: acc.fat + (log.fat || 0)
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 })
      
      setTodayNutrition(totalNutrition)

      // Calculate total calories burned (estimate 10 calories per minute)
      const totalCaloriesBurned = thisWeekWorkouts.reduce((acc, workout) => 
        acc + (workout.duration * 10), 0
      )

      setStats({
        workoutsThisWeek: thisWeekWorkouts.length,
        caloriesBurned: totalCaloriesBurned,
        weeklyGoal: 5,
        currentStreak: calculateStreak(completedWorkouts)
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }, [])

  const calculateStreak = (workouts: WorkoutLog[]): number => {
    if (workouts.length === 0) return 0
    
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]
      
      const hasWorkout = workouts.some(w => 
        w.completed_at && w.completed_at.startsWith(dateStr)
      )
      
      if (hasWorkout) {
        streak++
      } else if (i > 0) {
        break
      }
    }
    
    return streak
  }

  const logQuickWorkout = async () => {
    if (!user || !quickWorkout.name) return
    
    try {
      await blink.db.workouts.create({
        id: `workout_${Date.now()}`,
        userId: user.id,
        name: quickWorkout.name,
        category: quickWorkout.category,
        duration: quickWorkout.duration,
        exercises: JSON.stringify([]),
        completedAt: new Date().toISOString()
      })
      
      setShowQuickLog(false)
      setQuickWorkout({ name: '', category: 'strength', duration: 30 })
      await loadDashboardData(user.id)
    } catch (error) {
      console.error('Error logging workout:', error)
    }
  }

  const logQuickMeal = async () => {
    if (!user || !quickMeal.foodName) return
    
    try {
      const today = new Date().toISOString().split('T')[0]
      await blink.db.nutritionLogs.create({
        id: `nutrition_${Date.now()}`,
        userId: user.id,
        date: today,
        mealType: quickMeal.mealType,
        foodName: quickMeal.foodName,
        calories: quickMeal.calories,
        protein: quickMeal.protein,
        carbs: quickMeal.carbs,
        fat: quickMeal.fat
      })
      
      setShowNutritionLog(false)
      setQuickMeal({ foodName: '', mealType: 'breakfast', calories: 0, protein: 0, carbs: 0, fat: 0 })
      await loadDashboardData(user.id)
    } catch (error) {
      console.error('Error logging meal:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your fitness dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to FitHub</CardTitle>
            <CardDescription>Sign in to access your personalized fitness dashboard</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => blink.auth.login()} className="w-full bg-orange-500 hover:bg-orange-600">
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const quickActions = [
    {
      title: 'Log Workout',
      description: 'Record completed exercise',
      icon: Play,
      color: 'bg-primary',
      action: () => setShowQuickLog(true)
    },
    {
      title: 'Log Meal',
      description: 'Track your nutrition',
      icon: Apple,
      color: 'bg-green-500',
      action: () => setShowNutritionLog(true)
    },
    {
      title: 'Book Session',
      description: 'Schedule training',
      icon: Calendar,
      color: 'bg-blue-500',
      action: () => console.log('Book session')
    }
  ]

  const weeklyProgress = Math.round((stats.workoutsThisWeek / stats.weeklyGoal) * 100)
  const proteinGoal = 100
  const proteinProgress = Math.min((todayNutrition.protein / proteinGoal) * 100, 100)

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Champion'}! 💪
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
              This week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Calories</CardTitle>
            <Apple className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(todayNutrition.calories)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(todayNutrition.protein)}g protein
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
              {stats.currentStreak > 0 ? 'Keep it up!' : 'Start today!'}
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
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={action.action}>
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
            {recentWorkouts.length > 0 ? (
              recentWorkouts.map((workout, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{workout.name}</h4>
                    <p className="text-sm text-muted-foreground capitalize">{workout.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{workout.duration} min</div>
                    <div className="text-xs text-muted-foreground">{workout.duration * 10} cal</div>
                  </div>
                  <Badge variant="secondary" className="ml-3">
                    ✓ Done
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No workouts logged yet</p>
                <p className="text-sm">Start by logging your first workout!</p>
              </div>
            )}
            <Button variant="outline" className="w-full" onClick={() => setShowQuickLog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Log New Workout
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Today's Progress</span>
            </CardTitle>
            <CardDescription>Track your daily goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Weekly Workouts</span>
                  <span>{stats.workoutsThisWeek}/{stats.weeklyGoal}</span>
                </div>
                <Progress value={weeklyProgress} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Protein Intake</span>
                  <span>{Math.round(todayNutrition.protein)}/{proteinGoal}g</span>
                </div>
                <Progress value={proteinProgress} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Calories Today</span>
                  <span>{Math.round(todayNutrition.calories)}/2000</span>
                </div>
                <Progress value={Math.min((todayNutrition.calories / 2000) * 100, 100)} />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Current Streak</span>
                  <span>{stats.currentStreak} days</span>
                </div>
                <Progress value={Math.min(stats.currentStreak * 10, 100)} />
              </div>
            </div>
            
            <Button className="w-full" onClick={() => setShowNutritionLog(true)}>
              <Apple className="w-4 h-4 mr-2" />
              Log Nutrition
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Workout Log Dialog */}
      <Dialog open={showQuickLog} onOpenChange={setShowQuickLog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Quick Workout</DialogTitle>
            <DialogDescription>Record a completed workout session</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="workout-name">Workout Name</Label>
              <Input
                id="workout-name"
                value={quickWorkout.name}
                onChange={(e) => setQuickWorkout(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Morning Run, Push Day, Yoga Session"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={quickWorkout.category} onValueChange={(value) => setQuickWorkout(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strength">Strength Training</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="hiit">HIIT</SelectItem>
                  <SelectItem value="yoga">Yoga</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={quickWorkout.duration}
                onChange={(e) => setQuickWorkout(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
              />
            </div>
            <Button onClick={logQuickWorkout} className="w-full bg-orange-500 hover:bg-orange-600">
              Log Workout
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Nutrition Log Dialog */}
      <Dialog open={showNutritionLog} onOpenChange={setShowNutritionLog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Nutrition</DialogTitle>
            <DialogDescription>Record your meal or snack</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="food-name">Food Name</Label>
              <Input
                id="food-name"
                value={quickMeal.foodName}
                onChange={(e) => setQuickMeal(prev => ({ ...prev, foodName: e.target.value }))}
                placeholder="e.g., Grilled Chicken Breast, Protein Shake"
              />
            </div>
            <div>
              <Label htmlFor="meal-type">Meal Type</Label>
              <Select value={quickMeal.mealType} onValueChange={(value) => setQuickMeal(prev => ({ ...prev, mealType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  value={quickMeal.calories}
                  onChange={(e) => setQuickMeal(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={quickMeal.protein}
                  onChange={(e) => setQuickMeal(prev => ({ ...prev, protein: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={quickMeal.carbs}
                  onChange={(e) => setQuickMeal(prev => ({ ...prev, carbs: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  value={quickMeal.fat}
                  onChange={(e) => setQuickMeal(prev => ({ ...prev, fat: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <Button onClick={logQuickMeal} className="w-full bg-green-500 hover:bg-green-600">
              Log Meal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}