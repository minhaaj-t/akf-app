import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { mockDeliveryRequests } from "../../data/mockData";
import { DeliveryRequest } from "../../types";
import { motion } from "framer-motion";

export const DeliveryManagement: React.FC = () => {
  const [requests, setRequests] = useState<DeliveryRequest[]>(mockDeliveryRequests);

  const handleRequestAction = (requestId: string, action: 'approved' | 'rejected') => {
    setRequests(requests.map(request => 
      request.id === requestId ? { ...request, status: action } : request
    ));
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const processedRequests = requests.filter(req => req.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-orange-600">{pendingRequests.length}</p>
              </div>
              <span className="text-3xl">⏳</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {requests.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <span className="text-3xl">✅</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-blue-600">{requests.length}</p>
              </div>
              <span className="text-3xl">📋</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Delivery Time Requests</h3>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request, i) => (
                <motion.div key={request.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i, duration: 0.7, type: 'spring' }}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h5 className="font-semibold text-gray-900">{request.username}</h5>
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                              Pending
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-xs font-medium text-gray-600">Current Time</p>
                              <p className="text-sm text-gray-900">{request.currentTime}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-600">Requested Time</p>
                              <p className="text-sm font-semibold text-blue-600">{request.requestedTime}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-600">Requested On</p>
                              <p className="text-sm text-gray-900">{request.createdAt}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-600 mb-1">Reason</p>
                            <p className="text-sm text-gray-700 bg-white p-2 rounded border">{request.reason}</p>
                          </div>
                        </div>
                        <div className="ml-4 space-y-2">
                          <Button
                            onClick={() => handleRequestAction(request.id, 'approved')}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 w-full transition-transform hover:scale-105"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleRequestAction(request.id, 'rejected')}
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50 w-full transition-transform hover:scale-105"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Requests */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Processed Requests</h4>
          <div className="space-y-3">
            {processedRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="font-semibold text-gray-900">{request.username}</h5>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        request.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {request.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-medium text-gray-600">From</p>
                        <p className="text-gray-900">{request.currentTime}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600">To</p>
                        <p className="text-gray-900">{request.requestedTime}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600">Reason</p>
                        <p className="text-gray-700">{request.reason}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600">Processed</p>
                        <p className="text-gray-900">{request.createdAt}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};