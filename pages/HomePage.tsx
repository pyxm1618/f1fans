import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import { useSEO } from '../utils/seo';
import { Tab } from '../types';

const HomePage: React.FC = () => {
  useSEO('home');
  const navigate = useNavigate();

  const handleSetTab = (tab: Tab) => {
    switch (tab) {
      case Tab.STANDINGS:
        navigate('/standings');
        break;
      case Tab.SCHEDULE:
        navigate('/schedule');
        break;
      case Tab.NEW_TEAM:
        navigate('/phoenix');
        break;
      case Tab.SHOWER_BET:
        navigate('/shower-bet');
        break;
      case Tab.HOME:
      default:
        navigate('/');
        break;
    }
  };

  return <Hero setTab={handleSetTab} />;
};

export default HomePage;
