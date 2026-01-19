import React from 'react';
import { Flag, HeartPulse, Star, Trophy, Music, Beaker, Target } from 'lucide-react';
import { SEO } from '../../components/common/SEO';

const Ekstrakurikuler = () => {
    return (
        <div className="bg-stone-50 min-h-screen pt-24 pb-12 animate-fade-in-up">
            <SEO title="Ekstrakurikuler" description="Kegiatan ekstrakurikuler SMAN 2 Koto Kampar Hulu." />
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
export default Ekstrakurikuler;