// Cloudinary optimized image URLs
// These images are served from Cloudinary CDN with automatic format optimization (WebP/AVIF)

const CLOUDINARY_BASE = "https://res.cloudinary.com/drasdopux/image/upload";

// Transformation presets - with width limits for performance
const DESKTOP_LARGE = "f_auto,q_auto,w_800";   // Large images (journey steps)
const DESKTOP_MEDIUM = "f_auto,q_auto,w_600";  // Medium images (hero gallery)
const MOBILE = "f_auto,q_auto,w_400";          // Mobile optimized

// Landing page images - Desktop (larger screens)
export const cloudinaryImages = {
  // Journey section (3 large images) - limit to 800px width
  journeyStep1: `${CLOUDINARY_BASE}/${DESKTOP_LARGE}/vidacure/journey-step1`,
  journeyStep2: `${CLOUDINARY_BASE}/${DESKTOP_LARGE}/vidacure/journey-step2`,
  journeyStep3: `${CLOUDINARY_BASE}/${DESKTOP_LARGE}/vidacure/journey-step3`,

  // Hero section gallery - limit to 600px width
  first: `${CLOUDINARY_BASE}/${DESKTOP_MEDIUM}/vidacure/first`,
  second: `${CLOUDINARY_BASE}/${DESKTOP_MEDIUM}/vidacure/second`,
  third: `${CLOUDINARY_BASE}/${DESKTOP_MEDIUM}/vidacure/third`,
  fourth: `${CLOUDINARY_BASE}/${DESKTOP_MEDIUM}/vidacure/fourth`,
  fifth: `${CLOUDINARY_BASE}/${DESKTOP_MEDIUM}/vidacure/fifth`,
  sixth: `${CLOUDINARY_BASE}/${DESKTOP_MEDIUM}/vidacure/sixth`,

  // Partner section
  phones: `${CLOUDINARY_BASE}/${DESKTOP_MEDIUM}/vidacure/phones`,

  // Obesity/Medical section
  injections: `${CLOUDINARY_BASE}/${DESKTOP_MEDIUM}/vidacure/injections`,
};

// Mobile-optimized images (smaller width for faster loading)
export const cloudinaryImagesMobile = {
  journeyStep1: `${CLOUDINARY_BASE}/${MOBILE}/vidacure/journey-step1`,
  journeyStep2: `${CLOUDINARY_BASE}/${MOBILE}/vidacure/journey-step2`,
  journeyStep3: `${CLOUDINARY_BASE}/${MOBILE}/vidacure/journey-step3`,
  first: `${CLOUDINARY_BASE}/${MOBILE}/vidacure/first`,
  second: `${CLOUDINARY_BASE}/${MOBILE}/vidacure/second`,
  third: `${CLOUDINARY_BASE}/${MOBILE}/vidacure/third`,
  fourth: `${CLOUDINARY_BASE}/${MOBILE}/vidacure/fourth`,
  fifth: `${CLOUDINARY_BASE}/${MOBILE}/vidacure/fifth`,
  sixth: `${CLOUDINARY_BASE}/${MOBILE}/vidacure/sixth`,
  phones: `${CLOUDINARY_BASE}/${MOBILE}/vidacure/phones`,
  injections: `${CLOUDINARY_BASE}/${MOBILE}/vidacure/injections`,
};

// Helper to get image URL with custom width
export const getCloudinaryUrl = (imageName: string, width: number = 800) => {
  return `${CLOUDINARY_BASE}/f_auto,q_auto,w_${width}/vidacure/${imageName}`;
};

// Helper for responsive srcSet
export const getResponsiveSrcSet = (imageName: string, widths: number[] = [400, 600, 800]) => {
  return widths
    .map((w) => `${CLOUDINARY_BASE}/f_auto,q_auto,w_${w}/vidacure/${imageName} ${w}w`)
    .join(", ");
};

export default cloudinaryImages;
