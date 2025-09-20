import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, Users, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import aiAnalysis from '@/assets/ai-analysis.jpg';

export default function Leaderboard() {
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  const leaderboardData = [
    {
      rank: 1,
      name: "Priya Sharma",
      location: "Maharashtra",
      sport: "Sprint",
      score: 2847,
      change: 12,
      badge: "Champion",
      avatar: "PS",
      improvement: "+15%"
    },
    {
      rank: 2,
      name: "Arjun Kumar",
      location: "Kerala", 
      sport: "Long Jump",
      score: 2731,
      change: 3,
      badge: "Elite",
      avatar: "AK",
      improvement: "+8%"
    },
    {
      rank: 3,
      name: "Meera Patel",
      location: "Gujarat",
      sport: "Hurdles",
      score: 2689,
      change: -1,
      badge: "Rising Star",
      avatar: "MP",
      improvement: "+22%"
    },
    {
      rank: 4,
      name: "Ravi Singh",
      location: "Punjab",
      sport: "High Jump",
      score: 2654,
      change: 2,
      badge: "Competitor",
      avatar: "RS",
      improvement: "+5%"
    },
    {
      rank: 5,
      name: "Ananya Reddy",
      location: "Telangana",
      sport: "Pole Vault",
      score: 2598,
      change: -2,
      badge: "Talented",
      avatar: "AR",
      improvement: "+18%"
    },
    {
      rank: 6,
      name: "Kiran Joshi",
      location: "Rajasthan",
      sport: "Shot Put",
      score: 2567,
      change: 5,
      badge: "Competitor",
      avatar: "KJ",
      improvement: "+12%"
    },
    {
      rank: 7,
      name: "Sneha Gupta",
      location: "Uttar Pradesh",
      sport: "Javelin",
      score: 2543,
      change: 1,
      badge: "Rising Star",
      avatar: "SG",
      improvement: "+9%"
    },
    {
      rank: 8,
      name: "Vikram Das",
      location: "West Bengal",
      sport: "Hammer Throw",
      score: 2521,
      change: -3,
      badge: "Talented",
      avatar: "VD",
      improvement: "+6%"
    }
  ];

  const challenges = [
    {
      title: "Sprint Speed Challenge",
      participants: 1247,
      timeLeft: "5 days",
      prize: "₹50,000"
    },
    {
      title: "Agility Master",
      participants: 892,
      timeLeft: "12 days", 
      prize: "₹25,000"
    },
    {
      title: "Endurance Champion",
      participants: 1567,
      timeLeft: "18 days",
      prize: "₹75,000"
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <div className="w-6 h-6 flex items-center justify-center text-lg font-bold text-muted-foreground">#{rank}</div>;
    }
  };

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case 'Champion': return 'default';
      case 'Elite': return 'secondary';
      case 'Rising Star': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <section id="leaderboard" className="min-h-screen py-20 px-4">
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
              Global
            </span>{" "}
            Leaderboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Compete with athletes worldwide. Track rankings, join challenges, 
            and celebrate achievements in our global sports community.
          </p>
        </motion.div>

        {/* AI Analysis Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden">
            <img 
              src={aiAnalysis} 
              alt="AI-powered performance analysis visualization" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80" />
            <div className="absolute inset-0 flex items-center justify-center text-center text-white">
              <div className="space-y-4">
                <h3 className="text-3xl md:text-4xl font-bold">AI-Powered Rankings</h3>
                <p className="text-lg md:text-xl opacity-90 max-w-2xl">
                  Performance scores calculated using advanced AI analysis of technique, speed, agility, and improvement metrics
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="xl:col-span-2"
          >
            <Card className="glass-card">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Global Rankings
                  </CardTitle>
                  
                  <div className="flex flex-wrap gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input 
                        placeholder="Search athletes..." 
                        className="pl-10 w-48"
                      />
                    </div>
                    
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overall">Overall</SelectItem>
                        <SelectItem value="sprint">Sprint</SelectItem>
                        <SelectItem value="jump">Jump Events</SelectItem>
                        <SelectItem value="throw">Throwing</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <AnimatePresence>
                    {leaderboardData.map((athlete, index) => (
                      <motion.div
                        key={athlete.rank}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 + index * 0.05 }}
                        className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-lg ${
                          athlete.rank <= 3 
                            ? 'bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20' 
                            : 'bg-muted/20 border-border hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12">
                              {getRankIcon(athlete.rank)}
                            </div>
                            
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${athlete.name}`} />
                              <AvatarFallback>{athlete.avatar}</AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{athlete.name}</h4>
                                <Badge variant={getBadgeVariant(athlete.badge)}>
                                  {athlete.badge}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{athlete.sport}</span>
                                <span>•</span>
                                <span>{athlete.location}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                              {athlete.score.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className={`${
                                athlete.change > 0 ? 'text-green-400' : 
                                athlete.change < 0 ? 'text-red-400' : 'text-gray-400'
                              }`}>
                                {athlete.change > 0 ? '↗' : athlete.change < 0 ? '↘' : '→'} {Math.abs(athlete.change)}
                              </span>
                              <span className="text-muted-foreground">
                                {athlete.improvement}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline">
                    Load More Athletes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Active Challenges */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Active Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {challenges.map((challenge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="p-4 border border-border rounded-lg hover:border-primary/30 transition-colors cursor-pointer"
                  >
                    <h4 className="font-semibold mb-3">{challenge.title}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Participants:</span>
                        <span className="font-medium">{challenge.participants.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time Left:</span>
                        <span className="font-medium">{challenge.timeLeft}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Prize Pool:</span>
                        <span className="font-medium text-primary">{challenge.prize}</span>
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
                  Global Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                    156
                  </div>
                  <p className="text-sm text-muted-foreground">Countries Participating</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-primary">2.4M+</div>
                    <div className="text-xs text-muted-foreground">Total Athletes</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-secondary">15.7M</div>
                    <div className="text-xs text-muted-foreground">Analyses Done</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-purple-400">47K</div>
                    <div className="text-xs text-muted-foreground">Daily Active</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-orange-400">892</div>
                    <div className="text-xs text-muted-foreground">Live Challenges</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Ranking */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Your Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">#342</div>
                  <div className="text-sm text-muted-foreground">Global Rank</div>
                  <div className="text-xs text-green-400 mt-1">↗ +23 this week</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Score to next rank:</span>
                    <span className="font-medium">147 points</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" style={{ width: '73%' }} />
                  </div>
                </div>
                
                <Button className="w-full btn-hero">
                  <Trophy className="w-4 h-4 mr-2" />
                  Boost Your Rank
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}