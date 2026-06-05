import React, { useState, useEffect } from "react";
import { CommunityKnowledge } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Download, Upload, Star } from "lucide-react";

export default function CommunityHubPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setIsLoading(true);
    const data = await CommunityKnowledge.list();
    setItems(data.length > 0 ? data : mockItems);
    setIsLoading(false);
  };
  
  const mockItems = [
    { id: '1', type: 'query', title: 'Find Log4j Exploitation Attempts', author: 'sec.analyst@gov.agency', organization_type: 'government', effectiveness_rating: 4.8, usage_count: 1250, verified: true },
    { id: '2', type: 'playbook', title: 'Automated Phishing Response', author: 'threat.hunter@enterprise.com', organization_type: 'enterprise', effectiveness_rating: 4.5, usage_count: 890, verified: true },
    { id: '3', type: 'dashboard', title: 'SMB Security Overview', author: 'it.admin@smb.com', organization_type: 'smb', effectiveness_rating: 4.2, usage_count: 2300, verified: false },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Users className="w-8 h-8 text-cyan-400" /> Community Knowledge Hub
        </h1>

        <div className="flex gap-4 mb-6">
          <Input placeholder="Search knowledge base..." className="bg-gray-800 border-gray-700 text-white" />
          <Select>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="query">Query</SelectItem>
              <SelectItem value="playbook">Playbook</SelectItem>
              <SelectItem value="dashboard">Dashboard</SelectItem>
            </SelectContent>
          </Select>
          <Button><Upload className="w-4 h-4 mr-2" /> Share Knowledge</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? <p className="text-white">Loading community content...</p> :
            items.map(item => (
              <Card key={item.id} className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white">{item.title}</CardTitle>
                  <Badge variant="outline" className="w-fit mt-2 capitalize border-cyan-500/50 text-cyan-400">{item.type}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">by {item.author}</p>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{item.effectiveness_rating} ({item.usage_count} uses)</span>
                    </div>
                    {item.verified && <Badge className="bg-green-500/20 text-green-400">Verified</Badge>}
                  </div>
                  <Button className="w-full mt-4"><Download className="w-4 h-4 mr-2" /> Import</Button>
                </CardContent>
              </Card>
            ))
          }
        </div>
      </div>
    </div>
  );
}