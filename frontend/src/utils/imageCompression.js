/**
 * Image Compression Utility
 * Resizes large images using Canvas API while maintaining aspect ratio
 */

/**
 * Compress image by resizing and converting to JPEG
 * @param {File} file - Image file to compress
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Max width (default: 1024)
 * @param {number} options.maxHeight - Max height (default: 1024)
 * @param {number} options.quality - JPEG quality 0-1 (default: 0.8)
 * @returns {Promise<string>} Compressed image as base64 data URL
 */
export const compressImage = (file, options = {}) => {
  const { maxWidth = 1024, maxHeight = 1024, quality = 0.8 } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;

          if (width > height) {
            width = maxWidth;
            height = Math.round(width / aspectRatio);
          } else {
            height = maxHeight;
            width = Math.round(height * aspectRatio);
          }
        }

        // Create canvas and draw resized image
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 JPEG
        try {
          const compressedDataURL = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedDataURL);
        } catch (error) {
          reject(new Error(`Failed to compress image: ${error.message}`));
        }
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = e.target?.result;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Convert base64 data URL to File object
 * @param {string} dataURL - Base64 data URL
 * @param {string} fileName - File name (default: "image.jpg")
 * @returns {File} File object
 */
export const dataURLToFile = (dataURL, fileName = "image.jpg") => {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new File([u8arr], fileName, { type: mime });
};

/**
 * Get image dimensions from file
 * @param {File} file - Image file
 * @returns {Promise<{width: number, height: number}>} Image dimensions
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = e.target?.result;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
};
