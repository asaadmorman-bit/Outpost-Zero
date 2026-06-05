import React, { useEffect } from "react";
import { useAppContext, AppProvider } from "./AppContext";
import DemoSidebar from "./DemoSidebar";
import DemoTopbar from "./DemoTopbar";
import { createPageUrl } from "@/utils";

function DemoShellContent({ children }) {
  const { user } = useAppContext();

  useEffect(() => {
    if (!user) {
      window.location.href = createPageUrl("DemoLogin");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <DemoSidebar />
      <div className="flex-1 flex flex-col">
        <DemoTopbar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DemoShell({ children }) {
  return (
    <AppProvider>
      <DemoShellContent>{children}</DemoShellContent>
    </AppProvider>
  );
}