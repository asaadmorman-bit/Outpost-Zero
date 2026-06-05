import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, LayoutDashboard, AlertTriangle, Settings, LogOut, Server } from "lucide-react";
import { useAppContext } from "./AppContext";

export default function DemoSidebar() {
  const location = useLocation();
  const { logout } = useAppContext();
  
  const navItems = [
    { name: "Dashboard", page: "DemoDashboard", icon: LayoutDashboard },
    { name: "Incidents", page: "DemoIncidents", icon: AlertTriangle },
    { name: "Architecture", page: "ArchitectureOverview", icon: Server },
    { name: "Settings", page: "DemoSettings", icon: Settings },
  ];

  const isActive = (page) => location.pathname.includes(page);

  return (
    <aside className="w-56 bg-slate-950 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">Outpost Zero</h1>
            <p className="text-slate-500 text-xs">Security Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.page);
          return (
            <Link
              key={item.page}
              to={createPageUrl(item.page)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={() => {
            logout();
            window.location.href = createPageUrl("DemoLogin");
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}