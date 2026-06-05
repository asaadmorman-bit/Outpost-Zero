import React, { useState, useEffect } from "react";
import { Notification } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Plus, Edit, Trash2 } from "lucide-react";

export default function NotificationsPage() {
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    setIsLoading(true);
    const data = await Notification.list();
    setRules(data);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Bell className="w-8 h-8 text-purple-400" /> Notification Rules
          </h1>
          <Button><Plus className="mr-2 h-4 w-4" />New Rule</Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? <p className="text-white">Loading rules...</p> :
            rules.map(rule => (
              <Card key={rule.id} className="border-gray-700 bg-gray-800/50 flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{rule.template.replace(/_/g, ' ')}</CardTitle>
                  <Badge variant="secondary" className="w-fit mt-2">{rule.type}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2 mb-4">
                    <p><span className="text-gray-400">Frequency:</span> {rule.frequency}</p>
                    <p><span className="text-gray-400">Recipients:</span> {rule.recipients.join(', ')}</p>
                  </div>
                   <div className="flex gap-2">
                     <Button variant="outline" size="sm" className="w-full"><Edit className="w-4 h-4 mr-2" />Edit</Button>
                     <Button variant="destructive" size="sm" className="w-full"><Trash2 className="w-4 h-4 mr-2" />Delete</Button>
                   </div>
                </CardContent>
              </Card>
            ))
          }
        </div>
      </div>
    </div>
  );
}