import React from 'react';
import YeFeiShowerBet from '../components/YeFeiShowerBet';
import { useSEO } from '../utils/seo';

const ShowerBetPage: React.FC = () => {
  useSEO('showerBet');
  return <YeFeiShowerBet />;
};

export default ShowerBetPage;
