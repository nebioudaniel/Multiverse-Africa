// app/admin/applications/page.tsx

import { Suspense } from 'react';
import ApplicationsPageClient from './ApplicationsPageClient';
import CustomLoader from "@/components/ui/custom-loader"; 

// This file is a Server Component (default).
// It wraps the component that needs client-side context (like useSearchParams).
export default function AdminApplicationsPageWrapper() {
  return (
    // The Suspense boundary prevents the server-side build from crashing.
    <Suspense fallback={<CustomLoader message="Loading applications list setup..." emoji="⚙️" />}>
      <ApplicationsPageClient />
    </Suspense>
  );
}