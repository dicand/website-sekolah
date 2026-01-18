import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken,
  signInWithEmailAndPassword, // FITUR BARU: Login aman
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';

import { 
  Menu, X, Phone, MapPin, Mail, Facebook, Instagram, Youtube, User, LogOut, 
  PlusCircle, Trash2, Calendar, BookOpen, Award, Users, ArrowRight, ChevronRight, 
  LayoutDashboard, FileText, Image as ImageIcon, Type, List, Eye, Save, Send,
  Bold, Italic, Link as LinkIcon, Hash, Star, ChevronDown, Clock, Map, Monitor,
  Beaker, Coffee, HeartPulse, Camera, UploadCloud, MonitorUp, Search, GraduationCap, Loader2,
  ChevronLeft, Music, Trophy, Target, Flag
} from 'lucide-react';

// --- KONFIGURASI CLOUDINARY (GANTI INI!) ---
// Masukkan Cloud Name dan Upload Preset dari Dashboard Cloudinary Anda
const CLOUDINARY_CLOUD_NAME = "dam5zuh3h"; // GANTI DENGAN CLOUD NAME ANDA (Langkah 1)
const CLOUDINARY_UPLOAD_PRESET = "sekolah_preset"; // GANTI DENGAN PRESET ANDA (Langkah 2 - Pastikan Mode UNSIGNED)

// --- Firebase Configuration & Environment Setup ---
// UPDATED: Fungsi ini sekarang cerdas. Bisa jalan di Canvas Preview DAN Vercel.
const getFirebaseConfig = () => {
  // 1. Cek jika berjalan di Canvas Preview (Otomatis)
  if (typeof __firebase_config !== 'undefined') {
    return JSON.parse(__firebase_config);
  }

  // 2. Cek jika berjalan di Local/Vercel (Menggunakan .env)
  // Pastikan Anda sudah membuat file .env sesuai panduan deploy
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
};

const firebaseConfig = getFirebaseConfig();
// Pencegahan error jika config kosong (saat awal setup di lokal sebelum .env diisi)
const app = firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
// const storage = app ? getStorage(app) : null;

// Menentukan App ID untuk koleksi database
let currentAppId = 'school-website-default';
if (typeof __app_id !== 'undefined') {
    currentAppId = __app_id;
}
const appId = currentAppId;

// --- Custom Styles ---
const customStyles = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  @keyframes float-delayed {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-delayed { animation: float 6s ease-in-out infinite; animation-delay: 3s; }
  .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
  .glass-nav {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  }
  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
  .card-3d-hover { transition: all 0.4s ease; }
  .card-3d-hover:hover {
    transform: translateY(-10px) rotateX(2deg);
    box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.1);
  }
  .perspective-1000 { perspective: 1000px; }
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
`;

// --- SEO COMPONENTS ---

// 1. Dynamic Meta Tags Component
const SEO = ({ title, description, keywords, image, url }) => {
  useEffect(() => {
    // Standard Title
    document.title = `${title} | SMAN 2 Koto Kampar Hulu`;

    // Helper to update meta tags
    const setMeta = (name, content) => {
        let element = document.querySelector(`meta[name="${name}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute('name', name);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    const setOgMeta = (property, content) => {
        let element = document.querySelector(`meta[property="${property}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute('property', property);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    // Standard SEO
    setMeta('description', description || "Website Resmi SMAN 2 Koto Kampar Hulu. Informasi akademik, berita sekolah, ekstrakurikuler, dan profil sekolah.");
    setMeta('keywords', keywords || "SMAN 2 Koto Kampar Hulu, SMA Riau, Sekolah Menengah Atas, Pendidikan, Kampar, Riau, Website Sekolah");
    setMeta('author', 'SMAN 2 Koto Kampar Hulu');
    setMeta('robots', 'index, follow');

    // Open Graph / Facebook / WhatsApp
    const defaultImage = "https://cdn-icons-png.flaticon.com/512/3281/3281329.png";
    const currentUrl = url || window.location.href;

    setOgMeta('og:type', 'website');
    setOgMeta('og:title', title);
    setOgMeta('og:description', description || "Website Resmi SMAN 2 Koto Kampar Hulu");
    setOgMeta('og:image', image || defaultImage);
    setOgMeta('og:url', currentUrl);
    setOgMeta('og:site_name', 'SMAN 2 Koto Kampar Hulu');

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description || "Website Resmi SMAN 2 Koto Kampar Hulu");
    setMeta('twitter:image', image || defaultImage);

  }, [title, description, keywords, image, url]);

  return null;
};

// 2. Structured Data (JSON-LD) for Rich Snippets
const SchemaOrg = () => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "SMAN 2 Koto Kampar Hulu",
        "url": "https://sman2koto.sch.id", // Ganti dengan domain asli nanti
        "logo": "https://cdn-icons-png.flaticon.com/512/3281/3281329.png",
        "description": "Sekolah Menengah Atas Negeri yang berfokus pada pembentukan karakter dan prestasi akademik di Riau.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Jl. Pendidikan No. 1",
            "addressLocality": "Koto Kampar Hulu",
            "addressRegion": "Riau",
            "postalCode": "28453",
            "addressCountry": "ID"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+62-761-123456",
            "contactType": "customer service"
        },
        "sameAs": [
            "https://www.facebook.com/sman2kotokampar",
            "https://www.instagram.com/sman2kotokampar",
            "https://www.youtube.com/channel/sman2kotokampar"
        ]
    };

    return (
        <script type="application/ld+json">
            {JSON.stringify(schema)}
        </script>
    );
};

// --- COMPONENTS ---

const Navbar = ({ currentView, navigateTo, isAdmin, mobileMenuOpen, setMobileMenuOpen, scrolled }) => {
  // Changed from boolean to string to track which menu is open (Profil or Layanan)
  const [expandedMobileMenu, setExpandedMobileMenu] = useState(null);

  // Logic: Navbar is "solid/glass" if scrolled OR if NOT on home page
  const isSolidNav = scrolled || currentView !== 'home';

  const navItems = [
    { name: 'Home', view: 'home' },
    { 
      name: 'Profil', 
      view: 'profil', 
      subItems: [
        { label: 'Sambutan Kepala Sekolah', id: 'sambutan' },
        { label: 'Sejarah Singkat', id: 'sejarah' },
        { label: 'Visi & Misi', id: 'visimisi' },
        { label: 'Struktur Organisasi', id: 'struktur' },
        { label: 'Guru & Staf', id: 'guru' }, 
        { label: 'Fasilitas', id: 'fasilitas' }
      ] 
    },
    { name: 'Galeri', view: 'galeri' },
    { 
        name: 'Layanan', 
        view: null, // Set null so clicking parent doesn't navigate
        subItems: [
            { label: 'Berita Sekolah', view: 'berita' }, // View switching
            { label: 'Agenda Akademik', view: 'kalender' }, // View switching
            { label: 'Ekstrakurikuler', view: 'ekskul' }, // New View
            { label: 'Portal Layanan Digital', view: 'layanan' } // View switching
        ]
    },
    { name: 'Kontak', view: 'kontak' }
  ];

  const handleMobileMenuToggle = (menuName) => {
    if (expandedMobileMenu === menuName) {
        setExpandedMobileMenu(null);
    } else {
        setExpandedMobileMenu(menuName);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isSolidNav ? 'glass-nav py-2 shadow-sm' : 'bg-transparent py-4'}`}>
      <style>{customStyles}</style>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigateTo('home')}>
            <div className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-300 ${isSolidNav ? 'border-orange-500 shadow-md' : 'border-white/50 bg-white/10'}`}>
                <img src="https://cdn-icons-png.flaticon.com/512/3281/3281329.png" alt="Logo Sekolah" className="w-full h-full object-cover p-1" />
            </div>
            <div>
              <h1 className={`font-bold text-xl leading-tight tracking-tight ${isSolidNav ? 'text-slate-800' : 'text-white'}`}>SMAN 2</h1>
              <p className={`text-xs uppercase tracking-widest font-medium ${isSolidNav ? 'text-slate-500' : 'text-orange-100'}`}>Koto Kampar Hulu</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <button 
                  onClick={() => {
                      // Only navigate if it's a simple link, not a dropdown parent
                      if (!item.subItems) navigateTo(item.view);
                  }}
                  className={`flex items-center gap-1 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    currentView === item.view 
                      ? (isSolidNav ? 'bg-slate-100 text-orange-600' : 'bg-white/20 text-white backdrop-blur-sm')
                      : (isSolidNav ? 'text-slate-600 hover:text-orange-600 hover:bg-slate-50' : 'text-white/90 hover:text-white hover:bg-white/10')
                  } ${item.subItems ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {item.name} 
                  {item.subItems && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
                </button>

                {/* Desktop Dropdown */}
                {item.subItems && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left border border-slate-100">
                    <div className="py-2">
                      {item.subItems.map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (sub.view) {
                                // If subItem has a specific view (Berita, Agenda), go there
                                navigateTo(sub.view);
                            } else {
                                // If subItem uses ID scrolling (Profil), go to parent view + scroll
                                navigateTo(item.view, sub.id);
                            }
                          }}
                          className="block w-full text-left px-5 py-3 text-sm text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-slate-50 last:border-0"
                        >
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`${isSolidNav ? 'text-slate-800' : 'text-white'} focus:outline-none`}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 animate-fade-in-up max-h-[80vh] overflow-y-auto">
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.subItems ? (
                  <div>
                    <button 
                      onClick={() => handleMobileMenuToggle(item.name)} 
                      className="flex w-full items-center justify-between text-left px-4 py-3 rounded-lg hover:bg-orange-50 text-slate-700 font-medium"
                    >
                      {item.name}
                      <ChevronDown size={16} className={`transition-transform duration-300 ${expandedMobileMenu === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`pl-4 space-y-1 overflow-hidden transition-all duration-300 ${expandedMobileMenu === item.name ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                      {item.subItems.map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                              if (sub.view) {
                                navigateTo(sub.view);
                              } else {
                                navigateTo(item.view, sub.id);
                              }
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-slate-500 hover:text-orange-600 border-l-2 border-slate-100 hover:border-orange-300 ml-2"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => navigateTo(item.view)} 
                    className="block w-full text-left px-4 py-3 rounded-lg hover:bg-orange-50 text-slate-700 font-medium"
                  >
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

const Footer = ({ navigateTo }) => (
  <footer className="bg-slate-900 text-slate-300 py-16 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-red-500 to-purple-600"></div>
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
      <div className="col-span-1 md:col-span-1">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1">
            <img loading="lazy" src="https://cdn-icons-png.flaticon.com/512/3281/3281329.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h3 className="text-xl font-bold text-white">SMAN 2</h3>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-slate-400">
          Mewujudkan generasi penerus bangsa yang cerdas, berkarakter, dan kompetitif dengan sentuhan nilai budaya dan agama.
        </p>
        <div className="flex space-x-4">
          <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300"><Facebook size={18} /></a>
          <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300"><Instagram size={18} /></a>
          <a href="#" aria-label="Youtube" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300"><Youtube size={18} /></a>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-white mb-6">Hubungi Kami</h3>
        <div className="space-y-4 text-sm text-slate-400">
          <div className="flex items-start gap-3 group"><div className="p-2 bg-slate-800 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition"><MapPin size={16} /></div><span>Jl. Pendidikan No. 1, Koto Kampar Hulu, Riau</span></div>
          <div className="flex items-center gap-3 group"><div className="p-2 bg-slate-800 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition"><Phone size={16} /></div><span>(0761) 123456</span></div>
          <div className="flex items-center gap-3 group"><div className="p-2 bg-slate-800 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition"><Mail size={16} /></div><span>info@sman2koto.sch.id</span></div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-white mb-6">Tautan</h3>
        <ul className="space-y-3 text-sm text-slate-400">
          <li><button onClick={() => navigateTo('profil')} className="hover:text-orange-400 transition flex items-center gap-2"><ChevronRight size={14} /> Visi & Misi</button></li>
          <li><button onClick={() => navigateTo('galeri')} className="hover:text-orange-400 transition flex items-center gap-2"><ChevronRight size={14} /> Galeri Foto</button></li>
          <li><button onClick={() => navigateTo('berita')} className="hover:text-orange-400 transition flex items-center gap-2"><ChevronRight size={14} /> Berita Terbaru</button></li>
        </ul>
      </div>
      <div>
         <h3 className="text-lg font-bold text-white mb-6">Jam Operasional</h3>
         <div className="space-y-2 text-sm text-slate-400">
           <div className="flex justify-between border-b border-slate-800 pb-2"><span>Senin - Kamis</span><span className="text-white">07:00 - 16:00</span></div>
           <div className="flex justify-between border-b border-slate-800 pb-2"><span>Jumat</span><span className="text-white">07:00 - 11:30</span></div>
           <div className="flex justify-between"><span>Sabtu - Minggu</span><span className="text-orange-400">Libur</span></div>
         </div>
      </div>
    </div>
    <div className="mt-16 text-center text-slate-600 text-xs border-t border-slate-800 pt-8">&copy; 2026 SMAN 2 Koto Kampar Hulu. All rights reserved.</div>
  </footer>
);

// --- VIEW COMPONENTS ---

const EkstrakurikulerView = () => {
    return (
        <div className="bg-stone-50 min-h-screen pt-24 pb-12 animate-fade-in-up">
            <SEO 
                title="Ekstrakurikuler" 
                description="Daftar kegiatan ekstrakurikuler SMAN 2 Koto Kampar Hulu. Pramuka, Paskibra, Rohis, Olahraga, dan Seni untuk pengembangan bakat siswa."
                keywords="Ekstrakurikuler SMAN 2, Eskul Sekolah, Bakat Minat Siswa, Pengembangan Diri"
            />
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <span className="text-orange-500 font-bold tracking-widest text-sm uppercase">Pengembangan Diri</span>
                    <h2 className="text-4xl font-extrabold text-slate-800 mt-2 mb-4">Ekstrakurikuler</h2>
                    <p className="text-slate-500">Wadah bagi siswa untuk mengembangkan minat, bakat, dan potensi diri di luar kegiatan akademik.</p>
                    <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto mt-6 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: "Pramuka", category: "Wajib", desc: "Membentuk karakter, kedisiplinan, dan jiwa kepemimpinan melalui kegiatan kepramukaan.", icon: Flag, color: "text-amber-600", bg: "bg-amber-100" },
                        { title: "PMR", category: "Kemanusiaan", desc: "Melatih keterampilan pertolongan pertama dan kepedulian sosial.", icon: HeartPulse, color: "text-red-500", bg: "bg-red-100" },
                        { title: "Paskibra", category: "Kedisiplinan", desc: "Pasukan Pengibar Bendera yang melatih baris-berbaris dan patriotisme.", icon: Flag, color: "text-slate-700", bg: "bg-slate-200" },
                        { title: "Rohis", category: "Keagamaan", desc: "Memperdalam ilmu agama Islam dan kegiatan sosial keagamaan.", icon: Star, color: "text-green-600", bg: "bg-green-100" },
                        { title: "Futsal & Basket", category: "Olahraga", desc: "Mengembangkan bakat olahraga dan sportivitas tim.", icon: Trophy, color: "text-blue-500", bg: "bg-blue-100" },
                        { title: "Seni Tari & Musik", category: "Kesenian", desc: "Melestarikan budaya tradisional dan seni modern.", icon: Music, color: "text-purple-500", bg: "bg-purple-100" },
                        { title: "KIR", category: "Akademik", desc: "Mengasah kemampuan berpikir kritis dan penelitian ilmiah.", icon: Beaker, color: "text-teal-500", bg: "bg-teal-100" },
                        { title: "English Club", category: "Bahasa", desc: "Meningkatkan kemampuan berbahasa Inggris melalui debat dan speech.", icon: Target, color: "text-pink-500", bg: "bg-pink-100" }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                            <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <item.icon size={28} />
                            </div>
                            <div className="mb-2">
                                <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600">{item.category}</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const KalenderView = ({ events, loading }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // SEO for Calendar
  const seoDescription = `Jadwal Akademik SMAN 2 Koto Kampar Hulu Bulan ${currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}. Informasi ujian, libur sekolah, dan pembagian rapor.`;

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth); // 0 (Sun) - 6 (Sat)

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  // Filter events for current month
  const monthEvents = events.filter(e => {
    const eDate = new Date(e.date); // e.date format 'YYYY-MM-DD'
    return eDate.getMonth() === currentMonth && eDate.getFullYear() === currentYear;
  });

  const getEventForDay = (day) => {
    return monthEvents.filter(e => new Date(e.date).getDate() === day);
  };

  const getCategoryColor = (cat) => {
    switch(cat) {
        case 'Libur': return 'bg-red-500';
        case 'Ujian': return 'bg-yellow-500';
        case 'Rapor': return 'bg-blue-500';
        default: return 'bg-green-500';
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen pt-24 pb-12 animate-fade-in-up">
      <SEO 
        title="Agenda Akademik" 
        description={seoDescription}
        keywords="Kalender Pendidikan, Jadwal Ujian Sekolah, Libur Sekolah Riau, Agenda SMAN 2"
      />
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-slate-800 mb-4">Kalender Akademik</h2>
            <p className="text-slate-500">Jadwal kegiatan akademik, ujian, dan hari libur sekolah.</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Kegiatan Umum</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Ujian</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Rapor</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Libur</div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            {/* Calendar Header */}
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 rounded-full transition"><ChevronLeft /></button>
                <h3 className="text-2xl font-bold">{monthNames[currentMonth]} {currentYear}</h3>
                <button onClick={handleNextMonth} className="p-2 hover:bg-white/10 rounded-full transition"><ChevronRight /></button>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
                <div className="grid grid-cols-7 gap-2 mb-2 text-center font-bold text-slate-400 text-sm">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {/* Empty slots for previous month */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-24 md:h-32 bg-slate-50/50 rounded-xl"></div>
                    ))}

                    {/* Days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dayEvents = getEventForDay(day);
                        const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();

                        return (
                            <div key={day} className={`h-24 md:h-32 border border-slate-100 rounded-xl p-2 relative hover:bg-slate-50 transition overflow-hidden group ${isToday ? 'bg-orange-50 border-orange-200' : ''}`}>
                                <span className={`text-sm font-bold ${isToday ? 'text-orange-600' : 'text-slate-700'}`}>{day}</span>
                                <div className="mt-1 space-y-1">
                                    {dayEvents.map((ev, idx) => (
                                        <div key={idx} className={`text-[10px] md:text-xs text-white px-2 py-1 rounded truncate ${getCategoryColor(ev.category)} shadow-sm`}>
                                            {ev.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* Upcoming Events List */}
        <div className="mt-12 max-w-2xl mx-auto">
            <h4 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-2"><Calendar className="text-orange-500" size={24}/> Agenda Mendatang</h4>
            <div className="space-y-4">
                {events
                    .filter(e => new Date(e.date) >= new Date()) // Future events
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 5) // Take top 5
                    .map(item => (
                    <div key={item.id} className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center text-white font-bold shrink-0 ${getCategoryColor(item.category)}`}>
                            <span className="text-xs opacity-80">{new Date(item.date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-2xl">{new Date(item.date).getDate()}</span>
                        </div>
                        <div>
                            <h5 className="font-bold text-slate-800">{item.title}</h5>
                            <p className="text-slate-500 text-sm">{item.category} • {new Date(item.date).getFullYear()}</p>
                        </div>
                    </div>
                ))}
                {events.filter(e => new Date(e.date) >= new Date()).length === 0 && (
                    <p className="text-slate-400 text-center italic">Tidak ada agenda mendatang.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

const HomeView = ({ navigateTo, news, loading }) => (
  <div className="bg-stone-50 min-h-screen">
    <SEO 
        title="Beranda" 
        description="Selamat datang di Website Resmi SMAN 2 Koto Kampar Hulu. Membangun generasi unggul, kreatif, dan berakhlak mulia di era digital."
        keywords="SMAN 2 Koto Kampar Hulu, Sekolah Unggulan Riau, SMA Negeri Terbaik, Pendidikan Berkarakter"
    />
    <SchemaOrg />
    <div className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 z-0"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
           <img loading="lazy" src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Background Sekolah" className="w-full h-full object-cover" />
      </div>
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto perspective-1000">
        <div className="mb-6 inline-block animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <span className="bg-white/10 backdrop-blur-md border border-white/20 text-orange-200 px-6 py-2 rounded-full text-sm font-medium tracking-wide shadow-xl">
             ✨ Selamat Datang di Website Resmi
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight text-white drop-shadow-lg animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          SMAN 2 <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-200">Koto Kampar Hulu</span>
        </h1>
        <p className="text-lg md:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          Ruang tumbuh bagi generasi <span className="font-semibold text-white">Unggul</span>, <span className="font-semibold text-white">Kreatif</span>, dan <span className="font-semibold text-white">Berakhlak Mulia</span> di era digital.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <button onClick={() => navigateTo('profil')} className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-orange-500/30 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
            Jelajahi Profil <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={() => navigateTo('berita')} className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105">
            Lihat Berita
          </button>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1"><div className="w-1 h-2 bg-white rounded-full"></div></div>
      </div>
    </div>

    <div className="relative z-20 -mt-24 pb-20">
      <div className="container mx-auto px-6">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Users, val: '500+', label: 'Siswa Aktif', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: User, val: '45', label: 'Guru & Staff', color: 'text-orange-500', bg: 'bg-orange-50' },
              { icon: BookOpen, val: '18', label: 'Ekstrakurikuler', color: 'text-purple-500', bg: 'bg-purple-50' },
              { icon: Award, val: 'A', label: 'Akreditasi', color: 'text-emerald-500', bg: 'bg-emerald-50' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 flex flex-col items-center text-center group">
                 <div className={`w-16 h-16 ${stat.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon size={32} className={stat.color} />
                 </div>
                 <h3 className="text-3xl font-extrabold text-slate-800 mb-1">{stat.val}</h3>
                 <p className="text-slate-500 font-medium">{stat.label}</p>
              </div>
            ))}
         </div>
      </div>
    </div>

    <div className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-5/12 relative group perspective-1000">
             <div className="absolute -inset-4 bg-orange-100 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition duration-500"></div>
             <div className="relative transform transition-all duration-500 rotate-2 group-hover:rotate-0 shadow-2xl rounded-2xl overflow-hidden border-4 border-white">
               <img loading="lazy" src="https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Kepala Sekolah" className="w-full h-auto object-cover" />
               <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                  <h4 className="text-xl font-bold">Drs. Nama Kepala Sekolah</h4>
                  <p className="text-orange-300 text-sm">Kepala Sekolah</p>
               </div>
             </div>
          </div>
          <div className="md:w-7/12">
            <span className="inline-block py-1 px-3 rounded-md bg-orange-100 text-orange-600 text-xs font-bold tracking-wider uppercase mb-4">Kata Sambutan</span>
            <h2 className="text-4xl font-bold text-slate-800 mb-6 leading-tight">Membangun Karakter,<br/>Mengukir Prestasi.</h2>
            <div className="prose prose-lg text-slate-600 mb-8">
               <p className="mb-4">"Assalamu’alaikum Warahmatullahi Wabarakatuh. Selamat datang di portal digital kami. Di era yang serba cepat ini, kami berkomitmen untuk tidak hanya mengejar keunggulan akademik, tetapi juga menanamkan nilai-nilai luhur."</p>
               <p>Kami percaya bahwa pendidikan adalah jembatan menuju masa depan yang gemilang. Mari bersinergi untuk kemajuan bersama.</p>
            </div>
            <button onClick={() => navigateTo('profil')} className="px-8 py-3 bg-slate-800 text-white rounded-full font-medium shadow-lg hover:bg-slate-900 transition flex items-center gap-2">Baca Selengkapnya <ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>

    <div className="py-24 bg-stone-50 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Kabar Terbaru</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Ikuti perkembangan terkini, prestasi siswa, dan agenda kegiatan sekolah.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? <p className="col-span-3 text-center text-slate-400">Memuat...</p> : news.length === 0 ? (
             <div className="col-span-3 text-center py-12 bg-white rounded-2xl shadow-sm border border-stone-100"><p className="text-slate-400">Belum ada berita yang dipublish.</p></div>
          ) : (
            news.slice(0, 3).map((item, index) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden card-3d-hover shadow-lg border border-slate-100 group flex flex-col h-full" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="h-56 overflow-hidden relative">
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition z-10"></div>
                  <img loading="lazy" src={item.imageUrl || "https://placehold.co/600x400/e2e8f0/475569?text=News"} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out" />
                  <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1"><Calendar size={12} className="text-orange-500" /> {item.date}</div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-orange-600 transition leading-snug">{item.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed" dangerouslySetInnerHTML={{__html: item.content?.replace(/<[^>]+>/g, '')}}></p>
                  <button onClick={() => navigateTo('berita')} className="text-orange-600 font-bold text-sm hover:text-orange-700 self-start flex items-center gap-1 group-btn">Baca Selengkapnya <ArrowRight size={16} className="transform group-btn-hover:translate-x-1 transition" /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>

    {/* NEW: Contact Section embedded in Home */}
    <div className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
           <span className="text-orange-500 font-bold tracking-widest text-sm uppercase">Hubungi Kami</span>
           <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mt-2 mb-6">Informasi & Lokasi</h2>
           <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Cards */}
            <div className="space-y-6">
                <div className="bg-stone-50 p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:-translate-y-1 transition duration-300">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0"><MapPin size={24} /></div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 mb-1">Alamat</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">Jl. Pendidikan No. 1, Koto Kampar Hulu, Riau, Indonesia</p>
                    </div>
                </div>
                <div className="bg-stone-50 p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:-translate-y-1 transition duration-300">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0"><Phone size={24} /></div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 mb-1">Telepon</h3>
                        <p className="text-slate-600 text-sm">(0761) 123456</p>
                        <p className="text-slate-400 text-xs mt-1">Senin - Jumat, 08:00 - 15:00</p>
                    </div>
                </div>
                <div className="bg-stone-50 p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:-translate-y-1 transition duration-300">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0"><Mail size={24} /></div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 mb-1">Email</h3>
                        <p className="text-slate-600 text-sm">info@sman2koto.sch.id</p>
                        <p className="text-slate-600 text-sm">admin@sman2koto.sch.id</p>
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-2 bg-stone-50 p-2 rounded-3xl shadow-lg border border-slate-200">
                <div className="w-full h-[400px] bg-slate-200 rounded-2xl overflow-hidden relative">
                    <iframe 
                        title="Google Maps"
                        src="https://maps.google.com/maps?q=SMAN+2+Koto+Kampar+Hulu&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                        width="100%" 
                        height="100%" 
                        style={{border:0}} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
);

const ProfilView = ({ navigateTo, teachers }) => (
  <div className="bg-stone-50 min-h-screen pt-24 pb-12 animate-fade-in-up">
    <SEO 
        title="Profil Sekolah" 
        description="Profil lengkap SMAN 2 Koto Kampar Hulu. Sejarah singkat, visi misi, struktur organisasi, data guru, dan fasilitas sekolah."
        keywords="Profil SMAN 2, Sejarah Sekolah, Visi Misi SMAN 2, Guru SMAN 2 Koto Kampar Hulu"
    />
    <div className="container mx-auto px-6">
      <div className="text-center max-w-3xl mx-auto mb-16">
         <span className="text-orange-500 font-bold tracking-widest text-sm uppercase">Tentang Kami</span>
         <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mt-2 mb-6">Mengenal Lebih Dekat</h2>
         <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
      </div>
      
      {/* Content Center */}
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Sambutan Kepala Sekolah */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100" id="sambutan">
           <div className="bg-slate-800 p-1"></div>
           <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3 flex-shrink-0">
                 <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-slate-50">
                    <img loading="lazy"
                      src="https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                      alt="Kepala Sekolah" 
                      className="w-full h-auto object-cover"
                    />
                 </div>
                 <div className="text-center mt-4">
                    <h4 className="font-bold text-slate-800 text-lg">Drs. H. Mulyadi, M.Pd</h4>
                    <p className="text-orange-600 text-sm font-medium">Kepala Sekolah</p>
                 </div>
              </div>
              <div className="flex-1">
                 <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-8 bg-orange-500 rounded-full"></span> Sambutan Kepala Sekolah
                 </h3>
                 <div className="prose prose-slate text-slate-600 leading-relaxed space-y-4">
                    <p>"Assalamu’alaikum Warahmatullahi Wabarakatuh.</p>
                    <p>Puji syukur kita panjatkan kehadirat Allah SWT atas segala limpahan rahmat dan karunia-Nya. Selamat datang di website resmi SMAN 2 Koto Kampar Hulu. Website ini hadir sebagai wujud komitmen kami dalam keterbukaan informasi publik dan sebagai sarana komunikasi antara sekolah dengan masyarakat luas.</p>
                    <p>Di era digital 4.0 ini, penguasaan teknologi informasi sangatlah penting. Kami bertekad untuk terus meningkatkan mutu pendidikan yang tidak hanya unggul dalam akademik, tetapi juga membentuk karakter peserta didik yang berakhlak mulia, disiplin, dan cinta tanah air."</p>
                    <p className="font-bold text-slate-800 mt-4">Wassalamu’alaikum Warahmatullahi Wabarakatuh.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Sejarah Singkat */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100" id="sejarah">
           <div className="bg-blue-600 p-1"></div>
           <div className="p-10">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600"><Clock size={24} /></div>
                 <h3 className="text-3xl font-bold text-slate-800">Sejarah Singkat</h3>
              </div>
              <div className="prose prose-slate text-slate-600 max-w-none">
                 <p>SMAN 2 Koto Kampar Hulu berdiri pada tahun 2005 sebagai respon atas tingginya minat masyarakat Koto Kampar Hulu terhadap pendidikan menengah atas. Awalnya, sekolah ini menumpang di gedung SMPN 1 sebelum akhirnya memiliki gedung sendiri pada tahun 2007 di lahan seluas 2 hektar yang merupakan hibah dari tokoh masyarakat setempat.</p>
                 <p>Seiring berjalannya waktu, SMAN 2 Koto Kampar Hulu terus berkembang baik dari segi fisik bangunan maupun prestasi siswanya. Berbagai penghargaan tingkat kabupaten hingga provinsi telah diraih, membuktikan dedikasi para guru dan semangat belajar siswa. Kini, sekolah ini telah menjadi salah satu sekolah rujukan di Kabupaten Kampar dengan fasilitas yang memadai dan lingkungan belajar yang asri.</p>
              </div>
           </div>
        </div>

        {/* Visi Misi */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100" id="visimisi">
           <div className="bg-orange-500 p-1"></div>
           <div className="p-10">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600"><Award size={24} /></div>
                 <h3 className="text-3xl font-bold text-slate-800">Visi & Misi</h3>
              </div>
              <div className="space-y-8">
                 <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 relative">
                    <div className="absolute -top-3 -left-3 text-6xl text-orange-200 opacity-50 font-serif">"</div>
                    <h4 className="font-bold text-slate-800 text-lg mb-3">Visi Sekolah</h4>
                    <p className="text-xl text-slate-600 italic font-serif leading-relaxed">"Terwujudnya Peserta Didik yang Beriman, Cerdas, Terampil, Mandiri, dan Berwawasan Lingkungan."</p>
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2"><span className="w-2 h-6 bg-orange-500 rounded-full"></span> Misi Utama</h4>
                    <ul className="grid gap-4">
                       {['Meningkatkan keimanan dan ketaqwaan kepada Tuhan Yang Maha Esa.', 'Melaksanakan pembelajaran dan bimbingan secara efektif dan efisien berbasis teknologi.', 'Menumbuhkan semangat keunggulan secara intensif kepada seluruh warga sekolah.', 'Mendorong dan membantu setiap siswa untuk mengenali potensi dirinya.'].map((misi, i) => (
                          <li key={i} className="flex gap-4 items-start p-4 hover:bg-slate-50 rounded-xl transition cursor-default">
                             <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i+1}</div>
                             <span className="text-slate-600 leading-relaxed">{misi}</span>
                          </li>
                       ))}
                    </ul>
                 </div>
              </div>
           </div>
        </div>

        {/* Struktur Organisasi */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100" id="struktur">
           <div className="bg-green-600 p-1"></div>
           <div className="p-10">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600"><Users size={24} /></div>
                 <h3 className="text-3xl font-bold text-slate-800">Struktur Organisasi</h3>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300 text-center">
                 <p className="text-slate-500 italic mb-4">Bagan Struktur Organisasi SMAN 2 Koto Kampar Hulu</p>
                 <div className="bg-white p-4 rounded-xl shadow-sm inline-block max-w-full">
                    <div className="flex flex-col items-center gap-4">
                        <div className="border-2 border-slate-800 p-3 rounded-lg bg-white w-48 font-bold text-slate-800 shadow-md">Kepala Sekolah</div>
                        <div className="h-8 w-px bg-slate-400"></div>
                        <div className="border-2 border-slate-600 p-2 rounded-lg bg-white w-40 text-sm font-bold text-slate-700 shadow-sm">Komite Sekolah</div>
                        <div className="h-8 w-px bg-slate-400"></div>
                        <div className="flex gap-4 flex-wrap justify-center">
                            <div className="border border-slate-400 p-2 rounded bg-white w-32 text-xs font-medium shadow-sm">Waka Kurikulum</div>
                            <div className="border border-slate-400 p-2 rounded bg-white w-32 text-xs font-medium shadow-sm">Waka Kesiswaan</div>
                            <div className="border border-slate-400 p-2 rounded bg-white w-32 text-xs font-medium shadow-sm">Waka Sarpras</div>
                            <div className="border border-slate-400 p-2 rounded bg-white w-32 text-xs font-medium shadow-sm">Waka Humas</div>
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Guru & Staf (Dynamic Section) */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100" id="guru">
           <div className="bg-indigo-600 p-1"></div>
           <div className="p-10">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600"><GraduationCap size={24} /></div>
                 <h3 className="text-3xl font-bold text-slate-800">Guru & Staf</h3>
              </div>
              
              {!teachers || teachers.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <p className="text-slate-500">Data guru belum ditambahkan.</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {teachers.map((teacher, idx) => (
                          <div key={teacher.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                              <div className="h-64 overflow-hidden relative bg-slate-100">
                                  <img loading="lazy"
                                    src={teacher.imageUrl || "https://placehold.co/400x400/e2e8f0/475569?text=Guru"} 
                                    alt={teacher.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                              </div>
                              <div className="p-5">
                                  <h4 className="font-bold text-lg text-slate-800 mb-1">{teacher.name}</h4>
                                  <p className="text-indigo-600 text-sm font-medium mb-2">{teacher.position}</p>
                                  {teacher.nip && <p className="text-slate-400 text-xs">NIP. {teacher.nip}</p>}
                              </div>
                          </div>
                      ))}
                  </div>
              )}
           </div>
        </div>

        {/* Fasilitas */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100" id="fasilitas">
           <div className="bg-purple-600 p-1"></div>
           <div className="p-10">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600"><ImageIcon size={24} /></div>
                 <h3 className="text-3xl font-bold text-slate-800">Fasilitas Sekolah</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[
                    { name: "Ruang Kelas AC", desc: "Kelas nyaman dilengkapi pendingin ruangan dan proyektor.", icon: <Monitor className="text-blue-500" /> },
                    { name: "Laboratorium Komputer", desc: "40 Unit komputer terbaru dengan akses internet cepat.", icon: <Monitor className="text-purple-500" /> },
                    { name: "Perpustakaan Digital", desc: "Koleksi buku lengkap dan akses e-book.", icon: <BookOpen className="text-orange-500" /> },
                    { name: "Laboratorium IPA", desc: "Fasilitas lengkap untuk praktikum Fisika, Kimia, Biologi.", icon: <Beaker className="text-green-500" /> },
                    { name: "Musholla", desc: "Tempat ibadah yang bersih dan nyaman.", icon: <Star className="text-yellow-500" /> },
                    { name: "Kantin Sehat", desc: "Menyediakan makanan higienis dan bergizi.", icon: <Coffee className="text-red-500" /> },
                    { name: "UKS", desc: "Unit Kesehatan Sekolah dengan perlengkapan P3K lengkap.", icon: <HeartPulse className="text-pink-500" /> }
                 ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition border border-slate-100 hover:border-slate-200">
                       <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-100">{item.icon}</div>
                       <div>
                          <h4 className="font-bold text-slate-800">{item.name}</h4>
                          <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  </div>
);

const KontakView = () => (
    <div className="bg-stone-50 min-h-screen pt-24 pb-12 animate-fade-in-up">
      <SEO 
        title="Hubungi Kami" 
        description="Kontak dan lokasi SMAN 2 Koto Kampar Hulu. Hubungi kami melalui telepon, email, atau kunjungi langsung di Jl. Pendidikan No. 1."
        keywords="Kontak SMAN 2, Alamat SMAN 2, Telepon Sekolah, Email Sekolah"
      />
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
           <span className="text-orange-500 font-bold tracking-widest text-sm uppercase">Hubungi Kami</span>
           <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mt-2 mb-6">Informasi & Lokasi</h2>
           <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Cards */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex items-start gap-4 hover:-translate-y-1 transition duration-300">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0"><MapPin size={24} /></div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 mb-1">Alamat</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">Jl. Pendidikan No. 1, Koto Kampar Hulu, Riau, Indonesia</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex items-start gap-4 hover:-translate-y-1 transition duration-300">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0"><Phone size={24} /></div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 mb-1">Telepon</h3>
                        <p className="text-slate-600 text-sm">(0761) 123456</p>
                        <p className="text-slate-400 text-xs mt-1">Senin - Jumat, 08:00 - 15:00</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 flex items-start gap-4 hover:-translate-y-1 transition duration-300">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0"><Mail size={24} /></div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 mb-1">Email</h3>
                        <p className="text-slate-600 text-sm">info@sman2koto.sch.id</p>
                        <p className="text-slate-600 text-sm">admin@sman2koto.sch.id</p>
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-2 bg-white p-2 rounded-3xl shadow-lg border border-slate-200">
                <div className="w-full h-[400px] bg-slate-100 rounded-2xl overflow-hidden relative">
                    <iframe 
                        title="Google Maps"
                        src="https://maps.google.com/maps?q=SMAN+2+Koto+Kampar+Hulu&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                        width="100%" 
                        height="100%" 
                        style={{border:0}} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
      </div>
    </div>
);

// Updated BeritaView Component with Search Filter, Modal, & Load More
const BeritaView = ({ news, loading }) => {
  const [selectedNews, setSelectedNews] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(6); // Default show 6 items

  // Search Filtering Logic
  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6); // Load 6 more
  };

  return (
    <div className="bg-stone-50 min-h-screen pt-24 pb-12 animate-fade-in-up">
      <SEO 
        title="Beranda Berita" 
        description="Berita dan artikel terbaru dari SMAN 2 Koto Kampar Hulu. Prestasi siswa, pengumuman sekolah, dan kegiatan terbaru."
        keywords="Berita Sekolah, Artikel Pendidikan, Prestasi Siswa, Pengumuman SMAN 2"
      />
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-slate-200 pb-6">
           <div><h2 className="text-4xl font-extrabold text-slate-800 mb-2">Papan Informasi</h2><p className="text-slate-500">Berita, artikel, dan pengumuman sekolah.</p></div>
           <div className="mt-4 md:mt-0 flex gap-2 relative w-full md:w-64">
             <input 
                type="text" 
                placeholder="Cari berita..." 
                className="pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-orange-500 text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {loading ? <div className="col-span-full py-20 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500"></div></div> : filteredNews.length === 0 ? <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-slate-300"><p className="text-slate-400">Tidak ada berita yang ditemukan untuk "{searchTerm}".</p></div> : (
             filteredNews.slice(0, visibleCount).map((item, idx) => (
                <article key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-slate-100" style={{animationDelay: `${idx * 0.05}s`}}>
                  <div className="h-60 bg-slate-200 overflow-hidden relative cursor-pointer" onClick={() => setSelectedNews(item)}>
                    <img loading="lazy" src={item.imageUrl || "https://placehold.co/600x400/e2e8f0/475569?text=News"} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-in-out" />
                    <div className="absolute top-0 right-0 m-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">{item.date}</div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 onClick={() => setSelectedNews(item)} className="text-xl font-bold text-slate-800 mb-3 group-hover:text-orange-600 transition cursor-pointer leading-tight">{item.title}</h3>
                    <div className="text-slate-500 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed" dangerouslySetInnerHTML={{__html: item.content?.replace(/<[^>]+>/g, '')}}></div>
                    <div className="pt-4 border-t border-slate-100 mt-auto flex justify-between items-center">
                        <button onClick={() => setSelectedNews(item)} className="text-orange-600 font-bold text-sm hover:underline">Baca Selengkapnya</button>
                        <span className="text-slate-400 text-xs flex items-center gap-1"><User size={12}/> {item.author || 'Admin'}</span>
                    </div>
                  </div>
                </article>
             ))
           )}
        </div>
        
        {/* Load More Button */}
        {!loading && visibleCount < filteredNews.length && (
            <div className="text-center mt-12">
                <button onClick={handleLoadMore} className="bg-white border border-slate-200 text-slate-600 font-bold py-3 px-8 rounded-full shadow-sm hover:bg-slate-50 hover:text-orange-600 transition-all transform hover:-translate-y-1">
                    Muat Lebih Banyak Berita
                </button>
            </div>
        )}
      </div>

      {/* Modal Overlay for News Detail */}
      {selectedNews && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up" onClick={() => setSelectedNews(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedNews(null)} className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md hover:bg-red-100 hover:text-red-600 rounded-full transition z-10 shadow-sm">
              <X size={24} />
            </button>
            
            <div className="relative h-64 md:h-80">
               <img loading="lazy" src={selectedNews.imageUrl || "https://placehold.co/600x400/e2e8f0/475569?text=News"} alt={selectedNews.title} className="w-full h-full object-cover" />
               <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-6 pt-24">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block shadow-sm">{selectedNews.category || 'Umum'}</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight drop-shadow-md">{selectedNews.title}</h2>
               </div>
            </div>

            <div className="p-6 md:p-10">
               <div className="flex items-center gap-6 text-sm text-slate-500 mb-8 border-b border-slate-100 pb-6">
                  <div className="flex items-center gap-2"><Calendar size={18} className="text-orange-500"/> {selectedNews.date}</div>
                  <div className="flex items-center gap-2"><User size={18} className="text-orange-500"/> {selectedNews.author || 'Admin'}</div>
               </div>
               
               <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base md:text-lg" dangerouslySetInnerHTML={{__html: selectedNews.content}}></div>
               
               <div className="mt-10 pt-6 border-t border-slate-100 text-center">
                  <button onClick={() => setSelectedNews(null)} className="px-6 py-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition font-bold text-sm">Tutup Berita</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const GaleriView = ({ gallery, loading }) => {
  const [visibleCount, setVisibleCount] = useState(8); // Default show 8 items

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8); // Load 8 more
  };

  return (
    <div className="bg-stone-50 min-h-screen pt-24 pb-12 animate-fade-in-up">
      <SEO 
        title="Galeri Foto" 
        description="Koleksi foto kegiatan dan dokumentasi SMAN 2 Koto Kampar Hulu. Momen berharga siswa dan guru dalam berbagai acara."
        keywords="Galeri Sekolah, Foto Kegiatan, Dokumentasi SMAN 2, Album Sekolah"
      />
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-slate-800 mb-4">Galeri Sekolah</h2>
            <p className="text-slate-500">Momen-momen berharga dalam lensa, didokumentasikan untuk kenangan.</p>
            <div className="w-24 h-1 bg-orange-500 mx-auto mt-6 rounded-full"></div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500"></div></div>
        ) : gallery.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-slate-300"><p className="text-slate-400">Belum ada foto galeri.</p></div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {gallery.slice(0, visibleCount).map((item, index) => (
                <div key={item.id} className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 aspect-square cursor-pointer" style={{animationDelay: `${index * 0.05}s`}}>
                  <img loading="lazy"
                    src={item.imageUrl || `https://placehold.co/400x400/e2e8f0/475569?text=Foto`} 
                    alt={item.caption || "Foto Sekolah"} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-in-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-6">
                    <p className="text-white font-medium text-sm md:text-base translate-y-4 group-hover:translate-y-0 transition duration-300 line-clamp-2">
                      {item.caption || "Kegiatan Sekolah"}
                    </p>
                    <span className="text-orange-300 text-xs mt-1 translate-y-4 group-hover:translate-y-0 transition duration-300 delay-75">
                        {item.date}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition duration-300 delay-100">
                      <PlusCircle size={20} />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More Button */}
            {visibleCount < gallery.length && (
                <div className="text-center mt-12">
                    <button onClick={handleLoadMore} className="bg-white border border-slate-200 text-slate-600 font-bold py-3 px-8 rounded-full shadow-sm hover:bg-slate-50 hover:text-orange-600 transition-all transform hover:-translate-y-1">
                        Lihat Lebih Banyak Foto
                    </button>
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const LayananView = () => (
    <div className="bg-stone-50 min-h-screen pt-24 pb-12 animate-fade-in-up">
      <SEO 
        title="Layanan Digital" 
        description="Portal layanan digital SMAN 2 Koto Kampar Hulu. Akses PPDB Online, E-Learning, Perpustakaan Digital, dan Jaringan Alumni."
        keywords="Layanan Sekolah, PPDB Online, E-Learning, Perpustakaan Digital, Alumni SMAN 2"
      />
      <div className="container mx-auto px-6 max-w-5xl">
         <div className="text-center mb-16"><h2 className="text-4xl font-extrabold text-slate-800 mb-4">Layanan Digital</h2><p className="text-slate-500">Akses mudah ke berbagai sistem informasi sekolah.</p></div>
         <div className="grid md:grid-cols-2 gap-8">
            {[
                { title: "PPDB Online", desc: "Sistem pendaftaran peserta didik baru yang transparan dan mudah.", icon: User, color: "text-blue-500", bg: "bg-blue-50" },
                { title: "E-Learning", desc: "Platform pembelajaran jarak jauh untuk mendukung KBM digital.", icon: BookOpen, color: "text-green-500", bg: "bg-green-50" },
                { title: "Perpustakaan", desc: "Katalog buku digital dan reservasi peminjaman buku.", icon: BookOpen, color: "text-orange-500", bg: "bg-orange-50" },
                { title: "Alumni Network", desc: "Terhubung kembali dengan rekan seangkatan dan sekolah.", icon: Users, color: "text-purple-500", bg: "bg-purple-50" }
            ].map((service, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-orange-200 shadow-lg hover:shadow-2xl transition-all duration-300 group flex gap-6 items-start">
                   <div className={`w-14 h-14 ${service.bg} ${service.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}><service.icon size={28} /></div>
                   <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition">{service.title}</h3>
                      <p className="text-slate-500 mb-4 leading-relaxed text-sm">{service.desc}</p>
                      <button className="text-slate-800 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">Akses Layanan <ArrowRight size={14} className="text-orange-500" /></button>
                   </div>
                </div>
            ))}
         </div>
      </div>
    </div>
);

const LoginView = ({ navigateTo, handleLogin }) => (
  <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 pt-20">
    <SEO title="Login Admin" description="Halaman login administrator website sekolah." />
    <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-red-500"></div>
      <div className="text-center mb-10">
         <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-slate-100 mx-auto mb-6 shadow-xl p-2">
            <img src="https://cdn-icons-png.flaticon.com/512/3281/3281329.png" alt="Logo" className="w-full h-full object-contain" />
         </div>
         <h2 className="text-3xl font-extrabold text-slate-800">Selamat Datang</h2>
         <p className="text-slate-400 mt-2">Silakan login untuk mengakses dashboard admin.</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-6">
        <div><label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label><input type="email" name="email" placeholder="admin@sekolah.id" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" required /></div>
        <div><label className="block text-sm font-bold text-slate-700 mb-2">Password</label><input type="password" name="password" placeholder="••••••••" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" required /></div>
        <button type="submit" className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-900 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">Masuk Dashboard</button>
      </form>
      <div className="mt-8 text-center"><button onClick={() => navigateTo('home')} className="text-sm text-slate-500 hover:text-orange-600 font-medium transition">&larr; Kembali ke Beranda</button></div>
    </div>
  </div>
);

// --- MAIN APP ---

export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [news, setNews] = useState([]);
  const [gallery, setGallery] = useState([]); 
  const [teachers, setTeachers] = useState([]); 
  const [events, setEvents] = useState([]); // State for events
  const [loading, setLoading] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pendingScrollId, setPendingScrollId] = useState(null);

  // --- Auth & Data Fetching ---
  useEffect(() => {
    // Inisialisasi Auth: Cek user, jika tidak ada, login anonymous
    const initAuth = async () => {
        if (!auth) return; // Guard clause if firebase not inited
        if (auth.currentUser) return; // Jika sudah ada user, skip

        try {
            // Cek apakah ada token custom (dari Canvas Preview)
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                await signInWithCustomToken(auth, __initial_auth_token);
            } else {
                // Di Vercel/Local, kita tidak otomatis login anonymous agar flow login admin bersih
                // Tapi untuk akses data publik (read-only), kita login anonymous jika belum login
                // Logic ini dipindahkan ke onAuthStateChanged
            }
        } catch (error) {
            console.error("Auth init error:", error);
        }
    };
    initAuth();

    // Listener Status Login
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        
        // LOGIKA ADMIN: Cek apakah user login via email (bukan anonymous)
        if (currentUser && !currentUser.isAnonymous && currentUser.email) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
            // Jika tidak ada user sama sekali, login sebagai tamu (anonymous) untuk baca data
            if (!currentUser) {
                try {
                    await signInAnonymously(auth);
                } catch (err) {
                    console.error("Anonymous login fail:", err);
                }
            }
        }
    });

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    return () => {
      unsubscribeAuth();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fetch News Data
  useEffect(() => {
    if (!user || !db) return;
    const newsRef = collection(db, 'artifacts', appId, 'public', 'data', 'news');
    const unsubscribeNews = onSnapshot(newsRef, (snapshot) => {
      const newsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      newsData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setNews(newsData);
      setLoading(false);
    });
    return () => unsubscribeNews();
  }, [user]);

  // Fetch Gallery Data
  useEffect(() => {
    if (!user || !db) return;
    const galleryRef = collection(db, 'artifacts', appId, 'public', 'data', 'gallery');
    const unsubscribeGallery = onSnapshot(galleryRef, (snapshot) => {
      const galleryData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      galleryData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setGallery(galleryData);
      setLoadingGallery(false);
    });
    return () => unsubscribeGallery();
  }, [user]);

  // Fetch Teachers Data
  useEffect(() => {
    if (!user || !db) return;
    const teachersRef = collection(db, 'artifacts', appId, 'public', 'data', 'teachers');
    const unsubscribeTeachers = onSnapshot(teachersRef, (snapshot) => {
      const teachersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      teachersData.sort((a, b) => a.name.localeCompare(b.name));
      setTeachers(teachersData);
    });
    return () => unsubscribeTeachers();
  }, [user]);

  // Fetch Events Data (New)
  useEffect(() => {
    if (!user || !db) return;
    const eventsRef = collection(db, 'artifacts', appId, 'public', 'data', 'events');
    const unsubscribeEvents = onSnapshot(eventsRef, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by date ascending
      eventsData.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(eventsData);
    });
    return () => unsubscribeEvents();
  }, [user]);

  useEffect(() => {
    if (currentView === 'profil' && pendingScrollId) {
        setTimeout(() => {
            const element = document.getElementById(pendingScrollId);
            if (element) {
                const headerOffset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                setPendingScrollId(null);
            }
        }, 300);
    }
  }, [currentView, pendingScrollId]);

  const navigateTo = (view, scrollId = null) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setPendingScrollId(scrollId);
    if (view !== 'admin' && !scrollId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // UPDATED: Login menggunakan Firebase Auth (Backend)
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Jika sukses, onAuthStateChanged akan otomatis mendeteksi user dan set isAdmin(true)
        navigateTo('admin');
    } catch (error) {
        console.error("Login Error:", error);
        let msg = "Login Gagal.";
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') msg = "Email atau password salah.";
        if (error.code === 'auth/too-many-requests') msg = "Terlalu banyak percobaan. Coba lagi nanti.";
        alert(msg);
    }
  };

  // UPDATED: Logout menggunakan Firebase Auth
  const handleLogout = async () => {
    try {
        await signOut(auth);
        setIsAdmin(false);
        navigateTo('home');
        // Setelah logout, onAuthStateChanged akan trigger dan login-kan kembali sebagai Anonymous
    } catch (error) {
        console.error("Logout Error:", error);
    }
  };

  // --- ADMIN DASHBOARD ---
  const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('list');
    
    // News State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState('Kegiatan');
    const [author, setAuthor] = useState('Admin Sekolah');
    const [previewMode, setPreviewMode] = useState(false);
    const [newsUploadMode, setNewsUploadMode] = useState(false); 
    
    // Gallery State
    const [galleryImage, setGalleryImage] = useState('');
    const [galleryCaption, setGalleryCaption] = useState('');
    const [galleryUploadMode, setGalleryUploadMode] = useState(false); 

    // Teacher State
    const [teacherName, setTeacherName] = useState('');
    const [teacherNip, setTeacherNip] = useState('');
    const [teacherPosition, setTeacherPosition] = useState('');
    const [teacherImage, setTeacherImage] = useState('');
    const [teacherUploadMode, setTeacherUploadMode] = useState(false);

    // Event State (New)
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventCategory, setEventCategory] = useState('Kegiatan');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false); 
    const contentRef = useRef(null);

    // --- File Handler Logic (Storage + Base64 Fallback) ---
    const handleFileUpload = async (e, setUrl) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsUploading(true);

      try {
        const storageRef = ref(storage, `public/images/${Date.now()}_${file.name}`);
        const metadata = { contentType: file.type };
        const snapshot = await uploadBytes(storageRef, file, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setUrl(downloadURL);
      } catch (storageError) {
        console.warn("Firebase Storage upload failed, falling back to Base64:", storageError);
        
        if (file.size > 800 * 1024) {
          alert("Gagal upload ke Cloud & File terlalu besar untuk database (Maks 800KB).");
          setIsUploading(false);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          setUrl(e.target.result);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
        return; 
      }
      setIsUploading(false);
    };

    const handleAddNews = async (e) => {
      if (e) e.preventDefault();
      setIsSubmitting(true);
      if (!user) return;
      try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'news'), {
          title, content, imageUrl: imageUrl || "https://placehold.co/600x400/e2e8f0/475569?text=Berita",
          category, author,
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          createdAt: serverTimestamp()
        });
        resetForm();
        setActiveTab('list');
        alert('Berita berhasil dipublish!');
      } catch (error) {
        alert('Gagal menyimpan berita: ' + error.message);
      } finally { setIsSubmitting(false); }
    };

    const handleAddGallery = async (e) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        if (!user) return;
        try {
          await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'gallery'), {
            imageUrl: galleryImage,
            caption: galleryCaption,
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            createdAt: serverTimestamp()
          });
          setGalleryImage('');
          setGalleryCaption('');
          alert('Foto berhasil ditambahkan ke galeri!');
        } catch (error) {
          alert('Gagal menyimpan foto: ' + error.message);
        } finally { setIsSubmitting(false); }
    };

    const handleAddTeacher = async (e) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        if (!user) return;
        try {
          await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'teachers'), {
            name: teacherName,
            nip: teacherNip,
            position: teacherPosition,
            imageUrl: teacherImage || "https://placehold.co/400x400/e2e8f0/475569?text=Guru",
            createdAt: serverTimestamp()
          });
          setTeacherName(''); setTeacherNip(''); setTeacherPosition(''); setTeacherImage('');
          alert('Data guru berhasil ditambahkan!');
        } catch (error) {
          alert('Gagal menyimpan data guru: ' + error.message);
        } finally { setIsSubmitting(false); }
    };

    const handleAddEvent = async (e) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        if (!user) return;
        try {
            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'events'), {
                title: eventTitle,
                date: eventDate,
                category: eventCategory,
                createdAt: serverTimestamp()
            });
            setEventTitle(''); setEventDate('');
            alert('Agenda berhasil ditambahkan!');
        } catch (error) {
            alert('Gagal menyimpan agenda: ' + error.message);
        } finally { setIsSubmitting(false); }
    };

    const handleDeleteNews = async (id) => {
      if (confirm('Hapus berita ini?')) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'news', id));
    };

    const handleDeleteGallery = async (id) => {
        if (confirm('Hapus foto ini dari galeri?')) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'gallery', id));
    };

    const handleDeleteTeacher = async (id) => {
        if (confirm('Hapus data guru ini?')) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'teachers', id));
    };

    const handleDeleteEvent = async (id) => {
        if (confirm('Hapus agenda ini?')) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'events', id));
    };

    const resetForm = () => {
      setTitle(''); setContent(''); setImageUrl(''); setCategory('Kegiatan'); setPreviewMode(false);
      setNewsUploadMode(false);
    };

    const insertFormat = (tag) => {
      setContent(prev => prev + `<${tag}>teks...</${tag}> `);
    };

    return (
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
        <SEO title="Dashboard Admin" description="Halaman khusus administrator sekolah." />
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col flex-shrink-0 z-20 shadow-xl">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
             <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold">A</div>
             <span className="font-bold tracking-wide">Admin Panel</span>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <button onClick={() => setActiveTab('list')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'list' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
               <LayoutDashboard size={20} /> Dashboard Berita
            </button>
            <button onClick={() => { resetForm(); setActiveTab('editor'); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'editor' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
               <PlusCircle size={20} /> Tulis Berita
            </button>
            <button onClick={() => setActiveTab('gallery')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'gallery' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
               <ImageIcon size={20} /> Kelola Galeri
            </button>
            <button onClick={() => setActiveTab('teachers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'teachers' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
               <GraduationCap size={20} /> Kelola Guru
            </button>
            <button onClick={() => setActiveTab('agenda')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'agenda' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
               <Calendar size={20} /> Kelola Agenda
            </button>
          </nav>
          <div className="p-4 border-t border-slate-800">
             <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"><LogOut size={18}/> Logout</button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
             <h2 className="text-xl font-bold text-slate-800">
                {activeTab === 'list' ? 'Kelola Berita' : activeTab === 'gallery' ? 'Kelola Galeri' : activeTab === 'teachers' ? 'Kelola Data Guru' : activeTab === 'agenda' ? 'Kelola Agenda' : 'Editor Berita'}
             </h2>
             <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block"><p className="text-sm font-bold text-slate-800">Administrator</p><p className="text-xs text-slate-500">admin@sekolah.id</p></div>
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600"><User size={20}/></div>
             </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-stone-50">
            {/* LIST BERITA */}
            {activeTab === 'list' && (
              <div className="space-y-6 max-w-5xl mx-auto animate-fade-in-up">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"><div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><FileText size={24}/></div><div><h3 className="text-2xl font-bold">{news.length}</h3><p className="text-slate-500 text-sm">Total Berita</p></div></div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"><div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><ImageIcon size={24}/></div><div><h3 className="text-2xl font-bold">{gallery.length}</h3><p className="text-slate-500 text-sm">Foto Galeri</p></div></div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"><div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><Users size={24}/></div><div><h3 className="text-2xl font-bold">{teachers.length}</h3><p className="text-slate-500 text-sm">Total Guru</p></div></div>
                 </div>
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center"><h3 className="font-bold text-lg text-slate-800">Daftar Berita</h3><button onClick={() => setActiveTab('editor')} className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">Buat Baru</button></div>
                    <div className="divide-y divide-slate-100">
                       {loading ? <div className="p-8 text-center text-slate-400">Memuat data...</div> : news.length === 0 ? <div className="p-8 text-center text-slate-400">Belum ada data.</div> : (
                         news.map(item => (
                            <div key={item.id} className="p-4 hover:bg-slate-50 transition flex items-center gap-4 group">
                               <img src={item.imageUrl} className="w-16 h-16 rounded-lg object-cover bg-slate-200" alt="thumb"/>
                               <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1"><span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-700">{item.category || 'Umum'}</span><span className="text-xs text-slate-400">{item.date}</span></div>
                                  <h4 className="font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                                  <div className="text-xs text-slate-500 line-clamp-1" dangerouslySetInnerHTML={{__html: item.content?.replace(/<[^>]+>/g, '')}}></div>
                               </div>
                               <button onClick={() => handleDeleteNews(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={18}/></button>
                            </div>
                         ))
                       )}
                    </div>
                 </div>
              </div>
            )}

            {/* TEACHER MANAGER */}
            {activeTab === 'teachers' && (
                <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
                        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2"><PlusCircle size={20} className="text-orange-500"/> Tambah Data Guru</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap & Gelar</label>
                                    <input type="text" value={teacherName || ''} onChange={e => setTeacherName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Contoh: Drs. Budi Santoso, M.Pd" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Jabatan / Mapel</label>
                                        <input type="text" value={teacherPosition || ''} onChange={e => setTeacherPosition(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Guru Matematika" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">NIP (Opsional)</label>
                                        <input type="text" value={teacherNip || ''} onChange={e => setTeacherNip(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="198xxxx..." />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg w-fit mt-2">
                                    <button onClick={() => setTeacherUploadMode(false)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${!teacherUploadMode ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:bg-slate-200'}`}>Link URL</button>
                                    <button onClick={() => setTeacherUploadMode(true)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${teacherUploadMode ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:bg-slate-200'}`}>Upload Lokal</button>
                                </div>

                                <div>
                                    {teacherUploadMode ? (
                                        <div key="teacher-file" className="border-2 border-dashed border-slate-300 rounded-xl p-3 hover:bg-slate-50 transition cursor-pointer relative text-center">
                                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setTeacherImage)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                                            <div className="text-center text-slate-400">
                                                {isUploading ? <Loader2 className="mx-auto mb-2 animate-spin text-orange-500" /> : <UploadCloud className="mx-auto mb-2" />}
                                                <p className="text-xs text-slate-500">{isUploading ? 'Mengupload...' : 'Klik / Drop foto guru'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <input key="teacher-url" type="text" value={teacherImage || ''} onChange={e => setTeacherImage(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" placeholder="https://..." />
                                    )}
                                </div>

                                <button onClick={handleAddTeacher} disabled={!teacherName || isSubmitting || isUploading} className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 disabled:opacity-50">
                                    {isSubmitting ? 'Menyimpan...' : isUploading ? 'Tunggu Upload...' : <><Save size={18}/> Simpan Data Guru</>}
                                </button>
                            </div>
                            
                            <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300 p-4">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-200 mb-4 border-4 border-white shadow-md">
                                    {teacherImage ? <img src={teacherImage} className="w-full h-full object-cover" alt="Preview"/> : <User size={48} className="text-slate-400 m-auto mt-8"/>}
                                </div>
                                <p className="font-bold text-slate-800">{teacherName || "Nama Guru"}</p>
                                <p className="text-slate-500 text-sm">{teacherPosition || "Jabatan"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-6">
                        <h3 className="font-bold text-slate-800 text-lg mb-6">Daftar Guru ({teachers.length})</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {teachers.map(t => (
                                <div key={t.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition group">
                                    <img src={t.imageUrl} alt={t.name} className="w-16 h-16 rounded-full object-cover bg-slate-200"/>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800">{t.name}</h4>
                                        <p className="text-xs text-orange-600 font-bold">{t.position}</p>
                                        <p className="text-xs text-slate-400">{t.nip ? `NIP. ${t.nip}` : '-'}</p>
                                    </div>
                                    <button onClick={() => handleDeleteTeacher(t.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={18}/></button>
                                </div>
                            ))}
                            {teachers.length === 0 && <p className="text-slate-400 col-span-2 text-center py-4">Belum ada data guru.</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* EVENT MANAGER (NEW) */}
            {activeTab === 'agenda' && (
                <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
                        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2"><PlusCircle size={20} className="text-orange-500"/> Tambah Agenda / Kalender</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Judul Kegiatan</label>
                                <input type="text" value={eventTitle || ''} onChange={e => setEventTitle(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Ujian Semester Ganjil" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal</label>
                                <input type="date" value={eventDate || ''} onChange={e => setEventDate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
                                <select value={eventCategory} onChange={e => setEventCategory(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none">
                                    <option value="Kegiatan">Kegiatan Sekolah</option>
                                    <option value="Ujian">Ujian / Tes</option>
                                    <option value="Libur">Libur</option>
                                    <option value="Rapor">Pembagian Rapor</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={handleAddEvent} disabled={!eventTitle || !eventDate || isSubmitting} className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 disabled:opacity-50">
                                {isSubmitting ? 'Menyimpan...' : <><Save size={18}/> Simpan Agenda</>}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-6">
                        <h3 className="font-bold text-slate-800 text-lg mb-6">Daftar Agenda ({events.length})</h3>
                        <div className="divide-y divide-slate-100">
                            {events.map(ev => (
                                <div key={ev.id} className="flex items-center justify-between py-4 hover:bg-slate-50 px-2 rounded-lg transition">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center text-white font-bold text-xs ${ev.category === 'Libur' ? 'bg-red-500' : ev.category === 'Ujian' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                                            <span>{new Date(ev.date).getDate()}</span>
                                            <span className="text-[10px] uppercase">{new Date(ev.date).toLocaleString('default', { month: 'short' })}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{ev.title}</h4>
                                            <p className="text-sm text-slate-500">{ev.category} • {new Date(ev.date).getFullYear()}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteEvent(ev.id)} className="text-slate-400 hover:text-red-500 p-2"><Trash2 size={18}/></button>
                                </div>
                            ))}
                            {events.length === 0 && <p className="text-slate-400 text-center py-4">Belum ada agenda.</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* GALLERY MANAGER */}
            {activeTab === 'gallery' && (
                <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
                        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2"><PlusCircle size={20} className="text-orange-500"/> Tambah Foto Baru</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                {/* Toggle Upload Mode */}
                                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg w-fit">
                                    <button 
                                        onClick={() => setGalleryUploadMode(false)} 
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${!galleryUploadMode ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:bg-slate-200'}`}
                                    >
                                        <LinkIcon size={14} className="inline mr-1"/> Input Link
                                    </button>
                                    <button 
                                        onClick={() => setGalleryUploadMode(true)} 
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${galleryUploadMode ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:bg-slate-200'}`}
                                    >
                                        <UploadCloud size={14} className="inline mr-1"/> Upload Lokal
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        {galleryUploadMode ? 'Pilih Gambar (Maks 800KB)' : 'URL Gambar'}
                                    </label>
                                    {galleryUploadMode ? (
                                        <div key="gallery-file" className="border-2 border-dashed border-slate-300 rounded-xl p-4 hover:bg-slate-50 transition cursor-pointer relative">
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, setGalleryImage)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="text-center text-slate-400">
                                                {isUploading ? <Loader2 className="mx-auto mb-2 animate-spin text-orange-500" /> : <UploadCloud className="mx-auto mb-2" />}
                                                <p className="text-sm">{isUploading ? 'Mengupload...' : 'Klik untuk upload gambar'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div key="gallery-url" className="relative">
                                            <input type="text" value={galleryImage || ''} onChange={e => setGalleryImage(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="https://..." />
                                            <LinkIcon className="absolute left-3 top-3.5 text-slate-400" size={16}/>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Keterangan / Caption</label>
                                    <input type="text" value={galleryCaption || ''} onChange={e => setGalleryCaption(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Kegiatan Upacara..." />
                                </div>
                                <button onClick={handleAddGallery} disabled={!galleryImage || isSubmitting || isUploading} className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 disabled:opacity-50">
                                    {isSubmitting ? 'Mengupload...' : isUploading ? 'Tunggu Upload...' : <><Save size={18}/> Simpan ke Galeri</>}
                                </button>
                            </div>
                            <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center min-h-[200px] overflow-hidden relative">
                                {galleryImage ? (
                                    <img src={galleryImage} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-slate-400">
                                        <Camera size={48} className="mx-auto mb-2 opacity-50"/>
                                        <p className="text-sm">Preview Gambar</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Gallery List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-6">
                        <h3 className="font-bold text-slate-800 text-lg mb-6">Daftar Foto Galeri ({gallery.length})</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {gallery.map(item => (
                                <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition">
                                    <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3">
                                        <p className="text-white text-xs line-clamp-1 mb-2">{item.caption}</p>
                                        <button onClick={() => handleDeleteGallery(item.id)} className="bg-red-500 text-white p-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-red-600 transition">
                                            <Trash2 size={14} /> Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {gallery.length === 0 && <p className="text-slate-400 text-center py-8">Belum ada foto di galeri.</p>}
                    </div>
                </div>
            )}

            {/* EDITOR BERITA */}
            {activeTab === 'editor' && (
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 animate-fade-in-up pb-12">
                 <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                       <div className="flex items-center gap-2">
                          <button onClick={() => setPreviewMode(false)} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${!previewMode ? 'bg-white shadow text-orange-600' : 'text-slate-500 hover:bg-white/50'}`}>Editor</button>
                          <button onClick={() => setPreviewMode(true)} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${previewMode ? 'bg-white shadow text-orange-600' : 'text-slate-500 hover:bg-white/50'}`}>Preview</button>
                       </div>
                    </div>
                    {!previewMode ? (
                      <div className="p-6 space-y-6">
                         <div><label className="block text-sm font-bold text-slate-700 mb-2">Judul Artikel</label><input type="text" value={title || ''} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-lg" placeholder="Masukkan judul menarik..." /></div>
                         <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label><div className="relative"><select value={category || 'Kegiatan'} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none appearance-none cursor-pointer"><option value="Kegiatan">Kegiatan Sekolah</option><option value="Prestasi">Prestasi Siswa</option><option value="Pengumuman">Pengumuman Penting</option><option value="Artikel">Artikel Umum</option></select><ChevronRight className="absolute right-4 top-3.5 text-slate-400 rotate-90" size={16}/></div></div>
                            <div><label className="block text-sm font-bold text-slate-700 mb-2">Penulis</label><input type="text" value={author || ''} onChange={e => setAuthor(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" /></div>
                         </div>
                         <div><label className="block text-sm font-bold text-slate-700 mb-2">Konten Berita</label><div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 transition"><div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-1"><button type="button" onClick={() => insertFormat('b')} className="p-2 hover:bg-slate-200 rounded text-slate-600" title="Bold"><Bold size={16}/></button><button type="button" onClick={() => insertFormat('i')} className="p-2 hover:bg-slate-200 rounded text-slate-600" title="Italic"><Italic size={16}/></button><button type="button" onClick={() => insertFormat('u')} className="p-2 hover:bg-slate-200 rounded text-slate-600" title="Underline"><Type size={16}/></button><div className="w-px h-6 bg-slate-300 mx-1"></div><button type="button" onClick={() => insertFormat('p')} className="p-2 hover:bg-slate-200 rounded text-slate-600" title="Paragraf baru"><FileText size={16}/></button></div><textarea ref={contentRef} value={content || ''} onChange={e => setContent(e.target.value)} className="w-full h-64 p-4 bg-white outline-none resize-none font-sans leading-relaxed" placeholder="Tulis berita disini... Gunakan tombol toolbar untuk format sederhana."></textarea></div></div>
                      </div>
                    ) : (
                      <div className="p-8 bg-white min-h-[500px]"><span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold mb-4">{category}</span><h1 className="text-3xl font-bold text-slate-800 mb-4">{title || 'Judul Berita...'}</h1><div className="flex items-center gap-4 text-sm text-slate-400 mb-6 pb-6 border-b border-slate-100"><span>{new Date().toLocaleDateString('id-ID')}</span><span>Oleh: {author}</span></div>{imageUrl && <img src={imageUrl} alt="Preview" className="w-full h-64 object-cover rounded-xl mb-6 shadow-sm"/>}<div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{__html: content || 'Konten berita...'}}></div></div>
                    )}
                 </div>
                 <div className="w-full md:w-80 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                       <h3 className="font-bold text-slate-800 mb-4">Pengaturan Media</h3>
                       <div className="space-y-4">
                           {/* Toggle News Upload */}
                           <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg w-full">
                                <button 
                                    onClick={() => setNewsUploadMode(false)} 
                                    className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition ${!newsUploadMode ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:bg-slate-200'}`}
                                >
                                    Input Link
                                </button>
                                <button 
                                    onClick={() => setNewsUploadMode(true)} 
                                    className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition ${newsUploadMode ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:bg-slate-200'}`}
                                >
                                    Upload
                                </button>
                            </div>

                           <label className="block text-sm font-bold text-slate-700">
                                {newsUploadMode ? 'Pilih Gambar (Maks 800KB)' : 'URL Gambar Utama'}
                           </label>
                           
                           {newsUploadMode ? (
                                <div key="news-file" className="border-2 border-dashed border-slate-300 rounded-xl p-4 hover:bg-slate-50 transition cursor-pointer relative text-center">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, setImageUrl)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <UploadCloud size={20} className="mx-auto mb-1 text-slate-400"/>
                                    <p className="text-xs text-slate-500">Klik / Drop gambar disini</p>
                                </div>
                           ) : (
                                <div key="news-url" className="relative">
                                    <input type="text" value={imageUrl || ''} onChange={e => setImageUrl(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" placeholder="https://..." />
                                    <LinkIcon className="absolute left-3 top-3.5 text-slate-400" size={16}/>
                                </div>
                           )}

                           {imageUrl && (<div className="aspect-video rounded-lg overflow-hidden bg-slate-100 border border-slate-200 relative group"><img src={imageUrl} alt="Preview" className="w-full h-full object-cover"/><button onClick={() => setImageUrl('')} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"><X size={14}/></button></div>)}
                       </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                       <h3 className="font-bold text-slate-800 mb-4">Publikasi</h3>
                       <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm p-3 bg-slate-50 rounded-lg"><span className="text-slate-500">Status</span><span className="font-bold text-green-600">Siap Publish</span></div>
                          <button onClick={handleAddNews} disabled={isSubmitting} className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2">{isSubmitting ? 'Menyimpan...' : <><Send size={18}/> Terbitkan Berita</>}</button>
                          <button onClick={() => setActiveTab('list')} className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition">Batal</button>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  };

  // --- Main Render Switch ---
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-stone-50 selection:bg-orange-200 selection:text-orange-900">
      <style>{customStyles}</style>
      
      {currentView !== 'admin' && currentView !== 'login' && (
        <Navbar 
          currentView={currentView}
          navigateTo={navigateTo}
          isAdmin={isAdmin}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          scrolled={scrolled}
        />
      )}
      
      <main className="flex-grow">
        {currentView === 'home' && <HomeView navigateTo={navigateTo} news={news} loading={loading} />}
        {currentView === 'profil' && <ProfilView navigateTo={navigateTo} teachers={teachers} />}
        {currentView === 'berita' && <BeritaView news={news} loading={loading} />}
        {currentView === 'kalender' && <KalenderView events={events} loading={loading} />}
        {currentView === 'ekskul' && <EkstrakurikulerView />}
        {currentView === 'galeri' && <GaleriView gallery={gallery} loading={loadingGallery} />}
        {currentView === 'layanan' && <LayananView />}
        {currentView === 'kontak' && <KontakView />}
        {currentView === 'login' && <LoginView navigateTo={navigateTo} handleLogin={handleLogin} />}
        {currentView === 'admin' && isAdmin && <AdminDashboard />}
        
        {currentView === 'admin' && !isAdmin && (
            <div className="text-center py-40"><p className="text-xl font-bold text-slate-800">Akses Ditolak.</p><button onClick={() => navigateTo('login')} className="text-orange-600 font-bold underline mt-4">Login</button></div>
        )}
      </main>

      {currentView !== 'admin' && currentView !== 'login' && <Footer navigateTo={navigateTo} />}
    </div>
  );
}