import React from 'react';
import Standings from '../components/Standings';
import { useSEO } from '../utils/seo';

const StandingsPage: React.FC = () => {
  useSEO('standings');
  return <Standings />;
};

export default StandingsPage;
