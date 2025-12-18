//@ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import CustomLoader from "@/components/ui/custom-loader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeftCircle, Save, UserCog } from "lucide-react";

// Define the Zod schema for updating an Admin.
const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required.").optional(),
  email: z.string().email("Invalid email address.").optional(),
  password: z.string().min(8, "Password must be at least 8 characters long.").optional().or(z.literal("")),
  // FIX: Corrected z.enum syntax for Zod v3+ compatibility
  role: z.enum(["MAIN_ADMIN", "REGISTRAR_ADMIN"], {
    message: "Invalid admin role selected.", // Use 'message' for general enum error
  }).optional(),
});

type EditAdminFormValues = z.infer<typeof formSchema>;

interface EditAdminPageProps {
  params: {
    adminId: string;
  };
}

// 💡 Updated AdminData type to match the API response
interface AdminData {
    id: string;
    fullName: string;
    email: string;
    role: "MAIN_ADMIN" | "REGISTRAR_ADMIN";
    createdAt: string;
    updatedAt: string;
}

// FIX: Using 'any' in the function signature to bypass the Next.js/TS constraint error
export default function EditAdminPage({ params }: any) { 
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // FIX: Cast params to the correct type immediately for safety within the function
  const { adminId } = params as EditAdminPageProps['params']; 

  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState<AdminData | null>(null);

  const form = useForm<EditAdminFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "REGISTRAR_ADMIN",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user || session.user.role !== 'MAIN_ADMIN') {
      toast.error("Access Denied", {
        description: "You do not have permission to edit administrator details.",
      });
      router.push("/admin/dashboard");
      return;
    }

    const fetchAdmin = async () => {
      setIsLoading(true);
      try {
        // 💡 Use the correct API endpoint for admins
        const res = await fetch(`/api/admin/admins/${adminId}`);
        if (!res.ok) {
          if (res.status === 404) {
              throw new Error("Administrator not found.");
          }
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch administrator details.");
        }
        const data: AdminData = await res.json();
        setAdminData(data);
        form.reset({
          fullName: data.fullName,
          email: data.email,
          role: data.role,
          password: "",
        });
      } catch (error: unknown) { 
        const errorMessage = error instanceof Error ? error.message : "Could not load administrator details.";
        console.error("Error fetching admin:", error);
        toast.error("Error loading administrator", {
          description: errorMessage,
        });
        router.push("/admin/admins");
      } finally {
        setIsLoading(false);
      }
    };

    if (adminId) {
      fetchAdmin();
    }
  }, [adminId, session, status, router, form]);

  const onSubmit = async (values: EditAdminFormValues) => {
    setIsLoading(true);
    try {
      // Replaced Record<string, any> with Record<string, unknown> for type safety
      const payload: Record<string, unknown> = {}; 
      const defaultValues = form.formState.defaultValues;

      for (const key of Object.keys(values)) {
        const typedKey = key as keyof EditAdminFormValues;
        // 💡 Improved logic to only send changed fields
        if (values[typedKey] !== defaultValues?.[typedKey] && typedKey !== 'password') {
            payload[typedKey] = values[typedKey];
        }
      }

      if (values.password && values.password !== "") {
          payload.password = values.password;
      }
      
      const res = await fetch(`/api/admin/admins/${adminId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update administrator.");
      }

      toast.success("Administrator updated successfully!", {
        description: `Admin "${values.fullName || adminData?.fullName}" details saved.`,
      });

      router.push("/admin/admins");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
      console.error("Error updating admin:", error);
      toast.error("Update Failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return <CustomLoader message="Loading administrator details..." emoji="⚙️" />;
  }

  if (!adminData) {
      return (
          <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 text-red-600">
              <p>Administrator not found or access denied.</p>
              <Button onClick={() => router.push("/admin/admins")} className="ml-4">
                Back to Administrators
              </Button>
          </div>
      );
  }

  const isSelf = session?.user?.id === adminId;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">
          <UserCog className="inline-block mr-3 text-blue-600" />
          Edit Admin: {adminData.fullName}
        </h1>
        <Button variant="outline" onClick={() => router.push("/admin/admins")}>
          <ArrowLeftCircle className="mr-2 h-4 w-4" /> Back to Administrators
        </Button>
      </div>

      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Administrator Details</CardTitle>
          <CardDescription>
            Modify the administrator&apos; profile information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Admin Name" {...field} />
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
                      <Input type="email" placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password (Leave blank to keep current)</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} value={field.value || ""} />
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSelf || (session?.user?.role !== 'MAIN_ADMIN')}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select admin role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="REGISTRAR_ADMIN">Registrar Admin</SelectItem>
                        {session?.user?.role === 'MAIN_ADMIN' && (
                            <SelectItem value="MAIN_ADMIN">Main Admin</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    {isSelf && session?.user?.role === 'MAIN_ADMIN' && (
                        <CardDescription className="text-orange-500">
                            You cannot change your own role from this interface.
                        </CardDescription>
                    )}
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" /> {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}