import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItem {
  icon: string;
  label: string;
  to: string;
}

const navItems: NavItem[] = [
  { icon: 'dashboard', label: 'Home', to: '/' },
  { icon: 'fitness_center', label: 'Exercises', to: '/exercises' },
  { icon: 'favorite', label: 'Heart Rate', to: '/heart-rate' },
  { icon: 'bedtime', label: 'Sleep', to: '/sleep' },
  { icon: 'settings', label: 'Settings', to: '/settings' },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-[280px] h-screen sticky left-0 top-0 bg-surface-container-lowest card-shadow flex flex-col py-6 z-50 flex-shrink-0">
      <div className="px-8 mb-10">
        <h1
          className="text-headline-md font-bold text-primary cursor-pointer select-none"
          onClick={() => window.location.href = '/'}
        >Vitality Hub</h1>
        <p className="text-label-md text-on-surface-variant opacity-70 uppercase tracking-wider">
          Premium Health
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-4 px-4 py-3 text-primary font-bold border-r-4 border-primary bg-primary/10 transition-all duration-200'
                : 'flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors duration-200 rounded-lg'
            }
            aria-current={undefined}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-label-md">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-6 mt-auto">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBO5tloyO3ldz4CpMEUFtDLUA0z2LfTHJor7hapnEROaPp-Kb3rhClUXqFw1tKa1iCAR7wuDdgxl42PmSk1_cR-gdinESQpKEZeoqr_omjgaHqcRpLrIlLoHLWhv7kaXgh3h3ypfLQJbrOQmvdg3cGZP2Cu9pC91cHSSPzxDmiFwLukHZA57ozFh4tib9bW5kxoI18eJG-DTIxuUKXMROBFed3Rm2B6bLHlVm6oJroKMwv65lFEREfOs0iRdIYl1hqus5mbWtigDwI"
              alt="User profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-label-sm text-on-surface">John Doe</p>
            <p className="text-[10px] text-on-surface-variant">Pro Member</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
