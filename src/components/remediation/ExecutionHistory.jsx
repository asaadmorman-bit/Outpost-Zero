import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';

export default function ExecutionHistory({ executions, rules }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedExecution, setExpandedExecution] = useState(null);

  const filteredExecutions = executions.filter(execution => {
    const rule = rules.find(r => r.rule_id === execution.rule_id);
    const ruleName = rule?.rule_name || '';
    const matchesSearch = ruleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || execution.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'pending_approval':
        return <Clock className="w-5 h-5 text-orange-400" />;
      case 'executing':
        return <Activity className="w-5 h-5 text-blue-400 animate-pulse" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-500/20 text-green-300',
      failed: 'bg-red-500/20 text-red-300',
      pending_approval: 'bg-orange-500/20 text-orange-300',
      approved: 'bg-blue-500/20 text-blue-300',
      rejected: 'bg-red-500/20 text-red-300',
      executing: 'bg-blue-500/20 text-blue-300',
      rolled_back: 'bg-yellow-500/20 text-yellow-300',
      cancelled: 'bg-gray-500/20 text-gray-300'
    };
    return <Badge className={styles[status] || 'bg-gray-500/20 text-gray-300'}>
      {status?.replace(/_/g, ' ')}
    </Badge>;
  };

  if (executions.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="pt-12 pb-12 text-center">
          <Activity className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Execution History</h3>
          <p className="text-gray-400">Remediation executions will appear here once rules are triggered.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by rule name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'completed', 'failed', 'pending_approval', 'executing'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={statusFilter === status ? 'bg-blue-600' : 'border-gray-600'}
                >
                  {status.replace(/_/g, ' ')}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Execution List */}
      <div className="space-y-3">
        {filteredExecutions.map((execution) => {
          const rule = rules.find(r => r.rule_id === execution.rule_id);
          const isExpanded = expandedExecution === execution.id;

          return (
            <Card key={execution.id} className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(execution.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-semibold">{rule?.rule_name || 'Unknown Rule'}</h4>
                        {getStatusBadge(execution.status)}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-2">
                        <span>ID: {execution.execution_id}</span>
                        <span>•</span>
                        <span>Confidence: {execution.ai_confidence_score}%</span>
                        <span>•</span>
                        <span>{execution.created_date && format(new Date(execution.created_date), 'PPpp')}</span>
                        {execution.execution_duration_seconds && (
                          <>
                            <span>•</span>
                            <span>Duration: {execution.execution_duration_seconds}s</span>
                          </>
                        )}
                      </div>
                      
                      {execution.ai_reasoning && (
                        <p className="text-gray-300 text-sm">{execution.ai_reasoning}</p>
                      )}

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-4 space-y-3">
                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="bg-gray-900/50 p-3 rounded">
                              <div className="text-xs text-gray-400 mb-1">Trigger Source</div>
                              <div className="text-white text-sm">{execution.trigger_source_type}</div>
                              <div className="text-xs text-gray-400">ID: {execution.trigger_source_id}</div>
                            </div>
                            <div className="bg-gray-900/50 p-3 rounded">
                              <div className="text-xs text-gray-400 mb-1">Rule ID</div>
                              <div className="text-white text-sm">{execution.rule_id}</div>
                            </div>
                          </div>

                          {execution.approval_details && (
                            <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3">
                              <div className="text-sm text-blue-300 font-semibold mb-2">Approval Details</div>
                              {execution.approval_details.approved_by && (
                                <div className="text-sm text-gray-300">
                                  Approved by: {execution.approval_details.approved_by}
                                  {execution.approval_details.approved_at && 
                                    ` at ${format(new Date(execution.approval_details.approved_at), 'PPpp')}`
                                  }
                                </div>
                              )}
                              {execution.approval_details.approval_notes && (
                                <div className="text-sm text-gray-400 mt-1">
                                  Notes: {execution.approval_details.approval_notes}
                                </div>
                              )}
                            </div>
                          )}

                          {execution.error_details && (
                            <div className="bg-red-900/20 border border-red-500/30 rounded p-3">
                              <div className="text-sm text-red-300 font-semibold mb-1">Error Details</div>
                              <div className="text-sm text-gray-300">{execution.error_details}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedExecution(isExpanded ? null : execution.id)}
                    className="text-gray-400"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredExecutions.length === 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-12 pb-12 text-center">
            <Filter className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No executions match your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}