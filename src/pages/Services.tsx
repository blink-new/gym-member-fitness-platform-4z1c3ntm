import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Users,
  Star,
  MapPin,
  Phone,
  Mail,
  CheckCircle
} from 'lucide-react'

export function Services() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const services = [
    {
      id: 1,
      name: 'Personal Training',
      description: 'One-on-one training with certified trainers',
      duration: '60 min',
      price: '$75',
      category: 'training',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
      features: ['Customized workout plan', 'Form correction', 'Progress tracking', 'Nutrition guidance']
    },
    {
      id: 2,
      name: 'Group Fitness Classes',
      description: 'High-energy group workouts',
      duration: '45 min',
      price: '$25',
      category: 'classes',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
      features: ['Motivating group environment', 'Variety of class types', 'All fitness levels', 'Expert instruction']
    },
    {
      id: 3,
      name: 'Nutrition Consultation',
      description: 'Personalized nutrition planning',
      duration: '45 min',
      price: '$60',
      category: 'nutrition',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop',
      features: ['Meal plan creation', 'Dietary assessment', 'Supplement advice', 'Follow-up support']
    },
    {
      id: 4,
      name: 'Body Composition Analysis',
      description: 'Detailed body composition assessment',
      duration: '30 min',
      price: '$40',
      category: 'assessment',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
      features: ['InBody scan', 'Muscle mass analysis', 'Body fat percentage', 'Progress tracking']
    },
    {
      id: 5,
      name: 'Massage Therapy',
      description: 'Recovery and relaxation massage',
      duration: '60 min',
      price: '$90',
      category: 'recovery',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=250&fit=crop',
      features: ['Sports massage', 'Deep tissue', 'Recovery focused', 'Licensed therapists']
    },
    {
      id: 6,
      name: 'Fitness Assessment',
      description: 'Comprehensive fitness evaluation',
      duration: '90 min',
      price: '$50',
      category: 'assessment',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
      features: ['Strength testing', 'Cardio assessment', 'Flexibility evaluation', 'Goal setting']
    }
  ]

  const trainers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      specialty: 'Strength Training',
      experience: '8 years',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop',
      certifications: ['NASM-CPT', 'CSCS'],
      bio: 'Specializes in strength training and powerlifting with a focus on proper form and progressive overload.'
    },
    {
      id: 2,
      name: 'Mike Chen',
      specialty: 'HIIT & Cardio',
      experience: '6 years',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      certifications: ['ACE-CPT', 'HIIT Specialist'],
      bio: 'High-energy trainer focused on cardiovascular fitness and metabolic conditioning.'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      specialty: 'Yoga & Flexibility',
      experience: '10 years',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
      certifications: ['RYT-500', 'Corrective Exercise'],
      bio: 'Combines traditional yoga with modern fitness techniques for improved flexibility and mindfulness.'
    }
  ]

  const upcomingBookings = [
    {
      id: 1,
      service: 'Personal Training',
      trainer: 'Sarah Johnson',
      date: 'Today',
      time: '2:00 PM',
      duration: '60 min',
      status: 'confirmed'
    },
    {
      id: 2,
      service: 'Group Fitness Class',
      trainer: 'Mike Chen',
      date: 'Tomorrow',
      time: '6:00 AM',
      duration: '45 min',
      status: 'confirmed'
    },
    {
      id: 3,
      service: 'Nutrition Consultation',
      trainer: 'Dr. Lisa Park',
      date: 'Friday',
      time: '11:00 AM',
      duration: '45 min',
      status: 'pending'
    }
  ]

  const timeSlots = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM'
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gym Services</h1>
          <p className="text-muted-foreground">
            Book personal training, classes, and wellness services
          </p>
        </div>
        <Button>
          <CalendarIcon className="w-4 h-4 mr-2" />
          View My Bookings
        </Button>
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Upcoming Bookings</span>
          </CardTitle>
          <CardDescription>Your scheduled sessions and classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{booking.service}</h4>
                  <p className="text-sm text-muted-foreground">
                    with {booking.trainer} • {booking.date} at {booking.time}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                    {booking.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Services Tabs */}
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services">All Services</TabsTrigger>
          <TabsTrigger value="trainers">Our Trainers</TabsTrigger>
          <TabsTrigger value="book">Book Session</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-white/90 text-gray-800">
                    {service.price}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duration}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-2">What's included:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button className="w-full">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trainers" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => (
              <Card key={trainer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      className="w-20 h-20 rounded-full object-cover mb-4"
                    />
                    <h3 className="font-semibold text-lg">{trainer.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{trainer.specialty}</p>
                    
                    <div className="flex items-center space-x-4 text-sm mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {trainer.rating}
                      </div>
                      <div>{trainer.experience} experience</div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {trainer.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 text-center">
                      {trainer.bio}
                    </p>

                    <div className="flex space-x-2 w-full">
                      <Button variant="outline" className="flex-1">
                        <User className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                      <Button className="flex-1">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Book Session
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="book" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
                <CardDescription>Choose your preferred date for the session</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Time Slots */}
            <Card>
              <CardHeader>
                <CardTitle>Available Times</CardTitle>
                <CardDescription>
                  {selectedDate ? 
                    `Available slots for ${selectedDate.toLocaleDateString()}` : 
                    'Select a date to view available times'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="text-sm"
                        disabled={Math.random() > 0.7} // Randomly disable some slots
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Please select a date to view available time slots</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}