"use client";

import React from 'react';
import { MdWarning } from 'react-icons/md';
import {
  FaUser,
  FaUsers,
  FaPaperPlane,
  FaCheckCircle,
  FaTimesCircle,
  FaTrashAlt,
  FaSearch,
  FaInbox,
  FaBuilding,
  FaDollarSign,
  FaTag,
  FaInfoCircle,
  FaMoneyBillWave,
  FaLightbulb,
  FaShieldAlt,
  FaComments,
  FaUserTie,
  FaChartLine,
  FaRegGem,
  FaHandsHelping,
  FaGlobe,
  FaRocket,
  FaAward,
  FaMedal,
} from "react-icons/fa";

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center ">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <FaLightbulb className="text-yellow-500 absolute top-16 left-20 text-[100px] rotate-12" />
        <FaShieldAlt className="text-blue-500 absolute top-1/3 right-10 text-[120px] rotate-6" />
        <FaComments className="text-green-500 absolute bottom-16 left-1/4 text-[80px] -rotate-12" />
        <FaUserTie className="text-red-500 absolute top-1/4 left-10 text-[90px] rotate-45" />
        <FaChartLine className="text-purple-500 absolute bottom-20 right-1/3 text-[110px] -rotate-6" />
        <FaRegGem className="text-pink-500 absolute bottom-1/4 left-2/3 text-[100px] rotate-12" />
        <FaHandsHelping className="text-yellow-400 absolute top-20 right-5 text-[90px] rotate-12" />
        <FaGlobe className="text-blue-400 absolute bottom-28 right-14 text-[100px] rotate-12" />
        <FaRocket className="text-red-400 absolute top-1/3 left-14 text-[80px] rotate-45" />
        <FaAward className="text-orange-500 absolute bottom-10 left-32 text-[120px] rotate-6" />
        <FaMedal className="text-green-400 absolute top-10 right-32 text-[110px] -rotate-12" />
      </div>
      <div className="text-center p-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-md">
        <MdWarning className="text-4xl text-yellow-600 dark:text-yellow-400 mb-4 mx-auto" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {message}
        </h2>
        <p className="text-gray-700 dark:text-gray-300">No data available here. Try again later.</p>
      </div>
    </div>
  );
};

export default EmptyState;
