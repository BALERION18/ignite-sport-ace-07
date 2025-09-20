import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Users, Calendar, Award, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import ChatContainer from './ChatContainer';
import diverseAthletes from '@/assets/diverse-athletes.jpg';

interface AthleteHubProps {
  onSectionChange: (section: string) => void;
}

export default function AthleteHub({ onSectionChange }: AthleteHubProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const achievements = [
    { icon: Trophy, title: "Speed Demon", description: "Top 10% in sprint analysis", level: "Gold" },
    { icon: Target, title: "Precision Master", description: "95%+ accuracy in skill tests", level: "Silver" },
    { icon: TrendingUp, title: "Rising Star", description: "Consistent improvement over 30 days", level: "Bronze" },
  ];

  const upcomingChallenges = [
    { name: "100m Sprint Challenge", participants: 1247, deadline: "5 days", reward: "250 points" },
    { name: "Agility Ladder Test", participants: 892, deadline: "12 days", reward: "180 points" },
    { name: "Vertical Jump Challenge", participants: 1567, deadline: "18 days", reward: "320 points" },
  ];

  const progressData = [
    { metric: "Speed", current: 85, target: 90, unit: "%" },
    { metric: "Agility", current: 78, target: 85, unit: "%" },
    { metric: "Endurance", current: 72, target: 80, unit: "%" },
    { metric: "Technique", current: 88, target: 95, unit: "%" },
  ];

  return (
    <section id="athlete" className="min-h-screen py-20 px-4">
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
              Welcome, {user?.name?.split(' ')[0]}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Track your progress, earn achievements, and connect with athletes worldwide. 
            Your journey to excellence starts here.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
            <img 
              src={diverseAthletes} 
              alt="Diverse athletes celebrating achievements" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Join the Global Community</h3>
              <p className="text-lg opacity-90">Athletes from 50+ countries training together</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Chat with Coach
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Tracking */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Performance Overview */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {progressData.map((item, index) => (
                    <motion.div
                      key={item.metric}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.metric}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.current}{item.unit} / {item.target}{item.unit}
                        </span>
                      </div>
                      <Progress 
                        value={(item.current / item.target) * 100} 
                        className="h-3"
                      />
                      <div className="text-xs text-muted-foreground">
                        {item.target - item.current}{item.unit} to target
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="p-3 bg-primary/10 rounded-full">
                        <achievement.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{achievement.title}</h4>
                          <Badge variant={achievement.level === 'Gold' ? 'default' : 
                                          achievement.level === 'Silver' ? 'secondary' : 'outline'}>
                            {achievement.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="flex flex-wrap gap-4"
            >
              <Button 
                className="btn-hero flex-1 min-w-[200px]"
                onClick={() => onSectionChange('analysis')}
              >
                <Target className="w-4 h-4 mr-2" />
                Start Training Session
              </Button>
              <Button 
                variant="outline" 
                className="btn-hero-outline flex-1 min-w-[200px]"
                onClick={() => onSectionChange('leaderboard')}
              >
                <Trophy className="w-4 h-4 mr-2" />
                View Rankings
              </Button>
            </motion.div>
          </motion.div>

          {/* Sidebar - Challenges & Community */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Upcoming Challenges */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingChallenges.map((challenge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="p-4 border border-border rounded-lg hover:border-primary/30 transition-colors cursor-pointer"
                  >
                    <h4 className="font-semibold mb-2">{challenge.name}</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Participants:</span>
                        <span className="font-medium">{challenge.participants.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Deadline:</span>
                        <span className="font-medium">{challenge.deadline}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Reward:</span>
                        <span className="font-medium text-primary">{challenge.reward}</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      Join Challenge
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                    10,247
                  </div>
                  <p className="text-sm text-muted-foreground">Active Athletes Today</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-primary">156</div>
                    <div className="text-xs text-muted-foreground">Countries</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-secondary">2.4M</div>
                    <div className="text-xs text-muted-foreground">Analyses</div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Join Community Chat
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
                  Coach Communication
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