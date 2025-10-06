// lib/uploadthing.ts
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

// IMPORTANT: Ensure this path correctly points to your OurFileRouter in core.ts.
// "@/app/api/uploadthing/core" is common for Next.js App Router.
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();