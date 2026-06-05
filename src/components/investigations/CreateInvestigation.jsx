import React, { useState } from "react";
import { Investigation } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

export default function CreateInvestigation({ onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    lead_investigator: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newInvestigation = {
      ...formData,
      investigation_id: `CASE-${Date.now()}`,
      status: "open",
      created_date: new Date().toISOString()
    };
    await Investigation.create(newInvestigation);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg border-gray-700 bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Create New Investigation</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Investigation Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
            />
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
            />
            <Input
              placeholder="Lead Investigator Email"
              type="email"
              value={formData.lead_investigator}
              onChange={(e) => setFormData({ ...formData, lead_investigator: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
            />
            <Select onValueChange={(value) => setFormData({ ...formData, priority: value })} defaultValue="medium">
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Create Case</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}