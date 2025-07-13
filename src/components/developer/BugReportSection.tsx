import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useAuth } from "../../contexts/AuthContext";
import { mockBugReports } from "../../data/mockData";
import { BugReport } from "../../types";
import { Bug, AlertTriangle, CheckCircle, Clock, User, Calendar, Tag } from "lucide-react";

export const BugReportSection: React.FC = () => {
  const { user } = useAuth();
  const [bugReports, setBugReports] = useState<BugReport[]>(mockBugReports);
  const [isCreatingBug, setIsCreatingBug] = useState(false);
  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);
  const [newBug, setNewBug] = useState({
    title: '',
    description: '',
    severity: 'medium' as const,
    priority: 'medium' as const,
    category: 'ui' as const,
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    environment: ''
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitBug = () => {
    const bug: BugReport = {
      id: Date.now().toString(),
      ...newBug,
      status: 'open',
      reporterId: user?.id || '',
      reporterName: user?.username || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setBugReports([bug, ...bugReports]);
    setNewBug({
      title: '',
      description: '',
      severity: 'medium',
      priority: 'medium',
      category: 'ui',
      stepsToReproduce: '',
      expectedBehavior: '',
      actualBehavior: '',
      environment: ''
    });
    setIsCreatingBug(false);
  };

  const updateBugStatus = (bugId: string, status: BugReport['status']) => {
    setBugReports(bugReports.map(bug => 
      bug.id === bugId 
        ? { ...bug, status, updatedAt: new Date().toISOString() }
        : bug
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Bug Reports</h3>
          <p className="text-sm text-gray-600">Track and manage production bugs</p>
        </div>
        <Button 
          onClick={() => setIsCreatingBug(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Bug size={16} className="mr-2" />
          Report Bug
        </Button>
      </div>

      {/* Bug Report Form */}
      {isCreatingBug && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-medium text-gray-900">Report New Bug</h4>
              <Button 
                onClick={() => setIsCreatingBug(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bug Title</label>
                  <Input
                    value={newBug.title}
                    onChange={(e) => setNewBug({...newBug, title: e.target.value})}
                    placeholder="Brief description of the bug"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newBug.description}
                    onChange={(e) => setNewBug({...newBug, description: e.target.value})}
                    placeholder="Detailed description of the bug"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
                  <Input
                    value={newBug.environment}
                    onChange={(e) => setNewBug({...newBug, environment: e.target.value})}
                    placeholder="e.g., Chrome 120.0.0, Windows 11"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                  <select
                    value={newBug.severity}
                    onChange={(e) => setNewBug({...newBug, severity: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newBug.priority}
                    onChange={(e) => setNewBug({...newBug, priority: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newBug.category}
                    onChange={(e) => setNewBug({...newBug, category: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="ui">UI/UX</option>
                    <option value="backend">Backend</option>
                    <option value="database">Database</option>
                    <option value="performance">Performance</option>
                    <option value="security">Security</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Steps to Reproduce</label>
                <textarea
                  value={newBug.stepsToReproduce}
                  onChange={(e) => setNewBug({...newBug, stepsToReproduce: e.target.value})}
                  placeholder="1. Go to...\n2. Click on...\n3. See error..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Behavior</label>
                  <textarea
                    value={newBug.expectedBehavior}
                    onChange={(e) => setNewBug({...newBug, expectedBehavior: e.target.value})}
                    placeholder="What should happen?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Actual Behavior</label>
                  <textarea
                    value={newBug.actualBehavior}
                    onChange={(e) => setNewBug({...newBug, actualBehavior: e.target.value})}
                    placeholder="What actually happens?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button 
                onClick={() => setIsCreatingBug(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitBug}
                className="bg-red-600 hover:bg-red-700"
                disabled={!newBug.title || !newBug.description}
              >
                Submit Bug Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bug Reports List */}
      <div className="space-y-4">
        {bugReports.map((bug) => (
          <Card key={bug.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{bug.title}</h4>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(bug.severity)}`}>
                      {bug.severity}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bug.status)}`}>
                      {bug.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{bug.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User size={14} />
                      <span>{bug.reporterName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{new Date(bug.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Tag size={14} />
                      <span>{bug.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => setSelectedBug(bug)}
                    size="sm"
                    variant="outline"
                  >
                    View Details
                  </Button>
                  {user?.role === 'admin' && (
                    <select
                      value={bug.status}
                      onChange={(e) => updateBugStatus(bug.id, e.target.value as BugReport['status'])}
                      className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bug Details Modal */}
      {selectedBug && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-medium text-gray-900">{selectedBug.title}</h3>
                <Button 
                  onClick={() => setSelectedBug(null)}
                  variant="outline"
                  size="sm"
                >
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">{selectedBug.description}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Steps to Reproduce</h4>
                    <p className="text-gray-600 whitespace-pre-line">{selectedBug.stepsToReproduce}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Environment</h4>
                    <p className="text-gray-600">{selectedBug.environment}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Expected Behavior</h4>
                    <p className="text-gray-600">{selectedBug.expectedBehavior}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Actual Behavior</h4>
                    <p className="text-gray-600">{selectedBug.actualBehavior}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Severity</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(selectedBug.severity)}`}>
                        {selectedBug.severity}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Priority</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(selectedBug.priority)}`}>
                        {selectedBug.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 