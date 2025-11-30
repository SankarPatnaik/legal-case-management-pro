import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', to: '/', match: '/' },
    { label: 'Clients', to: '/clients', match: '/clients' },
    { label: 'Diary', to: '/diary', match: '/diary' }
  ];

  const resolvedTitle =
    location.pathname === '/'
      ? 'Dashboard'
      : location.pathname.startsWith('/cases/')
      ? 'Case Details'
      : navItems.find((item) => location.pathname.startsWith(item.match))?.label || 'Workspace';

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
        <div className="px-4 py-4 border-b border-slate-800">
          <h1 className="text-lg font-semibold">Legal Case Mgmt</h1>
          {user && (
            <p className="mt-1 text-xs text-slate-400">
              {user.name} · {user.role}
            </p>
          )}
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block px-3 py-2 rounded-md text-sm ${
                location.pathname === item.match
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-400">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6">
          <h2 className="text-base font-semibold text-slate-800">{resolvedTitle}</h2>
        </header>
        <section className="p-6">{children}</section>
      </main>
    </div>
  );
};

export default Layout;
