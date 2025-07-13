import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useAuth } from "../../contexts/AuthContext";
import { mockIssues } from "../../data/mockData";
import { Issue, IssueComment } from "../../types";
import { AlertTriangle, MessageSquare, User, Calendar, Tag, Clock, CheckCircle } from "lucide-react";

export const IssueSection: React.FC = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [isCreatingIssue, setIsCreatingIssue] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [newComment, setNewComment] = useState('');
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    type: 'bug' as const,
    priority: 'medium' as const,
    tags: [] as string[],
    dueDate: ''
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug': return 'bg-red-100 text-red-800';
      case 'feature': return 'bg-blue-100 text-blue-800';
      case 'improvement': return 'bg-green-100 text-green-800';
      case 'task': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitIssue = () => {
    const issue: Issue = {
      id: Date.now().toString(),
      ...newIssue,
      status: 'open',
      reporterId: user?.id || '',
      reporterName: user?.username || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    
    setIssues([issue, ...issues]);
    setNewIssue({
      title: '',
      description: '',
      type: 'bug',
      priority: 'medium',
      tags: [],
      dueDate: ''
    });
    setIsCreatingIssue(false);
  };

  const updateIssueStatus = (issueId: string, status: Issue['status']) => {
    setIssues(issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, status, updatedAt: new Date().toISOString() }
        : issue
    ));
  };

  const addComment = (issueId: string) => {
    if (!newComment.trim()) return;

    const comment: IssueComment = {
      id: Date.now().toString(),
      issueId,
      userId: user?.id || '',
      username: user?.username || '',
      comment: newComment,
      createdAt: new Date().toISOString()
    };

    setIssues(issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, comments: [...issue.comments, comment], updatedAt: new Date().toISOString() }
        : issue
    ));
    setNewComment('');
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !newIssue.tags.includes(tag.trim())) {
      setNewIssue({...newIssue, tags: [...newIssue.tags, tag.trim()]});
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewIssue({...newIssue, tags: newIssue.tags.filter(tag => tag !== tagToRemove)});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Issue Tracker</h3>
          <p className="text-sm text-gray-600">Track and manage development issues</p>
        </div>
        <Button 
          onClick={() => setIsCreatingIssue(true)}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <AlertTriangle size={16} className="mr-2" />
          Create Issue
        </Button>
      </div>

      {/* Issue Creation Form */}
      {isCreatingIssue && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-medium text-gray-900">Create New Issue</h4>
              <Button 
                onClick={() => setIsCreatingIssue(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Title</label>
                <Input
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                  placeholder="Brief description of the issue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                  placeholder="Detailed description of the issue"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newIssue.type}
                    onChange={(e) => setNewIssue({...newIssue, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="bug">Bug</option>
                    <option value="feature">Feature</option>
                    <option value="improvement">Improvement</option>
                    <option value="task">Task</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newIssue.priority}
                    onChange={(e) => setNewIssue({...newIssue, priority: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <Input
                    type="date"
                    value={newIssue.dueDate}
                    onChange={(e) => setNewIssue({...newIssue, dueDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newIssue.tags.map((tag) => (
                    <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add tag and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button 
                onClick={() => setIsCreatingIssue(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitIssue}
                className="bg-orange-600 hover:bg-orange-700"
                disabled={!newIssue.title || !newIssue.description}
              >
                Create Issue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issues List */}
      <div className="space-y-4">
        {issues.map((issue) => (
          <Card key={issue.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{issue.title}</h4>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(issue.type)}`}>
                      {issue.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(issue.priority)}`}>
                      {issue.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{issue.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <User size={14} />
                      <span>{issue.reporterName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare size={14} />
                      <span>{issue.comments.length} comments</span>
                    </div>
                    {issue.dueDate && (
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>Due: {new Date(issue.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  {issue.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {issue.tags.map((tag) => (
                        <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => setSelectedIssue(issue)}
                    size="sm"
                    variant="outline"
                  >
                    View Details
                  </Button>
                  {user?.role === 'admin' && (
                    <select
                      value={issue.status}
                      onChange={(e) => updateIssueStatus(issue.id, e.target.value as Issue['status'])}
                      className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
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

      {/* Issue Details Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-medium text-gray-900">{selectedIssue.title}</h3>
                <Button 
                  onClick={() => setSelectedIssue(null)}
                  variant="outline"
                  size="sm"
                >
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">{selectedIssue.description}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedIssue.tags.map((tag) => (
                        <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Type</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedIssue.type)}`}>
                        {selectedIssue.type}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedIssue.status)}`}>
                        {selectedIssue.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Priority</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedIssue.priority)}`}>
                        {selectedIssue.priority}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Reporter</h4>
                      <p className="text-gray-600">{selectedIssue.reporterName}</p>
                    </div>
                  </div>
                  {selectedIssue.dueDate && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Due Date</h4>
                      <p className="text-gray-600">{new Date(selectedIssue.dueDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Comments ({selectedIssue.comments.length})</h4>
                
                <div className="space-y-4 mb-4">
                  {selectedIssue.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">{comment.username}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600">{comment.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="space-y-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => addComment(selectedIssue.id)}
                      className="bg-orange-600 hover:bg-orange-700"
                      disabled={!newComment.trim()}
                    >
                      Add Comment
                    </Button>
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