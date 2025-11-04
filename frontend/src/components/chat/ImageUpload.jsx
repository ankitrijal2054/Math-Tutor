import React, { useRef } from "react";
import { Upload } from "lucide-react";
import toast from "react-hot-toast";

const ImageUpload = ({ onImageSelect, disabled = false }) => {
  const fileInputRef = useRef(null);

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
      const dataURL = await fileToDataURL(validatedFile);
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

      {/* Camera button - always visible */}
      <button
        onClick={handleCameraClick}
        disabled={disabled}
        title="Upload image from file or camera"
        className="h-full px-3 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition-colors duration-200 flex items-center justify-center"
      >
        <Upload className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ImageUpload;
