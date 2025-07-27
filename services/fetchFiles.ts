export async function fetchFromStore(
  filename: string,
  storeId: string
): Promise<string> {
  const endpoint = `${process.env.VPS_URL}/json`;
  const token = process.env.VPS_TOKEN || "your-secret-token"; // Use ENV for security

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      storeId: storeId,
      filename: filename,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch file: ${filename} — Status ${response.status}`
    );
  }

  return await response.text(); // or .json() if you're sure all responses are valid JSON
}
