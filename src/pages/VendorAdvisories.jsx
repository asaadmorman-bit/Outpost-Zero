import React, { useState, useEffect } from "react";
import { VendorAdvisory } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rss, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function VendorAdvisoriesPage() {
  const [advisories, setAdvisories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAdvisories();
  }, []);

  const loadAdvisories = async () => {
    setIsLoading(true);
    const data = await VendorAdvisory.list("-published_date");
    setAdvisories(data);
    setIsLoading(false);
  };
  
  const getSeverityColor = (severity) => ({
      critical: "bg-red-500/20 text-red-400",
      high: "bg-orange-500/20 text-orange-400",
      medium: "bg-yellow-500/20 text-yellow-400",
      low: "bg-blue-500/20 text-blue-400",
  }[severity] || "bg-gray-500/20 text-gray-400");

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Rss className="w-8 h-8 text-blue-400" /> Vendor Security Advisories
        </h1>
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Search advisories (e.g., CVE, vendor, product)..." className="pl-10 bg-gray-800 border-gray-700 text-white" />
        </div>
        <div className="space-y-4">
          {isLoading ? <p className="text-white">Loading advisories...</p> :
            advisories.map(adv => (
              <Card key={adv.id} className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg">{adv.title}</CardTitle>
                      <p className="text-sm text-gray-400 mt-1">{adv.vendor} / {adv.product}</p>
                    </div>
                    <Badge className={getSeverityColor(adv.severity)}>{adv.severity}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300 mb-4">{adv.summary}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono bg-gray-900/50 px-2 py-1 rounded">{adv.advisory_id}</span>
                    <span className="text-gray-400">Published: {new Date(adv.published_date).toLocaleDateString()}</span>
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