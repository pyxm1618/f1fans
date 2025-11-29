
import React from 'react';
import { Trophy, Calendar, Bath, Home, Flame } from 'lucide-react';
import { Tab } from '../types';

interface NavBarProps {
  currentTab: Tab;
  setTab: (tab: Tab) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentTab, setTab }) => {
  const navItems = [
    { id: Tab.HOME, label: '主页', icon: Home },
    { id: Tab.SHOWER_BET, label: '洗澡赌约', icon: Bath, highlight: true },
    { id: Tab.NEW_TEAM, label: '凤凰计划', icon: Flame },
    { id: Tab.STANDINGS, label: '积分榜', icon: Trophy },
    { id: Tab.SCHEDULE, label: '赛程', icon: Calendar },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur-md border-t border-slate-700 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="hidden md:flex items-center space-x-2 cursor-pointer" onClick={() => setTab(Tab.HOME)}>
             <div className="w-8 h-8 bg-red-600 skew-racing flex items-center justify-center">
                <span className="font-racing text-white font-bold text-lg not-italic">F1</span>
             </div>
             <span className="font-racing text-white text-xl tracking-tighter italic">极速<span className="text-red-500">F1</span></span>
          </div>

          <div className="flex w-full md:w-auto justify-around md:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 px-3 py-2 rounded-lg transition-all duration-300
                  ${currentTab === item.id 
                    ? item.highlight ? 'text-orange-400 bg-orange-400/10' : 'text-red-500 bg-red-500/10' 
                    : 'text-slate-400 hover:text-white'
                  }
                `}
              >
                <item.icon size={20} className={currentTab === item.id && item.highlight ? "animate-bounce" : ""} />
                <span className={`text-xs md:text-sm font-medium ${item.highlight && currentTab !== item.id ? 'text-orange-400' : ''}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
