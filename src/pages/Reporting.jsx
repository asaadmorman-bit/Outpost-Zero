import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, FileText } from "lucide-react";

export default function ReportingPage() {
  const [reportType, setReportType] = useState("");
  const [format, setFormat] = useState("pdf");
  const [dateRange, setDateRange] = useState("");

  const generateReport = () => {
    // In a real app, this would trigger a backend process.
    // For now, we'll simulate a CSV download.
    if (format === 'csv') {
      const headers = "incident_id,title,severity,status,date\n";
      const rows = "INC-2024-001,APT Movement,critical,investigating,2024-01-15\n";
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${reportType}_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
        alert(`Generating ${format.toUpperCase()} report for ${reportType}... (This is a demo)`);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Reporting Engine</h1>
        <Card className="border-gray-700 bg-gray-800/50">
          <CardHeader><CardTitle className="text-white flex items-center gap-2"><FileText />Generate Custom Report</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="report-type" className="text-white">Report Type</Label>
                <Select onValueChange={setReportType}>
                  <SelectTrigger id="report-type" className="bg-gray-900 border-gray-600 text-white"><SelectValue placeholder="Select report type..." /></SelectTrigger>
                  <SelectContent><SelectItem value="incident_summary">Incident Summary</SelectItem><SelectItem value="compliance_audit">Compliance Audit</SelectItem><SelectItem value="threat_intel">Threat Intelligence</SelectItem></SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="format" className="text-white">Format</Label>
                <Select defaultValue="pdf" onValueChange={setFormat}>
                  <SelectTrigger id="format" className="bg-gray-900 border-gray-600 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="pdf">PDF</SelectItem><SelectItem value="csv">CSV</SelectItem><SelectItem value="xls">XLS</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="date-range" className="text-white">Date Range</Label>
              <Input id="date-range" type="date" className="bg-gray-900 border-gray-600 text-white" />
            </div>
            <Button onClick={generateReport} className="w-full bg-blue-600 hover:bg-blue-700"><Download className="mr-2 h-4 w-4"/>Generate Report</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}