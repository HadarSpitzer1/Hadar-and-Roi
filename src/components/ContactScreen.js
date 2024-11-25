// components/ContactScreen.js

import React, { useState } from 'react';

const ContactScreen = () => {
  const [showAlert, setShowAlert] = useState(false);

  const handleContact = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <button
          onClick={handleContact}
          className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          צור קשר
        </button>

        {showAlert && (
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 rounded-lg">
            הטופס נשלח בהצלחה! נחזור אליך בהקדם.
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactScreen;
