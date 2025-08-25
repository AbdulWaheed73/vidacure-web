import type { ClientType } from '../types';

/**
 * Helper function to detect if user is on mobile
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Helper function to detect if user is on native app
 */
export function isNativeApp(): boolean {
  // Check for custom app identifiers or user agent patterns
  return navigator.userAgent.includes('VidacureApp') || 
         (window.location.hostname === 'localhost' && window.location.port === '3000');
}

/**
 * Determine client type based on device and app detection
 */
export function getClientType(): ClientType {
  if (isNativeApp()) {
    return 'app';
  } else if (isMobileDevice()) {
    return 'mobile';
  } else {
    return 'web';
  }
}
