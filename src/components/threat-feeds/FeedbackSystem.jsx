import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsDown } from 'lucide-react';

export default function FeedbackSystem({ onFeedbackSubmit }) {
  const [alertId, setAlertId] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!alertId || !feedback) return;
    onFeedbackSubmit({ 
      alert_id: alertId,
      analyst_feedback: feedback,
      is_false_positive: true,
      event_type: "login_attempt", // Example value
      feedback_timestamp: new Date().toISOString(),
      analyst_id: "soc_analyst@example.com" // Example value
    });
    setAlertId('');
    setFeedback('');
  };

  return (
    <Card className="border-gray-700 bg-gray-800/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ThumbsDown className="w-5 h-5 text-yellow-400" />
          False Positive Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400 mb-4">
          Help our ML models learn. Report alerts that were incorrect.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input 
            placeholder="Enter Alert ID" 
            className="bg-gray-900 border-gray-700 text-white"
            value={alertId}
            onChange={(e) => setAlertId(e.target.value)}
          />
          <Textarea 
            placeholder="Reason for false positive..." 
            className="bg-gray-900 border-gray-700 text-white"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <Button type="submit" className="w-full">Submit Feedback</Button>
        </form>
      </CardContent>
    </Card>
  );
}