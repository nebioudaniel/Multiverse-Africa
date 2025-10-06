// components/file-upload.tsx
"use client";

import { toast } from "sonner";
import { Loader2, LinkIcon, Trash2, FileIcon, CloudUpload } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface FileUploadProps {
  onChange: (url: string | undefined) => void;
  value?: string | null; // This will be the full URL (e.g., /uploads/my-file.pdf)
  label: string;
}

export const FileUpload = ({
  onChange,
  value,
  label,
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to extract filename from the relative URL (e.g., /uploads/abc-file.pdf -> abc-file.pdf)
  function getFileNameFromUrl(url: string) {
    if (!url) return "Unknown File";
    try {
      // Remove leading /uploads/ and any query parameters
      const parts = url.split('/');
      const filenameWithParams = parts[parts.length - 1];
      return filenameWithParams.split('?')[0]; // Remove query parameters
    } catch (error) {
      console.error("Error parsing URL to get filename:", url, error);
      return "Unknown File";
    }
  }

  // Generate an absolute URL for display and Zod validation (if needed for external links)
  // This is derived here, not stored in state, to keep state portable.
  const absoluteFileUrl = value ? `${window.location.origin}${value}` : undefined;
  const currentFileName = value ? getFileNameFromUrl(value) : ""; // Correctly derived inside component


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    toast.info(`Starting upload for ${label}...`);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true); // Our custom API endpoint

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        setIsUploading(false);
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          // Store the relative URL in the form state
          onChange(response.fileUrl); // <-- Ensure this is the relative path, e.g., /uploads/your-file.pdf
          toast.success(`${label} uploaded successfully!`);
          console.log(`${label} URL set to:`, response.fileUrl);
        } else {
          const errorResponse = JSON.parse(xhr.responseText);
          toast.error(`Error uploading ${label}: ${errorResponse.error || 'Unknown error'}`);
          console.error(`${label} upload error:`, errorResponse);
          onChange(undefined); // Clear value on error
        }
        setUploadProgress(0); // Reset progress after completion/error
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Clear the input field for next upload
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        setUploadProgress(0);
        toast.error(`Network error during ${label} upload.`);
        console.error(`${label} network error.`);
        onChange(undefined); // Clear value on error
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };

      xhr.send(formData);

    } catch (error: any) {
      setIsUploading(false);
      setUploadProgress(0);
      toast.error(`Error initiating ${label} upload: ${error.message}`);
      console.error(`Error initiating ${label} upload:`, error);
      onChange(undefined); // Clear value on error
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onClear = async () => {
    if (!value) return; // value is the relative URL like /uploads/filename.jpg

    // Extract filename from the stored relative URL to send to the backend for deletion
    const fileNameToDelete = getFileNameFromUrl(value);

    // Call our custom DELETE endpoint
    try {
      const res = await fetch(`/api/upload?fileName=${encodeURIComponent(fileNameToDelete)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete file from server.');
      }

      toast.info(`${label} cleared.`);
      onChange(undefined); // Clear the form field value
    } catch (error: any) {
      toast.error(`Failed to delete ${label} from server: ${error.message}`);
      console.error(`Deletion error for ${label}:`, error);
    }
  };


  return (
    <div className="space-y-2">
      <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label} (Optional)
      </p>
      {value && !isUploading ? (
        // Display uploaded file using the absolute URL for the link
        <div className="flex items-center p-3 w-full bg-blue-50 border border-blue-200 text-blue-700 rounded-md">
          <FileIcon className="h-5 w-5 mr-3 flex-shrink-0" />
          <p className="text-sm line-clamp-1">
            Uploaded:{" "}
            <a
              href={absoluteFileUrl} // Use absoluteFileUrl for the link
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-900 transition"
            >
              {currentFileName} {/* This should now be defined */}
            </a>
          </p>
          <Button
            type="button"
            onClick={onClear}
            variant="ghost"
            size="sm"
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        // Show upload zone or progress
        <div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            // You can add 'accept' prop here to specify allowed file types
            // For example: accept=".pdf,image/*"
          />
          <div
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition-colors"
            onClick={() => fileInputRef.current?.click()} // Trigger file input click
          >
            {isUploading ? (
              <div className="text-center w-full">
                <Loader2 className="mx-auto h-8 w-8 text-blue-500 animate-spin mb-2" />
                <p className="text-blue-600 text-lg font-medium">Uploading...</p>
                <Progress value={uploadProgress} className="w-full h-2 mt-2" />
                <p className="text-sm text-gray-500 mt-1">{uploadProgress}%</p>
              </div>
            ) : (
              <div className="text-center">
                <CloudUpload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-700 font-semibold mb-1">Drag & drop a file here or click to select</p>
                <p className="text-sm text-gray-500">Max file size: 4MB (adjustable in backend)</p>
                {/* You can add accepted file types hint here if needed */}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};