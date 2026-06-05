import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Clock } from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  open: "bg-blue-500/20 text-blue-400",
  active: "bg-green-500/20 text-green-400",
  pending_review: "bg-yellow-500/20 text-yellow-400",
  closed: "bg-gray-500/20 text-gray-400"
};

const priorityColors = {
  low: "bg-gray-500/20 text-gray-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  high: "bg-orange-500/20 text-orange-400",
  critical: "bg-red-500/20 text-red-400"
};

export default function InvestigationCard({ investigation, onClick, isSelected }) {
  return (
    <Card 
      onClick={onClick}
      className={`border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-colors duration-200 cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-white font-semibold">{investigation.title}</h3>
          <Badge className={priorityColors[investigation.priority]}>{investigation.priority}</Badge>
        </div>
        <p className="text-sm text-gray-400 mb-4">{investigation.investigation_id}</p>
        <div className="flex justify-between items-center text-xs text-gray-400">
          <div className="flex items-center gap-1"><User className="w-3 h-3" />{investigation.lead_investigator.split('@')[0]}</div>
          <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{format(new Date(investigation.created_date), 'MMM d, yyyy')}</div>
          <Badge variant="outline" className={statusColors[investigation.status]}>{investigation.status}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}