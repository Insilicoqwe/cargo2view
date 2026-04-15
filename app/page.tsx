import { AppSidebar } from "@/components/AppSidebar";
import { RepoStats } from "@/components/RepoStats";
import { ContributorsList } from "@/components/ContributorsList";
import { CommitsList } from "@/components/CommitsList";
import { RepoSlugLabel } from "@/components/RepoSlugLabel";
import { LanguagesPieCard } from "@/components/LanguagesPieCard";
import { CodeHealth } from "@/components/CodeHealth";
import { ContributorActivity } from "@/components/ContrinbtorActivity";
import { LanguageDistribution } from "@/components/LanguageDistribution";


export default function Home() {
  return (
    <div className="w-full p-8">
      <AppSidebar></AppSidebar>
      <RepoSlugLabel/>
      <RepoStats/>
      <LanguageDistribution/>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <CodeHealth/>
        <ContributorActivity/>
      </div>
    </div>
  );
}
