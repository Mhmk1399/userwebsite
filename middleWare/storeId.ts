import fs from "fs";
import path from "path";

export const getStoreId = (): string => {
  const storeIdPath = path.join(process.cwd(), "storeId.txt");
  try {
    const storeId = fs.readFileSync(storeIdPath, "utf-8");
    return storeId;
  } catch (error) {
    console.log("Error reading storeId:", error);
    throw new Error("Failed to read storeId");
  }
};
