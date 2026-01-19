import React from 'react';
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';

const Footer = ({ navigateTo }) => (
  <footer className="bg-slate-900 text-slate-300 py-16 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-red-500 to-purple-600"></div>
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
      <div className="col-span-1 md:col-span-1">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1">
            <img loading="lazy" src="https://cdn-icons-png.flaticon.com/512/3281/3281329.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h3 className="text-xl font-bold text-white">SMAN 2 KTKH</h3>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-slate-400">
          Mewujudkan generasi penerus bangsa yang cerdas, berkarakter, dan kompetitif dengan sentuhan nilai budaya dan agama.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all"><Facebook size={18} /></a>
          <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all"><Instagram size={18} /></a>
          <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all"><Youtube size={18} /></a>
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
    <div className="mt-16 text-center text-slate-600 text-xs border-t border-slate-800 pt-8">© 2026 SMAN 2 Koto Kampar Hulu. All rights reserved.</div>
  </footer>
);
export default Footer;