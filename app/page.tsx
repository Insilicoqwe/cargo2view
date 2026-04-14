import { AppSidebar } from "@/components/AppSidebar";
import { RepoStats } from "@/components/RepoStats";
import { ContributorsList } from "@/components/ContributorsList";
import { CommitsList } from "@/components/CommitsList";
import { RepoSlugLabel } from "@/components/RepoSlugLabel";
import { Separator } from "@/components/ui/separator";
import { LanguagesPieCard } from "@/components/LanguagesPieCard";
import { CodeHealth } from "@/components/CodeHealth";

export default function Home() {
  return (
    <div className="w-full p-8">
      <AppSidebar></AppSidebar>
      <RepoSlugLabel/>
      <RepoStats/>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <LanguagesPieCard/>
        <CodeHealth/>
      </div>
    </div>
  );
}
