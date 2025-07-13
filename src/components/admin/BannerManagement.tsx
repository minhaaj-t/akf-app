import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { mockBanners, mockFeedback } from "../../data/mockData";
import { Banner, Feedback } from "../../types";

export const BannerManagement: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [feedback, setFeedback] = useState<Feedback[]>(mockFeedback);
  const [isAddingBanner, setIsAddingBanner] = useState(false);
  const [newBanner, setNewBanner] = useState<Partial<Banner>>({
    type: 'info',
    active: true,
  });

  const handleAddBanner = () => {
    if (newBanner.title && newBanner.message) {
      const banner: Banner = {
        id: Date.now().toString(),
        title: newBanner.title,
        message: newBanner.message,
        type: newBanner.type || 'info',
        active: newBanner.active || true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setBanners([banner, ...banners]);
      setNewBanner({ type: 'info', active: true });
      setIsAddingBanner(false);
    }
  };

  const handleToggleBanner = (bannerId: string) => {
    setBanners(banners.map(banner => 
      banner.id === bannerId ? { ...banner, active: !banner.active } : banner
    ));
  };

  const handleFeedbackAction = (feedbackId: string, action: 'approved' | 'rejected') => {
    setFeedback(feedback.map(item => 
      item.id === feedbackId ? { ...item, status: action } : item
    ));
  };

  const getBannerColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Banner */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Banner Management</h3>
            <Button 
              onClick={() => setIsAddingBanner(!isAddingBanner)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isAddingBanner ? 'Cancel' : 'Add New Banner'}
            </Button>
          </div>

          {isAddingBanner && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner Title</label>
                  <Input
                    value={newBanner.title || ''}
                    onChange={(e) => setNewBanner({...newBanner, title: e.target.value})}
                    placeholder="Enter banner title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner Type</label>
                  <select
                    value={newBanner.type || 'info'}
                    onChange={(e) => setNewBanner({...newBanner, type: e.target.value as 'info' | 'warning' | 'emergency'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Message</label>
                <textarea
                  value={newBanner.message || ''}
                  onChange={(e) => setNewBanner({...newBanner, message: e.target.value})}
                  placeholder="Enter banner message"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <Button onClick={handleAddBanner} className="bg-green-600 hover:bg-green-700">
                Create Banner
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Banners */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Active Banners</h4>
          <div className="space-y-4">
            {banners.map((banner) => (
              <div key={banner.id} className={`p-4 rounded-lg border-2 ${getBannerColor(banner.type)}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-semibold">{banner.title}</h5>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        banner.type === 'emergency' ? 'bg-red-100 text-red-800' :
                        banner.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {banner.type}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        banner.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {banner.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm">{banner.message}</p>
                    <p className="text-xs mt-2 opacity-75">Created: {banner.createdAt}</p>
                  </div>
                  <Button
                    onClick={() => handleToggleBanner(banner.id)}
                    size="sm"
                    variant="outline"
                    className={banner.active ? 'text-red-600 border-red-600' : 'text-green-600 border-green-600'}
                  >
                    {banner.active ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feedback Management */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">User Feedback Management</h4>
          <div className="space-y-4">
            {feedback.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-semibold text-gray-900">{item.username}</h5>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'approved' ? 'bg-green-100 text-green-800' :
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{item.message}</p>
                    <p className="text-xs text-gray-500">Submitted: {item.createdAt}</p>
                  </div>
                  {item.status === 'pending' && (
                    <div className="space-x-2">
                      <Button
                        onClick={() => handleFeedbackAction(item.id, 'approved')}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleFeedbackAction(item.id, 'rejected')}
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};