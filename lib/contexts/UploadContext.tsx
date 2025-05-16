"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { uploadImage, addImageToNode } from '../storage-functions';

interface UploadContextType {
  uploading: boolean;
  progress: number;
  uploadImage: (file: File, path: string) => Promise<string>;
  uploadNodeImage: (nodeId: string, file: File) => Promise<any>;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider = ({ children }: { children: ReactNode }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUploadImage = async (file: File, path: string) => {
    setUploading(true);
    setProgress(0);
    
    try {
      // Simular progresso (em uma implementação real, usaríamos eventos do Firebase)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      
      const url = await uploadImage(file, path);
      
      clearInterval(interval);
      setProgress(100);
      setUploading(false);
      
      return url;
    } catch (error) {
      setUploading(false);
      setProgress(0);
      throw error;
    }
  };

  const handleUploadNodeImage = async (nodeId: string, file: File) => {
    setUploading(true);
    setProgress(0);
    
    try {
      // Simular progresso (em uma implementação real, usaríamos eventos do Firebase)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      
      const result = await addImageToNode(nodeId, file);
      
      clearInterval(interval);
      setProgress(100);
      setUploading(false);
      
      return result;
    } catch (error) {
      setUploading(false);
      setProgress(0);
      throw error;
    }
  };

  return (
    <UploadContext.Provider
      value={{
        uploading,
        progress,
        uploadImage: handleUploadImage,
        uploadNodeImage: handleUploadNodeImage,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
}; 