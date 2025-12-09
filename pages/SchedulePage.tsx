import React from 'react';
import Schedule from '../components/Schedule';
import { useSEO } from '../utils/seo';

const SchedulePage: React.FC = () => {
  useSEO('schedule');
  return <Schedule />;
};

export default SchedulePage;
