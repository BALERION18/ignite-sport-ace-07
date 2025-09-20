import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BarChart3, AlertTriangle, Trophy, Search, Filter, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import ChatContainer from './ChatContainer';

interface CoachDashboardProps {
  onSectionChange: (section: string) => void;
}

export default function CoachDashboard({ onSectionChange }: CoachDashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Mock athlete database - in real app this would come from backend
  const allAthletes = [
    {
      id: '1',
      name: "John Smith",
      age: 19,
      sport: "Sprint",
      location: "Maharashtra", 
      performance: 92,
      improvement: 15,
      injuryRisk: "low",
      lastAnalysis: "2 hours ago",
      avatar: "JS"
    },
    {
      id: '2',
      name: "Sarah Johnson", 
      age: 21,
      sport: "Long Jump",
      location: "Kerala",
      performance: 88,
      improvement: 8,
      injuryRisk: "medium", 
      lastAnalysis: "1 day ago",
      avatar: "SJ"
    },
    {
      id: '3',
      name: "Mike Wilson",
      age: 18,
      sport: "Hurdles", 
      location: "Gujarat",
      performance: 85,
      improvement: 22,
      injuryRisk: "low",
      lastAnalysis: "3 hours ago", 
      avatar: "MW"
    },
    {
      id: '4',
      name: "Emma Davis",
      age: 20,
      sport: "High Jump",
      location: "Punjab", 
      performance: 78,
      improvement: -5,
      injuryRisk: "high",
      lastAnalysis: "5 hours ago",
      avatar: "ED" 
    },
  ];

  // Filter athletes under this coach
  const myAthletes = allAthletes.filter(athlete => 
    user?.athleteIds?.includes(athlete.id)
  );

  const teamStats = [
    { label: "My Athletes", value: myAthletes.length.toString(), change: "+12%" },
    { label: "Avg Performance", value: Math.round(myAthletes.reduce((sum, a) => sum + a.performance, 0) / myAthletes.length).toString(), change: "+5.2%" },
    { label: "At Risk", value: myAthletes.filter(a => a.injuryRisk === 'high').length.toString(), change: "-15%" },
    { label: "Improved This Week", value: myAthletes.filter(a => a.improvement > 0).length.toString(), change: "+8%" },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <section id="coach" className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome, Coach {user?.name?.split(' ')[0]}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Monitor your athletes' performance, track progress, and identify potential injury risks 
            with AI-powered insights and analytics.
          </p>
        </motion.div>

        {/* Team Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {teamStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </div>
                    <div className={`text-xs ${
                      stat.change.startsWith('+') ? 'text-green-400' : 
                      stat.change.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {stat.change} this month
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat with Athletes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Athletes List */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="xl:col-span-2"
          >
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Athletes Overview
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input 
                        placeholder="Search athletes..." 
                        className="pl-10 w-48"
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myAthletes.length > 0 ? (
                    myAthletes.map((athlete, index) => (
                    <motion.div
                      key={athlete.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className="p-4 border border-border rounded-lg hover:border-primary/30 transition-all cursor-pointer hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${athlete.name}`} />
                            <AvatarFallback>{athlete.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{athlete.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{athlete.sport}</span>
                              <span>•</span>
                              <span>{athlete.location}</span>
                              <span>•</span>
                              <span>{athlete.age} years</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold">{athlete.performance}</div>
                            <div className="text-xs text-muted-foreground">Performance</div>
                          </div>
                          
                          <div className="text-center">
                            <div className={`text-lg font-bold ${
                              athlete.improvement > 0 ? 'text-green-400' : 
                              athlete.improvement < 0 ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              {athlete.improvement > 0 ? '+' : ''}{athlete.improvement}%
                            </div>
                            <div className="text-xs text-muted-foreground">Improvement</div>
                          </div>
                          
                          <Badge variant={getRiskBadge(athlete.injuryRisk)}>
                            {athlete.injuryRisk} risk
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>Performance Score</span>
                          <span>{athlete.performance}/100</span>
                        </div>
                        <Progress value={athlete.performance} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                        <span>Last analysis: {athlete.lastAnalysis}</span>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Athletes Assigned</h3>
                      <p className="text-muted-foreground mb-4">You don't have any athletes assigned to you yet.</p>
                      <Button variant="outline">
                        Request Athlete Assignment
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Analytics Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-6"
          >
            {/* Performance Analytics */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sprint Performance</span>
                    <span className="text-sm font-medium">↗ 12%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Technique Score</span>
                    <span className="text-sm font-medium">↗ 8%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Injury Prevention</span>
                    <span className="text-sm font-medium">↗ 15%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onSectionChange('analysis')}
                >
                  Detailed Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium">High Injury Risk</div>
                          <div className="text-xs text-muted-foreground">
                            {myAthletes.find(a => a.injuryRisk === 'high')?.name || 'No high risk athletes'} 
                            {myAthletes.find(a => a.injuryRisk === 'high') && ' - knee alignment issues detected'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium">Performance Drop</div>
                          <div className="text-xs text-muted-foreground">
                            {myAthletes.filter(a => a.improvement < 0).length} athletes showing decreased metrics
                          </div>
                        </div>
                      </div>
                    </div>

                <Button variant="outline" className="w-full">
                  View All Alerts
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Trophy className="w-4 h-4 mr-2" />
                  Create Challenge
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onSectionChange('leaderboard')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Team Rankings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Add Athlete
                </Button>
              </CardContent>
            </Card>
          </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Athlete Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ChatContainer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}