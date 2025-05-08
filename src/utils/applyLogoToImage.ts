export async function applyLogoToImage(
    imageFile: File,
    logoUrl: string,
    logoScale = 0.25
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const img = new Image();
      const logo = new Image();
  
      // Step 1: Convert image file to base64
      reader.onload = () => {
        img.src = reader.result as string;
      };
      reader.readAsDataURL(imageFile);
  
      // Step 2: When image is loaded
      img.onload = () => {
        logo.crossOrigin = 'anonymous'; // Ensure we can read logo pixels if hosted externally
        logo.src = logoUrl;
      };
  
      // Step 3: When logo is loaded, start drawing
      logo.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas context failed');
  
        // Draw the base image
        ctx.drawImage(img, 0, 0, img.width, img.height);
  
        // Scale the logo based on image width
        const newLogoWidth = img.width * logoScale;
        const newLogoHeight = logo.height * (newLogoWidth / logo.width); // maintain aspect ratio
  
        // Bottom-right corner
        const x = img.width - newLogoWidth;
        const y = img.height - newLogoHeight;
  
        // Draw the resized logo
        ctx.drawImage(logo, x, y, newLogoWidth, newLogoHeight);
  
        // Export canvas to blob
        canvas.toBlob((blob) => {
          if (!blob) return reject('Failed to convert canvas to blob');
          resolve(blob);
        }, 'image/jpeg', 0.95); // Quality similar to Python's default
      };
  
      img.onerror = reject;
      logo.onerror = reject;
    });
  }
  