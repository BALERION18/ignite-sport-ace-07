import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Smile, Phone, Video, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import EmojiPicker from './EmojiPicker';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'coach' | 'athlete';
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatInterface {
  recipientId?: string;
  recipientName?: string;
  recipientRole?: 'coach' | 'athlete';
}

export default function ChatInterface({ recipientId, recipientName, recipientRole }: ChatInterface) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock messages for demo
  useEffect(() => {
    if (recipientId) {
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: recipientId,
          senderName: recipientName || 'Unknown',
          senderRole: recipientRole || 'athlete',
          content: "Hi! I wanted to discuss my training progress from yesterday's session.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          isRead: true
        },
        {
          id: '2',
          senderId: user?.id || '',
          senderName: user?.name || '',
          senderRole: user?.role || 'athlete',
          content: "Great! I reviewed your analysis results. Your sprint technique has improved significantly. Let's focus on your start position in the next session.",
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
          isRead: true
        },
        {
          id: '3',
          senderId: recipientId,
          senderName: recipientName || 'Unknown',
          senderRole: recipientRole || 'athlete',
          content: "That's encouraging! I felt more confident in my form. Should I focus on any specific drills before our next meeting?",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          isRead: true
        },
        {
          id: '4',
          senderId: user?.id || '',
          senderName: user?.name || '',
          senderRole: user?.role || 'athlete',
          content: "Yes, practice your explosive starts. I'll send you a video of the drill we discussed. Also, make sure to warm up properly.",
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          isRead: false
        }
      ];
      setMessages(mockMessages);
    }
  }, [recipientId, recipientName, recipientRole, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !recipientId) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      senderName: user?.name || '',
      senderRole: user?.role || 'athlete',
      content: newMessage.trim(),
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing indicator and response (for demo)
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: recipientId,
        senderName: recipientName || 'Unknown',
        senderRole: recipientRole || 'athlete',
        content: "Thanks for the message! I'll get back to you soon.",
        timestamp: new Date(),
        isRead: false
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = newMessage.slice(0, start) + emoji + newMessage.slice(end);
      setNewMessage(newText);
      
      // Set cursor position after emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setNewMessage(prev => prev + emoji);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!recipientId) {
    return (
      <div className="h-full flex items-center justify-center text-center p-8">
        <div>
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
          <p className="text-muted-foreground">
            Choose a {user?.role === 'coach' ? 'athlete' : 'coach'} to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-background/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${recipientName}`} />
              <AvatarFallback>{recipientName?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{recipientName}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {recipientRole}
                </Badge>
                <span className="text-xs text-green-400">● Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => {
            const isOwn = message.senderId === user?.id;
            const showDate = index === 0 || 
              formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="flex justify-center mb-4">
                    <span className="text-xs text-muted-foreground bg-background px-3 py-1 rounded-full">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                )}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {!isOwn && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.senderName}`} />
                      <AvatarFallback>{message.senderName.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex gap-3"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${recipientName}`} />
              <AvatarFallback>{recipientName?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="bg-muted px-4 py-2 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" className="mb-2">
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="min-h-[40px] max-h-[120px] resize-none"
              rows={1}
            />
          </div>
          
          <EmojiPicker onEmojiSelect={handleEmojiSelect}>
            <Button variant="ghost" size="icon" className="mb-2">
              <Smile className="w-4 h-4" />
            </Button>
          </EmojiPicker>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="mb-2"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}