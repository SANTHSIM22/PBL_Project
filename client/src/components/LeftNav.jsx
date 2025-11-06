import React from 'react';

const LeftNav = ({ onMenuSelect, active }) => {
  const items = [
    { id: 'home', label: 'Overview' },
    { id: 'users', label: 'Artisans & Customers' },
    { id: 'products', label: 'Products' },
    { id: 'orders', label: 'Orders' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-[#7c3f00] to-[#a0522d] text-white flex flex-col p-4">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="white" />
          </svg>
        </div>
        <div>
          <div className="font-bold text-lg">Artisan Connect</div>
          <div className="text-xs text-white/80">Superadmin</div>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => onMenuSelect(it.id)}
            className={`text-left p-2 rounded transition-colors ${active === it.id ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            {it.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <button onClick={() => onMenuSelect('logout')} className="w-full text-left p-2 rounded hover:bg-white/10">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default LeftNav;
