import { Suspense } from 'react';
import CreateApplicationPageClient from './CreateApplicationPageClient';
import CustomLoader from "@/components/ui/custom-loader"; // Assuming this path is correct

// This wrapper is a Server Component (default in App Router).
// It wraps the Client Component in <Suspense> to resolve the build error.
export default function CreateApplicationPageWrapper() {
  return (
    // The Suspense boundary prevents Next.js from trying to render
    // useSearchParams() on the server, deferring it until the client.
    <Suspense fallback={<CustomLoader message="Loading form setup..." emoji="⚙️" />}>
      <CreateApplicationPageClient />
    </Suspense>
  );
}