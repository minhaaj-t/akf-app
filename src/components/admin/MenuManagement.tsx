import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { mockMenuItems } from "../../data/mockData";
import { MenuItem } from "../../types";

export const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'afternoon' | 'night'>('afternoon');
  const [isEditing, setIsEditing] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Partial<MenuItem>>({});

  const todayMenus = menuItems.filter(item => item.date === selectedDate);
  const selectedMenu = todayMenus.find(item => item.timeSlot === selectedTimeSlot);

  const handleSaveMenu = () => {
    if (editingMenu.id) {
      // Update existing menu
      setMenuItems(menuItems.map(item => 
        item.id === editingMenu.id ? { ...item, ...editingMenu } as MenuItem : item
      ));
    } else {
      // Add new menu
      const newMenu: MenuItem = {
        id: Date.now().toString(),
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        mainDish: editingMenu.mainDish || '',
        sideDish: editingMenu.sideDish || '',
        rice: editingMenu.rice || '',
        dessert: editingMenu.dessert || '',
        alternatives: editingMenu.alternatives || {},
        notes: editingMenu.notes || '',
        cutoffTime: editingMenu.cutoffTime || (selectedTimeSlot === 'afternoon' ? '12:00 PM' : '6:00 PM'),
      };
      setMenuItems([...menuItems, newMenu]);
    }
    setIsEditing(false);
    setEditingMenu({});
  };

  const handleEditMenu = (menu: MenuItem) => {
    setEditingMenu(menu);
    setIsEditing(true);
  };

  const handleAddNewMenu = () => {
    setEditingMenu({
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      mainDish: '',
      sideDish: '',
      rice: '',
      cutoffTime: selectedTimeSlot === 'afternoon' ? '12:00 PM' : '6:00 PM',
      alternatives: {},
    });
    setIsEditing(true);
  };

  const handleDeleteMenu = (menuId: string) => {
    if (confirm('Are you sure you want to delete this menu?')) {
      setMenuItems(menuItems.filter(item => item.id !== menuId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Date and Time Slot Selection */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value as 'afternoon' | 'night')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="afternoon">Afternoon</option>
                <option value="night">Night</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        {!selectedMenu && !isEditing && (
          <Button onClick={handleAddNewMenu} className="bg-green-600 hover:bg-green-700">
            Add {selectedTimeSlot === 'afternoon' ? 'Afternoon' : 'Night'} Menu
          </Button>
        )}
        {selectedMenu && !isEditing && (
          <Button onClick={() => handleEditMenu(selectedMenu)} variant="outline">
            Edit {selectedTimeSlot === 'afternoon' ? 'Afternoon' : 'Night'} Menu
          </Button>
        )}
        {selectedMenu && !isEditing && (
          <Button onClick={() => handleDeleteMenu(selectedMenu.id)} variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
            Delete Menu
          </Button>
        )}
      </div>

      {/* Display Current Menu */}
      {selectedMenu && !isEditing && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  {selectedTimeSlot === 'afternoon' ? 'Afternoon' : 'Night'} Menu for {new Date(selectedDate).toLocaleDateString()}
                </h4>
                <p className="text-sm text-gray-500">Delivery Time: {selectedTimeSlot === 'afternoon' ? '12:00 PM - 3:00 PM' : '6:00 PM - 9:00 PM'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h5 className="font-semibold text-orange-800 mb-2">🍛 Main Dish</h5>
                <p className="text-gray-700">{selectedMenu.mainDish}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-2">🥗 Side Dish</h5>
                <p className="text-gray-700">{selectedMenu.sideDish}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h5 className="font-semibold text-yellow-800 mb-2">🍚 Rice</h5>
                <p className="text-gray-700">{selectedMenu.rice}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h5 className="font-semibold text-purple-800 mb-2">🍮 Dessert</h5>
                <p className="text-gray-700">{selectedMenu.dessert || 'None'}</p>
              </div>
            </div>

            {selectedMenu.alternatives && Object.keys(selectedMenu.alternatives).length > 0 && (
              <div className="mt-6">
                <h5 className="font-semibold text-gray-800 mb-3">🔄 Alternative Options</h5>
                <div className="space-y-2">
                  {Object.entries(selectedMenu.alternatives).map(([original, alternatives]) => (
                    <div key={original} className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium text-blue-800">Instead of {original}:</span>
                        <span className="text-blue-700 ml-2">{alternatives.join(', ')}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedMenu.notes && (
              <div className="mt-6">
                <h5 className="font-semibold text-gray-800 mb-2">📝 Special Notes</h5>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedMenu.notes}</p>
              </div>
            )}

            <div className="mt-6 flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Cut-off time for changes:</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                {selectedMenu.cutoffTime} (day before)
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Menu Editor */}
      {isEditing && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-medium text-gray-900">
                {editingMenu.id ? 'Edit' : 'Add New'} {selectedTimeSlot === 'afternoon' ? 'Afternoon' : 'Night'} Menu for {new Date(selectedDate).toLocaleDateString()}
              </h4>
              <div className="space-x-2">
                <Button onClick={handleSaveMenu} className="bg-green-600 hover:bg-green-700">
                  Save Menu
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Main Dish</label>
                  <Input
                    value={editingMenu.mainDish || ''}
                    onChange={(e) => setEditingMenu({...editingMenu, mainDish: e.target.value})}
                    placeholder="e.g., Chicken Biryani"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Side Dish</label>
                  <Input
                    value={editingMenu.sideDish || ''}
                    onChange={(e) => setEditingMenu({...editingMenu, sideDish: e.target.value})}
                    placeholder="e.g., Raita"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rice</label>
                  <Input
                    value={editingMenu.rice || ''}
                    onChange={(e) => setEditingMenu({...editingMenu, rice: e.target.value})}
                    placeholder="e.g., Basmati Rice"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dessert (Optional)</label>
                  <Input
                    value={editingMenu.dessert || ''}
                    onChange={(e) => setEditingMenu({...editingMenu, dessert: e.target.value})}
                    placeholder="e.g., Kheer"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cut-off Time</label>
                  <select
                    value={editingMenu.cutoffTime || (selectedTimeSlot === 'afternoon' ? '12:00 PM' : '6:00 PM')}
                    onChange={(e) => setEditingMenu({...editingMenu, cutoffTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Notes</label>
                  <textarea
                    value={editingMenu.notes || ''}
                    onChange={(e) => setEditingMenu({...editingMenu, notes: e.target.value})}
                    placeholder="Any special instructions or notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Menu Overview for Selected Date */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Menu Overview for {new Date(selectedDate).toLocaleDateString()}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['afternoon', 'night'].map((timeSlot) => {
              const menu = todayMenus.find(item => item.timeSlot === timeSlot);
              return (
                <div key={timeSlot} className={`p-4 rounded-lg border ${menu ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-semibold text-gray-800 capitalize">{timeSlot} Menu</h5>
                    <span className={`text-xs px-2 py-1 rounded-full ${menu ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {menu ? 'Available' : 'Not Set'}
                    </span>
                  </div>
                  {menu ? (
                    <div className="text-sm text-gray-600">
                      <p><strong>Main:</strong> {menu.mainDish}</p>
                      <p><strong>Side:</strong> {menu.sideDish}</p>
                      <p><strong>Cut-off:</strong> {menu.cutoffTime}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No menu set for this time slot</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Menu History */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Menus</h4>
          <div className="space-y-3">
            {menuItems.slice(0, 10).map((menu) => (
              <div key={menu.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(menu.date).toLocaleDateString()} - {menu.timeSlot === 'afternoon' ? 'Afternoon' : 'Night'}
                  </p>
                  <p className="text-sm text-gray-600">{menu.mainDish} • {menu.sideDish} • {menu.rice}</p>
                </div>
                <div className="flex space-x-2">
                                     <Button 
                     onClick={() => {
                       setSelectedDate(menu.date);
                       setSelectedTimeSlot(menu.timeSlot === 'both' ? 'afternoon' : menu.timeSlot);
                       handleEditMenu(menu);
                     }} 
                     size="sm" 
                     variant="outline"
                   >
                     Edit
                   </Button>
                  <Button 
                    onClick={() => handleDeleteMenu(menu.id)} 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};