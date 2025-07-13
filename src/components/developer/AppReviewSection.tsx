import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useAuth } from "../../contexts/AuthContext";
import { mockAppReviews } from "../../data/mockData";
import { AppReview } from "../../types";
import { Star, MessageSquare, User, Calendar, Tag, ThumbsUp, ThumbsDown } from "lucide-react";

export const AppReviewSection: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<AppReview[]>(mockAppReviews);
  const [isCreatingReview, setIsCreatingReview] = useState(false);
  const [selectedReview, setSelectedReview] = useState<AppReview | null>(null);
  const [newReview, setNewReview] = useState({
    title: '',
    review: '',
    rating: 5,
    category: 'general' as const
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'implemented': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feature': return 'bg-purple-100 text-purple-800';
      case 'ui': return 'bg-blue-100 text-blue-800';
      case 'performance': return 'bg-orange-100 text-orange-800';
      case 'bug': return 'bg-red-100 text-red-800';
      case 'suggestion': return 'bg-green-100 text-green-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmitReview = () => {
    const review: AppReview = {
      id: Date.now().toString(),
      ...newReview,
      userId: user?.id || '',
      username: user?.username || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setReviews([review, ...reviews]);
    setNewReview({
      title: '',
      review: '',
      rating: 5,
      category: 'general'
    });
    setIsCreatingReview(false);
  };

  const updateReviewStatus = (reviewId: string, status: AppReview['status'], response?: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            status, 
            adminResponse: response,
            updatedAt: new Date().toISOString() 
          }
        : review
    ));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">App Reviews</h3>
          <p className="text-sm text-gray-600">User reviews and feedback</p>
        </div>
        <Button 
          onClick={() => setIsCreatingReview(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <MessageSquare size={16} className="mr-2" />
          Submit Review
        </Button>
      </div>

      {/* Review Form */}
      {isCreatingReview && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-medium text-gray-900">Submit New Review</h4>
              <Button 
                onClick={() => setIsCreatingReview(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
                <Input
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  placeholder="Brief title for your review"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex items-center space-x-2">
                  {renderStars(newReview.rating)}
                  <span className="text-sm text-gray-600 ml-2">({newReview.rating}/5)</span>
                </div>
                <div className="flex space-x-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({...newReview, rating: star})}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Star
                        size={20}
                        className={star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newReview.category}
                  onChange={(e) => setNewReview({...newReview, category: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="feature">Feature Request</option>
                  <option value="ui">UI/UX</option>
                  <option value="performance">Performance</option>
                  <option value="bug">Bug Report</option>
                  <option value="suggestion">Suggestion</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                <textarea
                  value={newReview.review}
                  onChange={(e) => setNewReview({...newReview, review: e.target.value})}
                  placeholder="Share your experience and suggestions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button 
                onClick={() => setIsCreatingReview(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitReview}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!newReview.title || !newReview.review}
              >
                Submit Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{review.title}</h4>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(review.category)}`}>
                      {review.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{review.review}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User size={14} />
                      <span>{review.username}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {review.adminResponse && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-1">Admin Response:</h5>
                      <p className="text-blue-700 text-sm">{review.adminResponse}</p>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => setSelectedReview(review)}
                    size="sm"
                    variant="outline"
                  >
                    View Details
                  </Button>
                  {user?.role === 'admin' && review.status === 'pending' && (
                    <div className="flex space-x-1">
                      <Button 
                        onClick={() => updateReviewStatus(review.id, 'implemented')}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <ThumbsUp size={14} />
                      </Button>
                      <Button 
                        onClick={() => updateReviewStatus(review.id, 'rejected')}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <ThumbsDown size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-medium text-gray-900">{selectedReview.title}</h3>
                <Button 
                  onClick={() => setSelectedReview(null)}
                  variant="outline"
                  size="sm"
                >
                  Close
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    {renderStars(selectedReview.rating)}
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedReview.status)}`}>
                    {selectedReview.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(selectedReview.category)}`}>
                    {selectedReview.category}
                  </span>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Review</h4>
                  <p className="text-gray-600">{selectedReview.review}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">By:</span>
                    <span className="text-gray-600 ml-2">{selectedReview.username}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Date:</span>
                    <span className="text-gray-600 ml-2">{new Date(selectedReview.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {selectedReview.adminResponse && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Admin Response</h4>
                    <p className="text-blue-700">{selectedReview.adminResponse}</p>
                  </div>
                )}

                {user?.role === 'admin' && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Admin Actions</h4>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => updateReviewStatus(selectedReview.id, 'implemented')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <ThumbsUp size={16} className="mr-2" />
                        Implement
                      </Button>
                      <Button 
                        onClick={() => updateReviewStatus(selectedReview.id, 'rejected')}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <ThumbsDown size={16} className="mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 