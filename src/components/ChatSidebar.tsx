import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageCircle, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface ChatContact {
  id: string;
  name: string;
  role: 'coach' | 'athlete';
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
}

interface ChatSidebarProps {
  selectedContactId?: string;
  onContactSelect: (contact: ChatContact) => void;
}

export default function ChatSidebar({ selectedContactId, onContactSelect }: ChatSidebarProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock contacts based on user role
  const getContacts = (): ChatContact[] => {
    if (user?.role === 'coach') {
      // Coach sees athletes
      return [
        {
          id: '1',
          name: 'John Smith',
          role: 'athlete',
          lastMessage: 'Should I focus on any specific drills before our next meeting?',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          unreadCount: 2,
          isOnline: true
        },
        {
          id: '3',
          name: 'Mike Wilson',
          role: 'athlete',
          lastMessage: 'Thanks for the training plan!',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          unreadCount: 0,
          isOnline: true
        },
        {
          id: '4',
          name: 'Emma Davis',
          role: 'athlete',
          lastMessage: 'Can we reschedule tomorrow\'s session?',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          unreadCount: 1,
          isOnline: false
        }
      ];
    } else {
      // Athlete sees coach
      return [
        {
          id: '2',
          name: 'Sarah Johnson',
          role: 'coach',
          lastMessage: 'Yes, practice your explosive starts. I\'ll send you a video of the drill we discussed.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          unreadCount: 1,
          isOnline: true
        }
      ];
    }
  };

  const contacts = getContacts();

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      return `${days}d`;
    }
  };

  return (
    <div className="w-80 border-r border-border bg-background/50 backdrop-blur-sm flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Button variant="ghost" size="icon">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${user?.role === 'coach' ? 'athletes' : 'coaches'}...`}
            className="pl-10"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length > 0 ? (
          <div className="p-2">
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => onContactSelect(contact)}
                className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
                  selectedContactId === contact.id ? 'bg-primary/10 border border-primary/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`} />
                      <AvatarFallback>{contact.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {contact.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-background rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm truncate">{contact.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {contact.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(contact.timestamp)}
                        </span>
                        {contact.unreadCount > 0 && (
                          <Badge className="bg-primary text-primary-foreground text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                            {contact.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-tight">
                      {contact.lastMessage}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">No conversations</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'No matches found' : `Start chatting with ${user?.role === 'coach' ? 'athletes' : 'your coach'}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}