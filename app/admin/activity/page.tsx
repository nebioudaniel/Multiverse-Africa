// app/admin/activity/page.tsx (NEW FILE)

import { Suspense } from 'react';
import ActivityPageClient from './ActivityPageClient.tsx';
import CustomLoader from "@/components/ui/custom-loader"; // Assuming this path is correct

// This file is a Server Component (default).
// It wraps the component that needs client-side context (like useSearchParams).
export default function AdminActivityPageWrapper() {
  return (
    // The Suspense boundary resolves the build error.
    <Suspense fallback={<CustomLoader message="Loading activity log setup..." emoji="⏱️" />}>
      <ActivityPageClient />
    </Suspense>
  );
}