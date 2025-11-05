import React, { useState } from "react";
import { Menu, LogOut, User, X, Settings } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import VoiceSettings from "../shared/VoiceSettings";

const Header = ({ onMenuToggle, isMenuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 px-4 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-slate-300" />
              ) : (
                <Menu className="w-6 h-6 text-slate-300" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  AI Math Tutor
                </h1>
                <p className="text-xs text-slate-400">
                  Learn through questions
                </p>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {/* Voice Settings Button */}
            <button
              onClick={() => setShowVoiceSettings(true)}
              title="Voice Settings"
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors duration-200 text-slate-300 hover:text-white"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center text-white text-sm font-semibold">
                  {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-sm text-slate-300 hidden sm:inline">
                  {user?.displayName || "User"}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-700 border border-slate-600 rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-600">
                    <p className="text-sm text-slate-200 font-medium">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    disabled
                    className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-600 flex items-center gap-2 transition-colors duration-200 disabled:opacity-50"
                  >
                    <User className="w-4 h-4" />
                    Profile (Coming soon)
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-600 flex items-center gap-2 transition-colors duration-200 border-t border-slate-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Voice Settings Modal */}
      <VoiceSettings
        isOpen={showVoiceSettings}
        onClose={() => setShowVoiceSettings(false)}
      />
    </>
  );
};

export default Header;
