import { fetchGitHubFile } from "@/utils/githubFetcher";

export async function GetStoreId() {
  const repoUrl = "https://github.com/Mhmk1399/mehran12";
  if (!repoUrl) {
    return new Response("Repository URL not provided", { status: 400 });
  }
  const fileContent = await fetchGitHubFile("storeId.txt", repoUrl);
  if (!fileContent) {
    return new Response("File not found", { status: 404 });
  }

  return fileContent;
}
