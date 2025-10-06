// app/admin/users/[userId]/edit/page.tsx
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeftCircle, Save,  UserPen } from "lucide-react";
import { UserApplicant } from '../../columns'; // Import the UserApplicant type

// Define the Zod schema for the frontend form for editing.
// This should match your backend's update schema for User.
// Note: Password is optional for edit, as it's not always changed.
const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required.").optional(), // Optional for patch, but required if provided
  fatherName: z.string().nullable().optional(),
  grandfatherName: z.string().nullable().optional(),
  isBusiness: z.boolean().nullable().optional(),
  entityName: z.string().nullable().optional(),
  tin: z.string().nullable().optional(),
  businessLicenseNo: z.string().nullable().optional(),
  emailAddress: z.string().email("Invalid email address.").nullable().optional(),
  password: z.string().min(8, "Password must be at least 8 characters long.").optional(), // Optional for edit
  primaryPhoneNumber: z.string().min(10, "Phone number must be at least 10 digits.").nullable().optional(),
  alternativePhoneNumber: z.string().nullable().optional(),
  gender: z.enum(["Male", "Female", "Other"]).nullable().optional(),
  idNumber: z.string().nullable().optional(),
  residentialAddress: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  woredaKebele: z.string().nullable().optional(),
  houseNumber: z.string().nullable().optional(),
  associationName: z.string().nullable().optional(),
  membershipNumber: z.string().nullable().optional(),
  preferredVehicleType: z.string().nullable().optional(),
  vehicleQuantity: z.preprocess((val) => {
    if (typeof val === 'string' && val.trim() === '') return undefined;
    if (typeof val === 'number') return val;
    return undefined;
  }, z.number().int().min(0).nullable().optional()),
  intendedUse: z.string().nullable().optional(),
}).superRefine((data, ctx) => {
    // Add any specific conditional refinements needed for updates here.
    // E.g., if primaryPhoneNumber is present, it must be valid.
    if (data.primaryPhoneNumber !== null && data.primaryPhoneNumber !== undefined && data.primaryPhoneNumber.length > 0 && data.primaryPhoneNumber.length < 10) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Primary phone number must be at least 10 digits.",
            path: ["primaryPhoneNumber"],
        });
    }
    // If business is true, certain fields might become required.
    if (data.isBusiness && (!data.entityName || !data.tin)) {
        if (!data.entityName) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Entity name is required for business applicants.",
                path: ["entityName"],
            });
        }
        if (!data.tin) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "TIN is required for business applicants.",
                path: ["tin"],
            });
        }
    }
});

type EditUserFormValues = z.infer<typeof formSchema>;

interface EditUserPageProps {
  params: {
    userId: string; // The ID will come from the URL
  };
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = params.userId;

  const [isLoading, setIsLoading] = useState(true);
  const [applicantData, setApplicantData] = useState<UserApplicant | null>(null);

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "", // Will be filled from fetched data
      fatherName: null,
      grandfatherName: null,
      isBusiness: false,
      entityName: null,
      tin: null,
      businessLicenseNo: null,
      emailAddress: null,
      password: "", // Password field is for optional change
      primaryPhoneNumber: null,
      alternativePhoneNumber: null,
      gender: null,
      idNumber: null,
      residentialAddress: null,
      region: null,
      city: null,
      woredaKebele: null,
      houseNumber: null,
      associationName: null,
      membershipNumber: null,
      preferredVehicleType: null,
      vehicleQuantity: null,
      intendedUse: null,
    },
    mode: "onChange", // Validate on change for better UX
  });

  const isBusinessApplicant = form.watch("isBusiness");

  // Fetch existing applicant data
  useEffect(() => {
    if (status === "loading") return;

    // Authorization check
    if (!session?.user || !['MAIN_ADMIN', 'REGISTRAR_ADMIN'].includes(session.user.role)) {
      toast.error("Access Denied", {
        description: "You do not have permission to edit user details.",
      });
      router.push("/admin/dashboard");
      return;
    }

    const fetchApplicant = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/users/${userId}`);
        if (!res.ok) {
          if (res.status === 404) {
              throw new Error("Applicant not found.");
          }
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch applicant details.");
        }
        const data: UserApplicant = await res.json();
        setApplicantData(data);
        // Set form default values from fetched data
        form.reset({
          fullName: data.fullName,
          fatherName: data.fatherName,
          grandfatherName: data.grandfatherName,
          isBusiness: data.isBusiness,
          entityName: data.entityName,
          tin: data.tin,
          businessLicenseNo: data.businessLicenseNo,
          emailAddress: data.emailAddress,
          // password: "", // Do not pre-fill password for security
          primaryPhoneNumber: data.primaryPhoneNumber,
          alternativePhoneNumber: data.alternativePhoneNumber,
          gender: data.gender,
          idNumber: data.idNumber,
          residentialAddress: data.residentialAddress,
          region: data.region,
          city: data.city,
          woredaKebele: data.woredaKebele,
          houseNumber: data.houseNumber,
          associationName: data.associationName,
          membershipNumber: data.membershipNumber,
          preferredVehicleType: data.preferredVehicleType,
          vehicleQuantity: data.vehicleQuantity,
          intendedUse: data.intendedUse,
          // role is not editable for an existing user via this form
        });
      } catch (error: any) {
        console.error("Error fetching applicant:", error);
        toast.error("Error loading applicant", {
          description: error.message || "Could not load applicant details.",
        });
        router.push("/admin/users"); // Redirect back to list if error
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchApplicant();
    }
  }, [userId, session, status, router, form]); // Added 'form' to dependency array for reset

  const onSubmit = async (values: EditUserFormValues) => {
    setIsLoading(true);
    try {
      // Create a payload that only includes changed or non-empty fields
      const payload: Record<string, any> = {};
      for (const key in values) {
          const typedKey = key as keyof EditUserFormValues; // Type assertion
          const value = values[typedKey];
          const defaultValue = form.formState.defaultValues?.[typedKey];

          // Only include fields that have changed from their initial fetched values
          // Or if they are specifically set (e.g., password field, even if default is empty)
          if (value !== defaultValue || (typedKey === 'password' && value !== '')) {
              // Handle specific null/undefined assignments for Prisma
              if (value === "" || value === undefined) {
                  payload[typedKey] = null;
              } else {
                  payload[typedKey] = value;
              }
          }
      }

      // Special handling for password: Only send if it's provided (not empty string)
      if (values.password === "") {
        delete payload.password; // Do not send empty password
      }

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update user.");
      }

      toast.success("User Updated", {
        description: `The user details for ${values.fullName} have been successfully updated.`,
      });
      router.push("/admin/users"); // Redirect back to the user list
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error("Update Failed", {
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render loading state while data is being fetched or submitted
  if (isLoading || status === "loading") {
    return <CustomLoader message="Loading user details..." emoji="👤" />;
  }
  
  if (!applicantData) {
      return (
          <div className="min-h-screen p-6 text-center text-red-600 bg-gray-50 flex flex-col items-center justify-center">
              <h2 className="text-xl font-semibold mb-2">Error</h2>
              <p className="mb-4">User not found or could not be loaded.</p>
              <Button onClick={() => router.push('/admin/users')} className="mt-4">
                  Go Back to User List
              </Button>
          </div>
      );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800">
          <UserPen className="inline-block mr-3 text-green-600" />
          Edit Applicant: {applicantData.fullName}
        </h1>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/admin/users")}>
                <ArrowLeftCircle className="mr-2 h-4 w-4" /> Back to Users
            </Button>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto shadow-sm">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Update the details for the selected user.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emailAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Email Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primaryPhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Primary Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="alternativePhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternative Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Alternative Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password */}
              <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password (Leave blank to keep current)</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="New Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
              />

              {/* Business Information (Conditional) */}
              <div className="flex items-center space-x-2">
                <Label htmlFor="isBusiness">Is this a business applicant?</Label>
                <Switch
                  id="isBusiness"
                  checked={isBusinessApplicant || false}
                  onCheckedChange={(checked) => form.setValue("isBusiness", checked)}
                />
              </div>

              {isBusinessApplicant && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="entityName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entity Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Entity Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TIN</FormLabel>
                        <FormControl>
                          <Input placeholder="TIN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessLicenseNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business License Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Business License Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? "Updating..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}