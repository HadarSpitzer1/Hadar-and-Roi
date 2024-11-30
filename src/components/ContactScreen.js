// components/ContactScreen.js

import React, { useState } from 'react';

const ContactScreen = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState('');

  const handleContact = (e) => {
    e.preventDefault();
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
    // TODO: Implement message sending logic here
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        {/* Contact Card */}
        <div className="flex flex-row-reverse items-center space-x-reverse space-x-6">
          <img
            src="https://wvairttcpyoazbfpqcaw.supabase.co/storage/v1/object/public/fake-profile-pics/image%20(81).jpeg"
            alt="Contact Person"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="text-right">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              שחר חמיאל
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              
              <a
                href="mailto:shaharha77@gmail.com"
                className="text-indigo-600 hover:underline"
              >
                shaharha77@gmail.com
              </a>
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              
              <a
                href="tel:+972545781101"
                className="text-indigo-600 hover:underline"
              >
                054-578-1101
              </a>
            </p>
          </div>
        </div>

        {/* Message Form */}
        <form onSubmit={handleContact} className="space-y-4">
          <textarea
            dir="rtl"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-32 p-4 border border-gray-1200 dark:border-gray-1900 dark:text-emerald-100 dark:bg-emerald-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
            placeholder="הודעה לצוות"
          ></textarea>
          <button
            type="submit"
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            צור קשר
          </button>
        </form>

        {showAlert && (
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 rounded-lg text-right">
            הטופס נשלח בהצלחה! נחזור אליך בהקדם.
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactScreen;
