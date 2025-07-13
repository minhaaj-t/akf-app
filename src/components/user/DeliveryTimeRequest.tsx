import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useAuth } from "../../contexts/AuthContext";
import { mockDeliveryRequests } from "../../data/mockData";

export const DeliveryTimeRequest: React.FC = () => {
  const { user } = useAuth();
  const [requestedAfternoon, setRequestedAfternoon] = useState('');
  const [requestedNight, setRequestedNight] = useState('');
  const [reason, setReason] = useState('');

  const userRequests = mockDeliveryRequests.filter(req => req.userId === user?.id);

  const submitRequest = () => {
    if ((requestedAfternoon || requestedNight) && reason.trim()) {
      alert('Delivery time change request submitted! Admin will review and respond soon.');
      setRequestedAfternoon('');
      setRequestedNight('');
      setReason('');
    } else {
      alert('Please provide at least one requested time and a reason.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Delivery Time */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Current Delivery Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Afternoon Plan</p>
              <p className="text-2xl font-bold text-blue-900">{user?.deliveryPlans?.afternoon || '-'}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-800">Night Plan</p>
              <p className="text-2xl font-bold text-green-900">{user?.deliveryPlans?.night || '-'}</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Delivery time changes require admin approval. 
              Please allow 24-48 hours for processing your request.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Request Time Change */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Request Delivery Time Change</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requested Afternoon Time
              </label>
              <select
                value={requestedAfternoon}
                onChange={(e) => setRequestedAfternoon(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">No change</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="12:30 PM">12:30 PM</option>
                <option value="1:00 PM">1:00 PM</option>
                <option value="1:30 PM">1:30 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="2:30 PM">2:30 PM</option>
                <option value="3:00 PM">3:00 PM</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requested Night Time
              </label>
              <select
                value={requestedNight}
                onChange={(e) => setRequestedNight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">No change</option>
                <option value="7:00 PM">7:00 PM</option>
                <option value="7:30 PM">7:30 PM</option>
                <option value="8:00 PM">8:00 PM</option>
                <option value="8:30 PM">8:30 PM</option>
                <option value="9:00 PM">9:00 PM</option>
                <option value="9:30 PM">9:30 PM</option>
                <option value="10:00 PM">10:00 PM</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Change
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please explain why you need to change your delivery time..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={3}
              />
            </div>
            <Button 
              onClick={submitRequest}
              className="bg-orange-600 hover:bg-orange-700"
              disabled={!(requestedAfternoon || requestedNight) || !reason.trim()}
            >
              Submit Request
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Request History */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">📋 My Requests</h4>
          <div className="space-y-3">
            {userRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {request.currentTime} → {request.requestedTime}
                    </p>
                    <p className="text-sm text-gray-600">{request.reason}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status === 'approved' ? '✅ Approved' :
                     request.status === 'pending' ? '⏳ Pending' :
                     '❌ Rejected'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Requested: {request.createdAt}</p>
              </div>
            ))}
            {userRequests.length === 0 && (
              <p className="text-gray-500 text-center py-4">No delivery time requests yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Guidelines */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">📋 Delivery Guidelines</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-green-600 mt-1">✅</span>
              <p className="text-sm text-gray-700">
                <strong>Available Times:</strong> 11:00 AM to 3:00 PM (30-minute intervals)
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 mt-1">✅</span>
              <p className="text-sm text-gray-700">
                <strong>Processing Time:</strong> 24-48 hours for approval
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 mt-1">✅</span>
              <p className="text-sm text-gray-700">
                <strong>Valid Reasons:</strong> Work schedule, medical appointments, family commitments
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-orange-600 mt-1">⚠️</span>
              <p className="text-sm text-gray-700">
                <strong>Limit:</strong> Maximum 2 time changes per month
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-red-600 mt-1">❌</span>
              <p className="text-sm text-gray-700">
                <strong>Not Available:</strong> Same-day delivery time changes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};