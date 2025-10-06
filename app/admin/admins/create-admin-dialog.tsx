// app/admin/admins/create-admin-dialog.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Save, Loader2, Eye, EyeOff,CircleUse } from "lucide-react"; // Import Eye and EyeOff icons
import { useSession } from "next-auth/react";

// Define the Zod schema for creating a new Admin. All fields are required.
const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  role: z.enum(["MAIN_ADMIN", "REGISTRAR_ADMIN"], {
    required_error: "Admin role is required.",
    invalid_type_error: "Invalid admin role.",
  }),
});

type CreateAdminFormValues = z.infer<typeof formSchema>;

// Define props for the dialog component
interface CreateAdminDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateAdminDialog = ({ isOpen, onClose, onSuccess }: CreateAdminDialogProps) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const form = useForm<CreateAdminFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "REGISTRAR_ADMIN",
    },
  });

  const onSubmit = async (values: CreateAdminFormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/admins', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create administrator.");
      }

      const newAdmin = await res.json();
      toast.success("Administrator created successfully!", {
        description: `Admin "${newAdmin.fullName}" has been added with the role of "${newAdmin.role}".`,
      });

      onSuccess(); // Call the parent's onSuccess function to close and refresh
      form.reset(); // Reset the form fields
    } catch (error: any) {
      console.error("Error creating admin:", error);
      toast.error("Creation Failed", {
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 ">
            <Save className="h-5 w-5 text-green-600" /> Create New Admin
          </DialogTitle>
          <DialogDescription>
            Fill in the details to create a new administrator account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ato..Tesema" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Tesema123@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password field with show/hide toggle */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    {/* Add relative positioning to the container */}
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="********" 
                        {...field}
                      />
                      {/* Button to toggle password visibility */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-1/2 -translate-y-1/2 h-full px-3 py-1.5"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select admin role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {session?.user?.role === "MAIN_ADMIN" && (
                          <SelectItem value="MAIN_ADMIN"> Main Admin</SelectItem>
                      )}
                      <SelectItem value="REGISTRAR_ADMIN">Registrar Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Create Admin
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdminDialog;
