import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Clock, Shield, Search, Paperclip, FileText, Plus } from "lucide-react";

export default function InvestigationDetails({ investigation }) {
  if (!investigation) {
    return (
      <Card className="border-gray-700 bg-gray-800/50 h-full">
        <CardContent className="flex flex-col items-center justify-center h-full text-center">
          <Search className="w-16 h-16 text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white">Select an Investigation</h3>
          <p className="text-gray-400">Choose a case from the list to see its details.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader>
        <CardTitle className="text-white text-xl">{investigation.title}</CardTitle>
        <p className="text-gray-400">{investigation.description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold text-gray-300 mb-2">Case Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><span className="text-gray-400">Lead:</span> {investigation.lead_investigator}</p>
            <p><span className="text-gray-400">Status:</span> <Badge>{investigation.status}</Badge></p>
            <p><span className="text-gray-400">Priority:</span> <Badge variant="destructive">{investigation.priority}</Badge></p>
            <p><span className="text-gray-400">Created:</span> {new Date(investigation.created_date).toLocaleDateString()}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-300 mb-2">Evidence</h4>
          <div className="space-y-2">
            {investigation.evidence_collected?.length > 0 ? (
              investigation.evidence_collected.map(ev => (
                <div key={ev.evidence_id} className="flex items-center justify-between p-2 bg-gray-900/40 rounded-md">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-blue-400" />
                    <span className="text-white text-sm">{ev.type}: {ev.file_path}</span>
                  </div>
                  <Badge variant="outline">{ev.hash.substring(0, 10)}...</Badge>
                </div>
              ))
            ) : <p className="text-gray-500 text-sm">No evidence collected.</p>}
            <Button variant="outline" size="sm" className="w-full mt-2"><Plus className="w-4 h-4 mr-2"/>Add Evidence</Button>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-300 mb-2">Findings</h4>
          <div className="p-3 bg-gray-900/40 rounded-md">
            {investigation.findings?.length > 0 ? 
              <p className="text-white text-sm">{investigation.findings[0].finding}</p> :
              <p className="text-gray-500 text-sm">No findings yet.</p>
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}