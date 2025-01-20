
import { fetchGitHubFile } from "@/utilities/github";

export default async function test2Page() {
    const lgData = await fetchGitHubFile('public/template/test2lg.json');
    const smData = await fetchGitHubFile('public/template/test2sm.json');
    
    return (
        <div>
            {/* Desktop Version */}
            <div className="hidden md:block">
                {JSON.parse(lgData)}
            </div>
            {/* Mobile Version */}
            <div className="block md:hidden">
                {JSON.parse(smData)}
            </div>
        </div>
    );
}