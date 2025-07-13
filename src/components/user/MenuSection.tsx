import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { mockMenuItems } from "../../data/mockData";

export const MenuSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isChangingMenu, setIsChangingMenu] = useState(false);
  const [menuChanges, setMenuChanges] = useState<{[key: string]: string}>({});
  const [specialNote, setSpecialNote] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const todayMenu = mockMenuItems.find(item => item.date === today) || mockMenuItems[0];
  const tomorrowMenu = mockMenuItems.find(item => item.date === tomorrow) || mockMenuItems[1];
  
  const currentTime = new Date().getHours();
  const canChangeMenu = currentTime < 12; // Can change until 12 PM

  const handleMenuChange = (originalItem: string, replacement: string) => {
    setMenuChanges({
      ...menuChanges,
      [originalItem]: replacement
    });
  };

  const submitMenuChanges = () => {
    if (Object.keys(menuChanges).length > 0 || specialNote) {
      alert('Menu changes submitted successfully! Changes will be applied to tomorrow\'s delivery.');
      setMenuChanges({});
      setSpecialNote('');
      setIsChangingMenu(false);
    }
  };

  const MenuCard = ({ menu, title, date, isEditable = false }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium text-gray-900">{title}</h4>
          <span className="text-sm text-gray-500">{new Date(date).toLocaleDateString()}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h5 className="font-semibold text-orange-800 mb-2">🍛 Main Dish</h5>
            <p className="text-gray-700">{menu.mainDish}</p>
            {isEditable && menu.alternatives[menu.mainDish] && (
              <div className="mt-2">
                <select
                  value={menuChanges[menu.mainDish] || ''}
                  onChange={(e) => handleMenuChange(menu.mainDish, e.target.value)}
                  className="w-full text-xs p-1 border rounded"
                >
                  <option value="">Keep original</option>
                  {menu.alternatives[menu.mainDish].map((alt: string) => (
                    <option key={alt} value={alt}>{alt}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-semibold text-green-800 mb-2">🥗 Side Dish</h5>
            <p className="text-gray-700">{menu.sideDish}</p>
            {isEditable && menu.alternatives[menu.sideDish] && (
              <div className="mt-2">
                <select
                  value={menuChanges[menu.sideDish] || ''}
                  onChange={(e) => handleMenuChange(menu.sideDish, e.target.value)}
                  className="w-full text-xs p-1 border rounded"
                >
                  <option value="">Keep original</option>
                  {menu.alternatives[menu.sideDish].map((alt: string) => (
                    <option key={alt} value={alt}>{alt}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h5 className="font-semibold text-yellow-800 mb-2">🍚 Rice</h5>
            <p className="text-gray-700">{menu.rice}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h5 className="font-semibold text-purple-800 mb-2">🍮 Dessert</h5>
            <p className="text-gray-700">{menu.dessert || 'None'}</p>
          </div>
        </div>

        {menu.notes && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <h5 className="font-semibold text-blue-800 mb-1">📝 Special Notes</h5>
            <p className="text-blue-700 text-sm">{menu.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Menu Change Notice */}
      <Card className={`border-2 ${canChangeMenu ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{canChangeMenu ? '✅' : '⏰'}</span>
            <div>
              <p className={`font-semibold ${canChangeMenu ? 'text-green-800' : 'text-red-800'}`}>
                {canChangeMenu ? 'Menu Changes Available' : 'Menu Change Deadline Passed'}
              </p>
              <p className={`text-sm ${canChangeMenu ? 'text-green-700' : 'text-red-700'}`}>
                {canChangeMenu 
                  ? 'You can change tomorrow\'s menu until 12:00 PM today.'
                  : 'Menu changes are only allowed until 12:00 PM the day before delivery.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Menu */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">🍽️ Today's Menu</h3>
        <MenuCard menu={todayMenu} title="Today's Menu" date={today} />
      </div>

      {/* Tomorrow's Menu */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">🍽️ Tomorrow's Menu</h3>
          {canChangeMenu && !isChangingMenu && (
            <Button 
              onClick={() => setIsChangingMenu(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Change Menu
            </Button>
          )}
        </div>
        <MenuCard 
          menu={tomorrowMenu} 
          title="Tomorrow's Menu" 
          date={tomorrow} 
          isEditable={isChangingMenu && canChangeMenu}
        />
      </div>

      {/* Menu Change Form */}
      {isChangingMenu && canChangeMenu && (
        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">🔄 Customize Tomorrow's Menu</h4>
            
            {Object.keys(menuChanges).length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-blue-800 mb-2">Your Changes:</h5>
                {Object.entries(menuChanges).map(([original, replacement]) => (
                  <p key={original} className="text-sm text-blue-700">
                    • Replace <strong>{original}</strong> with <strong>{replacement}</strong>
                  </p>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  placeholder="Any special dietary requirements or cooking preferences..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex space-x-4">
                <Button 
                  onClick={submitMenuChanges}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Submit Changes
                </Button>
                <Button 
                  onClick={() => {
                    setIsChangingMenu(false);
                    setMenuChanges({});
                    setSpecialNote('');
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Menu Calendar */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">📅 Weekly Menu Preview</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
              const dateStr = date.toISOString().split('T')[0];
              const menu = mockMenuItems.find(item => item.date === dateStr) || mockMenuItems[i % mockMenuItems.length];
              
              return (
                <div key={dateStr} className="border border-gray-200 rounded-lg p-3">
                  <div className="text-center mb-2">
                    <p className="font-semibold text-gray-900">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <p className="text-sm text-gray-600">{date.toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p><strong>Main:</strong> {menu.mainDish}</p>
                    <p><strong>Side:</strong> {menu.sideDish}</p>
                    <p><strong>Rice:</strong> {menu.rice}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};