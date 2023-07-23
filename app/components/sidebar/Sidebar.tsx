import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";

export async function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <DesktopSidebar />
      <MobileFooter />
      <main>{children}</main>
    </div>
  );
}
