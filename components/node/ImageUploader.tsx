"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useUpload } from "@/lib/contexts/UploadContext";
import { removeImageFromNode } from "@/lib/storage-functions";
import { isImageFile, formatFileSize } from "@/lib/utils";
import { X, Upload, ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  nodeId: string;
  existingImages: string[];
}

export default function ImageUploader({ nodeId, existingImages }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadNodeImage, uploading, progress } = useUpload();
  const [images, setImages] = useState<string[]>(existingImages);
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validar o arquivo
    if (!isImageFile(file)) {
      toast({
        title: "Invalid file",
        description: "Please select an image file (JPEG, PNG, GIF, WEBP)",
        variant: "destructive",
      });
      return;
    }
    
    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size (${formatFileSize(file.size)}) exceeds 5MB limit`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      const result = await uploadNodeImage(nodeId, file);
      
      if (result.code === "image/success") {
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
        
        // Atualizar a lista de imagens
        setImages(prev => [...prev, result.imageUrl]);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    }
    
    // Limpar o input
    e.target.value = "";
  };
  
  const handleRemoveImage = async (imageUrl: string) => {
    try {
      const result = await removeImageFromNode(nodeId, imageUrl);
      
      if (result.code === "image/success") {
        toast({
          title: "Success",
          description: "Image removed successfully",
        });
        
        // Atualizar a lista de imagens
        setImages(prev => prev.filter(url => url !== imageUrl));
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Failed to remove image",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((imageUrl, index) => (
          <Card key={index} className="relative w-32 h-32 overflow-hidden group">
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveImage(imageUrl)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Image
              src={imageUrl}
              alt={`Image ${index + 1}`}
              fill
              className="object-cover"
            />
          </Card>
        ))}
        
        <Card 
          className="w-32 h-32 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={handleUploadClick}
        >
          <ImageIcon className="h-10 w-10 text-gray-400" />
        </Card>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-gray-500">{progress}% uploaded</p>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleUploadClick}
          disabled={uploading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Add Image
        </Button>
      </div>
    </div>
  );
} 