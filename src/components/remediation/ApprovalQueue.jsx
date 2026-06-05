import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Brain,
  Info,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';

export default function ApprovalQueue({ pendingApprovals, onApprove, onReject }) {
  const [selectedExecution, setSelectedExecution] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = async (execution) => {
    try {
      await base44.entities.RemediationExecution.update(execution.id, {
        status: 'approved',
        approval_details: {
          ...execution.approval_details,
          approved_by: 'current_user@company.com',
          approved_at: new Date().toISOString(),
          approval_notes: approvalNotes
        }
      });
      
      alert('✅ Remediation approved! Execution will begin immediately.');
      setApprovalNotes('');
      setSelectedExecution(null);
      onApprove();
    } catch (error) {
      console.error('Error approving remediation:', error);
      alert('❌ Error approving remediation. Demo mode: approval would be processed in production.');
      onApprove();
    }
  };

  const handleReject = async (execution) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      await base44.entities.RemediationExecution.update(execution.id, {
        status: 'rejected',
        approval_details: {
          ...execution.approval_details,
          rejected_by: 'current_user@company.com',
          rejected_at: new Date().toISOString(),
          rejection_reason: rejectionReason
        }
      });
      
      alert('🚫 Remediation rejected.');
      setRejectionReason('');
      setSelectedExecution(null);
      onReject();
    } catch (error) {
      console.error('Error rejecting remediation:', error);
      alert('❌ Error rejecting remediation. Demo mode: rejection would be processed in production.');
      onReject();
    }
  };

  if (pendingApprovals.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="pt-12 pb-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">All Clear!</h3>
          <p className="text-gray-400">No remediation actions pending approval at this time.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Alert className="border-orange-500/50 bg-orange-500/10">
        <Clock className="h-4 w-4 text-orange-400" />
        <AlertDescription className="text-orange-200">
          <strong>{pendingApprovals.length} remediation action(s)</strong> require your review and approval.
        </AlertDescription>
      </Alert>

      {pendingApprovals.map((execution) => {
        const isSelected = selectedExecution?.id === execution.id;
        const timeAgo = execution.approval_details?.requested_at 
          ? format(new Date(execution.approval_details.requested_at), 'PPpp')
          : 'Unknown';

        return (
          <Card key={execution.id} className={`bg-gray-800/50 border-gray-700 ${isSelected ? 'border-blue-500' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                    <CardTitle className="text-white">Remediation Approval Required</CardTitle>
                    <Badge className="bg-orange-500/20 text-orange-300">
                      Pending
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">Requested: {timeAgo}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedExecution(isSelected ? null : execution)}
                  className="border-gray-600"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isSelected ? 'Hide Details' : 'View Details'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* AI Analysis */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  <h4 className="text-white font-semibold">AI Analysis</h4>
                  <Badge className="bg-blue-500/20 text-blue-300">
                    {execution.ai_confidence_score}% Confidence
                  </Badge>
                </div>
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-gray-300">{execution.ai_reasoning || 'No reasoning provided'}</p>
                </div>
              </div>

              {/* Details */}
              {isSelected && (
                <div className="space-y-4 mb-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 p-3 rounded">
                      <div className="text-xs text-gray-400 mb-1">Trigger Source</div>
                      <div className="text-white">{execution.trigger_source_type}</div>
                      <div className="text-xs text-gray-400 mt-1">ID: {execution.trigger_source_id}</div>
                    </div>
                    <div className="bg-gray-900/50 p-3 rounded">
                      <div className="text-xs text-gray-400 mb-1">Rule</div>
                      <div className="text-white">{execution.rule_id}</div>
                    </div>
                  </div>

                  <Alert className="border-blue-500/50 bg-blue-500/10">
                    <Info className="h-4 w-4 text-blue-400" />
                    <AlertDescription className="text-blue-200">
                      This remediation will be executed automatically upon approval. Review the AI analysis carefully before proceeding.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Approval Actions */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Approval Notes (Optional)</label>
                  <Textarea
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    placeholder="Add notes about this approval..."
                    className="bg-gray-900 border-gray-700 text-white"
                    rows={2}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleApprove(execution)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve & Execute
                  </Button>
                  <Button
                    onClick={() => {
                      const reason = prompt('Please provide a reason for rejection:');
                      if (reason) {
                        setRejectionReason(reason);
                        handleReject(execution);
                      }
                    }}
                    variant="outline"
                    className="flex-1 border-red-500/50 text-red-300 hover:bg-red-500/10"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}