import { useState } from 'react';
import { Card } from '@/components/ui/card';
import ChatSidebar from './ChatSidebar';
import ChatInterface from './ChatInterface';

interface ChatContact {
  id: string;
  name: string;
  role: 'coach' | 'athlete';
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
}

export default function ChatContainer() {
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);

  const handleContactSelect = (contact: ChatContact) => {
    setSelectedContact(contact);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex">
      <ChatSidebar
        selectedContactId={selectedContact?.id}
        onContactSelect={handleContactSelect}
      />
      
      <div className="flex-1">
        <ChatInterface
          recipientId={selectedContact?.id}
          recipientName={selectedContact?.name}
          recipientRole={selectedContact?.role}
        />
      </div>
    </div>
  );
}