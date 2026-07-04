import React from 'react';

interface PlaceholderPageProps {
  icon: string;
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ icon, title }) => {
  return (
    <main className="flex-1 overflow-y-auto flex flex-col items-center justify-center gap-6 px-10 pb-12 pt-4">
      <div className="w-24 h-24 rounded-[32px] bg-primary/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: 48 }}>
          {icon}
        </span>
      </div>
      <h1 className="text-headline-lg font-semibold text-on-surface">{title}</h1>
      <p className="text-body-lg text-on-surface-variant text-center max-w-sm">
        This page is coming soon. Check back later for your {title.toLowerCase()} data.
      </p>
    </main>
  );
};

export default PlaceholderPage;
