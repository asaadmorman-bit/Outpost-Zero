import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

export default function FeedbackButtons({ advisoryId, onFeedbackSubmit }) {
    const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
    const [feedbackType, setFeedbackType] = useState(null);
    const [feedbackText, setFeedbackText] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleFeedback = (type) => {
        setFeedbackType(type);
        if (type === 'positive') {
            submitFeedback(type, 'Advisory was helpful');
        } else {
            setShowFeedbackDialog(true);
        }
    };

    const submitFeedback = async (type, text) => {
        try {
            // In production, this would save to database
            console.log('Feedback submitted:', { advisoryId, type, text });
            
            toast.success('Thank you for your feedback!');
            setSubmitted(true);
            setShowFeedbackDialog(false);
            
            if (onFeedbackSubmit) {
                onFeedbackSubmit({ type, text });
            }
        } catch (error) {
            toast.error('Failed to submit feedback');
        }
    };

    if (submitted) {
        return (
            <div className="flex items-center gap-2 text-sm text-green-400">
                <MessageSquare className="w-4 h-4" />
                <span>Feedback received - Thank you!</span>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Was this helpful?</span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFeedback('positive')}
                    className="border-gray-700 text-gray-300 hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/50"
                >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Yes
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFeedback('negative')}
                    className="border-gray-700 text-gray-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50"
                >
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    No
                </Button>
            </div>

            <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
                <DialogContent className="bg-gray-900 border-gray-700">
                    <DialogHeader>
                        <DialogTitle className="text-white">Help Us Improve</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Please tell us how we can make this advisory more helpful
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Textarea
                            placeholder="What could be improved?"
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white min-h-32"
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowFeedbackDialog(false)}
                                className="border-gray-700 text-gray-300"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => submitFeedback('negative', feedbackText)}
                                disabled={!feedbackText.trim()}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Submit Feedback
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}