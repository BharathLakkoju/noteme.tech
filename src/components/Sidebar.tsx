import React, { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { FilePlus, Trash2, Settings, Pencil, Check, LogOut, Moon, Sun, Search, X } from 'lucide-react';
import { Note } from '../types';
import { Link } from 'react-router-dom';
import { NewNoteDialog } from './NewNoteDialog';

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { notes, deleteNote, addTab, updateNoteTitle, settings, toggleDarkMode, signOut, setSearchOpen } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewNoteDialogOpen, setIsNewNoteDialogOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const startEditing = (note: Note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
  };

  const saveTitle = async (noteId: string) => {
    await updateNoteTitle(noteId, editTitle);
    setEditingId(null);
  };

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  const handleNoteClick = (note: Note) => {
    addTab(note);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <div className={`w-[280px] sm:w-72 ${settings.darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50'} h-screen flex flex-col border-r ${settings.darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Notes</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsNewNoteDialogOpen(true)}
                className={`p-2 ${
                  settings.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                } rounded-md transition-colors`}
                title="Create new note"
              >
                <FilePlus size={20} />
              </button>
              <button
                onClick={toggleDarkMode}
                className={`p-2 ${
                  settings.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                } rounded-md transition-colors`}
                title={settings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link
                to="/settings"
                className={`p-2 ${
                  settings.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                } rounded-md transition-colors`}
                title="Settings"
              >
                <Settings size={20} />
              </Link>
              <button
                onClick={signOut}
                className={`p-2 ${
                  settings.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                } rounded-md transition-colors`}
                title="Sign out"
              >
                <LogOut size={20} />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className={`lg:hidden p-2 ${
                    settings.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  } rounded-md transition-colors`}
                  title="Close sidebar"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-2 ${
                settings.darkMode
                  ? 'bg-gray-700 text-white border-gray-600 focus:border-gray-500'
                  : 'bg-white border-gray-300 focus:border-blue-500'
              } border rounded-md pl-10 focus:outline-none focus:ring-2 ${
                settings.darkMode ? 'focus:ring-gray-500' : 'focus:ring-blue-200'
              } transition-colors`}
            />
            <Search
              size={18}
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                settings.darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            />
            <button
              onClick={() => setSearchOpen(true)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-1.5 py-1 rounded text-xs ${
                settings.darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
              }`}
            >
              ⌘K
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`group relative flex items-center justify-between p-2 ${
                settings.darkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-200'
              } rounded-md cursor-pointer transition-colors`}
            >
              {editingId === note.id ? (
                <div className="flex items-center flex-1 gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className={`flex-1 px-2 py-1 rounded border ${
                      settings.darkMode
                        ? 'bg-gray-600 border-gray-500 text-white'
                        : 'border-gray-300'
                    } focus:outline-none focus:ring-2 ${
                      settings.darkMode ? 'focus:ring-gray-500' : 'focus:ring-blue-200'
                    }`}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveTitle(note.id);
                      } else if (e.key === 'Escape') {
                        setEditingId(null);
                      }
                    }}
                  />
                  <button
                    onClick={() => saveTitle(note.id)}
                    className={`p-1 ${
                      settings.darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
                    } rounded-md transition-colors`}
                  >
                    <Check size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className="flex-1 truncate py-1"
                    onClick={() => handleNoteClick(note)}
                  >
                    {note.title}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(note);
                      }}
                      className={`p-1 ${
                        settings.darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
                      } rounded-md transition-colors`}
                      title="Rename note"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className={`p-1 ${
                        settings.darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
                      } rounded-md transition-colors`}
                      title="Delete note"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <NewNoteDialog
        isOpen={isNewNoteDialogOpen}
        onClose={() => setIsNewNoteDialogOpen(false)}
      />
    </>
  );
}