import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useAuth } from "../../contexts/AuthContext";

export const PaymentSection: React.FC = () => {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'bank'>('bank');
  const [showBankDetails, setShowBankDetails] = useState(false);

  const planAmount = user?.planType === 'yearly' ? 1200 : 120;

  const handlePayment = () => {
    if (selectedMethod === 'bank') {
      setShowBankDetails(true);
    } else {
      alert('Cash payment selected. Please contact admin for cash collection.');
    }
  };

  const copyBankDetails = () => {
    const bankDetails = `Bank: Emirates NBD
Account Number: 1234567890123456
IBAN: AE070331234567890123456
Account Holder: Ajman Mess Food Services
Amount: AED ${planAmount}`;
    
    navigator.clipboard.writeText(bankDetails);
    alert('Bank details copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Payment Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">💳 Payment Status</h3>
            <span className={`px-4 py-2 rounded-full font-semibold ${
              user?.paymentStatus === 'paid' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {user?.paymentStatus === 'paid' ? '✅ Paid' : '❌ Payment Due'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Plan Type</p>
              <p className="text-xl font-bold text-blue-900 capitalize">{user?.planType}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-purple-800">Amount Due</p>
              <p className="text-xl font-bold text-purple-900">AED {planAmount}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-orange-800">Due Date</p>
              <p className="text-xl font-bold text-orange-900">5th of Month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      {user?.paymentStatus === 'unpaid' && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">💰 Make Payment</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="bank"
                  name="paymentMethod"
                  value="bank"
                  checked={selectedMethod === 'bank'}
                  onChange={(e) => setSelectedMethod(e.target.value as 'bank')}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="bank" className="flex items-center space-x-2 cursor-pointer">
                  <span className="text-2xl">🏦</span>
                  <span className="font-medium">Bank Transfer</span>
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="cash"
                  name="paymentMethod"
                  value="cash"
                  checked={selectedMethod === 'cash'}
                  onChange={(e) => setSelectedMethod(e.target.value as 'cash')}
                  className="w-4 h-4 text-green-600"
                />
                <label htmlFor="cash" className="flex items-center space-x-2 cursor-pointer">
                  <span className="text-2xl">💵</span>
                  <span className="font-medium">Cash on Hand</span>
                </label>
              </div>
            </div>

            <Button 
              onClick={handlePayment}
              className="w-full bg-uae-green hover:bg-green-700 h-12 text-lg font-semibold"
            >
              {selectedMethod === 'bank' ? '🏦 Get Bank Details' : '💵 Request Cash Collection'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Bank Details */}
      {showBankDetails && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">🏦 Bank Transfer Details</h3>
              <Button onClick={copyBankDetails} variant="outline" size="sm">
                📋 Copy Details
              </Button>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-blue-800">Bank Name</p>
                  <p className="text-lg font-semibold text-blue-900">Emirates NBD</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Account Number</p>
                  <p className="text-lg font-semibold text-blue-900">1234567890123456</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">IBAN</p>
                  <p className="text-lg font-semibold text-blue-900">AE070331234567890123456</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Account Holder</p>
                  <p className="text-lg font-semibold text-blue-900">Ajman Mess Food Services</p>
                </div>
              </div>
              
              <div className="border-t border-blue-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-blue-800">Amount to Transfer:</span>
                  <span className="text-2xl font-bold text-blue-900">AED {planAmount}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Please include your username "{user?.username}" in the transfer reference/memo. 
                After making the payment, contact admin to confirm the transaction.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">📊 Payment History</h3>
          <div className="space-y-3">
            {[
              { date: '2024-01-15', amount: planAmount, method: 'Bank Transfer', status: 'Completed' },
              { date: '2023-12-15', amount: planAmount, method: 'Cash', status: 'Completed' },
              { date: '2023-11-15', amount: planAmount, method: 'Bank Transfer', status: 'Completed' },
            ].map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{payment.date}</p>
                  <p className="text-sm text-gray-600">{payment.method}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">AED {payment.amount}</p>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};