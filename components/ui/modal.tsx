"use client";
import * as React from "react";

export function Modal({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {children}
    </div>
  );
}

export function ModalContent({ children }: { children: React.ReactNode }) {
  return <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-lg">{children}</div>;
}

export const ModalHeader = ({ children }: { children: React.ReactNode }) => <div className="mb-4">{children}</div>;
export const ModalTitle = ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-bold">{children}</h2>;
export const ModalBody = ({ children }: { children: React.ReactNode }) => <div className="mb-4">{children}</div>;
export const ModalFooter = ({ children }: { children: React.ReactNode }) => <div className="flex justify-end gap-2">{children}</div>;
