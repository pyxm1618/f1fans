
import React, { useState } from 'react';
import { Tab } from './types';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import Standings from './components/Standings';
import YeFeiShowerBet from './components/YeFeiShowerBet';
import NewTeamProject from './components/NewTeamProject';
import Schedule from './components/Schedule';
import { AnimatePresence, motion } from 'framer-motion';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.HOME);

  const renderContent = () => {
    switch (currentTab) {
      case Tab.STANDINGS:
        return <Standings />;
      case Tab.SCHEDULE:
        return <Schedule />;
      case Tab.NEW_TEAM:
        return <NewTeamProject />;
      case Tab.SHOWER_BET:
        return <YeFeiShowerBet />;
      case Tab.HOME:
      default:
        return <Hero setTab={setCurrentTab} />;
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white overflow-x-hidden selection:bg-red-500 selection:text-white">
      <NavBar currentTab={currentTab} setTab={setCurrentTab} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-screen"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;
