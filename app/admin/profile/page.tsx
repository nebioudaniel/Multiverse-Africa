// app/admin/profile/page.tsx (Fixed and Complete)
"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CustomLoader from "@/components/ui/custom-loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

// Assuming Avatar components are available
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; 

interface UserProfile {
  id: string;
  fullName: string;
  emailAddress: string | null;
  primaryPhoneNumber: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

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


export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [primaryPhoneNumber, setPrimaryPhoneNumber] = useState("");

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/profile");
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch profile");
      }
      
      const data: UserProfile = await res.json();
      setUserProfile(data);
      setFullName(data.fullName);
      setEmailAddress(data.emailAddress || "");
      setPrimaryPhoneNumber(data.primaryPhoneNumber || "");
    } catch (err: unknown) { // FIX: Changed 'any' to 'unknown'
      const errorMessage = getErrorMessage(err);
      toast.error("Error loading profile", { description: errorMessage });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Controls editability: Only MAIN_ADMIN and APPLICANT can edit.
  // Note: Given this is inside `/admin`, APPLICANT role might be unexpected, but we maintain the logic.
  const isEditable = userProfile?.role === "MAIN_ADMIN" || userProfile?.role === "APPLICANT";

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile || !isEditable) return; 

    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          emailAddress: emailAddress || null, 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedData: UserProfile = await res.json();
      setUserProfile(updatedData);
      toast.success("Profile Updated successfully!");

      // Update the NextAuth session to reflect the new name/email
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: updatedData.fullName, 
          email: updatedData.emailAddress,
        }
      });
    } catch (err: unknown) { // FIX: Changed 'any' to 'unknown'
      const errorMessage = getErrorMessage(err);
      toast.error("Profile update failed", { description: errorMessage });
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      toast.error("You must be signed in");
      router.push("/auth/signin");
      return;
    }
    fetchProfile();
  }, [session, status, router, fetchProfile]);

  // Helper to get initials for the Avatar Fallback
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // --- Loader and Error States ---
  if (isLoading || status === "loading") {
    return <CustomLoader message="Loading profile..." emoji="👤" />;
  }

  if (error || !userProfile) {
    return (
      <div className="p-8 text-center text-red-600 bg-white flex flex-col items-center justify-center border border-red-200 rounded-lg">
        <h2 className="text-xl">{error ? "Error Loading Profile" : "Profile Not Found"}</h2>
        <p className="text-gray-600">{error || "Could not load user profile data."}</p>
        <Button onClick={fetchProfile} className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    // Outer container: Full width (no max-w) and uses padding for spacing.
    // Assuming the parent layout component handles the background color (e.g., bg-gray-50)
    <div className="w-full p-8">
      
      {/* Content Block: No max-w, no strong shadows/borders */}
      <div className="w-full  p-7 bg-white rounded-xl ">
        
        {/* Header Section */}
        <div className="flex items-center space-x-4 mb-8 border-b pb-4">
            <Avatar className="w-16 h-16 border-2 border-indigo-400">
                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xl">
                    {getInitials(userProfile.fullName)}
                </AvatarFallback>
            </Avatar>
          
          <div>
            <h1 className="text-2xl text-gray-900">
              My Profile
            </h1>
            <p className="text-gray-500 text-sm">View and manage your personal information.</p>
            <p className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${userProfile.role === 'MAIN_ADMIN' ? 'bg-indigo-50 text-indigo-700' : 'bg-green-50 text-green-700'}`}>
                {userProfile.role.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
          
          {/* Read-Only Meta Data (ID and Dates) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="id" className="text-gray-700 text-sm">User ID</Label>
              <Input id="id" value={userProfile.id} readOnly disabled className="bg-gray-50 border-gray-300 text-xs" />
            </div>
            <div>
              <Label htmlFor="createdAt" className="text-gray-700 text-sm">Account Created</Label>
              <Input 
                  id="createdAt" 
                  value={new Date(userProfile.createdAt).toLocaleDateString()} 
                  readOnly 
                  disabled 
                  className="bg-gray-50 border-gray-300 text-sm" 
              />
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div>
              <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                readOnly={!isEditable || isUpdating}
                disabled={!isEditable || isUpdating}
                className={!isEditable ? "bg-gray-100 border-gray-300" : "border-gray-400 focus-visible:ring-indigo-500"}
              />
            </div>

            <div>
              <Label htmlFor="emailAddress" className="text-gray-700">Email Address</Label>
              <Input
                id="emailAddress"
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                readOnly={!isEditable || isUpdating}
                disabled={!isEditable || isUpdating}
                className={!isEditable ? "bg-gray-100 border-gray-300" : "border-gray-400 focus-visible:ring-indigo-500"}
              />
            </div>

            {userProfile.primaryPhoneNumber && (
              <div>
                <Label htmlFor="primaryPhoneNumber" className="text-gray-700">Phone Number</Label>
                <Input
                  id="primaryPhoneNumber"
                  type="tel"
                  value={primaryPhoneNumber}
                  readOnly
                  disabled
                  className="bg-gray-100 border-gray-300"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="updatedAt" className="text-gray-700 text-sm">Last Updated</Label>
              <Input 
                  id="updatedAt" 
                  value={new Date(userProfile.updatedAt).toLocaleString()} 
                  readOnly 
                  disabled 
                  className="bg-gray-50 border-gray-300 text-sm" 
              />
            </div>
          </div>


          {/* Save Button */}
          {isEditable ? (
            <Button type="submit" className="w-full bg-indigo-400 hover:bg-indigo-500 text-white" disabled={isUpdating}>
              {isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          ) : (
             <div className="text-sm text-gray-600 mt-4 p-3 bg-yellow-50 rounded-md border border-yellow-200">
                <p>Your profile fields are managed by the Main Admin and cannot be edited.</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}