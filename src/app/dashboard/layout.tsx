'use client'

import React from 'react';
import { DashboardLayoutProps } from '../../types/type';

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div>
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;