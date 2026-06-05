import React, { useState, useEffect } from "react";
import { Incident, SecurityEvent } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  AlertTriangle, 
  Clock, 
  User, 
  Shield,
  Search,
  Filter,
  Plus,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";

import IncidentCard from "../components/incidents/IncidentCard";
import IncidentDetails from "../components/incidents/IncidentDetails";
import BulkActions from "../components/incidents/BulkActions";
import ResponsiveCard from "../components/shared/ResponsiveCard";
import ResponsiveTable from "../components/shared/ResponsiveTable";
import MobileDrawer from "../components/shared/MobileDrawer";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import EmptyState from "../components/shared/EmptyState";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedIncidents, setSelectedIncidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    setIsLoading(true);
    const data = await Incident.list("-created_date");
    setIncidents(data);
    setIsLoading(false);
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    open: incidents.filter(i => i.status === 'open').length,
    investigating: incidents.filter(i => i.status === 'investigating').length,
    contained: incidents.filter(i => i.status === 'contained').length,
    resolved: incidents.filter(i => i.status === 'resolved').length
  };

  const handleRowClick = (incident) => {
    setSelectedIncident(incident);
    setShowMobileDetails(true);
  };

  const handleSelectIncident = (incidentId) => {
    setSelectedIncidents(prev => {
      if (prev.includes(incidentId)) {
        return prev.filter(id => id !== incidentId);
      } else {
        return [...prev, incidentId];
      }
    });
  };

  const handleBulkActionComplete = () => {
    loadIncidents();
    setSelectedIncidents([]);
  };

  const tableColumns = [
    {
      key: 'select',
      label: '',
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIncidents.includes(row.id)}
          onChange={() => handleSelectIncident(row.id)}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
        />
      )
    },
    {
      key: 'title',
      label: 'Title',
      render: (row) => (
        <div>
          <p className="text-white font-medium">{row.title}</p>
          <p className="text-gray-400 text-xs mt-1">{row.incident_id}</p>
        </div>
      )
    },
    {
      key: 'severity',
      label: 'Severity',
      render: (row) => (
        <Badge className={`severity-${row.severity}`}>
          {row.severity}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant="outline" className="border-gray-600 text-gray-300">
          {row.status}
        </Badge>
      )
    },
    {
      key: 'created_date',
      label: 'Created',
      render: (row) => (
        <span className="text-gray-300">
          {format(new Date(row.created_date), 'MMM d, yyyy')}
        </span>
      )
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Incident Management</h1>
            <p style={{color: 'var(--text-secondary)'}} className="text-sm md:text-base">Monitor and respond to security incidents</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create Incident
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <ResponsiveCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs md:text-sm text-white">Open</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-red-400">{statusCounts.open}</div>
          </ResponsiveCard>
          
          <ResponsiveCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-4 h-4 text-yellow-400" />
              <span className="text-xs md:text-sm text-white">Investigating</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-yellow-400">{statusCounts.investigating}</div>
          </ResponsiveCard>
          
          <ResponsiveCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-orange-400" />
              <span className="text-xs md:text-sm text-white">Contained</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-orange-400">{statusCounts.contained}</div>
          </ResponsiveCard>
          
          <ResponsiveCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-green-400" />
              <span className="text-xs md:text-sm text-white">Resolved</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-green-400">{statusCounts.resolved}</div>
          </ResponsiveCard>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {["all", "open", "investigating", "contained", "resolved"].map(status => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={`${statusFilter === status ? "bg-blue-600 hover:bg-blue-700" : "border-gray-700 text-gray-300 hover:bg-gray-800"} transition-colors whitespace-nowrap flex-shrink-0`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner message="Loading incidents..." />
        ) : filteredIncidents.length === 0 ? (
          <EmptyState
            type="incidents"
            title="No Incidents Found"
            description={searchTerm || statusFilter !== 'all' ? "Try adjusting your filters" : "No security incidents have been reported yet"}
            actionLabel="Create Incident"
            onAction={() => {/* Create incident logic */}}
            showRefresh
            onRefresh={loadIncidents}
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ResponsiveTable
                data={filteredIncidents}
                columns={tableColumns}
                onRowClick={handleRowClick}
                mobileCardRender={(incident) => (
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <input
                        type="checkbox"
                        checked={selectedIncidents.includes(incident.id)}
                        onChange={() => handleSelectIncident(incident.id)}
                        className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-bold mb-1">{incident.title}</h3>
                        <p className="text-gray-400 text-xs">{incident.incident_id}</p>
                      </div>
                      <Badge className={`severity-${incident.severity} ml-2`}>
                        {incident.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {incident.status}
                      </Badge>
                      <span className="text-gray-400 text-xs">
                        {format(new Date(incident.created_date), 'MMM d')}
                      </span>
                    </div>
                  </div>
                )}
              />
            </div>

            <div className="hidden lg:block">
              <IncidentDetails incident={selectedIncident} />
            </div>
          </div>
        )}

        <BulkActions 
          selectedIncidents={selectedIncidents}
          onActionComplete={handleBulkActionComplete}
          onClearSelection={() => setSelectedIncidents([])}
        />

        <MobileDrawer
          isOpen={showMobileDetails}
          onClose={() => setShowMobileDetails(false)}
          title="Incident Details"
        >
          <IncidentDetails incident={selectedIncident} />
        </MobileDrawer>
      </div>
    </div>
  );
}