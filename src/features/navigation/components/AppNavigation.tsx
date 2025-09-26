"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  TrendingUp,
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
      {
        title: "Strategies",
        href: "/strategies",
        icon: Target,
        description: "Pricing rules and automation",
      },
      {
        title: "Recommendations",
        href: "/recommendations",
        icon: TrendingUp,
        description: "AI-powered price suggestions",
        badge: "5",
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Performance",
        href: "/analytics",
        icon: BarChart3,
        description: "Revenue and pricing analytics",
      },
      {
        title: "Reports",
        href: "/reports",
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

export function AppNavigation() {
  const pathname = usePathname();

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
                        <Link href={item.href}>
                          <Icon className="w-4 h-4" />
                          <span>{item.title}</span>
                          {item.badge && (
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
