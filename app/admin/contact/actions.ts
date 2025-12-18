// Re-add external imports needed by these functions
import { toast } from "sonner";
// Import React types for state update
import type { ContactMessage } from "./columns"; 
import type { Dispatch, SetStateAction } from "react"; 


// Helper function to safely extract an error message
export const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
        return err.message;
    }
    // Check if the error is an object with a message property
    if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
        return (err as { message: string }).message;
    }
    return "An unexpected error occurred. Please try again.";
}

// 1. Mark Message as Read
export const markMessageAsRead = async (
    id: string, 
    setMessages: Dispatch<SetStateAction<ContactMessage[]>> // Using imported React types
) => {
  try {
    const res = await fetch(`/api/admin/mark-read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      // Optimistically update the local state without re-fetching all messages
      setMessages(msgs => msgs.map(msg => 
        msg.id === id ? { ...msg, isRead: true } : msg
      ));
    } else {
      console.error("Failed to mark message as read on server.");
    }
  } catch (e: unknown) {
    console.error("Network error marking message as read:", e);
  }
};


// 2. Delete Contact Message
export const deleteContactMessage = async (id: string, fetchMessages: () => void) => { 
  try {
    const res = await fetch(`/api/admin/delete-message`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      toast.success("Message Deleted", { description: "The message was permanently removed." });
      fetchMessages(); // Refresh the list after deletion
    } else {
      // 🛑 FIX: Removed duplicate 'await'
      const errorData = await res.json(); 
      toast.error("Deletion Failed", { description: errorData.message || "Could not delete the message." });
    }
  } catch (e: unknown) {
    const errorMessage = getErrorMessage(e);
    toast.error("Network Error", { description: `Could not communicate with the server to delete the message. ${errorMessage}` });
    return false;
  }
  return true;
};