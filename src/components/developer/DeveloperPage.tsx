import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useAuth } from "../../contexts/AuthContext";
import { BugReportSection } from "./BugReportSection";
import { AppReviewSection } from "./AppReviewSection";
import { IssueSection } from "./IssueSection";
import { DocumentationSection } from "./DocumentationSection";
import { Bug, Code, AlertTriangle, Star, BookOpen } from "lucide-react";

export const DeveloperPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bugs');

  const tabs = [
    { 
      id: 'bugs', 
      label: 'Bug Reports', 
      icon: <Bug size={20} />,
      description: 'Report and track production bugs'
    },
    { 
      id: 'reviews', 
      label: 'App Reviews', 
      icon: <Star size={20} />,
      description: 'User reviews and feedback'
    },
    { 
      id: 'issues', 
      label: 'Issue Tracker', 
      icon: <AlertTriangle size={20} />,
      description: 'Track and manage development issues'
    },
    { 
      id: 'docs', 
      label: 'Documentation', 
      icon: <BookOpen size={20} />,
      description: 'System documentation and guides'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl mr-3"><Code size={28} /></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  <span className="block md:hidden">Developer</span>
                  <span className="hidden md:block">Developer Portal</span>
                </h1>
                <p className="text-sm text-gray-500 hidden md:block">Bug tracking, reviews, and documentation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden md:inline">Welcome, {user?.username}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">DEV</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Description */}
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <span className="text-blue-600">
                {tabs.find(tab => tab.id === activeTab)?.icon}
              </span>
              <div>
                <h2 className="text-lg font-medium text-blue-900">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-blue-700">
                  {tabs.find(tab => tab.id === activeTab)?.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'bugs' && <BugReportSection />}
        {activeTab === 'reviews' && <AppReviewSection />}
        {activeTab === 'issues' && <IssueSection />}
        {activeTab === 'docs' && <DocumentationSection />}
      </div>
    </div>
  );
}; 