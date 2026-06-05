import React, { useState, useEffect } from 'react';
import { MobileDevice, MDMIntegration } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
    Smartphone, 
    Shield, 
    AlertTriangle, 
    CheckCircle, 
    Settings, 
    Users,
    Wifi,
    Battery,
    HardDrive,
    MapPin,
    Lock,
    Eye,
    Zap
} from 'lucide-react';

export default function MobileDeviceManagementPage() {
    const [devices, setDevices] = useState([]);
    const [mdmIntegrations, setMdmIntegrations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [devicesData, mdmData] = await Promise.all([
                MobileDevice.list("-last_check_in"),
                MDMIntegration.list()
            ]);
            setDevices(devicesData.length > 0 ? devicesData : getMockDevices());
            setMdmIntegrations(mdmData.length > 0 ? mdmData : getMockMDM());
        } catch (error) {
            console.error('Error loading mobile data:', error);
            setDevices(getMockDevices());
            setMdmIntegrations(getMockMDM());
        }
        setIsLoading(false);
    };

    const getMockDevices = () => [
        {
            device_id: "iOS_001",
            user_email: "john.doe@company.com",
            device_name: "John's iPhone 15 Pro",
            platform: "ios",
            os_version: "17.2.1",
            app_version: "2.1.0",
            mdm_enrolled: true,
            mdm_provider: "microsoft_intune",
            compliance_status: "compliant",
            security_posture: {
                device_encrypted: true,
                screen_lock_enabled: true,
                biometric_enabled: true,
                jailbroken_rooted: false,
                vpn_connected: true,
                malware_detected: false,
                certificate_status: "valid",
                app_protection_enabled: true
            },
            location_info: {
                country: "USA",
                city: "New York",
                wifi_network: "Corporate-WiFi",
                network_security: "secure"
            },
            last_check_in: new Date().toISOString(),
            battery_level: 78,
            storage_info: {
                total_gb: 256,
                free_gb: 128,
                apps_count: 47
            }
        },
        {
            device_id: "AND_002", 
            user_email: "jane.smith@company.com",
            device_name: "Jane's Galaxy S24",
            platform: "android",
            os_version: "14.0.0",
            app_version: "2.1.0",
            mdm_enrolled: true,
            mdm_provider: "google_workspace",
            compliance_status: "non_compliant",
            security_posture: {
                device_encrypted: true,
                screen_lock_enabled: false,
                biometric_enabled: true,
                jailbroken_rooted: false,
                vpn_connected: false,
                malware_detected: false,
                certificate_status: "expired",
                app_protection_enabled: false
            },
            location_info: {
                country: "USA", 
                city: "Austin",
                wifi_network: "Home-Network",
                network_security: "open"
            },
            last_check_in: new Date(Date.now() - 30000).toISOString(),
            battery_level: 45,
            storage_info: {
                total_gb: 128,
                free_gb: 32,
                apps_count: 89
            }
        }
    ];

    const getMockMDM = () => [
        {
            integration_id: "mdm_intune",
            organization_id: "org_001",
            mdm_provider: "microsoft_intune",
            connection_status: "connected",
            managed_devices_count: 1247,
            last_sync: new Date().toISOString(),
            security_center_integration: {
                microsoft_defender: true,
                google_security_center: false,
                apple_business_manager: true
            }
        },
        {
            integration_id: "mdm_jamf",
            organization_id: "org_001", 
            mdm_provider: "jamf",
            connection_status: "connected",
            managed_devices_count: 89,
            last_sync: new Date().toISOString(),
            security_center_integration: {
                apple_business_manager: true,
                microsoft_defender: false
            }
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'compliant': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'non_compliant': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        }
    };

    const getPlatformIcon = (platform) => platform === 'ios' ? '🍎' : '🤖';

    const compliantDevices = devices.filter(d => d.compliance_status === 'compliant').length;
    const totalThreats = devices.reduce((sum, d) => sum + (d.threat_detections?.length || 0), 0);
    const mdmEnrolled = devices.filter(d => d.mdm_enrolled).length;

    return (
        <div className="min-h-screen p-3 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Mobile Device Management</h1>
                        <p className="text-gray-300 text-sm md:text-base">Monitor and secure your mobile workforce</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 mt-4 md:mt-0 w-full md:w-auto">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure MDM
                    </Button>
                </div>

                {/* Mobile-Optimized Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-3 md:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-xs md:text-sm">Total Devices</p>
                                    <p className="text-xl md:text-2xl font-bold text-white">{devices.length}</p>
                                </div>
                                <Smartphone className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-3 md:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-xs md:text-sm">Compliant</p>
                                    <p className="text-xl md:text-2xl font-bold text-green-400">{compliantDevices}</p>
                                </div>
                                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-3 md:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-xs md:text-sm">MDM Enrolled</p>
                                    <p className="text-xl md:text-2xl font-bold text-purple-400">{mdmEnrolled}</p>
                                </div>
                                <Shield className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-700 bg-gray-800/50">
                        <CardContent className="p-3 md:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-xs md:text-sm">Threats</p>
                                    <p className="text-xl md:text-2xl font-bold text-red-400">{totalThreats}</p>
                                </div>
                                <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-red-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="devices" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-8">
                        <TabsTrigger value="devices" className="text-xs md:text-sm">Devices</TabsTrigger>
                        <TabsTrigger value="mdm" className="text-xs md:text-sm">MDM Integration</TabsTrigger>
                        <TabsTrigger value="policies" className="text-xs md:text-sm">Policies</TabsTrigger>
                    </TabsList>

                    <TabsContent value="devices">
                        <div className="grid gap-4 md:gap-6">
                            {devices.map(device => (
                                <Card key={device.device_id} className="border-gray-700 bg-gray-800/50">
                                    <CardHeader className="pb-3">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="text-2xl">{getPlatformIcon(device.platform)}</div>
                                                <div>
                                                    <CardTitle className="text-white text-sm md:text-base">{device.device_name}</CardTitle>
                                                    <p className="text-gray-400 text-xs md:text-sm">{device.user_email}</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className={getStatusColor(device.compliance_status)}>
                                                {device.compliance_status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs md:text-sm">
                                            <div className="flex items-center gap-2">
                                                <Battery className="w-4 h-4 text-yellow-400" />
                                                <span className="text-white">{device.battery_level}%</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <HardDrive className="w-4 h-4 text-blue-400" />
                                                <span className="text-white">{device.storage_info.free_gb}GB free</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-green-400" />
                                                <span className="text-white">{device.location_info.city}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {device.security_posture.vpn_connected ? (
                                                    <Shield className="w-4 h-4 text-green-400" />
                                                ) : (
                                                    <AlertTriangle className="w-4 h-4 text-red-400" />
                                                )}
                                                <span className="text-white">
                                                    {device.security_posture.vpn_connected ? 'VPN On' : 'VPN Off'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 pt-4 border-t border-gray-700">
                                            <div className="flex flex-col md:flex-row gap-3">
                                                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1 md:flex-none">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </Button>
                                                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1 md:flex-none">
                                                    <Zap className="w-4 h-4 mr-2" />
                                                    Quick Actions
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="mdm">
                        <div className="grid gap-4 md:gap-6">
                            {mdmIntegrations.map(mdm => (
                                <Card key={mdm.integration_id} className="border-gray-700 bg-gray-800/50">
                                    <CardHeader>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                            <CardTitle className="text-white capitalize text-sm md:text-base">
                                                {mdm.mdm_provider.replace('_', ' ')}
                                            </CardTitle>
                                            <Badge className={mdm.connection_status === 'connected' ? 
                                                'bg-green-500/20 text-green-400' : 
                                                'bg-red-500/20 text-red-400'
                                            }>
                                                {mdm.connection_status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-400">Managed Devices</p>
                                                <p className="text-white font-semibold">{mdm.managed_devices_count.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Last Sync</p>
                                                <p className="text-white font-semibold">
                                                    {new Date(mdm.last_sync).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Security Centers</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {mdm.security_center_integration.microsoft_defender && (
                                                        <Badge variant="outline" className="text-xs">Defender</Badge>
                                                    )}
                                                    {mdm.security_center_integration.apple_business_manager && (
                                                        <Badge variant="outline" className="text-xs">Apple Business</Badge>
                                                    )}
                                                    {mdm.security_center_integration.google_security_center && (
                                                        <Badge variant="outline" className="text-xs">Google Security</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="policies">
                        <Card className="border-gray-700 bg-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white">Security Policies</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 bg-gray-900/50 rounded-lg">
                                        <div>
                                            <h4 className="text-white font-medium text-sm md:text-base">Device Encryption Required</h4>
                                            <p className="text-gray-400 text-xs md:text-sm">All devices must have full-disk encryption enabled</p>
                                        </div>
                                        <Badge className="bg-green-500/20 text-green-400 mt-2 md:mt-0">Enforced</Badge>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 bg-gray-900/50 rounded-lg">
                                        <div>
                                            <h4 className="text-white font-medium text-sm md:text-base">Jailbreak/Root Detection</h4>
                                            <p className="text-gray-400 text-xs md:text-sm">Automatically detect and block compromised devices</p>
                                        </div>
                                        <Badge className="bg-green-500/20 text-green-400 mt-2 md:mt-0">Enforced</Badge>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 bg-gray-900/50 rounded-lg">
                                        <div>
                                            <h4 className="text-white font-medium text-sm md:text-base">App Protection Policy</h4>
                                            <p className="text-gray-400 text-xs md:text-sm">Prevent data leakage from corporate applications</p>
                                        </div>
                                        <Badge className="bg-yellow-500/20 text-yellow-400 mt-2 md:mt-0">Monitoring</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}