import React from "react";
import { useAuth } from "../contexts/AuthContext";

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
  }>;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab, tabs }) => {
  const { user } = useAuth();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 mobile-nav-shadow md:hidden z-50">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 ${
              activeTab === tab.id
                ? user?.role === 'admin' 
                  ? 'text-uae-red' 
                  : 'text-uae-green'
                : 'text-gray-500'
            }`}
          >
            <span className="text-xl mb-1">{tab.icon}</span>
            <span className="text-xs font-medium truncate">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};