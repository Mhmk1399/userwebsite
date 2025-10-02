export function getClientStoreId(): string {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    return process.env.NEXT_PUBLIC_DEV_STORE_ID || "default-store";
  }
  
  // In production, extract from current hostname
  const hostname = window.location.hostname;
  const subdomain = hostname.split('.')[0];
  return subdomain || "default-store";
}