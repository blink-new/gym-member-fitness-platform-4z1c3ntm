import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { 
  User, 
  Settings, 
  Trophy, 
  Target,
  Calendar,
  TrendingUp,
  Award,
  Edit,
  Camera
} from 'lucide-react'
import { blink } from '../blink/client'

export function Profile() {
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    phone: '',
    age: '',
    height: '',
    weight: '',
    fitnessGoal: 'Build Muscle'
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (state.user) {
        setProfileData({
          displayName: state.user.displayName || '',
          email: state.user.email || '',
          phone: '',
          age: '',
          height: '',
          weight: '',
          fitnessGoal: 'Build Muscle'
        })
      }
    })
    return unsubscribe
  }, [])

  const achievements = [
    {
      id: 1,
      title: 'First Workout',
      description: 'Completed your first workout session',
      icon: '🏃‍♂️',
      earned: true,
      date: '2024-01-15'
    },
    {
      id: 2,
      title: '7-Day Streak',
      description: 'Worked out for 7 consecutive days',
      icon: '🔥',
      earned: true,
      date: '2024-01-22'
    },
    {
      id: 3,
      title: 'Strength Milestone',
      description: 'Increased bench press by 25%',
      icon: '💪',
      earned: true,
      date: '2024-02-01'
    },
    {
      id: 4,
      title: 'Nutrition Master',
      description: 'Logged meals for 30 days straight',
      icon: '🥗',
      earned: false,
      date: null
    },
    {
      id: 5,
      title: 'Cardio Champion',
      description: 'Completed 50 cardio sessions',
      icon: '❤️',
      earned: false,
      date: null
    },
    {
      id: 6,
      title: 'Goal Crusher',
      description: 'Achieved your fitness goal',
      icon: '🎯',
      earned: false,
      date: null
    }
  ]

  const stats = {
    totalWorkouts: 47,
    totalHours: 62,
    caloriesBurned: 18750,
    currentStreak: 7,
    personalBests: {
      benchPress: '185 lbs',
      squat: '225 lbs',
      deadlift: '275 lbs',
      run5k: '24:30'
    }
  }

  const fitnessGoals = [
    'Lose Weight',
    'Build Muscle',
    'Improve Endurance',
    'Increase Strength',
    'General Fitness',
    'Athletic Performance'
  ]

  const handleSaveProfile = async () => {
    try {
      await blink.auth.updateMe({
        displayName: profileData.displayName
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto mb-4" />
          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account and track your fitness journey
          </p>
        </div>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.avatar} alt={user?.displayName || user?.email} />
                <AvatarFallback className="text-2xl">
                  {user?.displayName?.[0] || user?.email?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold">
                  {user?.displayName || 'Gym Member'}
                </h2>
                <Badge variant="secondary">Premium Member</Badge>
              </div>
              <p className="text-muted-foreground mb-4">{user?.email}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.totalWorkouts}</div>
                  <div className="text-sm text-muted-foreground">Workouts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.totalHours}</div>
                  <div className="text-sm text-muted-foreground">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.caloriesBurned.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.currentStreak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Personal Details</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                  <CardDescription>Update your personal details and fitness goals</CardDescription>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                >
                  {isEditing ? (
                    <>Save Changes</>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Full Name</Label>
                  <Input
                    id="displayName"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profileData.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditing}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    value={profileData.age}
                    onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                    disabled={!isEditing}
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    value={profileData.height}
                    onChange={(e) => setProfileData({...profileData, height: e.target.value})}
                    disabled={!isEditing}
                    placeholder="5'10&quot;"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={profileData.weight}
                    onChange={(e) => setProfileData({...profileData, weight: e.target.value})}
                    disabled={!isEditing}
                    placeholder="170 lbs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fitness Goal</Label>
                <div className="flex flex-wrap gap-2">
                  {fitnessGoals.map((goal) => (
                    <Button
                      key={goal}
                      variant={profileData.fitnessGoal === goal ? "default" : "outline"}
                      size="sm"
                      disabled={!isEditing}
                      onClick={() => setProfileData({...profileData, fitnessGoal: goal})}
                    >
                      {goal}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Achievements</span>
              </CardTitle>
              <CardDescription>Your fitness milestones and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className={`${achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`text-2xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${achievement.earned ? 'text-green-800' : 'text-gray-600'}`}>
                            {achievement.title}
                          </h3>
                          <p className={`text-sm ${achievement.earned ? 'text-green-600' : 'text-gray-500'}`}>
                            {achievement.description}
                          </p>
                          {achievement.earned && achievement.date && (
                            <p className="text-xs text-green-500 mt-1">
                              Earned on {new Date(achievement.date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {achievement.earned && (
                          <Award className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Personal Bests</span>
                </CardTitle>
                <CardDescription>Your strongest lifts and fastest times</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Bench Press</span>
                  <span className="text-lg font-bold text-primary">{stats.personalBests.benchPress}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Squat</span>
                  <span className="text-lg font-bold text-primary">{stats.personalBests.squat}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Deadlift</span>
                  <span className="text-lg font-bold text-primary">{stats.personalBests.deadlift}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">5K Run</span>
                  <span className="text-lg font-bold text-primary">{stats.personalBests.run5k}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Monthly Goals</span>
                </CardTitle>
                <CardDescription>Track your progress this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Workout Sessions</span>
                    <span>12/16</span>
                  </div>
                  <Progress value={75} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Calories Burned</span>
                    <span>4,200/5,000</span>
                  </div>
                  <Progress value={84} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Protein Intake</span>
                    <span>85/100g avg</span>
                  </div>
                  <Progress value={85} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Sleep Quality</span>
                    <span>7.5/8 hrs avg</span>
                  </div>
                  <Progress value={94} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Account Settings</span>
              </CardTitle>
              <CardDescription>Manage your account preferences and privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive workout reminders and updates</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Privacy Settings</h3>
                    <p className="text-sm text-muted-foreground">Control who can see your progress</p>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Data Export</h3>
                    <p className="text-sm text-muted-foreground">Download your fitness data</p>
                  </div>
                  <Button variant="outline">Export</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Delete Account</h3>
                    <p className="text-sm text-muted-foreground">Permanently delete your account</p>
                  </div>
                  <Button variant="destructive">Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}