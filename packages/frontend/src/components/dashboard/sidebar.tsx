import { SidebarDesktop } from "@/components/dashboard/sidebar-desktop";
import { SidebarMobile } from "@/components/dashboard/sidebar-mobile";

type SideBarProps = {
  userName: string;
};

export default function SideBar({ userName }: SideBarProps) {
  return (
    <>
      <SidebarDesktop userName={userName} />
      <SidebarMobile userName={userName} />
    </>
  );
}
