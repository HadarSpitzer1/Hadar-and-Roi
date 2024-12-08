import React from "react";
import { Layout, Users, Settings, PhoneCall } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const buttonClass = (path) =>
      `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isActive(path)
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "hover:bg-indigo-50 dark:hover:bg-indigo-900/50 text-gray-700 dark:text-gray-200"
      }`;

  const { logout, user, isAuthenticated } = useAuth0();

  return (
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg mb-8 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-4">
              <button onClick={() => navigate("/")} className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                MatchBox
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button className={buttonClass("/")} onClick={() => navigate("/")}>
                <Layout size={20} />
                <span>לוחות</span>
              </button>
              <button className={buttonClass("/employees")} onClick={() => navigate("/employees")}>
                <Users size={20} />
                <span>עובדים</span>
              </button>
              <button className={buttonClass("/settings")} onClick={() => navigate("/settings")}>
                <Settings size={20} />
                <span>הגדרות</span>
              </button>
              <button className={buttonClass("/contact")} onClick={() => navigate("/contact")}>
                <PhoneCall size={20} />
                <span>צור קשר</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                  <div className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-800/50 text-indigo-600 dark:text-indigo-200 px-4 py-2 rounded-lg">
                    {user.picture && (
                        <img src={user.picture} alt="User Avatar" className="w-8 h-8 rounded-full" />
                    )}
                    <span className="text-sm font-medium">{user.name || user.email}</span>
                  </div>
              )}
              <button onClick={() => logout({ returnTo: window.location.origin })} className="px-4 py-2 bg-red-600 text-white rounded-lg">
                התנתק
              </button>
            </div>
          </div>
        </div>
      </nav>
  );
};

export default NavBar;
