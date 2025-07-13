import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useAuth } from "../../contexts/AuthContext";
import { DashboardHome } from "./DashboardHome";
import { PaymentSection } from "./PaymentSection";
import { MenuSection } from "./MenuSection";
import { FeedbackSection } from "./FeedbackSection";
import { DeliveryTimeRequest } from "./DeliveryTimeRequest";
import { UserProfile } from "./UserProfile";
import { MobileBottomNav } from "../MobileBottomNav";
import { Home, User, CreditCard, Utensils, MessageCircle, Truck, Menu as MenuIcon } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { locationService, LocationData } from "../../services/locationService";

export const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [adminLocation, setAdminLocation] = useState<LocationData | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number, address: string} | null>(null);
  const [deliveryRoute, setDeliveryRoute] = useState<[number, number][]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const mapRef = useRef<L.Map | null>(null);
  
  // Custom map styling
  const mapStyle = {
    height: 400,
    width: '100%',
    borderRadius: '12px',
    border: '2px solid #e5e7eb'
  };

  // Custom marker icons
  const adminIcon = L.divIcon({
    className: 'custom-admin-marker',
    html: '🚚',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  const userIcon = L.divIcon({
    className: 'custom-user-marker',
    html: '🏠',
    iconSize: [25, 25],
    iconAnchor: [12, 12]
  });

  const deliveryIcon = L.divIcon({
    className: 'custom-delivery-marker',
    html: '📦',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoadingLocation(true);
      try {
        // Get admin location using automatic service with retry mechanism
        const adminLoc = await locationService.getLocationWithRetry(3);
        setAdminLocation(adminLoc);

        // Get user location using the dedicated user location method
        const userLoc = await locationService.getUserLocation();
        setUserLocation({ 
          lat: userLoc.lat, 
          lon: userLoc.lon, 
          address: userLoc.address 
        });
      } catch (error) {
        console.error('Failed to fetch locations:', error);
        // Don't set any fallback locations - let the UI show the error
        setAdminLocation(null);
        setUserLocation(null);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    fetchLocations();
  }, []);

  // Real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (isTracking) {
        // Simulate admin movement
        if (adminLocation) {
          const newLat = adminLocation.lat + (Math.random() - 0.5) * 0.001;
          const newLon = adminLocation.lon + (Math.random() - 0.5) * 0.001;
          setAdminLocation(prev => prev ? { ...prev, lat: newLat, lon: newLon } : null);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isTracking, adminLocation]);

  // Calculate delivery route
  useEffect(() => {
    if (adminLocation && userLocation) {
      // Create a route with waypoints
      const route = [
        [adminLocation.lat, adminLocation.lon],
        [adminLocation.lat + (userLocation.lat - adminLocation.lat) * 0.3, adminLocation.lon + (userLocation.lon - adminLocation.lon) * 0.3],
        [adminLocation.lat + (userLocation.lat - adminLocation.lat) * 0.7, adminLocation.lon + (userLocation.lon - adminLocation.lon) * 0.7],
        [userLocation.lat, userLocation.lon]
      ] as [number, number][];
      setDeliveryRoute(route);
    }
  }, [adminLocation, userLocation]);

  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  const getEstimatedDeliveryTime = () => {
    if (!adminLocation || !userLocation) return 'Calculating...';
    const distance = Math.sqrt(
      Math.pow(adminLocation.lat - userLocation.lat, 2) + 
      Math.pow(adminLocation.lon - userLocation.lon, 2)
    ) * 111; // Rough km conversion
    const timeMinutes = Math.round(distance * 3); // 3 min per km
    return `${timeMinutes} minutes`;
  };

  // Only show these 4 in bottom nav
  const bottomTabs = [
    { id: 'home', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'menu', label: 'Menu', icon: <Utensils size={20} /> },
    { id: 'payment', label: 'Payment', icon: <CreditCard size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  ];

  // All tabs for sidebar
  const allTabs = [
    ...bottomTabs,
    { id: 'feedback', label: 'Feedback', icon: <MessageCircle size={20} /> },
    { id: 'delivery', label: 'Delivery Time', icon: <Truck size={20} /> },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl mr-3"><Utensils size={28} /></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  <span className="block md:hidden">Ajman Mess</span>
                  <span className="hidden md:block">Ajman Mess Food</span>
                </h1>
                <p className="text-sm text-gray-500 hidden md:block">Your daily meal service</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden md:inline">Welcome, {user?.username}</span>
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
                    ? 'border-green-500 text-uae-green'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* DashboardHome with map between banner and announcements */}
            <DashboardHome 
              adminLocation={adminLocation}
              userLocation={userLocation}
              deliveryRoute={deliveryRoute}
              isTracking={isTracking}
              isLoadingLocation={isLoadingLocation}
              toggleTracking={toggleTracking}
              getEstimatedDeliveryTime={getEstimatedDeliveryTime}
              mapRef={mapRef}
              mapStyle={mapStyle}
              adminIcon={adminIcon}
              userIcon={userIcon}
              onNavigate={setActiveTab}
            />
          </div>
        )}
        {activeTab === 'profile' && <UserProfile />}
        {activeTab === 'payment' && <PaymentSection />}
        {activeTab === 'menu' && <MenuSection />}
        {activeTab === 'feedback' && <FeedbackSection />}
        {activeTab === 'delivery' && <DeliveryTimeRequest />}
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} tabs={bottomTabs} />
    </div>
  );
};