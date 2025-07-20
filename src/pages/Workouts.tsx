import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Play, 
  Clock, 
  Target, 
  Dumbbell,
  Heart,
  Zap,
  Users,
  Filter
} from 'lucide-react'

export function Workouts() {
  const [searchQuery, setSearchQuery] = useState('')

  const workoutCategories = [
    { id: 'strength', label: 'Strength', icon: Dumbbell, count: 24 },
    { id: 'cardio', label: 'Cardio', icon: Heart, count: 18 },
    { id: 'hiit', label: 'HIIT', icon: Zap, count: 12 },
    { id: 'group', label: 'Group Classes', icon: Users, count: 8 }
  ]

  const featuredWorkouts = [
    {
      id: 1,
      title: 'Full Body Strength',
      description: 'Complete upper and lower body workout',
      duration: '45 min',
      difficulty: 'Intermediate',
      calories: '320-400',
      equipment: ['Dumbbells', 'Barbell', 'Bench'],
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
      category: 'strength'
    },
    {
      id: 2,
      title: 'HIIT Cardio Blast',
      description: 'High-intensity interval training',
      duration: '30 min',
      difficulty: 'Advanced',
      calories: '400-500',
      equipment: ['Bodyweight'],
      image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=250&fit=crop',
      category: 'hiit'
    },
    {
      id: 3,
      title: 'Morning Yoga Flow',
      description: 'Gentle stretching and mindfulness',
      duration: '25 min',
      difficulty: 'Beginner',
      calories: '100-150',
      equipment: ['Yoga Mat'],
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop',
      category: 'flexibility'
    },
    {
      id: 4,
      title: 'Leg Day Power',
      description: 'Intense lower body strength training',
      duration: '50 min',
      difficulty: 'Advanced',
      calories: '350-450',
      equipment: ['Squat Rack', 'Leg Press', 'Dumbbells'],
      image: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&h=250&fit=crop',
      category: 'strength'
    },
    {
      id: 5,
      title: 'Spin Class',
      description: 'High-energy cycling workout',
      duration: '45 min',
      difficulty: 'Intermediate',
      calories: '450-550',
      equipment: ['Spin Bike'],
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
      category: 'cardio'
    },
    {
      id: 6,
      title: 'Core Crusher',
      description: 'Targeted abdominal and core workout',
      duration: '20 min',
      difficulty: 'Intermediate',
      calories: '150-200',
      equipment: ['Mat', 'Medicine Ball'],
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
      category: 'strength'
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredWorkouts = featuredWorkouts.filter(workout =>
    workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Workout Library</h1>
          <p className="text-muted-foreground">
            Discover personalized workouts designed for your fitness goals
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search workouts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {workoutCategories.map((category) => {
          const Icon = category.icon
          return (
            <Card key={category.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-1">{category.label}</h3>
                <p className="text-sm text-muted-foreground">{category.count} workouts</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Workout Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Workouts</TabsTrigger>
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="cardio">Cardio</TabsTrigger>
          <TabsTrigger value="hiit">HIIT</TabsTrigger>
          <TabsTrigger value="flexibility">Flexibility</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkouts.map((workout) => (
              <Card key={workout.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={workout.image}
                    alt={workout.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="lg" className="rounded-full">
                      <Play className="w-5 h-5 mr-2" />
                      Start Workout
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{workout.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {workout.description}
                      </CardDescription>
                    </div>
                    <Badge className={getDifficultyColor(workout.difficulty)}>
                      {workout.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {workout.duration}
                    </div>
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      {workout.calories} cal
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Equipment needed:</p>
                    <div className="flex flex-wrap gap-1">
                      {workout.equipment.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Start Workout
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Category-specific tabs */}
        {workoutCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkouts
                .filter(workout => workout.category === category.id)
                .map((workout) => (
                  <Card key={workout.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative">
                      <img
                        src={workout.image}
                        alt={workout.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button size="lg" className="rounded-full">
                          <Play className="w-5 h-5 mr-2" />
                          Start Workout
                        </Button>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{workout.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {workout.description}
                          </CardDescription>
                        </div>
                        <Badge className={getDifficultyColor(workout.difficulty)}>
                          {workout.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {workout.duration}
                        </div>
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-1" />
                          {workout.calories} cal
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Equipment needed:</p>
                        <div className="flex flex-wrap gap-1">
                          {workout.equipment.map((item, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full">
                        <Play className="w-4 h-4 mr-2" />
                        Start Workout
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}