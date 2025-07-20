import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Apple, 
  Plus, 
  Target, 
  TrendingUp,
  Utensils,
  Clock,
  Zap,
  Droplets
} from 'lucide-react'

export function Nutrition() {
  const [dailyStats] = useState({
    calories: { consumed: 1650, target: 2200 },
    protein: { consumed: 85, target: 120 },
    carbs: { consumed: 180, target: 250 },
    fat: { consumed: 65, target: 80 },
    water: { consumed: 6, target: 8 }
  })

  const mealPlans = [
    {
      id: 1,
      name: 'Muscle Building',
      description: 'High protein plan for strength training',
      calories: '2400-2600',
      protein: '150g',
      duration: '7 days',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop',
      meals: 5
    },
    {
      id: 2,
      name: 'Fat Loss',
      description: 'Balanced macros for weight management',
      calories: '1800-2000',
      protein: '120g',
      duration: '14 days',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop',
      meals: 4
    },
    {
      id: 3,
      name: 'Endurance',
      description: 'Carb-focused for cardio athletes',
      calories: '2200-2400',
      protein: '100g',
      duration: '7 days',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop',
      meals: 5
    }
  ]

  const todaysMeals = [
    {
      type: 'Breakfast',
      time: '8:00 AM',
      name: 'Protein Oatmeal Bowl',
      calories: 420,
      protein: 25,
      carbs: 45,
      fat: 12,
      logged: true
    },
    {
      type: 'Lunch',
      time: '12:30 PM',
      name: 'Grilled Chicken Salad',
      calories: 380,
      protein: 35,
      carbs: 15,
      fat: 18,
      logged: true
    },
    {
      type: 'Snack',
      time: '3:00 PM',
      name: 'Greek Yogurt & Berries',
      calories: 180,
      protein: 15,
      carbs: 20,
      fat: 5,
      logged: true
    },
    {
      type: 'Dinner',
      time: '7:00 PM',
      name: 'Salmon with Quinoa',
      calories: 520,
      protein: 40,
      carbs: 35,
      fat: 22,
      logged: false
    },
    {
      type: 'Evening Snack',
      time: '9:00 PM',
      name: 'Protein Shake',
      calories: 150,
      protein: 25,
      carbs: 8,
      fat: 3,
      logged: false
    }
  ]

  const recipes = [
    {
      id: 1,
      name: 'High-Protein Pancakes',
      prepTime: '15 min',
      calories: 320,
      protein: 28,
      difficulty: 'Easy',
      image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Quinoa Power Bowl',
      prepTime: '20 min',
      calories: 450,
      protein: 22,
      difficulty: 'Medium',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'Lean Turkey Meatballs',
      prepTime: '30 min',
      calories: 280,
      protein: 35,
      difficulty: 'Medium',
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=300&h=200&fit=crop'
    }
  ]

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Nutrition Dashboard</h1>
          <p className="text-muted-foreground">
            Track your daily nutrition and discover healthy recipes
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Log Food
        </Button>
      </div>

      {/* Daily Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="w-4 h-4 mr-2 text-orange-500" />
              Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailyStats.calories.consumed}
              <span className="text-sm text-muted-foreground">/{dailyStats.calories.target}</span>
            </div>
            <Progress 
              value={(dailyStats.calories.consumed / dailyStats.calories.target) * 100} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {dailyStats.calories.target - dailyStats.calories.consumed} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="w-4 h-4 mr-2 text-blue-500" />
              Protein
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailyStats.protein.consumed}g
              <span className="text-sm text-muted-foreground">/{dailyStats.protein.target}g</span>
            </div>
            <Progress 
              value={(dailyStats.protein.consumed / dailyStats.protein.target) * 100} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((dailyStats.protein.consumed / dailyStats.protein.target) * 100)}% of goal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Apple className="w-4 h-4 mr-2 text-green-500" />
              Carbs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailyStats.carbs.consumed}g
              <span className="text-sm text-muted-foreground">/{dailyStats.carbs.target}g</span>
            </div>
            <Progress 
              value={(dailyStats.carbs.consumed / dailyStats.carbs.target) * 100} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((dailyStats.carbs.consumed / dailyStats.carbs.target) * 100)}% of goal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-purple-500" />
              Fat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailyStats.fat.consumed}g
              <span className="text-sm text-muted-foreground">/{dailyStats.fat.target}g</span>
            </div>
            <Progress 
              value={(dailyStats.fat.consumed / dailyStats.fat.target) * 100} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((dailyStats.fat.consumed / dailyStats.fat.target) * 100)}% of goal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Droplets className="w-4 h-4 mr-2 text-cyan-500" />
              Water
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailyStats.water.consumed}
              <span className="text-sm text-muted-foreground">/{dailyStats.water.target} glasses</span>
            </div>
            <Progress 
              value={(dailyStats.water.consumed / dailyStats.water.target) * 100} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {dailyStats.water.target - dailyStats.water.consumed} more to go
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="meals" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="meals">Today's Meals</TabsTrigger>
          <TabsTrigger value="plans">Meal Plans</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
        </TabsList>

        <TabsContent value="meals" className="mt-6">
          <div className="space-y-4">
            {todaysMeals.map((meal, index) => (
              <Card key={index} className={`${meal.logged ? 'bg-green-50 border-green-200' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex flex-col">
                          <h3 className="font-semibold">{meal.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{meal.type}</span>
                            <span>•</span>
                            <Clock className="w-3 h-3" />
                            <span>{meal.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span>{meal.calories} cal</span>
                        <span>P: {meal.protein}g</span>
                        <span>C: {meal.carbs}g</span>
                        <span>F: {meal.fat}g</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {meal.logged ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          ✓ Logged
                        </Badge>
                      ) : (
                        <Button variant="outline" size="sm">
                          Log Meal
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="plans" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealPlans.map((plan) => (
              <Card key={plan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={plan.image}
                    alt={plan.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Calories/day:</span>
                      <span className="font-medium">{plan.calories}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Protein/day:</span>
                      <span className="font-medium">{plan.protein}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Duration:</span>
                      <span className="font-medium">{plan.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Meals/day:</span>
                      <span className="font-medium">{plan.meals}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">
                    <Utensils className="w-4 h-4 mr-2" />
                    Start Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recipes" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-white/90 text-gray-800">
                    {recipe.difficulty}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{recipe.name}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {recipe.prepTime}
                    </div>
                    <div>{recipe.calories} cal</div>
                    <div>{recipe.protein}g protein</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    View Recipe
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}