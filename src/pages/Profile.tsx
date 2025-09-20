import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Trophy, Plus, X, Save, Loader2 } from 'lucide-react';

const POPULAR_SPORTS = [
  'Football', 'Basketball', 'Soccer', 'Baseball', 'Tennis', 'Volleyball', 
  'Swimming', 'Track & Field', 'Golf', 'Wrestling', 'Boxing', 'Cricket',
  'Hockey', 'Rugby', 'Badminton', 'Table Tennis', 'Cycling', 'Running',
  'Gymnastics', 'Martial Arts', 'Rock Climbing', 'Skateboarding'
];

interface ProfileProps {
  onNavigate: (page: string) => void;
}

const Profile = ({ onNavigate }: ProfileProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sports, setSports] = useState<string[]>([]);
  const [customSport, setCustomSport] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserSports();
    }
  }, [user]);

  const fetchUserSports = async () => {
    if (!user) return;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('sports')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      if (profile?.sports) {
        setSports(profile.sports);
      }
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  };

  const saveSports = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ sports })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your sports have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving sports:', error);
      toast({
        title: "Error",
        description: "Failed to update your sports. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSport = (sport: string) => {
    if (!sports.includes(sport)) {
      setSports([...sports, sport]);
    }
  };

  const removeSport = (sportToRemove: string) => {
    setSports(sports.filter(sport => sport !== sportToRemove));
  };

  const addCustomSport = () => {
    if (customSport.trim() && !sports.includes(customSport.trim())) {
      setSports([...sports, customSport.trim()]);
      setCustomSport('');
      setShowCustomInput(false);
    }
  };

  const availableSports = POPULAR_SPORTS.filter(sport => !sports.includes(sport));

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account information and sports preferences</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Account Information */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Your basic account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={user?.name || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={user?.role || ''}
                    disabled
                    className="bg-muted capitalize"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sports Management */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  My Sports
                </CardTitle>
                <CardDescription>
                  Add the sports you play or are interested in
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Sports */}
                <div>
                  <Label className="text-sm font-medium">Your Sports</Label>
                  <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] p-2 border rounded-md bg-background">
                    {sports.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No sports added yet</p>
                    ) : (
                      sports.map((sport) => (
                        <Badge
                          key={sport}
                          variant="secondary"
                          className="flex items-center gap-1 bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          {sport}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-destructive"
                            onClick={() => removeSport(sport)}
                          />
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                {/* Add Custom Sport */}
                <div>
                  {showCustomInput ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter sport name..."
                        value={customSport}
                        onChange={(e) => setCustomSport(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCustomSport()}
                      />
                      <Button onClick={addCustomSport} size="sm">
                        Add
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCustomInput(false);
                          setCustomSport('');
                        }}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setShowCustomInput(true)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Custom Sport
                    </Button>
                  )}
                </div>

                {/* Popular Sports */}
                {availableSports.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Popular Sports</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availableSports.slice(0, 8).map((sport) => (
                        <Badge
                          key={sport}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => addSport(sport)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {sport}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <Button
                  onClick={saveSports}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Sports
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;