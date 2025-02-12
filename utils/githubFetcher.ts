import axios from "axios";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Add this to your .env file
const GITHUB_OWNER = "Mhmk1399";

/**
 * Fetches the raw content of a file from the GitHub repository.
 * @param filePath - Path of the file in the repository (e.g., "public/template/homesm.json").
 * @returns The raw content of the file as a string.
 */
export async function fetchGitHubFile(filePath: string, GITHUB_REPO: string): Promise<string> {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
    console.log("Fetching URL:", url);

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`, // Provide your GitHub token here
                Accept: "application/vnd.github.v3+json", // Fetch metadata (including content)
            },
            
        });

        // Extract Base64-encoded content and decode it
        const fileContent = response.data.content;
        const decodedContent = Buffer.from(fileContent, "base64").toString("utf-8");
        return decodedContent; // Return the decoded raw content of the file

    } catch (error: any) {
        console.error("Error fetching file from GitHub:", error.response?.data || error.message);

        if (error.response?.status === 404) {
            throw new Error(`File not found: ${filePath}`);
        }
        throw new Error("Failed to fetch file from GitHub");
    }
}
