import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useAuth } from "../../contexts/AuthContext";
import { MenuItem } from "../../types";
import { databaseService } from "../../services/database";
import { mockMenuItems } from "../../data/mockData";
import { Clock, Utensils, Star, AlertCircle, Info, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export const MenuSection: React.FC = () => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenus();
  }, [selectedDate]);

  const fetchMenus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In browser environment, always use mock data
      // Database connections are handled server-side only
      let menus: MenuItem[] = mockMenuItems.filter(item => item.date === selectedDate);
      
      // Try to get from database if available (server-side only)
      try {
        const dbMenus = await databaseService.getMenusByDate(selectedDate);
        if (dbMenus && dbMenus.length > 0) {
          menus = dbMenus;
        }
      } catch (dbError) {
        console.log('Using mock data (database not available in browser)');
      }

      // Filter menus based on user's delivery plans
      const userDeliveryPlans = user?.deliveryPlans || {};
      const hasAfternoonPlan = !!userDeliveryPlans.afternoon;
      const hasNightPlan = !!userDeliveryPlans.night;

      if (!hasAfternoonPlan && !hasNightPlan) {
        // User has no delivery plans
        setMenuItems([]);
        setLoading(false);
        return;
      }

      const filteredMenus = menus.filter(item => {
        if (item.timeSlot === 'both') {
          return hasAfternoonPlan || hasNightPlan;
        }
        if (item.timeSlot === 'afternoon') {
          return hasAfternoonPlan;
        }
        if (item.timeSlot === 'night') {
          return hasNightPlan;
        }
        return false;
      });

      setMenuItems(filteredMenus);
    } catch (error) {
      console.error('Error fetching menus:', error);
      setError('Failed to load menus. Please try again.');
      // Fallback to mock data
      const fallbackMenus = mockMenuItems.filter(item => item.date === selectedDate);
      setMenuItems(fallbackMenus);
    } finally {
      setLoading(false);
    }
  };

  const getDeliveryPlansText = () => {
    const plans = user?.deliveryPlans || {};
    const afternoon = plans.afternoon;
    const night = plans.night;
    
    if (afternoon && night) {
      return `Afternoon (${afternoon}) & Night (${night})`;
    } else if (afternoon) {
      return `Afternoon (${afternoon})`;
    } else if (night) {
      return `Night (${night})`;
    }
    return 'No delivery plans';
  };

  const formatTime = (timeString: string) => {
    return timeString.replace(/(\d{1,2}):(\d{2})/, (_, hours, minutes) => {
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    });
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    // Add today and next 7 days
    for (let i = 0; i < 8; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const handleRequestChanges = (menu: MenuItem) => {
    // In a real app, this would open a form to request menu changes
    alert(`Request changes for ${menu.timeSlot} menu on ${selectedDate}. This feature will be available soon!`);
  };

  const handleViewDetails = (menu: MenuItem) => {
    // In a real app, this would show detailed menu information
    alert(`Viewing details for ${menu.timeSlot} menu on ${selectedDate}. This feature will be available soon!`);
  };

  if (!user?.deliveryPlans || Object.keys(user.deliveryPlans).length === 0) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Delivery Plans Found</h3>
              <p className="text-gray-600 mb-4">
                You don't have any active delivery plans. Please contact admin to set up your delivery schedule.
              </p>
              <Button variant="outline">
                Contact Admin
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Today's Menu</h2>
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Clock className="h-4 w-4" />
          <span>Your delivery plans: {getDeliveryPlansText()}</span>
        </div>
        
        {/* Date Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {getAvailableDates().map((date) => (
            <Button
              key={date}
              variant={selectedDate === date ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDate(date)}
              className="whitespace-nowrap"
            >
              {date === new Date().toISOString().split('T')[0] ? 'Today' : 
               date === new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] ? 'Tomorrow' :
               new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading menus...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
          <p className="text-red-600">{error}</p>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-8">
          <Utensils className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Menu Available</h3>
          <p className="text-gray-600">
            No menu has been set for {selectedDate === new Date().toISOString().split('T')[0] ? 'today' : 'this date'}.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {menuItems.map((menu) => (
            <motion.div
              key={menu.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold capitalize">
                        {menu.timeSlot} Menu
                      </h3>
                      <div className="text-sm">
                        Cutoff: {formatTime(menu.cutoffTime)}
                      </div>
                    </div>
                  </div>

                  {/* Menu Content */}
                  <div className="p-4">
                    <div className="grid gap-4">
                      {/* Main Dish */}
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Main Dish</h4>
                          <p className="text-gray-600">{menu.mainDish}</p>
                        </div>
                      </div>

                      {/* Side Dish */}
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Side Dish</h4>
                          <p className="text-gray-600">{menu.sideDish}</p>
                        </div>
                      </div>

                      {/* Rice */}
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Rice</h4>
                          <p className="text-gray-600">{menu.rice}</p>
                        </div>
                      </div>

                      {/* Dessert */}
                      {menu.dessert && (
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                          <div>
                            <h4 className="font-semibold text-gray-800">Dessert</h4>
                            <p className="text-gray-600">{menu.dessert}</p>
                          </div>
                        </div>
                      )}

                      {/* Alternatives */}
                      {Object.keys(menu.alternatives).length > 0 && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-2">Alternatives Available</h4>
                          {Object.entries(menu.alternatives).map(([dish, alternatives]) => (
                            <div key={dish} className="mb-2">
                              <p className="text-sm font-medium text-gray-700">{dish}:</p>
                              <p className="text-sm text-gray-600">{alternatives.join(', ')}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Notes */}
                      {menu.notes && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-800 mb-1">Notes</h4>
                          <p className="text-sm text-blue-700">{menu.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons - More appropriate for mess food app */}
                    <div className="mt-6 flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleViewDetails(menu)}
                      >
                        <Info className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleRequestChanges(menu)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Request Changes
                      </Button>
                    </div>

                    {/* Delivery Info */}
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-800">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Your meal will be delivered at {formatTime(user.deliveryPlans[menu.timeSlot as 'afternoon' | 'night'] || '')}
                        </span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        Based on your {menu.timeSlot} delivery plan
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};