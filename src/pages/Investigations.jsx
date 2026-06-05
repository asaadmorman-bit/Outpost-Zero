import React, { useState, useEffect } from "react";
import { Investigation } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Plus,
  Filter
} from "lucide-react";

import InvestigationCard from "../components/investigations/InvestigationCard";
import InvestigationDetails from "../components/investigations/InvestigationDetails";
import CreateInvestigation from "../components/investigations/CreateInvestigation";
import MobileDrawer from "../components/shared/MobileDrawer";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import EmptyState from "../components/shared/EmptyState";

export default function InvestigationsPage() {
  const [investigations, setInvestigations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setIsLoading(true);
    const data = await Investigation.list("-created_date");
    setInvestigations(data);
    setIsLoading(false);
  };

  const filteredInvestigations = investigations.filter(inv =>
    inv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectInvestigation = (inv) => {
    setSelected(inv);
    setShowMobileDetails(true);
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <Search className="w-7 h-7 md:w-8 md:h-8 text-blue-400" /> Case Management
            </h1>
            <p className="text-gray-300 text-sm md:text-base mt-2">Manage security investigations and case files</p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />New Investigation
          </Button>
        </div>

        {isCreating && <CreateInvestigation onClose={() => { setIsCreating(false); loadData(); }} />}
        
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search investigations by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading investigations..." />
        ) : filteredInvestigations.length === 0 ? (
          <EmptyState
            type="investigations"
            title="No Investigations Found"
            description={searchTerm ? "Try adjusting your search" : "No investigations have been created yet"}
            actionLabel="Create Investigation"
            onAction={() => setIsCreating(true)}
            showRefresh
            onRefresh={loadData}
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              {filteredInvestigations.map(inv => (
                <InvestigationCard 
                  key={inv.id} 
                  investigation={inv} 
                  onClick={() => handleSelectInvestigation(inv)} 
                  isSelected={selected?.id === inv.id} 
                />
              ))}
            </div>
            <div className="hidden lg:block lg:col-span-2">
              <InvestigationDetails investigation={selected} />
            </div>
          </div>
        )}

        <MobileDrawer
          isOpen={showMobileDetails}
          onClose={() => setShowMobileDetails(false)}
          title="Investigation Details"
        >
          <InvestigationDetails investigation={selected} />
        </MobileDrawer>
      </div>
    </div>
  );
}