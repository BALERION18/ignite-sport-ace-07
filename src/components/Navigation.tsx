import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, Users, Trophy, BarChart, LogOut, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export default function Navigation({ activePage, onPageChange }: NavigationProps) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const allNavigationItems = [
    { id: 'home', label: 'Home', icon: Zap, roles: ['athlete', 'coach'] },
    { id: 'analysis', label: 'AI Analysis', icon: BarChart, roles: ['athlete', 'coach'] },
    { id: 'athlete', label: 'Athlete Hub', icon: Users, roles: ['athlete'] },
    { id: 'coach', label: 'Coach Dashboard', icon: Trophy, roles: ['coach'] },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, roles: ['athlete', 'coach'] },
  ];

  // Filter navigation items based on user role
  const navigationItems = allNavigationItems.filter(item => 
    item.roles.includes(user?.role || 'athlete')
  );

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass m-4 rounded-3xl shadow-2xl border border-white/20">
        <div className="flex items-center justify-between px-8 py-5">
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary via-accent to-secondary rounded-2xl flex items-center justify-center shadow-lg animate-glow">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Esylium
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Talent Discovery Platform
              </span>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-black/20 rounded-2xl p-2 backdrop-blur-sm">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`w-36 h-12 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group flex items-center justify-center ${
                    activePage === item.id
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' 
                      : 'text-foreground hover:bg-white/10 hover:text-primary'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center space-x-2 relative z-10">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-sm truncate">{item.label}</span>
                  </div>
                  {activePage !== item.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </motion.button>
              ))}
            </div>
            
            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost" 
                  className="w-36 h-12 px-3 py-2 rounded-xl transition-all duration-300 relative overflow-hidden group bg-black/20 backdrop-blur-sm hover:bg-white/10"
                >
                  <div className="flex items-center justify-between w-full relative z-10">
                    <div className="flex items-center space-x-2 min-w-0">
                      <Users className="w-5 h-5 flex-shrink-0 text-foreground" />
                      <span className="font-medium text-base text-foreground">{user?.name}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 flex-shrink-0 ml-1 text-foreground" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-50 bg-background border border-border shadow-lg">
                <DropdownMenuLabel>Account Information</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <User className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{user?.name}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Trophy className="mr-2 h-4 w-4" />
                  <span className="capitalize">{user?.role}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-lg" />
            <motion.div
              className="relative top-20 mx-4 glass-card rounded-2xl p-6"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                {/* User Info */}
                <div className="flex items-center space-x-3 p-3 bg-secondary/20 rounded-xl">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{user?.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                </div>

                {/* Navigation Items */}
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activePage === item.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-foreground hover:bg-primary/10'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
                
                {/* Logout Button */}
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navigationItems.length * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}