import React, { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Download, X } from 'lucide-react';
import { clsx } from 'clsx';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { vim } from '@replit/codemirror-vim';

export function Editor() {
  const { tabs, activeTabId, closeTab, setActiveTab, updateTabContent, settings } = useStore();
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const handleDownload = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (!tab) return;

    const blob = new Blob([tab.note.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tab.note.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!activeTabId || !editorRef.current) return;

    const tab = tabs.find((t) => t.id === activeTabId);
    if (!tab) return;

    const state = EditorState.create({
      doc: tab.note.content,
      extensions: [
        basicSetup,
        settings.vimMode ? vim() : [],
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            updateTabContent(activeTabId, update.state.doc.toString());
          }
        }),
        EditorView.theme({
          '&': {
            backgroundColor: settings.darkMode ? '#1f2937' : '#ffffff',
            color: settings.darkMode ? '#e5e7eb' : '#000000',
          },
          '.cm-gutters': {
            backgroundColor: settings.darkMode ? '#374151' : '#f3f4f6',
            color: settings.darkMode ? '#9ca3af' : '#6b7280',
            border: 'none',
          },
          '.cm-activeLineGutter': {
            backgroundColor: settings.darkMode ? '#4b5563' : '#e5e7eb',
          },
          '.cm-activeLine': {
            backgroundColor: settings.darkMode ? '#374151' : '#f9fafb',
          },
          '.cm-cursor': {
            borderLeftColor: settings.darkMode ? '#ffffff' : '#000000',
            borderLeftWidth: '2px',
            backgroundColor: settings.darkMode ? '#000000' : '#ffffff',
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [activeTabId, settings.vimMode, settings.darkMode]);

  if (tabs.length === 0) {
    return (
      <div className={`flex-1 flex items-center justify-center ${
        settings.darkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-500'
      }`}>
        <div className="text-center px-4">
          <p className="mb-4">No notes open</p>
          <p className="text-sm">Create or select a note from the sidebar to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col h-full ${settings.darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className={`flex flex-wrap ${settings.darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} border-b`}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={clsx(
              'flex items-center px-3 py-2 border-r cursor-pointer group transition-colors min-w-[120px] max-w-[200px]',
              tab.id === activeTabId
                ? settings.darkMode
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white text-gray-800 border-gray-200'
                : settings.darkMode
                ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="mr-2 truncate flex-1 text-sm">{tab.note.title}</span>
            {tab.isDirty && (
              <span className={`${
                settings.darkMode ? 'text-blue-400' : 'text-blue-500'
              } text-sm`}>•</span>
            )}
            <div className="flex items-center ml-1 space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(tab.id);
                }}
                className={`opacity-0 group-hover:opacity-100 p-1 ${
                  settings.darkMode
                    ? 'hover:bg-gray-600 text-gray-300'
                    : 'hover:bg-gray-200 text-gray-600'
                } rounded-md transition-all block`}
                title="Download note"
              >
                <Download size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className={`opacity-0 group-hover:opacity-100 p-1 ${
                  settings.darkMode
                    ? 'hover:bg-gray-600 text-gray-300'
                    : 'hover:bg-gray-200 text-gray-600'
                } rounded-md transition-all`}
                title="Close tab"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div ref={editorRef} className="flex-1" />
    </div>
  );
}