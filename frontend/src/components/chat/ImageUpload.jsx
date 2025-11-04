import React, { useRef, useState } from "react";
import { X, Upload } from "lucide-react";
import toast from "react-hot-toast";

const ImageUpload = ({ onImageSelect, disabled = false }) => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  // Allowed image types and max file size (5MB)
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/heic", "image/webp"];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Validate file
  const validateFile = (file) => {
    if (!file) return null;

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPG, PNG, HEIC, or WebP.");
      return null;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large. Maximum size is 5MB.");
      return null;
    }

    return file;
  };

  // Convert file to data URL for preview
  const fileToDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle file selection from input
  const handleFileSelect = async (file) => {
    const validatedFile = validateFile(file);
    if (!validatedFile) return;

    try {
      setIsCompressing(true);
      const dataURL = await fileToDataURL(validatedFile);
      setSelectedImage({
        file: validatedFile,
        preview: dataURL,
        name: validatedFile.name,
      });

      // Notify parent component
      if (onImageSelect) {
        onImageSelect({
          file: validatedFile,
          preview: dataURL,
          name: validatedFile.name,
        });
      }
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error("Failed to load image. Please try again.");
    } finally {
      setIsCompressing(false);
    }
  };

  // Handle file input change
  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  // Handle drag and drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Clear selected image
  const handleClearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onImageSelect) {
      onImageSelect(null);
    }
  };

  // Trigger file input
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
        aria-label="Upload image"
      />

      {/* Image preview */}
      {selectedImage && (
        <div className="relative inline-block">
          <img
            src={selectedImage.preview}
            alt="Selected"
            className="h-32 w-32 object-cover rounded-lg border-2 border-indigo-500 shadow-lg"
          />
          <button
            onClick={handleClearImage}
            disabled={disabled || isCompressing}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded-full p-1 transition-colors duration-200"
            title="Remove image"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          {isCompressing && (
            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
              <div className="animate-spin">
                <Upload className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Camera button - always visible */}
      <button
        onClick={handleCameraClick}
        disabled={disabled || isCompressing}
        title="Upload image from file or camera"
        className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors duration-200"
      >
        <Upload className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ImageUpload;
