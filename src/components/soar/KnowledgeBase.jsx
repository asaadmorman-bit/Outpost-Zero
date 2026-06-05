import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Star, User, BrainCircuit, Lightbulb, Shield, AlertTriangle, FileText } from 'lucide-react';

const knowledgeTypeIcons = {
  lessons_learned: Lightbulb,
  best_practice: Star,
  procedure: FileText,
  troubleshooting_guide: AlertTriangle,
  threat_intelligence: Shield,
  team_expertise: User,
  common_pattern: Search
};

const sourceColors = {
  incident_response: "bg-red-500/20 text-red-300 border-red-500/30",
  user_activity: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  playbook_execution: "bg-green-500/20 text-green-300 border-green-500/30",
  training_session: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  manual_entry: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  ai_analysis: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
};

export default function KnowledgeBase({ knowledgeBase }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKnowledge, setSelectedKnowledge] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const filteredKnowledge = knowledgeBase.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || item.knowledge_type === filterType;
    return matchesSearch && matchesType;
  });

  const handleKnowledgeAction = (knowledge, action) => {
    const actions = {
      view: `📖 VIEWING KNOWLEDGE\n\nTitle: ${knowledge.title}\nType: ${knowledge.knowledge_type}\n\nIn production, this would:\n• Log knowledge access\n• Update usage analytics\n• Suggest related content\n• Track knowledge effectiveness`,
      apply: `🔧 APPLYING KNOWLEDGE\n\nKnowledge: ${knowledge.title}\n\nIn production, this would:\n• Create playbook step\n• Update existing procedures\n• Notify relevant team members\n• Track application success`,
      update: `✏️ UPDATE REQUESTED\n\nKnowledge: ${knowledge.title}\n\nIn production, this would:\n• Open knowledge editor\n• Version control changes\n• Request peer review\n• Update related playbooks`
    };
    
    alert(actions[action]);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="border-gray-700 bg-gray-800/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
            <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
            Organizational Knowledge Base
          </CardTitle>
          <p className="text-gray-400 text-xs md:text-sm">Captured wisdom from your team's experience and AI analysis</p>
        </CardHeader>
      </Card>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search knowledge base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'lessons_learned', 'best_practice', 'procedure', 'troubleshooting_guide'].map(type => (
            <Button
              key={type}
              variant={filterType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(type)}
              className={`${filterType === type ? "bg-blue-600" : "border-gray-700 text-gray-300"} text-xs whitespace-nowrap`}
            >
              {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredKnowledge.map(knowledge => {
            const IconComponent = knowledgeTypeIcons[knowledge.knowledge_type] || BookOpen;
            return (
              <Card 
                key={knowledge.knowledge_id} 
                className={`border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all cursor-pointer ${selectedKnowledge?.knowledge_id === knowledge.knowledge_id ? 'ring-2 ring-cyan-500' : ''}`}
                onClick={() => setSelectedKnowledge(knowledge)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 md:gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-cyan-500/10 flex-shrink-0">
                        <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm md:text-lg mb-1">{knowledge.title}</h3>
                        <p className="text-gray-300 text-xs md:text-sm leading-relaxed line-clamp-2">
                          {knowledge.content.substring(0, 120)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {knowledge.auto_generated && <BrainCircuit className="w-3 h-3 md:w-4 md:h-4 text-purple-400" title="AI Generated" />}
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                        {knowledge.confidence_level}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="truncate">{knowledge.contributor === 'system' ? 'AI System' : knowledge.contributor.split('@')[0]}</span>
                    </div>
                    <Badge variant="outline" className={`${sourceColors[knowledge.source]} text-xs`}>
                      {knowledge.source.replace(/_/g, ' ')}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{knowledge.effectiveness_rating}/5</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {knowledge.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} className="bg-gray-700 text-gray-300 text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {knowledge.tags.length > 3 && (
                      <Badge className="bg-gray-700 text-gray-300 text-xs">
                        +{knowledge.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs text-gray-500">
                    Used {knowledge.usage_count} times
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="hidden lg:block">
          {selectedKnowledge ? (
            <Card className="border-gray-700 bg-gray-800/50 sticky top-4">
              <CardHeader>
                <CardTitle className="text-white text-base md:text-lg">Knowledge Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2 text-sm md:text-base">Full Content</h4>
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                    {selectedKnowledge.content}
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2 text-sm md:text-base">All Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedKnowledge.tags.map(tag => (
                      <Badge key={tag} className="bg-gray-700 text-gray-300 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-sm"
                    onClick={() => handleKnowledgeAction(selectedKnowledge, 'apply')}
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Apply to Playbook
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300 text-sm"
                    onClick={() => handleKnowledgeAction(selectedKnowledge, 'update')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Suggest Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-gray-700 bg-gray-800/50">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">Select Knowledge Item</h3>
                <p className="text-gray-400 text-sm">
                  Click on a knowledge item to view full details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}