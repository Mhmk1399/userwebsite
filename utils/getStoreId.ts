import { NextRequest } from "next/server";

export function getStoreId(request: NextRequest): string {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    return process.env.NEXT_PUBLIC_DEV_STORE_ID || "default-store";
  }
  
  const url = new URL(request.url);
  const hostname = url.hostname;
  const subdomain = hostname.split('.')[0];
  return subdomain || "default-store";
}

export function getStoreIdFromUrl(url: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    return process.env.NEXT_PUBLIC_DEV_STORE_ID || "default-store";
  }
  
  const urlObj = new URL(url);
  const hostname = urlObj.hostname;
  const subdomain = hostname.split('.')[0];
  return subdomain || "default-store";
}