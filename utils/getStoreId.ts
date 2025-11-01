import { NextRequest } from "next/server";

export function getStoreId() {
  const storeId = process.env.storeId;
  return storeId;
}
