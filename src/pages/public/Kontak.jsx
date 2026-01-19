import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { SEO } from '../../components/common/SEO';

const Kontak = () => (
    <div className="bg-stone-50 min-h-screen pt-24 pb-12 animate-fade-in-up">
      <SEO title="Hubungi Kami" description="Kontak dan lokasi SMAN 2 Koto Kampar Hulu." />
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
           <span className="text-orange-500 font-bold tracking-widest text-sm uppercase">Hubungi Kami</span>
           <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mt-2 mb-6">Informasi & Lokasi</h2>
           <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 bg-white p-2 rounded-3xl shadow-lg border border-slate-200">
                <div className="w-full h-[400px] bg-slate-100 rounded-2xl overflow-hidden relative">
                    <iframe title="Google Maps" src="https://maps.google.com/maps?q=SMAN+2+Koto+Kampar+Hulu&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
            </div>
        </div>
      </div>
    </div>
);
export default Kontak;