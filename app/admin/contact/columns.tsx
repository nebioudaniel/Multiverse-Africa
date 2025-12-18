// app/admin/messages/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Eye, Trash2, AlertTriangle, X, Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
// 🎯 FIX 1: Change to NAMED IMPORT { deleteContactMessage } 
// Assuming you have moved this function to a separate utility file named 'actions'.
// If not, change './actions' back to './page', but the build error in page.tsx will return.
import { deleteContactMessage } from "./actions"; 

// 1. Define the type for the message structure
export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  interestedIn: string;
  phone: string | null;
  message: string;
  isRead: boolean;
  createdAt: string; 
};

// 2. Define the function to create columns
export const createMessageColumns = (
  markAsRead: (id: string) => Promise<void>,
  fetchMessages: () => void // Function to refresh the list after deletion
): ColumnDef<ContactMessage>[] => {
  
  // Custom Cell Component for View Action with Dialog
  const ViewActionCell = ({ row }: { row: { original: ContactMessage } }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const msg = row.original;

    const handleView = () => {
      setIsModalOpen(true);
      if (!msg.isRead) {
        markAsRead(msg.id); // Mark as read when opening the modal
      }
    };

    return (
      <>
        <Button 
          variant="ghost" 
          onClick={handleView}
          className="text-indigo-600 hover:text-indigo-900"
        >
          <Eye className="h-4 w-4 mr-1"/> View
        </Button>

        {/* Message View Dialog (Modal) */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle className="text-2xl">
                  Message from {msg.name} 
                  {msg.isRead ? '' : <span className="text-red-500 ml-2">(New)</span>}
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm text-gray-700">
                  <p><span className="font-semibold">Email:</span> {msg.email}</p>
                  <p><span className="font-semibold">Interest:</span> {msg.interestedIn}</p>
                  {msg.phone && <p><span className="font-semibold">Phone:</span> {msg.phone}</p>}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 border-t border-b h-72 overflow-y-auto bg-gray-50 p-4 rounded-md">
                <p className="whitespace-pre-wrap text-gray-800">{msg.message}</p>
              </div>

              <DialogFooter>
                <p className="text-sm text-gray-500 mr-auto">
                  Received: {new Date(msg.createdAt).toLocaleString()}
                </p>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  <X className="h-4 w-4 mr-2" /> Close
                </Button>
              </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  };
  
  // Custom Cell Component for Delete Action with AlertDialog
  const DeleteActionCell = ({ row }: { row: { original: ContactMessage } }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const msg = row.original;

    const handleDelete = async () => {
        setIsDeleting(true);
        
        // 🎯 FIX 2: Add 'await' to wait for the async function to complete
        await deleteContactMessage(msg.id, fetchMessages); 
        
        setIsDeleting(false);
    };

    return (
      <div className="text-center">
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center text-red-600">
                  <AlertTriangle className="h-6 w-6 mr-2" /> 
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the message from **{msg.name}** and remove the data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete} 
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete Message'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  // The actual Column Definitions
  return [
    {
      accessorKey: "isRead",
      header: "Status",
      cell: ({ row }) => {
        const isRead = row.getValue("isRead");
        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isRead ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-700'}`}>
            {isRead ? (
              <span className="flex items-center"><CheckCircle className="h-3 w-3 mr-1"/> Read</span>
            ) : (
              <span className="flex items-center"><Clock className="h-3 w-3 mr-1"/> New</span>
            )}
          </span>
        );
      },
      // Sorting: Unread messages appear first (false < true)
      sortingFn: (rowA, rowB, columnId) => {
        const valA = rowA.getValue(columnId) as boolean;
        const valB = rowB.getValue(columnId) as boolean;
        if (!valA && valB) return -1;
        if (valA && !valB) return 1;
        return 0;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "interestedIn",
      header: "Interest",
    },
    {
      accessorKey: "createdAt",
      header: "Received",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
      // Use original date string for proper sorting
      sortingFn: (rowA, rowB, columnId) => {
        const dateA = new Date(rowA.original.createdAt).getTime();
        const dateB = new Date(rowB.original.createdAt).getTime();
        return dateA - dateB;
      },
    },
    {
      id: "view",
      header: "View",
      enableSorting: false,
      cell: ViewActionCell,
    },
    {
      id: "delete",
      header: "Delete",
      enableSorting: false,
      cell: DeleteActionCell,
    },
  ];
};