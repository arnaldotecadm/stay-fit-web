import React from 'react';

const TopBar: React.FC = () => {
  return (
    <header className="w-full h-16 sticky top-0 z-40 bg-surface flex justify-between items-center px-10 border-b border-outline-variant/10">
      <div className="flex items-center gap-8">
        <h2 className="text-headline-md font-black text-on-surface">Samsung Health</h2>
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            placeholder="Search data..."
            className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 text-label-md"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          aria-label="Calendar"
          className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
        >
          calendar_today
        </button>
        <div className="relative">
          <button
            aria-label="Notifications"
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
          >
            notifications
          </button>
          <span className="absolute top-0 right-0 w-2 h-2 bg-tertiary rounded-full border-2 border-surface" />
        </div>
        <button
          aria-label="Help"
          className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
        >
          help
        </button>
      </div>
    </header>
  );
};

export default TopBar;
