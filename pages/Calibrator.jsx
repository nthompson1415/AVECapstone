import { useState } from 'react';
import { Brain, Sliders, Play, RotateCcw } from 'lucide-react';

const CalibratorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Sliders className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Personal Ethics Calibrator</h1>
          <p className="text-gray-600 mb-6">
            This feature allows you to personalize your ethical weights and calibrate your values.
          </p>
          <p className="text-sm text-gray-500">
            Coming soon - This page will allow you to customize ethical weights based on your personal values.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalibratorPage;

