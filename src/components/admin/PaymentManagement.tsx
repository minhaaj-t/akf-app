import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { mockUsers } from "../../data/mockData";
import { User } from "../../types";

export const PaymentManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers.filter(u => u.role === 'user'));
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [editingPayment, setEditingPayment] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<'full' | 'half' | 'custom'>('full');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.paymentStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handlePaymentStatusChange = (userId: string, newStatus: 'paid' | 'unpaid') => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, paymentStatus: newStatus } : user
    ));
  };

  const handlePaymentUpdate = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const fullAmount = user.planType === 'yearly' ? 1200 : 120;
    let amount = 0;
    
    switch (paymentType) {
      case 'full':
        amount = fullAmount;
        break;
      case 'half':
        amount = fullAmount / 2;
        break;
      case 'custom':
        amount = paymentAmount;
        break;
    }
    
    // Update user with payment info
    setUsers(users.map(u => 
      u.id === userId 
        ? { 
            ...u, 
            paymentStatus: amount >= fullAmount ? 'paid' : 'unpaid',
            paidAmount: amount,
            lastPaymentDate: new Date().toISOString().split('T')[0]
          } 
        : u
    ));
    
    setEditingPayment(null);
    setPaymentAmount(0);
    setPaymentType('full');
  };

  const totalRevenue = users
    .filter(user => user.paymentStatus === 'paid')
    .reduce((total, user) => {
      const amount = user.planType === 'yearly' ? 1200 : 120; // AED per month/year
      return total + amount;
    }, 0);

  const pendingAmount = users
    .filter(user => user.paymentStatus === 'unpaid')
    .reduce((total, user) => {
      const amount = user.planType === 'yearly' ? 1200 : 120;
      return total + amount;
    }, 0);

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">AED {totalRevenue}</p>
              </div>
              <span className="text-3xl">💰</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-red-600">AED {pendingAmount}</p>
              </div>
              <span className="text-3xl">⏳</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Users</p>
                <p className="text-2xl font-bold text-blue-600">
                  {users.filter(u => u.paymentStatus === 'paid').length}
                </p>
              </div>
              <span className="text-3xl">✅</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Management */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Payment Management</h3>
            <div className="flex space-x-4">
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'paid' | 'unpaid')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Users</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const amount = user.planType === 'yearly' ? 1200 : 120;
                  return (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        AED {amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.paymentMethod === 'bank' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.paymentMethod === 'bank' ? '🏦 Bank Transfer' : '💵 Cash on Hand'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.paymentStatus === 'paid' ? '✅ Paid' : '❌ Unpaid'}
                          </span>
                          {(user as any).paidAmount && (
                            <p className="text-xs text-gray-500 mt-1">
                              Paid: AED {(user as any).paidAmount}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.expiryDate || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {editingPayment === user.id ? (
                          <div className="space-y-2 min-w-48">
                            <select
                              value={paymentType}
                              onChange={(e) => setPaymentType(e.target.value as 'full' | 'half' | 'custom')}
                              className="w-full text-xs p-1 border rounded"
                            >
                              <option value="full">Full Payment</option>
                              <option value="half">Half Payment</option>
                              <option value="custom">Custom Amount</option>
                            </select>
                            {paymentType === 'custom' && (
                              <Input
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                placeholder="Enter amount"
                                className="text-xs h-8"
                              />
                            )}
                            <div className="flex space-x-1">
                              <Button
                                onClick={() => handlePaymentUpdate(user.id)}
                                size="sm"
                                className="bg-uae-green hover:bg-green-700 text-xs"
                              >
                                Save
                              </Button>
                              <Button
                                onClick={() => setEditingPayment(null)}
                                size="sm"
                                variant="outline"
                                className="text-xs"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            onClick={() => setEditingPayment(user.id)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-xs"
                          >
                            Update Payment
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details for Reference */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Bank Account Details</h4>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-blue-800">Bank Name</p>
                <p className="text-blue-700">Emirates NBD</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Account Number</p>
                <p className="text-blue-700">1234567890123456</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">IBAN</p>
                <p className="text-blue-700">AE070331234567890123456</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Account Holder</p>
                <p className="text-blue-700">Ajman Mess Food Services</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};