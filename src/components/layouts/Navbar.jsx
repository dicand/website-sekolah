import React, { useState } from 'react';
import { Menu, X, ChevronDown, User } from 'lucide-react';

const Navbar = ({ currentView, navigateTo, isAdmin, mobileMenuOpen, setMobileMenuOpen, scrolled }) => {
  const [expandedMobileMenu, setExpandedMobileMenu] = useState(null);
  const isSolidNav = scrolled || currentView !== 'home';

  const navItems = [
    { name: 'Home', view: 'home' },
    { name: 'Profil', view: 'profil', subItems: [
        { label: 'Sambutan Kepala Sekolah', id: 'sambutan' },
        { label: 'Sejarah Singkat', id: 'sejarah' },
        { label: 'Visi & Misi', id: 'visimisi' },
        { label: 'Struktur Organisasi', id: 'struktur' },
        { label: 'Guru & Staf', id: 'guru' }, 
        { label: 'Fasilitas', id: 'fasilitas' }
      ] 
    },
    { name: 'Galeri', view: 'galeri' },
    { name: 'Layanan', view: null, subItems: [
            { label: 'Berita Sekolah', view: 'berita' },
            { label: 'Agenda Akademik', view: 'kalender' },
            { label: 'Ekstrakurikuler', view: 'ekskul' },
            { label: 'Portal Layanan Digital', view: 'layanan' }
        ]
    },
    { name: 'Kontak', view: 'kontak' }
  ];

  const handleMobileMenuToggle = (menuName) => {
    if (expandedMobileMenu === menuName) setExpandedMobileMenu(null);
    else setExpandedMobileMenu(menuName);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isSolidNav ? 'glass-nav py-2 shadow-sm' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigateTo('home')}>
            <div className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-300 ${isSolidNav ? 'border-orange-500 shadow-md' : 'border-white/50 bg-white/10'}`}>
                <img src="https://mediacenter.riau.go.id/img_album/thumb/kabupaten-kampar.png" alt="Logo Sekolah" className="w-full h-full object-cover p-1" />
            </div>
            <div>
              <h1 className={`font-bold text-xl leading-tight tracking-tight ${isSolidNav ? 'text-slate-800' : 'text-white'}`}>SMAN 2</h1>
              <p className={`text-xs uppercase tracking-widest font-medium ${isSolidNav ? 'text-slate-500' : 'text-orange-100'}`}>Koto Kampar Hulu</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <button 
                  onClick={() => { if (!item.subItems) navigateTo(item.view); }}
                  className={`flex items-center gap-1 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    currentView === item.view 
                      ? (isSolidNav ? 'bg-slate-100 text-orange-600' : 'bg-white/20 text-white backdrop-blur-sm')
                      : (isSolidNav ? 'text-slate-600 hover:text-orange-600 hover:bg-slate-50' : 'text-white/90 hover:text-white hover:bg-white/10')
                  } ${item.subItems ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {item.name} 
                  {item.subItems && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
                </button>
                {item.subItems && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left border border-slate-100">
                    <div className="py-2">
                      {item.subItems.map((sub, idx) => (
                        <button key={idx} onClick={(e) => {
                            e.stopPropagation();
                            if (sub.view) navigateTo(sub.view);
                            else navigateTo(item.view, sub.id);
                          }}
                          className="block w-full text-left px-5 py-3 text-sm text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-slate-50 last:border-0">
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isAdmin ? (
              <button onClick={() => navigateTo('admin')} className="ml-4 bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
                <User size={16} /> Dashboard
              </button>
            ) : (
              <button onClick={() => navigateTo('login')} className={`ml-4 px-6 py-2 rounded-full font-medium border transition-all duration-300 ${isSolidNav ? 'border-slate-200 text-slate-600 hover:border-orange-500 hover:text-orange-500' : 'border-white/30 text-white hover:bg-white hover:text-orange-600'}`}>Login</button>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`${isSolidNav ? 'text-slate-800' : 'text-white'} focus:outline-none`}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 animate-fade-in-up max-h-[80vh] overflow-y-auto">
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.subItems ? (
                  <div>
                    <button onClick={() => handleMobileMenuToggle(item.name)} className="flex w-full items-center justify-between text-left px-4 py-3 rounded-lg hover:bg-orange-50 text-slate-700 font-medium">
                      {item.name}
                      <ChevronDown size={16} className={`transition-transform duration-300 ${expandedMobileMenu === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`pl-4 space-y-1 overflow-hidden transition-all duration-300 ${expandedMobileMenu === item.name ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                      {item.subItems.map((sub, idx) => (
                        <button key={idx} onClick={() => {
                              if (sub.view) navigateTo(sub.view);
                              else navigateTo(item.view, sub.id);
                          }} className="block w-full text-left px-4 py-2 text-sm text-slate-500 hover:text-orange-600 border-l-2 border-slate-100 hover:border-orange-300 ml-2">
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button onClick={() => navigateTo(item.view)} className="block w-full text-left px-4 py-3 rounded-lg hover:bg-orange-50 text-slate-700 font-medium">
                    {item.name}
                  </button>
                )}
              </div>
            ))}
            <div className="pt-4 mt-2 border-t border-slate-100">
              {isAdmin ? (
                <button onClick={() => navigateTo('admin')} className="block w-full text-left px-4 py-3 bg-orange-100 text-orange-700 font-bold rounded-lg flex items-center gap-2">
                  <User size={18} /> Dashboard Admin
                </button>
              ) : (
                <button onClick={() => navigateTo('login')} className="block w-full text-left px-4 py-3 bg-slate-100 text-slate-600 rounded-lg">Login Admin</button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;