// components/LandingPage.js

import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LandingPage = () => {
  const { loginWithRedirect } = useAuth0();

  const handleGetStarted = () => {
    loginWithRedirect();
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gradient-to-br from-indigo-100 via-blue-200 to-indigo-200">
      {/* Header Section */}
      <div className="text-center mt-16">
        <h1 className="text-6xl font-extrabold text-indigo-800 mb-4">MatchBox</h1>
        <p className="text-xl text-indigo-600">Your ultimate scheduling companion</p>
      </div>

      {/* Responsive YouTube Video */}
      <div className="relative w-full max-w-3xl mb-8">
        <div className="relative" style={{ paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            src="https://www.youtube.com/embed/rc04D5jUh68?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1"
            title="MatchBox Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mb-16">
        <button
          onClick={handleGetStarted}
          className="px-10 py-4 bg-indigo-600 text-white rounded-full text-lg font-medium shadow-md hover:bg-indigo-700 transition duration-300"
        >
          Get Started
        </button>
      </div>

      {/* Footer */}
      <footer className="text-center text-indigo-700 text-sm mb-4">
        &copy; {new Date().getFullYear()} MatchBox. All Rights Reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
