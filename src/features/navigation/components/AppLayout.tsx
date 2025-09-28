"use client";

import { memo } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui";
import { ErrorBoundary } from "@/shared/components";
import { AppNavigation } from "./AppNavigation";
import { Button } from "@/components/ui";
import { useNavigationPreloader } from "@/shared/hooks";
import { 
  Settings, 
  Bell,
  User
} from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayoutComponent({ children }: AppLayoutProps) {
  // Initialize navigation preloader for better performance
  useNavigationPreloader();

  return (
    <SidebarProvider>
      <ErrorBoundary level="component">
        <AppNavigation />
      </ErrorBoundary>
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">Store Owner</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
          <ErrorBoundary level="page">
            {children}
          </ErrorBoundary>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Memoize the layout component to prevent unnecessary re-renders
export const AppLayout = memo(AppLayoutComponent);
