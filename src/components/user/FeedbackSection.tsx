import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useAuth } from "../../contexts/AuthContext";
import { mockFeedback } from "../../data/mockData";
import { Star, MessageCircle, FileText, BarChart2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const FeedbackSection: React.FC = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const approvedFeedback = mockFeedback.filter(feedback => feedback.status === 'approved');

  const submitFeedback = () => {
    if (rating > 0 && message.trim()) {
      alert('Thank you for your feedback! It will be reviewed by admin before being published.');
      setRating(0);
      setMessage('');
    } else {
      alert('Please provide both a rating and message.');
    }
  };

  const StarRating = ({ value, onChange, readonly = false }: any) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          animate={{ scale: star <= (hoveredRating || rating) ? 1.1 : 1 }}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHoveredRating(star)}
          onMouseLeave={() => !readonly && setHoveredRating(0)}
          className={`text-2xl ${readonly ? 'cursor-default' : 'cursor-pointer'} transition-transform ${star <= (readonly ? value : (hoveredRating || rating)) ? 'text-yellow-400' : 'text-gray-300'}`}
          disabled={readonly}
        >
          <Star fill={star <= (readonly ? value : (hoveredRating || rating)) ? '#facc15' : 'none'} />
        </motion.button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Submit Feedback */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, type: 'spring' }}>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2"><MessageCircle size={20} /> Submit Feedback</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate your experience
                </label>
                <StarRating value={rating} onChange={setRating} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your feedback
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your experience with our food and service..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={4}
                />
              </div>

              <Button 
                onClick={submitFeedback}
                className="bg-orange-600 hover:bg-orange-700"
                disabled={rating === 0 || !message.trim()}
              >
                Submit Feedback
              </Button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your feedback will be reviewed by our admin team before being published. 
                Only approved feedback will be visible to other users.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* My Previous Feedback */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2"><FileText size={18} /> My Previous Feedback</h4>
          <div className="space-y-3">
            {mockFeedback
              .filter(feedback => feedback.userId === user?.id)
              .map((feedback) => (
                <div key={feedback.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <StarRating value={feedback.rating} readonly />
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      feedback.status === 'approved' ? 'bg-green-100 text-green-800' :
                      feedback.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {feedback.status}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{feedback.message}</p>
                  <p className="text-xs text-gray-500">Submitted: {feedback.createdAt}</p>
                </div>
              ))}
            {mockFeedback.filter(feedback => feedback.userId === user?.id).length === 0 && (
              <p className="text-gray-500 text-center py-4">You haven't submitted any feedback yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Community Feedback */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2"><Sparkles size={18} /> Community Feedback</h4>
          <div className="space-y-4">
            {approvedFeedback.map((feedback) => (
              <div key={feedback.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-orange-600">
                        {feedback.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{feedback.username}</p>
                      <StarRating value={feedback.rating} readonly />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{feedback.createdAt}</span>
                </div>
                <p className="text-gray-700 ml-11">{feedback.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feedback Statistics */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2"><BarChart2 size={18} /> Feedback Statistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">4.6</p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{approvedFeedback.length}</p>
              <p className="text-sm text-gray-600">Total Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">98%</p>
              <p className="text-sm text-gray-600">Satisfaction Rate</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h5 className="font-semibold text-gray-800 mb-3">Rating Distribution</h5>
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = approvedFeedback.filter(f => f.rating === stars).length;
              const percentage = approvedFeedback.length > 0 ? (count / approvedFeedback.length) * 100 : 0;
              
              return (
                <div key={stars} className="flex items-center space-x-3 mb-2">
                  <span className="text-sm w-8">{stars}<Star className="inline ml-1" size={16} fill="#facc15" /></span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{count}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};