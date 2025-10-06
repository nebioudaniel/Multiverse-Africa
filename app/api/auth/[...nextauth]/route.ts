// src/app/api/auth/[...nextauth]/route.ts
// Re-export the NextAuth.js handlers from your central auth configuration
export { GET, POST } from "@/app/auth"; // Adjust path if your auth.ts is in src/auth.ts (e.g., "@/auth")