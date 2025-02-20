import { create } from 'zustand';
import { Note, Tab, User, Settings } from '../types';
import { supabase } from '../lib/supabase';
import { persist } from 'zustand/middleware';

interface Store {
  user: User | null;
  notes: Note[];
  tabs: Tab[];
  activeTabId: string | null;
  settings: Settings;
  isSearchOpen: boolean;
  setUser: (user: User | null) => void;
  setNotes: (notes: Note[]) => void;
  addNote: (note: Partial<Note>) => void;
  updateNote: (note: Note) => void;
  deleteNote: (noteId: string) => void;
  addTab: (note: Note) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTabContent: (tabId: string, content: string) => void;
  updateNoteTitle: (noteId: string, title: string) => void;
  toggleVimMode: () => void;
  toggleDarkMode: () => void;
  setSearchOpen: (isOpen: boolean) => void;
  signOut: () => Promise<void>;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      notes: [],
      tabs: [],
      activeTabId: null,
      settings: {
        vimMode: false,
        darkMode: false,
      },
      isSearchOpen: false,

      setUser: (user) => set({ user }),
      setNotes: (notes) => set({ notes }),
      setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),

      addNote: async (note) => {
        const user = get().user;
        if (!user) return;

        const { data, error } = await supabase
          .from('notes')
          .insert([{ ...note, user_id: user.id }])
          .select()
          .single();

        if (!error && data) {
          set((state) => ({ notes: [...state.notes, data] }));
        }
      },

      updateNote: async (note) => {
        const { data, error } = await supabase
          .from('notes')
          .update({ ...note, updated_at: new Date().toISOString() })
          .eq('id', note.id)
          .select()
          .single();

        if (!error && data) {
          set((state) => ({
            notes: state.notes.map((n) => (n.id === note.id ? data : n)),
            tabs: state.tabs.map((t) => 
              t.note.id === note.id ? { ...t, note: data } : t
            ),
          }));
        }
      },

      updateNoteTitle: async (noteId, title) => {
        const note = get().notes.find((n) => n.id === noteId);
        if (note) {
          const updatedNote = { ...note, title };
          await get().updateNote(updatedNote);
        }
      },

      deleteNote: async (noteId) => {
        const { error } = await supabase.from('notes').delete().eq('id', noteId);

        if (!error) {
          set((state) => ({
            notes: state.notes.filter((n) => n.id !== noteId),
            tabs: state.tabs.filter((t) => t.note.id !== noteId),
          }));
        }
      },

      addTab: (note) => {
        set((state) => {
          // Check if the note is already open in a tab
          const existingTab = state.tabs.find((t) => t.note.id === note.id);
          if (existingTab) {
            return { activeTabId: existingTab.id };
          }

          // If not, create a new tab
          const tabId = `tab-${Date.now()}`;
          return {
            tabs: [...state.tabs, { id: tabId, note, isDirty: false }],
            activeTabId: tabId,
          };
        });
      },

      closeTab: (tabId) => {
        set((state) => {
          const newTabs = state.tabs.filter((t) => t.id !== tabId);
          return {
            tabs: newTabs,
            activeTabId: state.activeTabId === tabId ? (newTabs[0]?.id || null) : state.activeTabId,
          };
        });
      },

      setActiveTab: (tabId) => set({ activeTabId: tabId }),

      updateTabContent: (tabId, content) => {
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.id === tabId ? { ...t, note: { ...t.note, content }, isDirty: true } : t
          ),
        }));

        // Auto-save after 1 second of no typing
        const tab = get().tabs.find((t) => t.id === tabId);
        if (tab) {
          setTimeout(() => {
            const currentTab = get().tabs.find((t) => t.id === tabId);
            if (currentTab?.isDirty) {
              get().updateNote(currentTab.note);
              set((state) => ({
                tabs: state.tabs.map((t) =>
                  t.id === tabId ? { ...t, isDirty: false } : t
                ),
              }));
            }
          }, 1000);
        }
      },

      toggleVimMode: () => 
        set((state) => ({
          settings: { ...state.settings, vimMode: !state.settings.vimMode }
        })),

      toggleDarkMode: () =>
        set((state) => ({
          settings: { ...state.settings, darkMode: !state.settings.darkMode }
        })),

      signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, notes: [], tabs: [], activeTabId: null });
      },
    }),
    {
      name: 'notepad-storage',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);