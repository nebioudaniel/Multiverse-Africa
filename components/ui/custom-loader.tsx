// components/ui/custom-loader.tsx
import { Loader2 } from "lucide-react";

interface CustomLoaderProps {
  message?: string;
  emoji?: string;
}

export default function CustomLoader({
  message = "Loading content...",
  emoji = "✨", // Default emoji
}: CustomLoaderProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-lg font-semibold text-gray-700">
          {emoji} {message}
        </p>
        <p className="text-sm text-gray-500 mt-1">Please wait a moment.</p>
      </div>
    </div>
  );
}
