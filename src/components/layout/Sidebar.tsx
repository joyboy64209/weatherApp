import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Search, Wind, Settings } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/air-quality', label: 'AQI', icon: Wind },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-glass-stroke bg-glass-fill px-6 py-8 backdrop-blur-[20px]">
      <div className="mb-10">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">SkyGlass</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant/70">Premium Weather</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 font-label-md text-label-md transition-all duration-300 active:scale-95 ${
                isActive
                  ? 'border-r-2 border-primary bg-glass-fill font-bold text-primary'
                  : 'font-medium text-on-surface-variant hover:bg-glass-stroke hover:text-on-surface'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}