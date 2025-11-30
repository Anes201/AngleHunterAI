import React, { useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ImageState } from '../types';

interface ImageUploadProps {
  imageState: ImageState;
  onImageChange: (state: ImageState) => void;
  isLoading: boolean;
}

// Helper to resize and compress image
const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_DIM = 1536; // Limit max dimension to 1536px to prevent payload errors

        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Compress to jpeg 0.8 to significantly reduce size while keeping quality
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
            resolve(e.target?.result as string);
        }
      };
      img.onerror = (err) => reject(err);
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const ImageUpload: React.FC<ImageUploadProps> = ({ imageState, onImageChange, isLoading }) => {
  
  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    try {
        // Use the resized base64 for the API, but we can use the object URL for immediate preview
        const base64 = await resizeImage(file);
        
        onImageChange({
            file,
            previewUrl: URL.createObjectURL(file),
            base64: base64
        });
    } catch (error) {
        console.error("Error processing image:", error);
        // Fallback to standard reading if resize fails
        const reader = new FileReader();
        reader.onload = (e) => {
             onImageChange({
                file,
                previewUrl: URL.createObjectURL(file),
                base64: e.target?.result as string
            });
        };
        reader.readAsDataURL(file);
    }
  }, [onImageChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (isLoading) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile, isLoading]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return;
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile, isLoading]);

  const clearImage = useCallback(() => {
    onImageChange({ file: null, previewUrl: null, base64: null });
  }, [onImageChange]);

  if (imageState.previewUrl) {
    return (
      <div className="relative w-full max-w-sm mx-auto aspect-square bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl group">
        <img 
          src={imageState.previewUrl} 
          alt="Preview" 
          className="w-full h-full object-cover"
        />
        {!isLoading && (
            <button 
            onClick={clearImage}
            className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-red-500/80 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            >
            <X className="w-4 h-4" />
            </button>
        )}
      </div>
    );
  }

  return (
    <div 
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={`relative w-full max-w-sm mx-auto aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 
        ${isLoading 
            ? 'border-slate-700 bg-slate-800/30 opacity-50 cursor-not-allowed' 
            : 'border-slate-600 bg-slate-800/50 hover:border-brand-500 hover:bg-slate-800 cursor-pointer'
        }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        disabled={isLoading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <div className="flex flex-col items-center p-6 text-center space-y-4 pointer-events-none">
        <div className="p-4 bg-slate-700/50 rounded-full text-brand-400">
            <Upload className="w-8 h-8" />
        </div>
        <div>
          <p className="text-lg font-medium text-white">Upload Product Image</p>
          <p className="text-sm text-slate-400 mt-1">Drag & drop or click to browse</p>
        </div>
        <p className="text-xs text-slate-500">Supports JPG, PNG, WEBP</p>
      </div>
    </div>
  );
};