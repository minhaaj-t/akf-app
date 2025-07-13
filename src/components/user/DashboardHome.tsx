import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { mockBanners } from "../../data/mockData";
import { Megaphone, Info, AlertTriangle, AlarmClock, ClipboardList, CalendarDays, CheckCircle2, XCircle, Utensils, CreditCard, MessageCircle, Truck, Zap, User } from "lucide-react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import { LocationData } from "../../services/locationService";

interface DashboardHomeProps {
  adminLocation: LocationData | null;
  userLocation: {lat: number, lon: number, address: string} | null;
  deliveryRoute: [number, number][];
  isTracking: boolean;
  isLoadingLocation: boolean;
  toggleTracking: () => void;
  getEstimatedDeliveryTime: () => string;
  mapRef: React.RefObject<any>;
  mapStyle: React.CSSProperties;
  adminIcon: any;
  userIcon: any;
  onNavigate: (tab: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  adminLocation,
  userLocation,
  deliveryRoute,
  isTracking,
  isLoadingLocation,
  toggleTracking,
  getEstimatedDeliveryTime,
  mapRef,
  mapStyle,
  adminIcon,
  userIcon,
  onNavigate
}) => {
  const { user } = useAuth();
  const activeBanners = mockBanners.filter(banner => banner.active);

  const getBannerColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getBannerIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlarmClock className="text-red-600" size={22} />;
      case 'warning': return <AlertTriangle className="text-yellow-600" size={22} />;
      default: return <Info className="text-blue-600" size={22} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, type: 'spring' }} className="bg-gradient-to-r from-blue-600 via-green-500 to-gray-700 text-white rounded-lg shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.username}!</h2>
              <p className="text-blue-100">Enjoy fresh, homemade meals delivered to your doorstep daily.</p>
            </div>
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-6xl opacity-20"><User size={48} /></motion.div>
          </div>
        </CardContent>
      </motion.div>

      {/* Live Delivery Tracking Map */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Truck size={20} /> Live Delivery Tracking
            </h3>
            <div className="flex gap-2">
              <Button 
                onClick={toggleTracking}
                className={`${isTracking ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                size="sm"
              >
                {isTracking ? 'Stop Tracking' : 'Start Live Tracking'}
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-800"
                title="Refresh location data"
              >
                🔄 Refresh
              </Button>
            </div>
          </div>
          
          {adminLocation && userLocation ? (
            <div>
              {/* Location Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">🚚 Admin Location</h4>
                  <p className="text-sm text-blue-800">{adminLocation.address}</p>
                  <p className="text-xs text-blue-600">{adminLocation.region}, {adminLocation.country}</p>
                  <p className="text-xs text-blue-600">Timezone: {adminLocation.timezone}</p>
                </div>
                              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">🏠 Your Location</h4>
                <p className="text-sm text-green-800">{userLocation.address}</p>
                <p className="text-xs text-green-600">Estimated delivery: {getEstimatedDeliveryTime()}</p>
                <button 
                  onClick={() => {
                    const newAddress = prompt('Enter your address (optional):', userLocation.address);
                    if (newAddress && newAddress.trim()) {
                      // In a real app, this would update the user's profile
                      alert('Address updated! This would save to your profile in a real app.');
                    }
                  }}
                  className="text-xs text-green-700 hover:text-green-900 underline mt-1"
                >
                  📝 Edit Address
                </button>
              </div>
              </div>

              {/* Interactive Map */}
              <div className="relative">
                {/* Map View Controls */}
                <div className="absolute top-2 left-2 z-10 bg-white p-2 rounded-lg shadow-lg">
                  <div className="text-xs text-gray-600 mb-2">Map View:</div>
                  <div className="space-y-1">
                                         <button 
                       onClick={() => {
                         if (mapRef.current) {
                           mapRef.current.eachLayer((layer: any) => {
                             if (layer instanceof L.TileLayer) {
                               mapRef.current?.removeLayer(layer);
                             }
                           });
                           L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                             attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                           }).addTo(mapRef.current);
                         }
                       }}
                       className="block w-full text-left px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                     >
                       🗺️ Street View
                     </button>
                                         <button 
                       onClick={() => {
                         if (mapRef.current) {
                           mapRef.current.eachLayer((layer: any) => {
                             if (layer instanceof L.TileLayer) {
                               mapRef.current?.removeLayer(layer);
                             }
                           });
                           L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                             attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
                           }).addTo(mapRef.current);
                         }
                       }}
                       className="block w-full text-left px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                     >
                       🛰️ Satellite View
                     </button>
                                         <button 
                       onClick={() => {
                         if (mapRef.current) {
                           mapRef.current.eachLayer((layer: any) => {
                             if (layer instanceof L.TileLayer) {
                               mapRef.current?.removeLayer(layer);
                             }
                           });
                           L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                             attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>'
                           }).addTo(mapRef.current);
                         }
                       }}
                       className="block w-full text-left px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded hover:bg-orange-200"
                     >
                                              🏔️ Terrain View
                     </button>
                     <button 
                       onClick={() => {
                         const url = `https://www.google.com/maps/@${adminLocation.lat},${adminLocation.lon},3a,75y,0h,90t/data=!3m6!1e1!3m4!1s!2e0!7i16384!8i8192`;
                         window.open(url, '_blank');
                       }}
                       className="block w-full text-left px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
                     >
                       🚶 Street View
                     </button>
                   </div>
                 </div>

                <MapContainer 
                  center={[adminLocation.lat, adminLocation.lon]} 
                  zoom={13} 
                  style={mapStyle} 
                  scrollWheelZoom={true}
                  ref={mapRef}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Admin Marker */}
                  <Marker position={[adminLocation.lat, adminLocation.lon]} icon={adminIcon}>
                    <Popup>
                      <div className="text-center">
                        <strong>🚚 Admin Location</strong><br />
                        {adminLocation.address}<br />
                        <small>{adminLocation.region}, {adminLocation.country}</small>
                      </div>
                    </Popup>
                  </Marker>

                  {/* User Marker */}
                  <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
                    <Popup>
                      <div className="text-center">
                        <strong>🏠 Your Location</strong><br />
                        {userLocation.address}<br />
                        <small>Estimated delivery: {getEstimatedDeliveryTime()}</small>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Delivery Route */}
                  {deliveryRoute.length > 0 && (
                    <Polyline 
                      positions={deliveryRoute}
                      color="#3b82f6"
                      weight={4}
                      opacity={0.8}
                      dashArray="10, 10"
                    />
                  )}

                  {/* Delivery Radius */}
                  <Circle 
                    center={[userLocation.lat, userLocation.lon]}
                    radius={500}
                    color="#10b981"
                    fillColor="#10b981"
                    fillOpacity={0.1}
                  />
                </MapContainer>

                {/* Map Controls */}
                <div className="absolute top-2 right-2 bg-white p-2 rounded-lg shadow-lg">
                  <div className="text-xs text-gray-600">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">🚚</span>
                      <span>Admin</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">🏠</span>
                      <span>You</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-1 bg-blue-500"></div>
                      <span>Route</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Status: {isTracking ? '🟢 Live Tracking Active' : '⚪ Tracking Paused'}
                  </span>
                  <span className="text-sm text-gray-600">
                    Last updated: {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              {isLoadingLocation ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span>Fetching real location data...</span>
                  <p className="text-xs text-gray-400 mt-2">This may take a few seconds</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-red-600 font-medium">Unable to fetch real location</span>
                  <p className="text-xs text-gray-400">Please check your internet connection and try again</p>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      onClick={() => window.location.reload()}
                      size="sm"
                    >
                      🔄 Retry
                    </Button>
                    <Button 
                      onClick={() => {
                        const lat = prompt('Enter latitude (e.g., 25.2048):');
                        const lon = prompt('Enter longitude (e.g., 55.2708):');
                        if (lat && lon && !isNaN(Number(lat)) && !isNaN(Number(lon))) {
                          // In a real app, this would update the location
                          alert('Location updated! This would save in a real app.');
                          window.location.reload();
                        }
                      }}
                      variant="outline"
                      size="sm"
                    >
                      📍 Manual Location
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Banners */}
      {activeBanners.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2"><Megaphone size={20} /> Announcements</h3>
          {activeBanners.map((banner, i) => (
            <motion.div key={banner.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1, duration: 0.7, type: 'spring' }}>
              <Card className={`border-2 overflow-hidden p-0 ${getBannerColor(banner.type)}`}>
                <div className="relative">
                  <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex justify-end items-end">
                    {/* Decorative background icon */}
                    <span className="pr-4 pb-2">{getBannerIcon(banner.type)}</span>
                  </div>
                  <CardContent className="p-4 relative z-10">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{getBannerIcon(banner.type)}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{banner.title}</h4>
                        <p className="text-sm">{banner.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Afternoon Plan</p>
                <p className="text-2xl font-bold text-gray-900">{user?.deliveryPlans?.afternoon || '-'}</p>
              </div>
              <span className="text-3xl"><ClipboardList size={28} /></span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Night Plan</p>
                <p className="text-2xl font-bold text-gray-900">{user?.deliveryPlans?.night || '-'}</p>
              </div>
              <span className="text-3xl"><CalendarDays size={28} /></span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Payment Status</p>
                <p className={`text-2xl font-bold ${
                  user?.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {user?.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                </p>
              </div>
              <span className="text-3xl">{user?.paymentStatus === 'paid' ? <CheckCircle2 size={28} className="text-green-600" /> : <XCircle size={28} className="text-red-600" />}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Details */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2"><ClipboardList size={20} /> Plan Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Plan Type</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{user?.planType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Join Date</p>
                <p className="text-lg text-gray-900">{user?.joinDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Days Active</p>
                <p className="text-lg text-gray-900">{user?.daysActive} days</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Afternoon Plan</p>
                <p className="text-lg font-semibold text-blue-600">{user?.deliveryPlans?.afternoon || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Night Plan</p>
                <p className="text-lg font-semibold text-blue-600">{user?.deliveryPlans?.night || '-'}</p>
              </div>
              {user?.expiryDate && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Plan Expiry</p>
                  <p className="text-lg text-gray-900">{user.expiryDate}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-600">Payment Status</p>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  user?.paymentStatus === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user?.paymentStatus === 'paid' ? <CheckCircle2 size={16} className="inline mr-1" /> : <XCircle size={16} className="inline mr-1" />}
                  {user?.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2"><Zap size={20} /> Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.button 
              onClick={() => onNavigate('menu')}
              className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors duration-200 cursor-pointer border border-blue-200 hover:border-blue-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl mb-2 text-blue-600"><Utensils size={22} /></div>
              <p className="text-sm font-medium text-blue-800">View Today's Menu</p>
            </motion.button>
            <motion.button 
              onClick={() => onNavigate('payment')}
              className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100 transition-colors duration-200 cursor-pointer border border-green-200 hover:border-green-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl mb-2 text-green-600"><CreditCard size={22} /></div>
              <p className="text-sm font-medium text-green-800">Make Payment</p>
            </motion.button>
            <motion.button 
              onClick={() => onNavigate('feedback')}
              className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100 transition-colors duration-200 cursor-pointer border border-purple-200 hover:border-purple-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl mb-2 text-purple-600"><MessageCircle size={22} /></div>
              <p className="text-sm font-medium text-purple-800">Submit Feedback</p>
            </motion.button>
            <motion.button 
              onClick={() => onNavigate('delivery')}
              className="bg-orange-50 p-4 rounded-lg text-center hover:bg-orange-100 transition-colors duration-200 cursor-pointer border border-orange-200 hover:border-orange-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl mb-2 text-orange-600"><Truck size={22} /></div>
              <p className="text-sm font-medium text-orange-800">Change Delivery Time</p>
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};