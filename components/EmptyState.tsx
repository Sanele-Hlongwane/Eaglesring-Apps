"use client";

import React from 'react';
import { MdWarning } from 'react-icons/md';

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="flex flex-col min-h-screen text-gray-900 dark:text-white">
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-md">
          <MdWarning className="text-4xl text-yellow-600 dark:text-yellow-400 mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            {message}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">No data available here. Try again later.</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
