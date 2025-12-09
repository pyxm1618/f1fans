
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Calendar, Bath, Home, Flame } from 'lucide-react';

const NavBar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: '主页', icon: Home },
    { path: '/shower-bet', label: '洗澡赌约', icon: Bath, highlight: true },
    { path: '/phoenix', label: '凤凰计划', icon: Flame },
    { path: '/standings', label: '积分榜', icon: Trophy },
    // { path: '/schedule', label: '赛程', icon: Calendar },  // 暂时隐藏
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur-md border-t border-slate-700 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="hidden md:flex items-center space-x-2 cursor-pointer">
             <div className="w-8 h-8 bg-red-600 skew-racing flex items-center justify-center">
                <span className="font-racing text-white font-bold text-lg not-italic">F1</span>
             </div>
             <span className="font-racing text-white text-xl tracking-tighter italic">极速<span className="text-red-500">F1</span></span>
          </Link>

          <div className="flex w-full md:w-auto justify-around md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 px-3 py-2 rounded-lg transition-all duration-300
                  ${location.pathname === item.path
                    ? item.highlight ? 'text-orange-400 bg-orange-400/10' : 'text-red-500 bg-red-500/10' 
                    : 'text-slate-400 hover:text-white'
                  }
                `}
              >
                <item.icon size={20} className={location.pathname === item.path && item.highlight ? "animate-bounce" : ""} />
                <span className={`text-xs md:text-sm font-medium ${item.highlight && location.pathname !== item.path ? 'text-orange-400' : ''}`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
