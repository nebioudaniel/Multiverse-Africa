// src/app/register/layout.tsx
import Navbar from "@/components/Nav/page";
import { RegistrationProvider } from "@/components/register/RegisterFormContainer";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RegistrationProvider>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col pt-24">
        <div className="w-full h-full">
          {children}
        </div>
      </div>
    </RegistrationProvider>
  );
}