import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useAuth } from "../contexts/AuthContext";

export const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const userStats = [
    { label: 'Profile Views', value: '156', icon: '👁️' },
    { label: 'Messages', value: '23', icon: '💬' },
    { label: 'Notifications', value: '8', icon: '🔔' },
    { label: 'Tasks Completed', value: '42', icon: '✅' },
  ];

  const recentActivity = [
    { id: 1, action: 'Updated profile picture', time: '2 hours ago', type: 'profile' },
    { id: 2, action: 'Completed task: Review documents', time: '5 hours ago', type: 'task' },
    { id: 3, action: 'Received message from John', time: '1 day ago', type: 'message' },
    { id: 4, action: 'Changed password', time: '3 days ago', type: 'security' },
  ];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'profile', label: 'Profile' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'messages', label: 'Messages' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">User Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Hello, {user?.username}</span>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Card */}
            <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.username}!</h2>
                    <p className="text-green-100">Here's what's happening with your account today.</p>
                  </div>
                  <div className="text-6xl opacity-20">👋</div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <span className="text-2xl">{stat.icon}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'profile' ? 'bg-blue-500' :
                        activity.type === 'task' ? 'bg-green-500' :
                        activity.type === 'message' ? 'bg-purple-500' :
                        'bg-orange-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'profile' && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Profile Settings</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <Button variant="outline">Change Photo</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      defaultValue={user?.username}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'tasks' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">My Tasks</h3>
                <Button className="bg-green-600 hover:bg-green-700">Add New Task</Button>
              </div>
              <div className="space-y-4">
                {[
                  { id: 1, title: 'Review project proposal', status: 'pending', priority: 'high' },
                  { id: 2, title: 'Update user documentation', status: 'in-progress', priority: 'medium' },
                  { id: 3, title: 'Prepare monthly report', status: 'completed', priority: 'low' },
                ].map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" defaultChecked={task.status === 'completed'} />
                      <span className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'messages' && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Messages</h3>
              <div className="space-y-4">
                {[
                  { id: 1, from: 'John Doe', subject: 'Project Update', time: '2 hours ago', unread: true },
                  { id: 2, from: 'Jane Smith', subject: 'Meeting Tomorrow', time: '5 hours ago', unread: false },
                  { id: 3, from: 'Admin', subject: 'System Maintenance', time: '1 day ago', unread: false },
                ].map((message) => (
                  <div key={message.id} className={`p-4 border border-gray-200 rounded-lg ${message.unread ? 'bg-blue-50' : 'bg-white'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${message.unread ? 'text-blue-900' : 'text-gray-900'}`}>
                          {message.from}
                        </p>
                        <p className={`text-sm ${message.unread ? 'text-blue-700' : 'text-gray-600'}`}>
                          {message.subject}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{message.time}</p>
                        {message.unread && (
                          <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-1"></span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};