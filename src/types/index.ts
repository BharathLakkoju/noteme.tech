export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
}

export interface Tab {
  id: string;
  note: Note;
  isDirty: boolean;
}

export interface Settings {
  vimMode: boolean;
  darkMode: boolean;
  isSearchOpen: boolean;
}