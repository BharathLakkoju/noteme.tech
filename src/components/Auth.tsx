import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { Github, Mail } from 'lucide-react';

export function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { setUser, settings } = useStore();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (!error && user) {
        setUser({ id: user.id, email: user.email || '' });
      }
    } else {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!error && user) {
        setUser({ id: user.id, email: user.email || '' });
      }
    }
  };

  const handleGithubSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin
      }
    });
    
    if (error) {
      console.error('Error signing in with Github:', error.message);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      settings.darkMode ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className={`${
        settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white'
      } p-8 rounded-lg shadow-md w-96`}>
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${
              settings.darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full rounded-md ${
                settings.darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${
              settings.darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 block w-full rounded-md ${
                settings.darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            <Mail size={18} />
            <span>Continue with Email</span>
          </button>
        </form>

        <div className="mt-4 relative">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-2 ${settings.darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
              Or continue with
            </span>
          </div>
        </div>

        <button
          onClick={handleGithubSignIn}
          className={`mt-4 w-full py-2 px-4 rounded-md border ${
            settings.darkMode
              ? 'border-gray-600 hover:bg-gray-700'
              : 'border-gray-300 hover:bg-gray-50'
          } flex items-center justify-center gap-2 transition-colors`}
        >
          <Github size={18} />
          <span>Continue with Github</span>
        </button>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className={`mt-4 text-sm ${
            settings.darkMode ? 'text-blue-400' : 'text-blue-500'
          } hover:text-blue-600 w-full text-center`}
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}