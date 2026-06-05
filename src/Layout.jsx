import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from './utils';
import AIAssistant from './components/ai/AIAssistant';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import MobileNavigation from './components/mobile/MobileNavigation';
import MobileAlertBanner from './components/mobile/MobileAlertBanner';
import { base44 } from '@/api/base44Client';
import { StripeSubscription } from '@/entities/StripeSubscription';
import WelcomePage from './pages/Welcome';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield, Activity, Users, Settings, AlertTriangle, Eye, BookOpen, BarChart3, Network, PlayCircle, Search, Bell,
  User as UserIcon, Menu, X, FileText, Box, Swords, ClipboardList, Server, CheckCircle, Cloud, GitBranch,
  BrainCircuit, PieChart, Brain, Smartphone, Heart, Code, TrendingUp, Target, BookUser, FlaskConical, Share2,
  Rocket, ChevronDown, ChevronRight, LifeBuoy, LogOut, Bot, Crown, Crosshair, Globe, Package, Monitor, Sparkles, Terminal, Zap
} from 'lucide-react';
import ProprietaryHeader from './components/branding/ProprietaryHeader';
import CyberDojoWatermark from './components/branding/CyberDojoWatermark';
import { Button } from '@/components/ui/button';
import { AlertProvider } from './components/alerts/AlertService';
import AlertPanel from './components/alerts/AlertPanel';
import { Toaster } from 'sonner';

const navigationGroups = [
  {
    name: 'Core Operations',
    items: [
      { name: 'Dashboard', href: createPageUrl('Dashboard'), icon: BarChart3 },
      { name: 'Incidents', href: createPageUrl('Incidents'), icon: AlertTriangle },
      { name: 'Investigations', href: createPageUrl('Investigations'), icon: Search },
      { name: 'Threat Intel', href: createPageUrl('ThreatIntel'), icon: Eye },
      { name: 'User Analytics', href: createPageUrl('UserAnalytics'), icon: Users },
      { name: 'Insider Threat Center', href: createPageUrl('InsiderThreatCenter'), icon: Users },
      { name: 'Query Studio', href: createPageUrl('QueryStudio'), icon: Code },
    ]
  },
  {
    name: 'Automation & Response',
    items: [
      { name: 'SOAR', href: createPageUrl('SOAR'), icon: PlayCircle },
      { name: 'AI Advisory Center', href: createPageUrl('AIAdvisoryCenter'), icon: Brain },
      { name: 'Automated Remediation', href: createPageUrl('AutomatedRemediation'), icon: Zap },
      { name: 'Attack Simulations', href: createPageUrl('AttackSimulations'), icon: Swords },
      { name: 'Automated Security', href: createPageUrl('AutomatedSecurity'), icon: Bot },
      { name: 'Agentic AI Platform', href: createPageUrl('AgenticAI'), icon: Sparkles },
      { name: 'Agent Deployment', href: createPageUrl('AgentDeployment'), icon: Monitor },
    ]
  },
  {
    name: 'Strategic Management',
    items: [
      { name: 'Executive Dashboard', href: createPageUrl('ExecutiveDashboard'), icon: PieChart },
      { name: 'Strategic Risk Center', href: createPageUrl('StrategicRiskCenter'), icon: Target },
      { name: 'Implementation Priority', href: createPageUrl('ImplementationPrioritization'), icon: Target },
      { name: 'Advanced Strategy', href: createPageUrl('AdvancedStrategy'), icon: Crown },
      { name: 'High Impact Initiatives', href: createPageUrl('HighImpactInitiatives'), adminOnly: true, icon: Crosshair },
      { name: 'Compliance', href: createPageUrl('Compliance'), icon: CheckCircle },
      { name: 'Cyber Credit Score', href: createPageUrl('CyberCreditScore'), icon: Target },
      { name: 'Project Management', href: createPageUrl('ProjectManagement'), icon: ClipboardList },
    ]
  },
  {
    name: 'Advanced Security',
    items: [
      { name: 'Quantum Safe Security', href: createPageUrl('QuantumSafeSecurity'), icon: Cloud },
      { name: 'Homomorphic Encryption', href: createPageUrl('HomomorphicEncryption'), icon: Code },
      { name: 'Deception Platforms', href: createPageUrl('DeceptionPlatforms'), icon: Eye },
      { name: 'Decentralized Identity', href: createPageUrl('DecentralizedIdentity'), icon: Users },
      { name: 'Deepfake Protection', href: createPageUrl('DeepfakeProtection'), icon: Eye },
      { name: 'Cyber Resilience', href: createPageUrl('CyberResilience'), icon: Heart },
    ]
  },
  {
    name: 'Physical Security',
    items: [
      { name: 'Evolv Weapons Detection', href: createPageUrl('EvolvIntegration'), icon: Shield },
    ]
  },
  {
    name: 'Platform Infrastructure',
    items: [
      { name: 'Data Sources', href: createPageUrl('DataSources'), icon: Server },
      { name: 'Infrastructure', href: createPageUrl('InfrastructureManagement'), icon: Server },
      { name: 'Infrastructure as Code', href: createPageUrl('InfrastructureAsCodeManagementPlatform'), icon: Code },
      { name: 'Cloud Security', href: createPageUrl('CloudSecurity'), icon: Cloud },
      { name: 'Disaster Recovery', href: createPageUrl('DisasterRecovery'), icon: Shield },
      { name: 'SD-WAN Integration', href: createPageUrl('SDWANIntegration'), icon: Network },
      { name: 'Software Defined Branch', href: createPageUrl('SoftwareDefinedBranch'), icon: GitBranch },
      { name: 'Mobile & IoT Security', href: createPageUrl('MobileSecurity'), icon: Smartphone },
      { name: 'Observability', href: createPageUrl('Observability'), icon: Activity },
      { name: 'DevSecOps', href: createPageUrl('DevSecOps'), icon: GitBranch },
      { name: 'Developer Tools', href: createPageUrl('DeveloperTools'), icon: Terminal },
    ]
  },
  {
    name: 'Revenue & GTM',
    items: [
      { name: 'Microsoft ISV Program', href: createPageUrl('MicrosoftISVReadiness'), adminOnly: true, icon: Rocket },
      { name: 'Secure Gateway Services', href: createPageUrl('SecureGatewayServices'), adminOnly: true, icon: Globe },
      { name: 'Integration Marketplace', href: createPageUrl('IntegrationMarketplace'), adminOnly: true, icon: Share2 },
      { name: 'Licensing Platform', href: createPageUrl('LicensingPlatform'), adminOnly: true, icon: FileText },
    ]
  },
  {
    name: 'Ecosystem & Knowledge',
    items: [
      { name: 'Knowledge Center', href: createPageUrl('KnowledgeCenter'), icon: BookOpen },
      { name: 'Capabilities Guide', href: createPageUrl('CapabilitiesGuide'), icon: BookOpen },
      { name: 'SDK Marketplace', href: createPageUrl('SDKMarketplace'), icon: Package },
      { name: 'My SDKs', href: createPageUrl('MySDKs'), icon: Code },
      { name: 'CerebraSec Integration', href: createPageUrl('CerebraSecIntegration'), icon: BrainCircuit },
      { name: 'Patented Technology', href: createPageUrl('PatentedTechnology'), icon: Code },
      { name: 'Threat Prediction Market', href: createPageUrl('ThreatPredictionMarket'), icon: TrendingUp },
      { name: 'API Documentation', href: createPageUrl('APIDocumentation'), icon: FileText },
      { name: 'AI Doc Generator', href: createPageUrl('DocumentationGenerator'), icon: Sparkles },
      { name: 'Training', href: createPageUrl('Training'), icon: BookUser },
    ]
  },
];

const NavItem = ({ item, currentPath }) => {
  const isActive = currentPath === item.href;
  
  return (
    <Link
      to={item.href}
      className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-white hover:bg-gray-700/50'
      }`}
      preventScrollReset={true}
    >
      <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-300'}`} />
      <span className="truncate">{item.name}</span>
    </Link>
  );
};

const NavGroup = ({ group, currentPath }) => {
    const [isOpen, setIsOpen] = useState(true);
    const isGroupActive = group.items.some(item => item.href === currentPath);
    
    useEffect(() => {
        if(isGroupActive) setIsOpen(true);
    }, [isGroupActive]);

    return (
        <div>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-xs font-semibold tracking-wider text-gray-400 uppercase my-2 px-3"
            >
                {group.name}
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {isOpen && (
                 <div className="space-y-1">
                    {group.items.map((item) => <NavItem key={item.name} item={item} currentPath={currentPath} />)}
                </div>
            )}
        </div>
    );
};

const Sidebar = ({ isSidebarOpen, user }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Check if user has admin access to Revenue & GTM section
  const hasRevenueAccess = user?.email?.endsWith('@cyberdojogroup.com') || user?.email?.endsWith('@eds-360.com') || user?.email?.endsWith('@emergingdefensesolutions.com') || user?.email === 'asaadmorman@gmail.com';
  const isCDSAdmin = (user?.role === 'admin' && hasRevenueAccess) || user?.email === 'asaadmorman@gmail.com' || user?.email?.endsWith('@eds-360.com') || user?.email?.endsWith('@emergingdefensesolutions.com');
  
  const filteredNavGroups = navigationGroups.map(group => ({
    ...group,
    items: group.items.filter(item => !item.adminOnly || isCDSAdmin)
  })).filter(group => group.items.length > 0);

  return (
    <div className={`fixed inset-y-0 left-0 z-20 w-64 bg-gray-900 border-r border-gray-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 hidden md:block`}>
      <div className="flex items-center justify-center h-20 px-4 border-b border-gray-800">
         <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/174051417_Screenshot2025-07-24110248.jpg" alt="Outpost Zero Logo" className="h-9 object-contain" />
         <span className="text-xl font-bold ml-3 text-white tracking-wider">Outpost Zero</span>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
        {filteredNavGroups.map(group => <NavGroup key={group.name} group={group} currentPath={currentPath} />)}
        <div className="pt-8 border-t border-gray-700 space-y-2">
            <Link to={createPageUrl("Settings")} className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white hover:bg-gray-700/30 transition-colors">
                <Settings className="mr-3 h-5 w-5 flex-shrink-0"/>
                <span>Settings</span>
            </Link>
            <div className="px-3 py-2">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6358de6e2_188ec1ee-2ae7-4d9b-aacd-de581b4988ff.png" 
                alt="Cyber Dojo Solutions" 
                className="h-6 object-contain opacity-60"
              />
            </div>
        </div>
      </nav>
    </div>
  );
};

const AppFooter = () => (
    <footer className="bg-gray-900 py-6 md:py-12 px-4 md:px-8 border-t border-gray-800 hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p className="text-center md:text-left mb-4 md:mb-0">&copy; {new Date().getFullYear()} Cyber Dojo Solutions, LLC. All Rights Reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                <Link to={createPageUrl('PrivacyPolicy')} className="hover:text-white">Privacy Policy</Link>
                <Link to={createPageUrl('TermsOfService')} className="hover:text-white">Terms of Service</Link>
                <Link to={createPageUrl('APIDocumentation')} className="hover:text-white">API Docs</Link>
                <Link to={createPageUrl('About')} className="hover:text-white">About Us</Link>
            </div>
        </div>
    </footer>
);

const IconMap = {
    AlertTriangle, Brain, FileText, Server, CheckCircle, Users, Crown, BookOpen, Crosshair, Code, Package, Monitor, Terminal
};

const Header = ({ onToggleSidebar, user, onOpenAlertPanel }) => {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const mockNotifications = [
                { id: '1', message: 'Critical incident detected in network segment A', status: 'unread', icon: 'AlertTriangle' },
                { id: '2', message: 'AI Advisory: Recommend updating firewall rules', status: 'unread', icon: 'Brain' },
                { id: '3', message: 'Weekly security report is ready', status: 'read', icon: 'FileText' }
            ];
            setNotifications(mockNotifications);
        }
    }, [user]);

    const handleLogout = async () => {
        base44.auth.logout('/Welcome');
    };

    const handleNotificationClick = (notification) => {
        setNotifications(notifications.map(n => n.id === notification.id ? { ...n, status: 'read' } : n));
        if (notification.icon === 'AlertTriangle') {
            navigate(createPageUrl('Incidents'));
        } else if (notification.icon === 'Brain') {
            navigate(createPageUrl('AIAdvisoryCenter'));
        }
    };

    const unreadCount = notifications.filter(n => n.status === 'unread').length;

    return (
        <header className="flex items-center justify-between h-20 px-6 bg-gray-900 border-b border-gray-800 md:justify-end hidden md:flex">
            <button onClick={onToggleSidebar} className="md:hidden text-gray-400 hover:text-white">
                <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-6">
                {/* Alert Bell */}
                <button 
                    onClick={onOpenAlertPanel}
                    className="relative text-gray-400 hover:text-white"
                >
                    <Bell className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        !
                    </span>
                </button>

                {/* Existing notifications popover */}
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="relative text-gray-400 hover:text-white">
                            <Bell className="h-6 w-6" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-gray-800 border-gray-700 text-white">
                        <div className="p-4">
                            <h4 className="font-semibold">Notifications</h4>
                        </div>
                        <div className="space-y-2 p-2 max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? notifications.map(n => {
                                const IconComponent = IconMap[n.icon] || Bell;
                                return (
                                <div key={n.id} onClick={() => handleNotificationClick(n)} className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-700/50 cursor-pointer">
                                    {n.status === 'unread' && <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>}
                                    <IconComponent className={`w-5 h-5 mt-1 flex-shrink-0 ${n.status === 'read' ? 'text-gray-500' : 'text-blue-400'}`} />
                                    <p className={`text-sm ${n.status === 'read' ? 'text-gray-400' : 'text-white'}`}>{n.message}</p>
                                </div>
                            )}) : <p className="text-center text-sm text-gray-400 p-4">No new notifications.</p>}
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Existing user dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="text-gray-400 hover:text-white">
                           <UserIcon className="h-6 w-6" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-white">
                        <DropdownMenuLabel>
                            <p>{user?.full_name || 'User'}</p>
                            <p className="text-xs font-normal text-gray-400">{user?.email || ''}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-700"/>
                        <DropdownMenuItem asChild>
                            <Link to={createPageUrl('Settings')} className="cursor-pointer flex items-center">
                                <Settings className="mr-2 h-4 w-4" /> Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to={createPageUrl('Subscription')} className="cursor-pointer flex items-center">
                                <CheckCircle className="mr-2 h-4 w-4" /> Subscription
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-700"/>
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center text-red-300 focus:bg-red-900/50 focus:text-red-200">
                           <LogOut className="mr-2 h-4 w-4" /> Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}


function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 1024px)').matches);
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 1024px)');
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
    return isMobile;
}

export default function Layout({ children, currentPageName }) {
    const [authStatus, setAuthStatus] = useState('loading'); 
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showAlertPanel, setShowAlertPanel] = useState(false);
    const location = useLocation();
    const isMobile = useIsMobile();

    useEffect(() => {
        // Disable automatic scroll restoration
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const isAuthed = await base44.auth.isAuthenticated();
                if (!isAuthed) {
                    setAuthStatus('unauthenticated');
                    return;
                }

                const currentUser = await base44.auth.me();
                if (currentUser) {
                    setUser(currentUser);
                    setAuthStatus('authenticated');
                } else {
                    setAuthStatus('unauthenticated');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setAuthStatus('unauthenticated');
            }
        };
        verifyAuth();
    }, [location.pathname]);

    // Pages that should always be accessible (no auth required)
    const publicPages = ['Welcome', 'TermsOfService', 'PrivacyPolicy', 'StripeSuccess', 'NextSteps', 'DomainDebug', 'DiagnosticTest', 'About', 'EmergencyTest', 'DashboardSimple'];
    const isPublicPage = publicPages.includes(currentPageName);

    // Loading state
    if (authStatus === 'loading') {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading Outpost Zero...</p>
                    <p className="text-gray-400 text-sm mt-2">Verifying access permissions...</p>
                </div>
            </div>
        );
    }

    // Public pages - show without layout
    if (isPublicPage) {
        return children;
    }
    
    // User authenticated - show full app
    if (authStatus === 'authenticated' && user) {
        const hasRevenueAccess = user?.email?.endsWith('@cyberdojogroup.com') || user?.email?.endsWith('@eds-360.com') || user?.email?.endsWith('@emergingdefensesolutions.com') || user?.email === 'asaadmorman@gmail.com';
        const isCDSAdmin = (user?.role === 'admin' && hasRevenueAccess) || user?.email === 'asaadmorman@gmail.com' || user?.email?.endsWith('@eds-360.com') || user?.email?.endsWith('@emergingdefensesolutions.com');
        
        const filteredNavGroups = navigationGroups.map(group => ({
          ...group,
          items: group.items.filter(item => !item.adminOnly || isCDSAdmin)
        })).filter(group => group.items.length > 0);

        return (
            <AlertProvider>
                <Toaster position="top-right" richColors closeButton />
                <div className="flex flex-col h-screen bg-gray-800 text-gray-100">
                    <ProprietaryHeader />
                    <OnboardingWizard 
                        isOpen={showOnboarding} 
                        onClose={() => setShowOnboarding(false)} 
                    />
                    
                    {isMobile && (
                        <MobileNavigation 
                            user={user} 
                            navigationGroups={filteredNavGroups}
                            onNotificationClick={() => setShowAlertPanel(true)}
                        />
                    )}

                    {/* Mobile Alert Banner */}
                    <MobileAlertBanner onOpenPanel={() => setShowAlertPanel(true)} />

                    <div className="flex flex-1 overflow-hidden pt-16 md:pt-0">
                        <style>{`
                            html {
                                scroll-behavior: auto !important;
                            }
                            :root {
                                --primary-bg: linear-gradient(135deg, #1f2937 0%, #111827 100%);
                                --text-secondary: #9ca3af;
                                --cyber-dojo-primary: #4f46e5;
                                --cyber-dojo-secondary: #7c3aed;
                            }
                            .severity-critical { color: #f87171; background-color: #7f1d1d; }
                            .severity-high { color: #fb923c; background-color: #9a3412; }
                            .severity-medium { color: #fbbf24; background-color: #92400e; }
                            .severity-low { color: #34d399; background-color: #065f46; }
                            .app-scrollbar::-webkit-scrollbar {
                                width: 8px;
                            }
                            .app-scrollbar::-webkit-scrollbar-track {
                                background: #374151;
                                border-radius: 4px;
                            }
                            .app-scrollbar::-webkit-scrollbar-thumb {
                                background: #6b7280;
                                border-radius: 4px;
                            }
                            .app-scrollbar::-webkit-scrollbar-thumb:hover {
                                background: #9ca3af;
                            }
                            .cyber-pulse {
                                animation: cyber-pulse 2s infinite;
                            }
                            @keyframes cyber-pulse {
                                0%, 100% { opacity: 1; }
                                50% { opacity: 0.7; }
                            }
                            /* Mobile optimizations */
                            @media (max-width: 768px) {
                                .touch-manipulation {
                                    touch-action: manipulation;
                                    -webkit-tap-highlight-color: transparent;
                                }
                                button, a {
                                    min-height: 44px;
                                    min-width: 44px;
                                }
                            }
                            body { overscroll-behavior: none; }
                            #main-scroll { overscroll-behavior: none; }
                        `}</style>
                        <Sidebar isSidebarOpen={isSidebarOpen} user={user} />
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <Header 
                                onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
                                user={user}
                                onOpenAlertPanel={() => setShowAlertPanel(true)}
                            />
                            <main id="main-scroll" className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800 relative pb-16 md:pb-0">
                                <div className="min-h-full">
                                    {children}
                                </div>
                                <CyberDojoWatermark position="bottom-right" />
                            </main>
                            <AppFooter />
                        </div>
                        <AIAssistant />
                    </div>
                    
                    <AlertPanel 
                        isOpen={showAlertPanel} 
                        onClose={() => setShowAlertPanel(false)} 
                    />
                </div>
            </AlertProvider>
        );
    }
    
    // Not authenticated - show welcome page
    return <WelcomePage />;
}