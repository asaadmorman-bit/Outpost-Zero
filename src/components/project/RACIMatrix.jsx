import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RACIMatrix({ project }) {
  if (!project) {
    return (
        <Card className="border-gray-700 bg-gray-800/50 mt-6">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    RACI Matrix
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-400 text-center py-8">Select a project to view its RACI Matrix.</p>
            </CardContent>
        </Card>
    );
  }

  const { raci_matrix } = project;

  const renderMembers = (members) => {
    if (!members || members.length === 0) {
      return <span className="text-gray-500 italic">Not assigned</span>;
    }
    return members.map(member => (
      <Badge key={member} variant="secondary" className="mr-1 mb-1 bg-gray-700 text-gray-200">{member}</Badge>
    ));
  };

  return (
    <Card className="border-gray-700 bg-gray-800/50 mt-6 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          RACI Matrix: <span className="text-purple-300">{project.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-900/40 rounded-lg border border-gray-700">
            <h4 className="font-semibold text-purple-300 mb-2">Responsible (Does the work)</h4>
            <div>{renderMembers(raci_matrix?.responsible)}</div>
          </div>
          <div className="p-4 bg-gray-900/40 rounded-lg border border-gray-700">
            <h4 className="font-semibold text-purple-300 mb-2">Accountable (Owns the work)</h4>
            <div>{renderMembers(raci_matrix?.accountable)}</div>
          </div>
          <div className="p-4 bg-gray-900/40 rounded-lg border border-gray-700">
            <h4 className="font-semibold text-purple-300 mb-2">Consulted (Provides input)</h4>
            <div>{renderMembers(raci_matrix?.consulted)}</div>
          </div>
          <div className="p-4 bg-gray-900/40 rounded-lg border border-gray-700">
            <h4 className="font-semibold text-purple-300 mb-2">Informed (Kept up-to-date)</h4>
            <div>{renderMembers(raci_matrix?.informed)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}