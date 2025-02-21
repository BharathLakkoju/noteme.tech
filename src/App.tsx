import { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Settings } from './components/Settings';
import { SearchDialog } from './components/SearchDialog';
import { NewNoteDialog } from './components/NewNoteDialog';
import { Menu } from 'lucide-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function Layout() {
  const { settings } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNewNoteDialogOpen, setIsNewNoteDialogOpen] = useState(false);
  
  return (
    <>
      <div className={`flex h-screen ${settings.darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Mobile menu button - only visible when sidebar is closed */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center px-4 h-14 bg-inherit border-b border-gray-200 dark:border-gray-700">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2 rounded-md ${
                settings.darkMode
                  ? 'text-white hover:bg-gray-700'
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Menu size={24} />
            </button>
          )}
        </div>

        {/* Sidebar with responsive behavior */}
        <div
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:relative z-50 transition-transform duration-300 ease-in-out h-full`}
        >
          <Sidebar 
            onClose={() => setIsSidebarOpen(false)} 
            onNewNote={() => setIsNewNoteDialogOpen(true)}
          />
        </div>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 relative lg:relative">
          <div className="h-full lg:h-screen pt-14 lg:pt-0">
            <Editor />
          </div>
        </div>
        <SearchDialog />
        <NewNoteDialog
          isOpen={isNewNoteDialogOpen}
          onClose={() => setIsNewNoteDialogOpen(false)}
        />
      </div>
    </>
  );
}

function App() {
  const { user, setUser, setNotes, settings } = useStore();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      // Fetch user's notes
      supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false })
        .then(({ data }) => {
          if (data) {
            setNotes(data);
          }
        });
    }
  }, [user]);

  if (!user) {
    return (
      <div className={settings.darkMode ? 'dark' : ''}>
        <Auth />
      </div>
    );
  }

  return (
    <div className={settings.darkMode ? 'dark' : ''}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App