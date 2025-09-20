import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Login from './Login';
import Home from './Home';
import AIAnalysis from './AIAnalysis';
import Athlete from './Athlete';
import Coach from './Coach';
import LeaderboardPage from './LeaderboardPage';
import Profile from './Profile';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const [activePage, setActivePage] = useState('home');

  const handlePageChange = (page: string) => {
    setActivePage(page);
  };

  const handleLoginSuccess = () => {
    setActivePage('home');
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home onNavigate={handlePageChange} />;
      case 'analysis':
        return <AIAnalysis />;
      case 'athlete':
        return <Athlete onNavigate={handlePageChange} />;
      case 'coach':
        return <Coach onNavigate={handlePageChange} />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'profile':
        return <Profile onNavigate={handlePageChange} />;
      default:
        return <Home onNavigate={handlePageChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        activePage={activePage} 
        onPageChange={handlePageChange} 
      />
      
      <main className="relative">
        {renderPage()}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
