import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useAuth } from "../../contexts/AuthContext";
import { User as UserIcon, Lock, CheckCircle2, Clock, XCircle, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import Avatar, { genConfig } from 'react-nice-avatar';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  // Replace STICKERS and profileSticker with avatarConfig
  const [avatarConfig, setAvatarConfig] = useState(() => genConfig());
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    deliveryPlans: {
      afternoon: user?.deliveryPlans?.afternoon || '',
      night: user?.deliveryPlans?.night || '',
    },
    // In profileData, remove profileSticker, add avatarConfig if needed
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveProfile = () => {
    // In a real app, this would make an API call
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    // In a real app, this would make an API call
    alert('Password changed successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangingPassword(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, type: 'spring' }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2"><UserIcon size={18} /> Profile Information</h3>
              <Button 
                onClick={() => setIsEditing(!isEditing)}
                className={isEditing ? "bg-gray-600 hover:bg-gray-700" : "bg-uae-green hover:bg-green-700"}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            <div className="flex items-center space-x-6 mb-6">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mx-auto mb-4">
                <Avatar style={{ width: 80, height: 80 }} {...avatarConfig} />
              </motion.div>
              {isEditing && (
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-2">Choose your sticker:</span>
                  <div className="grid grid-cols-8 gap-1 max-w-xs">
                    {/* STICKERS.slice(0, 32).map((sticker) => ( */}
                    {/*   <button */}
                    {/*     key={sticker} */}
                    {/*     type="button" */}
                    {/*     className={`text-2xl p-1 rounded ${profileData.profileSticker === sticker ? 'bg-black text-white' : 'hover:bg-gray-200'}`} */}
                    {/*     onClick={() => setProfileData({ ...profileData, profileSticker: sticker })} */}
                    {/*   > */}
                    {/*     {sticker} */}
                    {/*   </button> */}
                    {/* ))} */}
                    <Button onClick={() => setAvatarConfig(genConfig())} className="mt-2">Randomize Avatar</Button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <Input
                  value={profileData.username}
                  onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Afternoon Plan Time</label>
                <select
                  value={profileData.deliveryPlans.afternoon}
                  onChange={(e) => setProfileData({...profileData, deliveryPlans: {...profileData.deliveryPlans, afternoon: e.target.value}})}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${!isEditing ? "bg-gray-50" : ""}`}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Night Plan Time</label>
                <select
                  value={profileData.deliveryPlans.night}
                  onChange={(e) => setProfileData({...profileData, deliveryPlans: {...profileData.deliveryPlans, night: e.target.value}})}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${!isEditing ? "bg-gray-50" : ""}`}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Plan Type</label>
                <Input
                  value={user?.planType?.toUpperCase()}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            {isEditing && (
              <div className="mt-6">
                <Button 
                  onClick={handleSaveProfile}
                  className="bg-uae-green hover:bg-green-700 mr-4"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Security */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2"><Lock size={18} /> Account Security</h3>
            <Button 
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className={isChangingPassword ? "bg-gray-600 hover:bg-gray-700" : "bg-uae-red hover:bg-red-700"}
            >
              {isChangingPassword ? 'Cancel' : 'Change Password'}
            </Button>
          </div>

          {isChangingPassword ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="Confirm new password"
                />
              </div>
              <Button 
                onClick={handleChangePassword}
                className="bg-uae-red hover:bg-red-700"
                disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              >
                Update Password
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle2 size={16} className="text-green-600" />
                <p className="text-sm text-gray-700">Password last changed: Never</p>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 size={16} className="text-green-600" />
                <p className="text-sm text-gray-700">Account status: Active</p>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 size={16} className="text-green-600" />
                <p className="text-sm text-gray-700">Two-factor authentication: Disabled</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2"><BarChart2 size={18} /> Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Member Since</p>
                <p className="text-lg text-gray-900">{user?.joinDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Days Active</p>
                <p className="text-lg text-gray-900">{user?.daysActive} days</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">User ID</p>
                <p className="text-lg text-gray-900 font-mono">{user?.id}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Plan Expiry</p>
                <p className="text-lg text-gray-900">{user?.expiryDate || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Payment Status</p>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  user?.paymentStatus === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user?.paymentStatus === 'paid' ? <CheckCircle2 size={14} className="inline mr-1 text-green-600" /> : <XCircle size={14} className="inline mr-1 text-red-600" />}
                  {user?.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Payment Method</p>
                <p className="text-lg text-gray-900 capitalize">{user?.paymentMethod || 'Not set'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};