// ./app/admin/messages/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table"; 
import { createMessageColumns, ContactMessage } from "./columns"; 

// 🎯 FIX: Import utility functions from the new actions file
import { 
  getErrorMessage, 
  markMessageAsRead // Used in the columns definition
} from "./actions"; 


export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // This function remains here because it uses local state (setMessages and setLoading)
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/get-messages"); 
      if (res.ok) {
        const data = await res.json();
        // Sort messages: Unread first, then by date (newest first)
        const sortedMessages = data.messages.sort((a: ContactMessage, b: ContactMessage) => {
          if (!a.isRead && b.isRead) return -1;
          if (a.isRead && !b.isRead) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setMessages(sortedMessages);
      } else {
        toast.error("Failed to fetch messages.");
      }
    } catch (e: unknown) {
      const errorMessage = getErrorMessage(e);
      toast.error("Network error while fetching messages.", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Pass the required functions down to the column creation
  const columns = createMessageColumns(
    // markMessageAsRead is imported from actions.ts
    (id) => markMessageAsRead(id, setMessages), 
    fetchMessages // Pass the local refresh function for deletion
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading Messages...</span>
      </div>
    );
  }

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Mail className="h-6 w-6 mr-2 text-blue-600" />
          Customer Contact Messages
        </h1>
        <Button onClick={fetchMessages} variant="outline">
          <Loader2 className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <p className="mb-4 text-gray-700">
        Total {messages.length} messages | Unread: <span className="font-bold text-lg text-blue-600">{unreadCount}</span>
      </p>
      <Separator className="mb-6" />

      <DataTable 
        columns={columns} 
        data={messages} 
        filterColumnId="name" 
      />
    </div>
  );
}