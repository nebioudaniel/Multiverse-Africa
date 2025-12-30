'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import { useEdgeStore } from "@/lib/edgestore-client"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, X, Plus, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface VehicleFormProps {
  initialData?: any;
}

export function VehicleForm({ initialData }: VehicleFormProps) {
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  
  const [loading, setLoading] = React.useState(false);
  const [images, setImages] = React.useState<string[]>(initialData?.images || []);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (images.length === 0) {
        alert("Please upload at least one image of the vehicle.");
        return;
    }
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      capacity: formData.get("capacity"),
      type: formData.get("type"),
      images: images,
    };

    try {
      const url = initialData ? `/api/vehicles/${initialData.id}` : `/api/vehicles`;
      const method = initialData ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/vehicles");
        router.refresh();
      }
    } catch (error) {
      console.error("Error saving vehicle", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !edgestore) return;

    setIsUploading(true);
    for (const file of Array.from(files)) {
      try {
        // FIXED: Using .documents bucket to match your route.ts
        const res = await edgestore.documents.upload({
  file,
  onProgressChange: (progress: number) => {
    setUploadProgress(progress);
  },
});
setImages((prev) => [...prev, res.url]);
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
    setIsUploading(false);
    setUploadProgress(0);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-3xl bg-white dark:bg-zinc-900 p-6 rounded-xl border shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Vehicle Name</label>
          <Input 
            name="name" 
            defaultValue={initialData?.name} 
            placeholder="e.g., Shacman F3000" 
            required 
            className="focus-visible:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Category Type</label>
          <select 
            name="type" 
            defaultValue={initialData?.type || "minibus"} 
            className="w-full border rounded-md p-2 h-10 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
          >
            <option value="minibus">Minibus</option>
            <option value="truck">Truck / Heavy Duty</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Capacity Info</label>
        <Input 
            name="capacity" 
            defaultValue={initialData?.capacity} 
            placeholder="e.g., 22 + 1 Seater or 40 Ton Payload" 
            required 
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Detailed Description</label>
        <textarea 
          name="description" 
          defaultValue={initialData?.description}
          className="w-full border rounded-md p-3 min-h-[120px] bg-transparent focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white" 
          placeholder="Describe the engine, features, and condition..."
          required 
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <label className="text-sm font-semibold flex items-center text-gray-700 dark:text-gray-200">
                <ImageIcon className="w-4 h-4 mr-2 text-blue-500" />
                Vehicle Gallery
            </label>
            {isUploading && (
                <span className="text-xs text-blue-600 font-medium animate-pulse">
                    Uploading... {uploadProgress}%
                </span>
            )}
        </div>
        
        <div className="flex flex-wrap gap-4 p-4 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-zinc-800/50">
          {images.map((url) => (
            <div key={url} className="relative group w-28 h-28 border rounded-lg overflow-hidden shadow-sm">
              {/* FIXED: Removed legacy props objectFit and layout */}
              <Image 
                src={url} 
                alt="vehicle" 
                fill 
                className="object-cover"
              />
              <button 
                type="button" 
                onClick={() => setImages(images.filter(i => i !== url))}
                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          <label className="w-28 h-28 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 dark:hover:bg-zinc-700 border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-lg transition-colors">
            {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            ) : (
                <>
                    <Plus className="w-6 h-6 text-gray-400" />
                    <span className="text-[10px] mt-1 text-gray-500 font-medium">Add Photo</span>
                </>
            )}
            <input type="file" multiple className="hidden" onChange={handleImageUpload} disabled={isUploading} />
          </label>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
        <Button 
            type="submit" 
            size="lg"
            className="px-8"
            disabled={loading || isUploading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Vehicle" : "Publish Vehicle"}
        </Button>
        <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()}
        >
            Cancel
        </Button>
      </div>
    </form>
  );
}