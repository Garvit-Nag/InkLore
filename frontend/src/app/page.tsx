import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import StoryInterface from "@/components/StoryInterface";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#171717]">
      <StoryInterface />
      <Sidebar>
        <SidebarBody />
      </Sidebar>
    </div>
  );
}