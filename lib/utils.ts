import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Valida se um arquivo é uma imagem
 * @param file Arquivo a ser validado
 */
export const isImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};

/**
 * Formata o tamanho de um arquivo para exibição amigável
 * @param bytes Tamanho em bytes
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Gera um nome de arquivo único
 * @param fileName Nome original do arquivo
 */
export const generateUniqueFileName = (fileName: string): string => {
  const extension = fileName.split('.').pop();
  const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
  const timestamp = Date.now();
  
  return `${baseName}_${timestamp}.${extension}`;
};
