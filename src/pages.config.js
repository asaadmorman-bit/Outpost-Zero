/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AIAdvisoryCenter from './pages/AIAdvisoryCenter';
import AIModelManagement from './pages/AIModelManagement';
import APIDocumentation from './pages/APIDocumentation';
import About from './pages/About';
import AdvancedStrategy from './pages/AdvancedStrategy';
import AgentDeployment from './pages/AgentDeployment';
import AgenticAI from './pages/AgenticAI';
import AlertSettings from './pages/AlertSettings';
import AlertsDemo from './pages/AlertsDemo';
import AndroidIntegrationGuide from './pages/AndroidIntegrationGuide';
import AndroidStepByStep from './pages/AndroidStepByStep';
import ArchitectureOverview from './pages/ArchitectureOverview';
import AttackSimulations from './pages/AttackSimulations';
import AutomatedRemediation from './pages/AutomatedRemediation';
import AutomatedSecurity from './pages/AutomatedSecurity';
import CapabilitiesGuide from './pages/CapabilitiesGuide';
import CerebraSecIntegration from './pages/CerebraSecIntegration';
import CloudDashboard from './pages/CloudDashboard';
import CloudSecurity from './pages/CloudSecurity';
import CommunityHub from './pages/CommunityHub';
import Compliance from './pages/Compliance';
import CounterIntelligenceHub from './pages/CounterIntelligenceHub';
import CustomSDKRequest from './pages/CustomSDKRequest';
import CyberAwarenessTraining from './pages/CyberAwarenessTraining';
import CyberCreditScore from './pages/CyberCreditScore';
import CyberInsuranceHub from './pages/CyberInsuranceHub';
import CyberResilience from './pages/CyberResilience';
import Dashboard from './pages/Dashboard';
import DashboardSimple from './pages/DashboardSimple';
import DashboardTest from './pages/DashboardTest';
import DataSources from './pages/DataSources';
import DecentralizedIdentity from './pages/DecentralizedIdentity';
import DeceptionPlatforms from './pages/DeceptionPlatforms';
import DeepfakeProtection from './pages/DeepfakeProtection';
import DemoDashboard from './pages/DemoDashboard';
import DemoIncidents from './pages/DemoIncidents';
import DemoLogin from './pages/DemoLogin';
import DemoSettings from './pages/DemoSettings';
import DeploymentPlan from './pages/DeploymentPlan';
import DevSecOps from './pages/DevSecOps';
import DeveloperTools from './pages/DeveloperTools';
import DiagnosticDashboard from './pages/DiagnosticDashboard';
import DiagnosticTest from './pages/DiagnosticTest';
import DisasterRecovery from './pages/DisasterRecovery';
import DocumentationGenerator from './pages/DocumentationGenerator';
import DomainDebug from './pages/DomainDebug';
import DomainSetup from './pages/DomainSetup';
import EmergencyDashboard from './pages/EmergencyDashboard';
import EmergencyTest from './pages/EmergencyTest';
import EvolvIntegration from './pages/EvolvIntegration';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import GapAnalysis from './pages/GapAnalysis';
import Guides from './pages/Guides';
import HealthcareCompliance from './pages/HealthcareCompliance';
import HighImpactInitiatives from './pages/HighImpactInitiatives';
import Home from './pages/Home';
import HomomorphicEncryption from './pages/HomomorphicEncryption';
import ImplementationPrioritization from './pages/ImplementationPrioritization';
import IncidentPlaybooks from './pages/IncidentPlaybooks';
import Incidents from './pages/Incidents';
import InfrastructureAsCodeManagementPlatform from './pages/InfrastructureAsCodeManagementPlatform';
import InfrastructureManagement from './pages/InfrastructureManagement';
import InsiderThreatCenter from './pages/InsiderThreatCenter';
import IntegrationMarketplace from './pages/IntegrationMarketplace';
import Investigations from './pages/Investigations';
import KnowledgeCenter from './pages/KnowledgeCenter';
import LicensingPlatform from './pages/LicensingPlatform';
import MicrosoftISVIntegration from './pages/MicrosoftISVIntegration';
import MicrosoftISVReadiness from './pages/MicrosoftISVReadiness';
import MobileAppDownloads from './pages/MobileAppDownloads';
import MobileDeviceManagement from './pages/MobileDeviceManagement';
import MobileSecurity from './pages/MobileSecurity';
import MultiPlatformDashboard from './pages/MultiPlatformDashboard';
import MySDKs from './pages/MySDKs';
import NetworkDashboard from './pages/NetworkDashboard';
import NextSteps from './pages/NextSteps';
import Notifications from './pages/Notifications';
import Observability from './pages/Observability';
import PatentedTechnology from './pages/PatentedTechnology';
import PatentedTechnologyImplementation from './pages/PatentedTechnologyImplementation';
import PhysicalSecurity from './pages/PhysicalSecurity';
import PlatformArchitecture from './pages/PlatformArchitecture';
import PredictiveAlerts from './pages/PredictiveAlerts';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProjectManagement from './pages/ProjectManagement';
import QuantumSafeSecurity from './pages/QuantumSafeSecurity';
import Quarantine from './pages/Quarantine';
import QueryStudio from './pages/QueryStudio';
import RemotionSetupGuide from './pages/RemotionSetupGuide';
import Reporting from './pages/Reporting';
import SDKMarketplace from './pages/SDKMarketplace';
import SDWANIntegration from './pages/SDWANIntegration';
import SIEMComparison from './pages/SIEMComparison';
import SOAR from './pages/SOAR';
import Sandbox from './pages/Sandbox';
import SecureGatewayServices from './pages/SecureGatewayServices';
import SecurityToolIntegrations from './pages/SecurityToolIntegrations';
import Settings from './pages/Settings';
import SoftwareDefinedBranch from './pages/SoftwareDefinedBranch';
import StrategicRiskCenter from './pages/StrategicRiskCenter';
import StrategicRoadmap from './pages/StrategicRoadmap';
import StripeSuccess from './pages/StripeSuccess';
import Subscription from './pages/Subscription';
import SystemRequirements from './pages/SystemRequirements';
import SystemStatus from './pages/SystemStatus';
import TermsOfService from './pages/TermsOfService';
import ThreatFeeds from './pages/ThreatFeeds';
import ThreatIntel from './pages/ThreatIntel';
import ThreatPredictionMarket from './pages/ThreatPredictionMarket';
import Training from './pages/Training';
import UserAnalytics from './pages/UserAnalytics';
import VendorAdvisories from './pages/VendorAdvisories';
import VulnerabilityManagement from './pages/VulnerabilityManagement';
import Welcome from './pages/Welcome';
import WelcomeRedirect from './pages/WelcomeRedirect';
import ZeroTrustDashboard from './pages/ZeroTrustDashboard';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AIAdvisoryCenter": AIAdvisoryCenter,
    "AIModelManagement": AIModelManagement,
    "APIDocumentation": APIDocumentation,
    "About": About,
    "AdvancedStrategy": AdvancedStrategy,
    "AgentDeployment": AgentDeployment,
    "AgenticAI": AgenticAI,
    "AlertSettings": AlertSettings,
    "AlertsDemo": AlertsDemo,
    "AndroidIntegrationGuide": AndroidIntegrationGuide,
    "AndroidStepByStep": AndroidStepByStep,
    "ArchitectureOverview": ArchitectureOverview,
    "AttackSimulations": AttackSimulations,
    "AutomatedRemediation": AutomatedRemediation,
    "AutomatedSecurity": AutomatedSecurity,
    "CapabilitiesGuide": CapabilitiesGuide,
    "CerebraSecIntegration": CerebraSecIntegration,
    "CloudDashboard": CloudDashboard,
    "CloudSecurity": CloudSecurity,
    "CommunityHub": CommunityHub,
    "Compliance": Compliance,
    "CounterIntelligenceHub": CounterIntelligenceHub,
    "CustomSDKRequest": CustomSDKRequest,
    "CyberAwarenessTraining": CyberAwarenessTraining,
    "CyberCreditScore": CyberCreditScore,
    "CyberInsuranceHub": CyberInsuranceHub,
    "CyberResilience": CyberResilience,
    "Dashboard": Dashboard,
    "DashboardSimple": DashboardSimple,
    "DashboardTest": DashboardTest,
    "DataSources": DataSources,
    "DecentralizedIdentity": DecentralizedIdentity,
    "DeceptionPlatforms": DeceptionPlatforms,
    "DeepfakeProtection": DeepfakeProtection,
    "DemoDashboard": DemoDashboard,
    "DemoIncidents": DemoIncidents,
    "DemoLogin": DemoLogin,
    "DemoSettings": DemoSettings,
    "DeploymentPlan": DeploymentPlan,
    "DevSecOps": DevSecOps,
    "DeveloperTools": DeveloperTools,
    "DiagnosticDashboard": DiagnosticDashboard,
    "DiagnosticTest": DiagnosticTest,
    "DisasterRecovery": DisasterRecovery,
    "DocumentationGenerator": DocumentationGenerator,
    "DomainDebug": DomainDebug,
    "DomainSetup": DomainSetup,
    "EmergencyDashboard": EmergencyDashboard,
    "EmergencyTest": EmergencyTest,
    "EvolvIntegration": EvolvIntegration,
    "ExecutiveDashboard": ExecutiveDashboard,
    "GapAnalysis": GapAnalysis,
    "Guides": Guides,
    "HealthcareCompliance": HealthcareCompliance,
    "HighImpactInitiatives": HighImpactInitiatives,
    "Home": Home,
    "HomomorphicEncryption": HomomorphicEncryption,
    "ImplementationPrioritization": ImplementationPrioritization,
    "IncidentPlaybooks": IncidentPlaybooks,
    "Incidents": Incidents,
    "InfrastructureAsCodeManagementPlatform": InfrastructureAsCodeManagementPlatform,
    "InfrastructureManagement": InfrastructureManagement,
    "InsiderThreatCenter": InsiderThreatCenter,
    "IntegrationMarketplace": IntegrationMarketplace,
    "Investigations": Investigations,
    "KnowledgeCenter": KnowledgeCenter,
    "LicensingPlatform": LicensingPlatform,
    "MicrosoftISVIntegration": MicrosoftISVIntegration,
    "MicrosoftISVReadiness": MicrosoftISVReadiness,
    "MobileAppDownloads": MobileAppDownloads,
    "MobileDeviceManagement": MobileDeviceManagement,
    "MobileSecurity": MobileSecurity,
    "MultiPlatformDashboard": MultiPlatformDashboard,
    "MySDKs": MySDKs,
    "NetworkDashboard": NetworkDashboard,
    "NextSteps": NextSteps,
    "Notifications": Notifications,
    "Observability": Observability,
    "PatentedTechnology": PatentedTechnology,
    "PatentedTechnologyImplementation": PatentedTechnologyImplementation,
    "PhysicalSecurity": PhysicalSecurity,
    "PlatformArchitecture": PlatformArchitecture,
    "PredictiveAlerts": PredictiveAlerts,
    "PrivacyPolicy": PrivacyPolicy,
    "ProjectManagement": ProjectManagement,
    "QuantumSafeSecurity": QuantumSafeSecurity,
    "Quarantine": Quarantine,
    "QueryStudio": QueryStudio,
    "RemotionSetupGuide": RemotionSetupGuide,
    "Reporting": Reporting,
    "SDKMarketplace": SDKMarketplace,
    "SDWANIntegration": SDWANIntegration,
    "SIEMComparison": SIEMComparison,
    "SOAR": SOAR,
    "Sandbox": Sandbox,
    "SecureGatewayServices": SecureGatewayServices,
    "SecurityToolIntegrations": SecurityToolIntegrations,
    "Settings": Settings,
    "SoftwareDefinedBranch": SoftwareDefinedBranch,
    "StrategicRiskCenter": StrategicRiskCenter,
    "StrategicRoadmap": StrategicRoadmap,
    "StripeSuccess": StripeSuccess,
    "Subscription": Subscription,
    "SystemRequirements": SystemRequirements,
    "SystemStatus": SystemStatus,
    "TermsOfService": TermsOfService,
    "ThreatFeeds": ThreatFeeds,
    "ThreatIntel": ThreatIntel,
    "ThreatPredictionMarket": ThreatPredictionMarket,
    "Training": Training,
    "UserAnalytics": UserAnalytics,
    "VendorAdvisories": VendorAdvisories,
    "VulnerabilityManagement": VulnerabilityManagement,
    "Welcome": Welcome,
    "WelcomeRedirect": WelcomeRedirect,
    "ZeroTrustDashboard": ZeroTrustDashboard,
}

export const pagesConfig = {
    mainPage: "Welcome",
    Pages: PAGES,
    Layout: __Layout,
};