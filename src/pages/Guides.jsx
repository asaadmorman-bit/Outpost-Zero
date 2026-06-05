
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, ChevronsRight, ListChecks, Video } from 'lucide-react';

const guides = [
  {
    category: 'Onboarding & Migration',
    items: [
      { title: 'Onboarding Checklist for New Teams', description: 'A step-by-step guide to get your team fully operational on our platform.', icon: ListChecks },
      { title: 'Migrating from Splunk', description: 'Learn how to transfer your data, dashboards, and queries from Splunk to our platform.', icon: ChevronsRight },
      { title: 'Migrating from QRadar', description: 'A comprehensive guide for a seamless transition from IBM QRadar.', icon: ChevronsRight },
    ]
  },
  {
    category: 'Feature Deep Dives',
    items: [
      { title: 'Mastering Custom QL', description: 'Advanced query techniques for proactive threat hunting.', icon: BookOpen },
      { title: 'Building SOAR Playbooks', description: 'Automate your incident response with our powerful playbook builder.', icon: BookOpen },
      { title: 'AI-Powered Training Video Generator', description: 'Create custom, animated training content for your team in minutes.', icon: Video },
    ]
  }
];

export default function GuidesPage() {
  const handleGuideClick = (title) => {
      alert(`OPENING GUIDE: ${title}\n\nIn a production environment, this would navigate to a detailed page with step-by-step instructions, code snippets, diagrams, and video tutorials.`);
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--primary-bg)' }}>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">How-To Guides & Onboarding</h1>
        <p className="text-lg text-gray-300 mb-12 text-center">
          Accelerate your team's adoption and mastery of the platform.
        </p>

        {guides.map(section => (
          <div key={section.category} className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6 border-l-4 border-blue-500 pl-4">{section.category}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map(item => {
                const Icon = item.icon;
                return (
                  <Card 
                    key={item.title} 
                    className="border-gray-700 bg-gray-800/50 hover:border-blue-500/50 hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
                    onClick={() => handleGuideClick(item.title)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Icon className="w-8 h-8 text-blue-400" />
                        <CardTitle className="text-white text-lg">{item.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">{item.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
