"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

import { ArrowLeftCircle, Save, UserPen } from "lucide-react";
import { UserApplicant } from "../../columns";

// Helper function to safely extract an error message
const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
        return err.message;
    }
    if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
        return (err as { message: string }).message;
    }
    return "An unexpected error occurred.";
}

// ————————————————————————————————————————
// FIXED ZOD SCHEMA — matches DB exactly
// ————————————————————————————————————————
const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  fatherName: z.string().nullable().optional(),
  grandfatherName: z.string().nullable().optional(),
  isBusiness: z.boolean().nullable().optional(),
  entityName: z.string().nullable().optional(),
  tin: z.string().nullable().optional(),
  businessLicenseNo: z.string().nullable().optional(),
  emailAddress: z.string().email("Invalid email").nullable().optional(),
  password: z.string().min(8, "Password too short").optional().or(z.literal("")),
  primaryPhoneNumber: z.string().min(10, "Phone must be ≥10 digits").nullable().optional(),
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

  // THIS WAS THE BUILD KILLER → now fixed
  vehicleQuantity: z.number().int().min(0).nullable().optional(),

  intendedUse: z.string().nullable().optional(),
}).superRefine((data, ctx) => {
  if (data.isBusiness) {
    if (!data.entityName?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Entity name required", path: ["entityName"] });
    }
    if (!data.tin?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "TIN required", path: ["tin"] });
    }
  }
});

type EditUserFormValues = z.infer<typeof formSchema>;

export default function EditUserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [applicantData, setApplicantData] = useState<UserApplicant | null>(null);

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      fatherName: null,
      grandfatherName: null,
      isBusiness: false,
      entityName: null,
      tin: null,
      businessLicenseNo: null,
      emailAddress: null,
      password: "",
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
    mode: "onChange",
  });

  const isBusinessApplicant = form.watch("isBusiness");
  // FIX: Using type assertion (as string) to satisfy the TypeScript compiler for role
  const userRole = ((session?.user as any)?.role as string) ?? "";
  
  // ————————————————————————————————————————
  // Fetch user + auth check
  // ————————————————————————————————————————
  useEffect(() => {
    if (status === "loading") return;

   if (!session?.user || !["MAIN_ADMIN", "REGISTRAR_ADMIN"].includes(userRole)) {
      toast.error("Access Denied", {
        description: "You do not have permission to edit user details.",
      });
      router.push("/admin/dashboard");
      return;
    }

    const fetchUser = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/users/${userId}`);
        if (!res.ok) throw new Error("User not found");

        const data: UserApplicant = await res.json();
        setApplicantData(data);

        form.reset({
          fullName: data.fullName ?? "",
          fatherName: data.fatherName,
          grandfatherName: data.grandfatherName,
          isBusiness: data.isBusiness ?? false,
          entityName: data.entityName,
          tin: data.tin,
          businessLicenseNo: data.businessLicenseNo,
          emailAddress: data.emailAddress,
          password: "",
          primaryPhoneNumber: data.primaryPhoneNumber,
          alternativePhoneNumber: data.alternativePhoneNumber,
          gender: data.gender as any,
          idNumber: data.idNumber,
          residentialAddress: data.residentialAddress,
          region: data.region,
          city: data.city,
          woredaKebele: data.woredaKebele,
          houseNumber: data.houseNumber,
          associationName: data.associationName,
          membershipNumber: data.membershipNumber,
          preferredVehicleType: data.preferredVehicleType,
          vehicleQuantity: data.vehicleQuantity ?? null,
          intendedUse: data.intendedUse,
        });
      } catch (err: any) {
        toast.error("Failed to load user", { description: err.message });
        router.push("/admin/users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId, session, status, router, form, userRole]); // Added userRole to dependency array

  // ————————————————————————————————————————
  // Submit handler
  // ————————————————————————————————————————
  const onSubmit = async (values: EditUserFormValues) => {
    setIsLoading(true);
    try {
      const payload: Record<string, any> = {};

      Object.keys(values).forEach((key) => {
        const k = key as keyof EditUserFormValues;
        const value = values[k];
        const defaultValue = form.formState.defaultValues?.[k];

        if (value !== defaultValue && value !== undefined) {
          payload[k] = value === "" ? null : value;
        }
      });

      if (values.password === "") delete payload.password;

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Update failed");
      }

      toast.success("User updated successfully!");
      router.push("/admin/users");
    } catch (err: any) {
      toast.error("Update failed", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || status === "loading") {
    return <CustomLoader message="Loading user..." emoji="Profile" />;
  }

  if (!applicantData) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-600 text-xl">User not found</p>
        <Button onClick={() => router.push("/admin/users")} className="mt-4">
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <UserPen className="text-green-600" />
            Edit: {applicantData.fullName}
          </h1>
          <Button variant="outline" onClick={() => router.push("/admin/users")}>
            <ArrowLeftCircle className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit User Details</CardTitle>
            <CardDescription>Make changes and save</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      {/* Full Name is required and defaults to "" so no null check needed */}
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="emailAddress" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        {/* 🎯 FIX: Convert null/undefined to "" for the Input component */}
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="primaryPhoneNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Phone</FormLabel>
                      <FormControl>
                        {/* FIX: Convert null/undefined to "" */}
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="alternativePhoneNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternative Phone (optional)</FormLabel>
                      <FormControl>
                         {/* FIX: Convert null/undefined to "" */}
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Password (already correctly handles "" as default) */}
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password (leave blank to keep current)</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Business Toggle */}
                <div className="flex items-center space-x-3">
                  <Label htmlFor="isBusiness">Business Applicant?</Label>
                  <Switch
                    id="isBusiness"
                    checked={!!isBusinessApplicant}
                    onCheckedChange={(v) => form.setValue("isBusiness", v)}
                  />
                </div>

                {/* Business Fields */}
                {isBusinessApplicant && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <FormField control={form.control} name="entityName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entity Name</FormLabel>
                        <FormControl>
                          {/* FIX: Convert null/undefined to "" */}
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="tin" render={({ field }) => (
                      <FormItem>
                        <FormLabel>TIN</FormLabel>
                        <FormControl>
                          {/* FIX: Convert null/undefined to "" */}
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="businessLicenseNo" render={({ field }) => (
                      <FormItem>
                        <FormLabel>License No</FormLabel>
                        <FormControl>
                          {/* FIX: Convert null/undefined to "" */}
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}

                {/* Submit */}
                <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}