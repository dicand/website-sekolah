import React from 'react';
import { User, BookOpen, Users, ArrowRight } from 'lucide-react';
import { SEO } from '../../components/common/SEO';

const Layanan = () => (
    <div className="bg-stone-50 min-h-screen pt-24 pb-12 animate-fade-in-up">
      <SEO title="Layanan Digital" description="Portal layanan digital SMAN 2 Koto Kampar Hulu." />
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
export default Layanan;