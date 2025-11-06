import React from 'react';
import { useParams } from 'react-router-dom';
import Dashboard from './Dashboard';
import ArtisanProfile from './ArtisanProfile';

// If the param matches known roles, render Dashboard, otherwise render ArtisanProfile
const DashboardRouter = () => {
  // Always render the main Dashboard component. Dashboard will inspect the URL param
  // and determine whether to show role-specific content or an artisan dashboard by slug.
  return <Dashboard />;
};

export default DashboardRouter;
