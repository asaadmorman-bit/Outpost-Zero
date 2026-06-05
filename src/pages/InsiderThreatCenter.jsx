
import React, { useState, useEffect } from 'react';
import { User, PersonnelSecurityClearance, UserBehavior } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, UserX, AlertTriangle, ShieldCheck, History, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const statusStyles = {
    'Active': { icon: ShieldCheck, color: 'bg-green-500/20 text-green-300 border-green-500/50' },
    'Suspended': { icon: UserX, color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' },
    'Revoked': { icon: UserX, color: 'bg-red-500/20 text-red-300 border-red-500/50' },
    'Needs_Review': { icon: AlertTriangle, color: 'bg-orange-500/20 text-orange-300 border-orange-500/50' }
};

export default function InsiderThreatCenterPage() {
    const [highRiskUsers, setHighRiskUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userActivity, setUserActivity] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            // In production, this logic would be more complex, likely fetching users with recent clearance changes or high anomaly scores.
            const users = await User.list();
            const clearances = await PersonnelSecurityClearance.list();
            
            const userMap = users.reduce((acc, user) => {
                acc[user.id] = user;
                return acc;
            }, {});

            const usersWithClearance = clearances
                .filter(c => c.status !== 'Active')
                .map(c => ({
                    ...userMap[c.subject_id],
                    clearance_status: c.status,
                    last_event: c.event_timestamp
                }));

            setHighRiskUsers(usersWithClearance);
            if (usersWithClearance.length > 0) {
                handleUserSelect(usersWithClearance[0]);
            }
            setIsLoading(false);
        };
        loadData();
    }, []);

    const handleUserSelect = async (user) => {
        setSelectedUser(user);
        const activity = await UserBehavior.filter({ user_id: user.id }, '-timestamp', 20);
        setUserActivity(activity);
    };

    const filteredUsers = highRiskUsers.filter(u => 
        u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
            <div className="max-w-7xl mx-auto">
                <CardHeader className="px-0">
                    <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
                        <UserCheck className="text-blue-400" />
                        Insider Threat & Personnel Security Center
                    </CardTitle>
                    <p className="text-gray-300">Correlate DISS/JADE personnel events with user behavior analytics.</p>
                </CardHeader>
                
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Panel: High-Risk Users List */}
                    <div className="lg:col-span-1">
                        <Card className="border-gray-700 bg-gray-800/50">
                            <CardHeader>
                                <CardTitle className="text-white">High-Risk Personnel Monitor</CardTitle>
                                <div className="relative mt-2">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input 
                                        placeholder="Search users..." 
                                        className="pl-10 bg-gray-900 border-gray-600 text-white"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 max-h-[60vh] overflow-y-auto">
                                {isLoading ? <p className="text-gray-400">Loading users...</p> : 
                                    filteredUsers.map(user => {
                                        const style = statusStyles[user.clearance_status] || statusStyles['Needs_Review'];
                                        return (
                                            <div key={user.id} onClick={() => handleUserSelect(user)}
                                                className={`p-3 rounded-lg cursor-pointer border-l-4 transition-colors ${selectedUser?.id === user.id ? 'bg-blue-500/20 border-blue-400' : 'bg-gray-900/50 border-transparent hover:bg-gray-700/50'}`}>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-semibold text-white">{user.full_name}</p>
                                                        <p className="text-sm text-gray-400">{user.email}</p>
                                                    </div>
                                                    <Badge className={style.color}>
                                                        <style.icon className="w-3 h-3 mr-1.5" />
                                                        {user.clearance_status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Panel: Selected User Details */}
                    <div className="lg:col-span-2">
                        {selectedUser ? (
                            <Card className="border-gray-700 bg-gray-800/50">
                                <CardHeader>
                                    <CardTitle className="text-white text-xl">Correlated Activity Timeline: {selectedUser.full_name}</CardTitle>
                                    <p className="text-gray-400">Recent user activity correlated with clearance status from DISS.</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="flex justify-around bg-gray-900/50 p-4 rounded-lg">
                                            <div className="text-center">
                                                <p className="text-sm text-gray-400">Current Clearance</p>
                                                <p className="text-lg font-bold text-white">{selectedUser.clearance_status.replace('_', ' ')}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-gray-400">Last DISS Event</p>
                                                <p className="text-lg font-bold text-white">{new Date(selectedUser.last_event).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><History /> Recent Activity</h4>
                                            <div className="relative pl-6 space-y-4 after:absolute after:inset-y-0 after:left-0 after:w-0.5 after:bg-gray-700">
                                                {userActivity.map(activity => (
                                                    <div key={activity.id} className="relative">
                                                        <div className="absolute -left-[35px] top-1.5 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-gray-800"></div>
                                                        <p className="text-sm text-gray-400">{new Date(activity.timestamp).toLocaleString()}</p>
                                                        <p className="font-medium text-white">{activity.activity_type.replace('_', ' ')}</p>
                                                        <p className="text-sm text-gray-300">{activity.details?.description || 'No details provided.'}</p>
                                                        {activity.context?.clearance_status_at_event && (
                                                            <Badge variant="outline" className="mt-1 text-xs bg-yellow-500/10 text-yellow-300">
                                                                Clearance at time: {activity.context.clearance_status_at_event}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="flex items-center justify-center h-full rounded-lg bg-gray-800/30 border-2 border-dashed border-gray-700">
                                <p className="text-gray-400">Select a user to view their correlated timeline.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
