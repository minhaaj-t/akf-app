import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { mockMenuItems } from "../../data/mockData";
import { MenuItem } from "../../types";

export const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Partial<MenuItem>>({});

  const todayMenu = menuItems.find(item => item.date === selectedDate);

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
        mainDish: editingMenu.mainDish || '',
        sideDish: editingMenu.sideDish || '',
        rice: editingMenu.rice || '',
        dessert: editingMenu.dessert || '',
        alternatives: editingMenu.alternatives || {},
        notes: editingMenu.notes || '',
        cutoffTime: editingMenu.cutoffTime || '12:00 PM',
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
      cutoffTime: '12:00 PM',
      alternatives: {},
    });
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Menu Management</h3>
            <div className="flex space-x-4 items-center">
              <label className="text-sm font-medium text-gray-700">Select Date:</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
              <Button onClick={handleAddNewMenu} className="bg-green-600 hover:bg-green-700">
                Add New Menu
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Menu Display */}
      {todayMenu && !isEditing && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                Menu for {new Date(selectedDate).toLocaleDateString()}
              </h4>
              <Button onClick={() => handleEditMenu(todayMenu)} variant="outline">
                Edit Menu
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h5 className="font-semibold text-orange-800 mb-2">🍛 Main Dish</h5>
                <p className="text-gray-700">{todayMenu.mainDish}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-2">🥗 Side Dish</h5>
                <p className="text-gray-700">{todayMenu.sideDish}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h5 className="font-semibold text-yellow-800 mb-2">🍚 Rice</h5>
                <p className="text-gray-700">{todayMenu.rice}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h5 className="font-semibold text-purple-800 mb-2">🍮 Dessert</h5>
                <p className="text-gray-700">{todayMenu.dessert || 'None'}</p>
              </div>
            </div>

            {todayMenu.alternatives && Object.keys(todayMenu.alternatives).length > 0 && (
              <div className="mt-6">
                <h5 className="font-semibold text-gray-800 mb-3">🔄 Alternative Options</h5>
                <div className="space-y-2">
                  {Object.entries(todayMenu.alternatives).map(([original, alternatives]) => (
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

            {todayMenu.notes && (
              <div className="mt-6">
                <h5 className="font-semibold text-gray-800 mb-2">📝 Special Notes</h5>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{todayMenu.notes}</p>
              </div>
            )}

            <div className="mt-6 flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Cut-off time for changes:</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                {todayMenu.cutoffTime} (day before)
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
                {editingMenu.id ? 'Edit Menu' : 'Add New Menu'} for {new Date(selectedDate).toLocaleDateString()}
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
                    value={editingMenu.cutoffTime || '12:00 PM'}
                    onChange={(e) => setEditingMenu({...editingMenu, cutoffTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
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

      {/* Menu History */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Menus</h4>
          <div className="space-y-3">
            {menuItems.slice(0, 5).map((menu) => (
              <div key={menu.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{new Date(menu.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">{menu.mainDish} • {menu.sideDish} • {menu.rice}</p>
                </div>
                <Button onClick={() => handleEditMenu(menu)} size="sm" variant="outline">
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};