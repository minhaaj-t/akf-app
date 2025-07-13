import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useAuth } from "../../contexts/AuthContext";
import { UserManagement } from "./UserManagement";
import { MenuManagement } from "./MenuManagement";
import { BannerManagement } from "./BannerManagement";
import { PaymentManagement } from "./PaymentManagement";
import { DeliveryManagement } from "./DeliveryManagement";
import { MobileBottomNav } from "../MobileBottomNav";
import { BarChart2, Users, Utensils, Megaphone, CreditCard, Truck, CheckCircle2, Clock, DollarSign, Menu as MenuIcon } from "lucide-react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { locationService, LocationData } from "../../services/locationService";

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [adminLocation, setAdminLocation] = useState<LocationData | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  useEffect(() => {
    const fetchAdminLocation = async () => {
      setIsLoadingLocation(true);
      try {
        const location = await locationService.getCurrentLocation();
        setAdminLocation(location);
      } catch (error) {
        console.error('Failed to fetch admin location:', error);
        // Don't set fallback location - let the UI show the error
        setAdminLocation(null);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    fetchAdminLocation();
  }, []);

  // Only show these 4 in bottom nav
  const bottomTabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart2 size={20} /> },
    { id: 'menu', label: 'Menu Management', icon: <Utensils size={20} /> },
    { id: 'payments', label: 'Payment Management', icon: <CreditCard size={20} /> },
    { id: 'users', label: 'User Management', icon: <Users size={20} /> },
  ];

  // All tabs for sidebar and desktop
  const allTabs = [
    ...bottomTabs,
    { id: 'banners', label: 'Banners & Alerts', icon: <Megaphone size={20} /> },
    { id: 'delivery', label: 'Delivery Requests', icon: <Truck size={20} /> },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    { label: 'Total Users', value: '156', change: '+12', color: 'text-green-600', icon: <Users size={22} /> },
    { label: 'Active Today', value: '89', change: '+5', color: 'text-blue-600', icon: <CheckCircle2 size={22} /> },
    { label: 'Pending Approvals', value: '8', change: '+3', color: 'text-orange-600', icon: <Clock size={22} /> },
    { label: 'Monthly Revenue', value: 'AED 45,678', change: '+18%', color: 'text-purple-600', icon: <DollarSign size={22} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl mr-3">{user?.profileSticker || <Utensils size={28} />}</div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  <span className="block md:hidden">Ajman Mess</span>
                  <span className="hidden md:block">Ajman Mess Food - Admin</span>
                </h1>
                <p className="text-sm text-gray-500 hidden md:block">Food Delivery Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden md:inline">Welcome, {user?.profileSticker} {user?.username}</span>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
              {/* Mobile menu button */}
              <button className="md:hidden ml-2 p-2 rounded hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
                <MenuIcon size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Drawer for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="bg-white w-64 h-full shadow-lg p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-gray-100">
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {allTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                  className={`flex items-center gap-3 px-3 py-2 rounded text-left ${activeTab === tab.id ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-black bg-opacity-30" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white border-b hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {allTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-red-500 text-uae-red'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-transform hover:scale-105`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                          <span className={`text-sm font-medium ${stat.color}`}>
                            {stat.change}
                          </span>
                        </div>
                        <span className="text-3xl">{stat.icon}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => setActiveTab('users')}
                      className="bg-uae-red hover:bg-red-700 h-12"
                    >
                      <Users size={18} className="inline mr-2" /> Manage Users
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('menu')}
                      className="bg-uae-green hover:bg-green-700 h-12"
                    >
                      <Utensils size={18} className="inline mr-2" /> Update Menu
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('banners')}
                      className="bg-uae-black hover:bg-gray-800 h-12 text-white"
                    >
                      <Megaphone size={18} className="inline mr-2" /> Send Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Tracking Map */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Tracking Map (Admin IP)</h3>
                  {adminLocation ? (
                    <div className="relative">
                      {/* Map View Controls */}
                      <div className="absolute top-2 left-2 z-10 bg-white p-2 rounded-lg shadow-lg">
                        <div className="text-xs text-gray-600 mb-2">Map View:</div>
                        <div className="space-y-1">
                          <button 
                            onClick={() => {
                              const url = `https://www.google.com/maps/@${adminLocation.lat},${adminLocation.lon},3a,75y,0h,90t/data=!3m6!1e1!3m4!1s!2e0!7i16384!8i8192`;
                              window.open(url, '_blank');
                            }}
                            className="block w-full text-left px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
                          >
                            🚶 Google Street View
                          </button>
                          <button 
                            onClick={() => {
                              const url = `https://www.google.com/maps/@${adminLocation.lat},${adminLocation.lon},15z`;
                              window.open(url, '_blank');
                            }}
                            className="block w-full text-left px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                          >
                            🗺️ Google Maps
                          </button>
                        </div>
                      </div>

                                            <MapContainer center={[adminLocation.lat, adminLocation.lon]} zoom={12} style={{ height: 300, width: '100%' }} scrollWheelZoom={false}>
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[adminLocation.lat, adminLocation.lon]}>
                          <Popup>
                            <div className="text-center">
                              <strong>🚚 Admin Location</strong><br />
                              {adminLocation.address}<br />
                              <small>{adminLocation.city}, {adminLocation.country}</small><br />
                              <small>ISP: {adminLocation.isp || 'Unknown'}</small>
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-8">
                      {isLoadingLocation ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span>Fetching real location data...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-red-600 font-medium">Unable to fetch real location</span>
                          <p className="text-xs text-gray-400">Please check your internet connection</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { action: 'New user registration: omar_khalil', time: '2 hours ago', type: 'user' },
                      { action: 'Menu updated for tomorrow', time: '4 hours ago', type: 'menu' },
                      { action: 'Payment received from ahmed_ali', time: '6 hours ago', type: 'payment' },
                      { action: 'Delivery time request approved', time: '1 day ago', type: 'delivery' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'user' ? 'bg-blue-500' :
                          activity.type === 'menu' ? 'bg-green-500' :
                          activity.type === 'payment' ? 'bg-purple-500' :
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
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'menu' && <MenuManagement />}
          {activeTab === 'banners' && <BannerManagement />}
          {activeTab === 'payments' && <PaymentManagement />}
          {activeTab === 'delivery' && <DeliveryManagement />}
        </div>
      </motion.div>
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} tabs={bottomTabs} />
    </div>
  );
};