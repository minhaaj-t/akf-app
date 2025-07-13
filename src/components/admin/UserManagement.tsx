import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { mockUsers } from "../../data/mockData";
import { User } from "../../types";
import { motion } from "framer-motion";
import Avatar, { genConfig } from 'react-nice-avatar';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingUser, setIsAddingUser] = useState(false);
  // Replace STICKERS and profileSticker with avatarConfig for each user
  // For newUser, use avatarConfig: genConfig()
  const [newUser, setNewUser] = useState<Partial<User>>({
    role: 'user',
    status: 'pending',
    planType: 'monthly',
    paymentStatus: 'unpaid',
    deliveryPlans: {},
    daysActive: 0,
    avatarConfig: genConfig(),
  });

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (userId: string, newStatus: 'approved' | 'rejected') => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const handlePaymentStatusChange = (userId: string, newStatus: 'paid' | 'unpaid') => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, paymentStatus: newStatus } : user
    ));
  };

  const handleDeliveryTimeChange = (userId: string, newTime: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, deliveryTime: newTime } : user
    ));
  };

  const handleAddUser = () => {
    if (newUser.username && newUser.email) {
      const user: User = {
        id: Date.now().toString(),
        username: newUser.username,
        email: newUser.email,
        role: newUser.role || 'user',
        status: newUser.status || 'pending',
        planType: newUser.planType || 'monthly',
        joinDate: new Date().toISOString().split('T')[0],
        deliveryPlans: newUser.deliveryPlans || {},
        paymentStatus: newUser.paymentStatus || 'unpaid',
        paymentMethod: newUser.paymentMethod,
        daysActive: 0,
        expiryDate: newUser.planType === 'yearly' 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        avatarConfig: newUser.avatarConfig || genConfig(),
      };
      setUsers([...users, user]);
      setNewUser({
        role: 'user',
        status: 'pending',
        planType: 'monthly',
        paymentStatus: 'unpaid',
        deliveryPlans: {},
        daysActive: 0,
        avatarConfig: genConfig(),
      });
      setIsAddingUser(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, type: 'spring' }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">User Management</h3>
              <div className="flex space-x-4">
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
                <Button 
                  onClick={() => setIsAddingUser(!isAddingUser)}
                  className="bg-uae-green hover:bg-green-700 text-white"
                >
                  {isAddingUser ? 'Cancel' : 'Add User'}
                </Button>
              </div>
            </div>

            {/* Add User Form */}
            {isAddingUser && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 className="text-md font-medium text-gray-900 mb-4">Add New User</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <Input
                      value={newUser.username || ''}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input
                      type="email"
                      value={newUser.email || ''}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="Enter email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type</label>
                    <select
                      value={newUser.planType || 'monthly'}
                      onChange={(e) => setNewUser({...newUser, planType: e.target.value as 'monthly' | 'yearly'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Afternoon Plan Time</label>
                    <select
                      value={newUser.deliveryPlans?.afternoon || ''}
                      onChange={(e) => setNewUser({...newUser, deliveryPlans: {...newUser.deliveryPlans, afternoon: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">None</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Night Plan Time</label>
                    <select
                      value={newUser.deliveryPlans?.night || ''}
                      onChange={(e) => setNewUser({...newUser, deliveryPlans: {...newUser.deliveryPlans, night: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">None</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select
                      value={newUser.paymentMethod || ''}
                      onChange={(e) => setNewUser({...newUser, paymentMethod: e.target.value as 'cash' | 'bank'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select method</option>
                      <option value="cash">Cash</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Sticker</label>
                    <div className="flex flex-wrap gap-1">
                      <Button onClick={() => setNewUser({ ...newUser, avatarConfig: genConfig() })} className="mt-2">Randomize Avatar</Button>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={handleAddUser}
                      className="bg-uae-green hover:bg-green-700 text-white"
                      disabled={!newUser.username || !newUser.email}
                    >
                      Add User
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Afternoon Delivery</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Night Delivery</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">{user.daysActive} days active</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.planType === 'yearly' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.planType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.joinDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.deliveryPlans?.afternoon || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.deliveryPlans?.night || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.paymentStatus}
                          onChange={(e) => handlePaymentStatusChange(user.id, e.target.value as 'paid' | 'unpaid')}
                          className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${
                            user.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <option value="paid">Paid</option>
                          <option value="unpaid">Unpaid</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'approved' ? 'bg-green-100 text-green-800' :
                          user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-2xl">
                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2, delay: Math.random() }} className="">
                          <Avatar style={{ width: 40, height: 40 }} {...user.avatarConfig} />
                        </motion.div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {user.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleStatusChange(user.id, 'approved')}
                              size="sm"
                             className="bg-uae-green hover:bg-green-700 text-xs"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleStatusChange(user.id, 'rejected')}
                              size="sm"
                              variant="outline"
                             className="text-uae-red border-uae-red hover:bg-red-50 text-xs"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {user.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            Edit
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};