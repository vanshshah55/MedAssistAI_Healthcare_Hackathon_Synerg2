import React, { useState } from 'react';

const AISettings: React.FC = () => {
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(70);
  const [enableAutoTriage, setEnableAutoTriage] = useState(true);
  const [enableAutoDiagnosis, setEnableAutoDiagnosis] = useState(true);
  const [enableAutoTreatment, setEnableAutoTreatment] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(true);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-4">AI System Settings</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            AI Confidence Threshold ({aiConfidenceThreshold}%)
          </label>
          <input
            type="range"
            min="50"
            max="95"
            step="5"
            value={aiConfidenceThreshold}
            onChange={(e) => setAiConfidenceThreshold(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <p className="mt-1 text-xs text-gray-500">
            AI will only make recommendations when its confidence level is above this threshold.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Enable Automated Triage</h4>
              <p className="text-xs text-gray-500">
                Allow AI to automatically assign triage levels to incoming patients
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={enableAutoTriage}
                onChange={() => setEnableAutoTriage(!enableAutoTriage)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Enable Automated Diagnosis</h4>
              <p className="text-xs text-gray-500">
                Allow AI to automatically suggest diagnoses based on patient data
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={enableAutoDiagnosis}
                onChange={() => setEnableAutoDiagnosis(!enableAutoDiagnosis)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Enable Automated Treatment Plans</h4>
              <p className="text-xs text-gray-500">
                Allow AI to automatically suggest treatment plans (requires doctor approval)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={enableAutoTreatment}
                onChange={() => setEnableAutoTreatment(!enableAutoTreatment)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Enable AI Notifications</h4>
              <p className="text-xs text-gray-500">
                Receive notifications when AI detects critical conditions or changes
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={enableNotifications}
                onChange={() => setEnableNotifications(!enableNotifications)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
        
        <div className="pt-4">
          <button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Save AI Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISettings;