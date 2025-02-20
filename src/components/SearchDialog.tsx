import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useStore } from '../store/useStore';
import { Search, File } from 'lucide-react';

export function SearchDialog() {
  const { notes, addTab, settings, isSearchOpen, setSearchOpen } = useStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault();
        setSearchOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredNotes = notes.filter((note) => {
    const searchLower = search.toLowerCase();
    return (
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[20vh]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSearchOpen(false);
        }
      }}
    >
      <Command
        className={`${
          settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white'
        } rounded-lg shadow-2xl overflow-hidden w-[640px] max-w-[90vw]`}
      >
        <div className={`${
          settings.darkMode ? 'border-gray-700' : 'border-gray-200'
        } border-b px-4 flex items-center`}>
          <Search className={`${
            settings.darkMode ? 'text-gray-400' : 'text-gray-500'
          } w-4 h-4 mr-2 flex-shrink-0`} />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search notes..."
            className={`${
              settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white'
            } w-full py-4 outline-none placeholder:text-gray-400`}
            autoFocus
          />
        </div>
        <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
          <Command.Empty className={`${
            settings.darkMode ? 'text-gray-400' : 'text-gray-500'
          } p-4 text-center`}>
            No results found.
          </Command.Empty>
          {filteredNotes.map((note) => (
            <Command.Item
              key={note.id}
              value={note.title}
              onSelect={() => {
                addTab(note);
                setSearchOpen(false);
                setSearch('');
              }}
              className={`${
                settings.darkMode
                  ? 'text-gray-200 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              } px-4 py-2 rounded-md cursor-pointer flex items-center gap-2 group`}
            >
              <File className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{note.title}</div>
                {note.content && (
                  <div className={`${
                    settings.darkMode ? 'text-gray-400' : 'text-gray-500'
                  } text-sm truncate`}>
                    {note.content.slice(0, 100)}
                  </div>
                )}
              </div>
            </Command.Item>
          ))}
        </Command.List>
      </Command>
    </div>
  );
}