import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { X } from 'lucide-react';

interface NewNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewNoteDialog({ isOpen, onClose }: NewNoteDialogProps) {
  const [title, setTitle] = useState('');
  const { addNote, settings } = useStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      await addNote({
        title: title.trim(),
        content: '',
      });
      setTitle('');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`${
        settings.darkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
        } rounded-lg shadow-xl w-[400px] max-w-full border overflow-hidden transform transition-all`}
      >
        <div className={`flex items-center justify-between px-4 py-3 border-b ${
          settings.darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-lg font-semibold ${
            settings.darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Create New Note
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-md transition-colors ${
              settings.darkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label
              htmlFor="title"
              className={`block text-sm font-medium mb-1 ${
                settings.darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Note Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 transition-colors ${
                settings.darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500 focus:ring-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-200'
              }`}
              placeholder="Enter note title"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                settings.darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                title.trim()
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-blue-500/50 cursor-not-allowed'
              }`}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}