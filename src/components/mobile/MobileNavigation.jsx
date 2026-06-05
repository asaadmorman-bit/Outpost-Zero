import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  BarChart3, Shield, AlertTriangle, Users, Settings,
  Menu, X, Bell, User as UserIcon, ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAlerts } from '../alerts/AlertService';
import { base44 } from '@/api/base44Client';

export default function MobileNavigation({ user, navigationGroups, onNotificationClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const location = useLocation();
  const { unreadCount } = useAlerts();

  const quickLinks = [
    { name: 'Dashboard', href: createPageUrl('Dashboard'), icon: BarChart3, color: 'text-blue-400' },
    { name: 'Incidents', href: createPageUrl('Incidents'), icon: Shield, color: 'text-red-400' },
    { name: 'Alerts', onClick: onNotificationClick, icon: Bell, color: 'text-orange-400', badge: unreadCount },
    { name: 'Users', href: createPageUrl('UserAnalytics'), icon: Users, color: 'text-green-400' },
  ];

  const toggleGroup = (groupName) => {
    setExpandedGroup(expandedGroup === groupName ? null : groupName);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden bg-gray-900 border-b border-gray-800 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/174051417_Screenshot2025-07-24110248.jpg" 
              alt="Outpost Zero" 
              className="h-8 object-contain" 
            />
            <span className="text-lg font-bold text-white">Outpost Zero</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onNotificationClick}
              className="relative p-2 text-gray-400 hover:text-white touch-manipulation"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-semibold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 text-gray-400 hover:text-white touch-manipulation"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Quick Access Bar */}
        <div className="flex items-center gap-1 px-2 py-2 overflow-x-auto border-t border-gray-800 bg-gray-900/50 backdrop-blur">
          {quickLinks.map((link) => (
            <div key={link.name} className="relative">
              {link.onClick ? (
                <button
                  onClick={link.onClick}
                  className="flex flex-col items-center justify-center min-w-[70px] py-2 px-3 rounded-lg hover:bg-gray-800/50 touch-manipulation transition-colors"
                >
                  <link.icon className={`w-5 h-5 ${link.color} mb-1`} />
                  <span className="text-xs text-gray-300">{link.name}</span>
                  {link.badge > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-600 text-white text-xs">
                      {link.badge}
                    </Badge>
                  )}
                </button>
              ) : (
                <Link
                  to={link.href}
                  className="flex flex-col items-center justify-center min-w-[70px] py-2 px-3 rounded-lg hover:bg-gray-800/50 touch-manipulation transition-colors"
                >
                  <link.icon className={`w-5 h-5 ${link.color} mb-1`} />
                  <span className="text-xs text-gray-300">{link.name}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Full Menu Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent 
          side="left" 
          className="w-[85vw] bg-gray-900 border-gray-800 text-white p-0 overflow-y-auto"
        >
          <SheetHeader className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <UserIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <SheetTitle className="text-white text-left text-lg">
                  {user?.full_name || 'User'}
                </SheetTitle>
                <p className="text-sm text-gray-400">{user?.email || ''}</p>
                <Badge className="mt-1 bg-blue-600/20 text-blue-300">
                  {user?.role || 'user'}
                </Badge>
              </div>
            </div>
          </SheetHeader>

          <nav className="px-4 py-6 space-y-2">
            {navigationGroups.map((group) => (
              <div key={group.name} className="mb-4">
                <button
                  onClick={() => toggleGroup(group.name)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wider hover:text-white touch-manipulation transition-colors"
                >
                  {group.name}
                  <ChevronRight 
                    className={`w-4 h-4 transition-transform ${
                      expandedGroup === group.name ? 'rotate-90' : ''
                    }`} 
                  />
                </button>
                {expandedGroup === group.name && (
                  <div className="mt-2 space-y-1 pl-2">
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium touch-manipulation transition-colors ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                          }`}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="border-t border-gray-800 p-4 space-y-2">
            <Link
              to={createPageUrl('Settings')}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-white touch-manipulation transition-colors"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
            <button
              onClick={async () => {
                base44.auth.logout();
                window.location.href = createPageUrl('Welcome');
              }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 touch-manipulation transition-colors"
            >
              <X className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}