import React from 'react';
import NewTeamProject from '../components/NewTeamProject';
import { useSEO } from '../utils/seo';

const PhoenixPage: React.FC = () => {
  useSEO('phoenix');
  return <NewTeamProject />;
};

export default PhoenixPage;
