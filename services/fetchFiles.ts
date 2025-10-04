export async function fetchFromStore(
  filename: string,
  storeId: string
): Promise<string> {
  const endpoint = `${process.env.VPS_URL}/json/${storeId}/${filename}`;
  const token = process.env.VPS_TOKEN || "your-secret-token"; // Use ENV for security

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    console.log(
      `Failed to fetch file: ${filename} — Status ${response.status}`
    );
  }

  return await response.text(); // or .json() if you're sure all responses are valid JSON
}
