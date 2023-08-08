export * from "./Header";
export * from "./Sidebar";
export * from "./SidebarToggle";
export * from "./Icon";
export * from "./HomeIcon";

export type Page = "home" | "leaderboard";

export interface SidebarIconProps {
   handler: [Page, React.Dispatch<React.SetStateAction<Page>>];
}
