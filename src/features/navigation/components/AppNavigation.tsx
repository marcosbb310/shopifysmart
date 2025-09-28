"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useCallback } from "react";
import { useRoutePreloader } from "@/shared/hooks";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  Button
} from "@/components/ui";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Settings,
  Target,
  Zap,
  DollarSign,
  FileText,
  HelpCircle,
} from "lucide-react";

const navigationItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Revenue overview and key metrics",
      },
    ],
  },
  {
    title: "Pricing",
    items: [
      {
        title: "Products",
        href: "/products",
        icon: Package,
        description: "Manage products and pricing",
        badge: "8",
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Performance",
        href: "/performance",
        icon: BarChart3,
        description: "Revenue and pricing analytics",
      },
      {
        title: "History",
        href: "/history",
        icon: FileText,
        description: "Detailed performance reports",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Account",
        href: "/settings",
        icon: Settings,
        description: "Account and billing settings",
      },
      {
        title: "Support",
        href: "/support",
        icon: HelpCircle,
        description: "Help and documentation",
      },
    ],
  },
];

/**
 * AppNavigation component that provides the main navigation sidebar for the application
 * 
 * Features:
 * - Responsive sidebar navigation with collapsible groups
 * - Active route highlighting
 * - Icon-based navigation items
 * - Quick actions and settings access
 * - Branding and user information display
 * - Mobile-friendly design
 * - Route preloading for faster navigation
 * 
 * @returns JSX element representing the application navigation
 */
function AppNavigationComponent() {
  const pathname = usePathname();
  const { preloadOnHover } = useRoutePreloader();

  // Preload routes on hover for faster navigation
  const handleMouseEnter = useCallback((href: string) => {
    preloadOnHover(href);
  }, [preloadOnHover]);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-2">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">
              Smart Pricing
            </h1>
            <p className="text-xs text-sidebar-foreground/60">
              Shopify App
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="w-full justify-start"
                      >
                        <Link 
                          href={item.href}
                          onMouseEnter={() => handleMouseEnter(item.href)}
                          prefetch={true}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.title}</span>
                          {'badge' in item && item.badge && (
                            <SidebarMenuBadge>
                              {item.badge}
                            </SidebarMenuBadge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 mx-2">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
              Smart Pricing
            </span>
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-2">
            AI recommendations active
          </p>
          <Button
            size="sm"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
          >
            <DollarSign className="w-3 h-3 mr-1" />
            Upgrade
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

// Memoize the navigation component to prevent unnecessary re-renders
export const AppNavigation = memo(AppNavigationComponent);
