import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dumbbell, 
  Clock, 
  Target, 
  Play, 
  Search, 
  Filter,
  Plus,
  CheckCircle,
  Star,
  Users,
  Zap
} from 'lucide-react'
import { blink } from '@/blink/client'

interface Workout {
  id: string
  name: string
  category: string
  duration: number
  difficulty: string
  description: string
  exercises: string
  completed_at?: string
  user_id?: string
}

export function Workouts() {
  const [user, setUser] = useState<any>(null)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    category: 'strength',
    duration: 45,
    difficulty: 'intermediate',
    description: '',
    exercises: ''
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      if (state.user) {
        setUser(state.user)
        await loadWorkouts()
      }
    })
    return unsubscribe
  }, [loadWorkouts])

  useEffect(() => {
    filterWorkouts()
  }, [workouts, searchTerm, categoryFilter, difficultyFilter, filterWorkouts])

  const loadWorkouts = useCallback(async () => {
    try {
      // Load both template workouts and user workouts
      const allWorkouts = await blink.db.workouts.list({
        orderBy: { createdAt: 'desc' }
      })
      
      // Add some default template workouts if none exist
      if (allWorkouts.length === 0) {
        await createDefaultWorkouts()
        const refreshedWorkouts = await blink.db.workouts.list({
          orderBy: { createdAt: 'desc' }
        })
        setWorkouts(refreshedWorkouts)
      } else {
        setWorkouts(allWorkouts)
      }
    } catch (error) {
      console.error('Error loading workouts:', error)
    }
  }, [])

  const createDefaultWorkouts = async () => {
    const defaultWorkouts = [
      {
        id: `template_${Date.now()}_1`,
        userId: 'template',
        name: 'Full Body Strength',
        category: 'strength',
        duration: 60,
        difficulty: 'intermediate',
        description: 'Complete full-body strength training targeting all major muscle groups',
        exercises: JSON.stringify([
          'Squats - 3x12',
          'Push-ups - 3x10',
          'Deadlifts - 3x8',
          'Pull-ups - 3x6',
          'Plank - 3x30s'
        ])
      },
      {
        id: `template_${Date.now()}_2`,
        userId: 'template',
        name: 'HIIT Cardio Blast',
        category: 'hiit',
        duration: 30,
        difficulty: 'advanced',
        description: 'High-intensity interval training for maximum calorie burn',
        exercises: JSON.stringify([
          'Burpees - 4x30s',
          'Mountain Climbers - 4x30s',
          'Jump Squats - 4x30s',
          'High Knees - 4x30s',
          'Rest - 30s between exercises'
        ])
      },
      {
        id: `template_${Date.now()}_3`,
        userId: 'template',
        name: 'Morning Yoga Flow',
        category: 'yoga',
        duration: 20,
        difficulty: 'beginner',
        description: 'Gentle morning yoga sequence to start your day',
        exercises: JSON.stringify([
          'Sun Salutation A - 3 rounds',
          'Warrior I - Hold 30s each side',
          'Downward Dog - Hold 1 min',
          'Child\'s Pose - Hold 1 min',
          'Savasana - 2 min'
        ])
      },
      {
        id: `template_${Date.now()}_4`,
        userId: 'template',
        name: 'Cardio Run',
        category: 'cardio',
        duration: 45,
        difficulty: 'intermediate',
        description: 'Steady-state cardio run for endurance building',
        exercises: JSON.stringify([
          'Warm-up walk - 5 min',
          'Steady run - 35 min',
          'Cool-down walk - 5 min'
        ])
      }
    ]

    for (const workout of defaultWorkouts) {
      await blink.db.workouts.create(workout)
    }
  }

  const filterWorkouts = useCallback(() => {
    let filtered = workouts

    if (searchTerm) {
      filtered = filtered.filter(workout =>
        workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(workout => workout.category === categoryFilter)
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(workout => workout.difficulty === difficultyFilter)
    }

    setFilteredWorkouts(filtered)
  }, [workouts, searchTerm, categoryFilter, difficultyFilter])

  const createWorkout = async () => {
    if (!user || !newWorkout.name) return

    try {
      await blink.db.workouts.create({
        id: `workout_${Date.now()}`,
        userId: user.id,
        name: newWorkout.name,
        category: newWorkout.category,
        duration: newWorkout.duration,
        difficulty: newWorkout.difficulty,
        description: newWorkout.description,
        exercises: newWorkout.exercises
      })

      setShowCreateDialog(false)
      setNewWorkout({
        name: '',
        category: 'strength',
        duration: 45,
        difficulty: 'intermediate',
        description: '',
        exercises: ''
      })
      await loadWorkouts()
    } catch (error) {
      console.error('Error creating workout:', error)
    }
  }

  const startWorkout = async (workout: Workout) => {
    if (!user) return

    try {
      // Log the workout as completed
      await blink.db.workouts.create({
        id: `completed_${Date.now()}`,
        userId: user.id,
        name: workout.name,
        category: workout.category,
        duration: workout.duration,
        difficulty: workout.difficulty,
        description: workout.description,
        exercises: workout.exercises,
        completedAt: new Date().toISOString()
      })

      alert(`Great job! You've completed "${workout.name}"!`)
    } catch (error) {
      console.error('Error starting workout:', error)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength': return <Dumbbell className="w-4 h-4" />
      case 'cardio': return <Target className="w-4 h-4" />
      case 'hiit': return <Zap className="w-4 h-4" />
      case 'yoga': return <Star className="w-4 h-4" />
      default: return <Play className="w-4 h-4" />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Access Workouts</CardTitle>
            <CardDescription>Sign in to view and create workouts</CardDescription>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workouts</h1>
          <p className="text-gray-600">Discover and track your fitness routines</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Workout</DialogTitle>
              <DialogDescription>Design your custom workout routine</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="workout-name">Workout Name</Label>
                <Input
                  id="workout-name"
                  value={newWorkout.name}
                  onChange={(e) => setNewWorkout(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Upper Body Power"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newWorkout.category} onValueChange={(value) => setNewWorkout(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strength">Strength</SelectItem>
                      <SelectItem value="cardio">Cardio</SelectItem>
                      <SelectItem value="hiit">HIIT</SelectItem>
                      <SelectItem value="yoga">Yoga</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={newWorkout.difficulty} onValueChange={(value) => setNewWorkout(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newWorkout.duration}
                  onChange={(e) => setNewWorkout(prev => ({ ...prev, duration: parseInt(e.target.value) || 45 }))}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newWorkout.description}
                  onChange={(e) => setNewWorkout(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the workout"
                />
              </div>
              <div>
                <Label htmlFor="exercises">Exercises (one per line)</Label>
                <Textarea
                  id="exercises"
                  value={newWorkout.exercises}
                  onChange={(e) => setNewWorkout(prev => ({ ...prev, exercises: e.target.value }))}
                  placeholder="e.g., Push-ups - 3x10&#10;Squats - 3x12&#10;Plank - 3x30s"
                  rows={4}
                />
              </div>
              <Button onClick={createWorkout} className="w-full bg-orange-500 hover:bg-orange-600">
                Create Workout
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search workouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="strength">Strength</SelectItem>
            <SelectItem value="cardio">Cardio</SelectItem>
            <SelectItem value="hiit">HIIT</SelectItem>
            <SelectItem value="yoga">Yoga</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
          </SelectContent>
        </Select>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Workout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkouts.map((workout) => {
          const exercises = workout.exercises ? JSON.parse(workout.exercises) : []
          const isTemplate = workout.userId === 'template'
          
          return (
            <Card key={workout.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(workout.category)}
                    <CardTitle className="text-lg">{workout.name}</CardTitle>
                  </div>
                  <Badge className={getDifficultyColor(workout.difficulty)}>
                    {workout.difficulty}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {workout.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{workout.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {isTemplate ? (
                      <>
                        <Star className="w-4 h-4" />
                        <span>Template</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4" />
                        <span>Custom</span>
                      </>
                    )}
                  </div>
                </div>

                {exercises.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Exercises:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {exercises.slice(0, 3).map((exercise: string, index: number) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="line-clamp-1">{exercise}</span>
                        </li>
                      ))}
                      {exercises.length > 3 && (
                        <li className="text-xs text-gray-500">
                          +{exercises.length - 3} more exercises
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <Button 
                  onClick={() => startWorkout(workout)} 
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Workout
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredWorkouts.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || categoryFilter !== 'all' || difficultyFilter !== 'all'
              ? 'Try adjusting your filters or search terms'
              : 'Create your first workout to get started'
            }
          </p>
          <Button onClick={() => setShowCreateDialog(true)} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Create Workout
          </Button>
        </div>
      )}
    </div>
  )
}