import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { User, Trophy, Mail, Lock } from 'lucide-react';
import loginSportsBg from '@/assets/login-sports-bg.jpg';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('athlete');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(email, password, selectedRole);
      if (success) {
        onLoginSuccess();
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role as UserRole);
    setEmail('');
    setPassword('');
    setError('');
  };

  const demoCredentials = {
    athlete: { email: 'athlete@demo.com', password: 'demo123' },
    coach: { email: 'coach@demo.com', password: 'demo123' }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${loginSportsBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 drop-shadow-lg">Welcome Back</h1>
          <p className="text-muted-foreground drop-shadow">Sign in to your sports analysis platform</p>
        </div>

        <Card className="glass-card shadow-2xl border-0">
          <CardHeader>
            <CardTitle className="text-center">Choose Your Role</CardTitle>
            <CardDescription className="text-center">
              Select whether you're logging in as an athlete or coach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedRole} onValueChange={handleRoleChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="athlete" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Athlete
                </TabsTrigger>
                <TabsTrigger value="coach" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Coach
                </TabsTrigger>
              </TabsList>

              <TabsContent value="athlete" className="mt-0">
                <div className="bg-secondary/30 p-3 rounded-lg mb-4 text-sm">
                  <p className="font-medium text-secondary-foreground">Demo Athlete Account:</p>
                  <p className="text-muted-foreground">Email: athlete@demo.com</p>
                  <p className="text-muted-foreground">Password: demo123</p>
                </div>
              </TabsContent>

              <TabsContent value="coach" className="mt-0">
                <div className="bg-secondary/30 p-3 rounded-lg mb-4 text-sm">
                  <p className="font-medium text-secondary-foreground">Demo Coach Account:</p>
                  <p className="text-muted-foreground">Email: coach@demo.com</p>
                  <p className="text-muted-foreground">Password: demo123</p>
                </div>
              </TabsContent>
            </Tabs>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing In...' : `Sign In as ${selectedRole === 'athlete' ? 'Athlete' : 'Coach'}`}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const creds = demoCredentials[selectedRole];
                  setEmail(creds.email);
                  setPassword(creds.password);
                }}
              >
                Use Demo Credentials
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;