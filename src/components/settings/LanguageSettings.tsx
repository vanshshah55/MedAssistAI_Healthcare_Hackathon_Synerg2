import React, { useState } from 'react';

const LanguageSettings: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  
  const languages = [
    { id: 'english', name: 'English' },
    { id: 'spanish', name: 'Spanish' },
    { id: 'french', name: 'French' },
    { id: 'german', name: 'German' },
    { id: 'chinese', name: 'Chinese' },
    { id: 'arabic', name: 'Arabic' },
    { id: 'russian', name: 'Russian' },
    { id: 'japanese', name: 'Japanese' },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-4">Language Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Interface Language
          </label>
          <select
            className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 bg-white text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            This will change the language of the user interface only. Patient data will remain in its original language.
          </p>
        </div>
        
        <div className="pt-4">
          <button
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Save Language Preference
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;