import React from 'react';
import { useStore } from '../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Settings() {
  const { user, settings, toggleVimMode, toggleDarkMode } = useStore();

  return (
    <div className={`min-h-screen ${settings.darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <div className="mb-8 flex items-center gap-4">
          <Link
            to="/"
            className={`p-2 ${
              settings.darkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-200'
            } rounded-md`}
            title="Back to notes"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className={`text-xl sm:text-2xl font-bold ${settings.darkMode ? 'text-white' : 'text-gray-900'}`}>
            Settings
          </h1>
        </div>

        <div className={`${
          settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white'
        } rounded-lg shadow-md p-4 sm:p-6 space-y-6`}>
          <div>
            <h2 className="text-lg font-semibold mb-4">User Details</h2>
            <div className="space-y-2">
              <p className="break-all">
                <span className="font-medium">Email:</span> {user?.email}
              </p>
            </div>
          </div>

          <div className={`border-t ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'} pt-6`}>
            <h2 className="text-lg font-semibold mb-4">Editor Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <h3 className="font-medium">Vim Mode</h3>
                  <p className={`text-sm ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Enable Vim keybindings in the editor
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.vimMode}
                    onChange={toggleVimMode}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className={`text-sm ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Switch between light and dark theme
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={toggleDarkMode}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}