"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // OPTIONAL: Keep this useEffect to redirect already logged-in users who land here
  useEffect(() => {
    // Note: This relies on the session being available (not "loading")
    if (status === "authenticated") {
      if (session?.user?.role === "MAIN_ADMIN" || session?.user?.role === "REGISTRAR_ADMIN") {
        router.replace("/admin/dashboard");
      } else {
        // Handle unauthorized but logged-in user
        // You might want to call signOut() here or simply redirect away
        toast.error("Access Denied", { description: "Your account is not authorized." });
        // Redirect to a non-admin page or call signOut
      }
    }
  }, [status, session, router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error("Login Failed", {
          description: result.error,
          duration: 5000,
          richColors: true,
        });
      } else {
        // ✅ CRITICAL FIX: Direct the successful login flow
        toast.success("Login Successful", {
          description: "Redirecting to dashboard...",
          duration: 2000,
          richColors: true,
        });
        
        // Use a full page refresh to ensure the session update is registered
        // by the dashboard component instantly, preventing the redirect loop/stall.
        window.location.href = "/admin/dashboard";

        // IMPORTANT: We do NOT call setIsLoading(false) on success 
        // because we are navigating away. The loader will stay until the new page loads.
        return; // Exit the function after redirect
      }
    } catch (error) {
      toast.error("An unexpected error occurred during login.");
    } finally {
      // Only reset loading state if the login failed or had an error
      if (!window.location.pathname.includes("/admin/dashboard")) {
        setIsLoading(false);
      }
    }
  };

  return (
    // ... rest of the render code (it looks fine)
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}