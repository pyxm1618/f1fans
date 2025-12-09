
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import StandingsPage from './pages/StandingsPage';
import SchedulePage from './pages/SchedulePage';
import PhoenixPage from './pages/PhoenixPage';
import ShowerBetPage from './pages/ShowerBetPage';
import { AnimatePresence, motion } from 'framer-motion';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen"
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/standings" element={<StandingsPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/phoenix" element={<PhoenixPage />} />
          <Route path="/shower-bet" element={<ShowerBetPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <div className="bg-slate-900 min-h-screen text-white overflow-x-hidden selection:bg-red-500 selection:text-white">
      <NavBar />
      <AnimatedRoutes />
    </div>
  );
};

export default App;
