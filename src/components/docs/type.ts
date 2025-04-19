export interface SidebarNavItem {
  title: string;
  description?: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  items?: SidebarNavItem[];
}

