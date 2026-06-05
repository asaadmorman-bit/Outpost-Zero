import React, { useState, useEffect } from "react";
import { ThreatFeed, FalsePositiveFeedback } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rss, Brain, ThumbsDown } from "lucide-react";
import ThreatFeedCard from "../components/threat-feeds/ThreatFeedCard";
import AutoResponsePanel from "../components/threat-feeds/AutoResponsePanel";
import FeedbackSystem from "../components/threat-feeds/FeedbackSystem";

export default function ThreatFeedsPage() {
  const [feeds, setFeeds] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [feedData, feedbackData] = await Promise.all([
        ThreatFeed.list(),
        FalsePositiveFeedback.list("-feedback_timestamp", 50)
      ]);
      setFeeds(feedData.length > 0 ? feedData : mockFeeds);
      setFeedback(feedbackData);
    } catch (error) {
      console.error("Error loading data:", error);
      setFeeds(mockFeeds);
    }
    setIsLoading(false);
  };
  
  const mockFeeds = [
    { id: '1', name: 'AlienVault OTX', provider: 'alienvault_otx', feed_type: 'ioc', cost_model: 'free', update_frequency: 'real_time', status: 'active', quality_score: 85 },
    { id: '2', name: 'CrowdStrike Falcon Intel', provider: 'crowdstrike', feed_type: 'ttps', cost_model: 'paid', update_frequency: 'hourly', status: 'active', quality_score: 98 },
    { id: '3', name: 'Recorded Future', provider: 'recorded_future', feed_type: 'vulnerabilities', cost_model: 'paid', update_frequency: 'daily', status: 'active', quality_score: 95 },
    { id: '4', name: 'Custom OSINT Feed', provider: 'custom_osint', feed_type: 'ioc', cost_model: 'free', update_frequency: 'daily', status: 'error', quality_score: 60 },
  ];

  const handleFeedbackSubmit = async (feedbackData) => {
    // This would create a record and then trigger an ML model tuning job in a real app
    console.log("Submitting feedback to ML model:", feedbackData);
    await FalsePositiveFeedback.create({ ...feedbackData, feedback_id: `fp_${Date.now()}` });
    loadData(); // Reload to show updated state
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{background: 'var(--primary-bg)'}}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <Rss className="w-8 h-8 text-orange-400" />
          Threat Intelligence Feeds
        </h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {isLoading ? <p className="text-white">Loading feeds...</p> :
              feeds.map(feed => <ThreatFeedCard key={feed.id} feed={feed} />)
            }
          </div>
          <div className="space-y-6">
            <AutoResponsePanel />
            <FeedbackSystem onFeedbackSubmit={handleFeedbackSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}