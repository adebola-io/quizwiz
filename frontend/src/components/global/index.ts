export * from "./Header";
export * from "./Sidebar";
export * from "./SidebarToggle";
export * from "./Icon";
export * from "./HomeIcon";

export type Page = "home" | "leaderboard";

export interface SidebarIconProps {
   handlers: {
      page: [Page, React.Dispatch<React.SetStateAction<Page>>];
      expanded: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
   };
}
