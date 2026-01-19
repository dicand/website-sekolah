import React from 'react';
import { Users, User, BookOpen, Award, ArrowRight, ChevronRight, Calendar, MapPin, Phone } from 'lucide-react';
import { SEO, SchemaOrg } from '../../components/common/SEO';
import Typewriter from '../../components/common/Typewriter';
import Carousel from '../../components/common/Carousel';

const Home = ({ navigateTo, news, loading, gallery }) => (
  <div className="bg-stone-50 min-h-screen">
    <SEO title="Beranda" description="Website Resmi SMAN 2 Koto Kampar Hulu." />
    <SchemaOrg />
    <div className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 z-0"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay"><img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Background Sekolah" className="w-full h-full object-cover" /></div>
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto perspective-1000">
        <div className="mb-6 inline-block animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <span className="bg-white/10 backdrop-blur-md border border-white/20 text-orange-200 px-6 py-2 rounded-full text-sm font-medium tracking-wide shadow-xl">Selamat Datang di Website Resmi</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight text-white drop-shadow-lg animate-fade-in-up" style={{animationDelay: '0.2s'}}>SMAN 2 <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-200">Koto Kampar Hulu</span></h1>
        
        <div className="text-lg md:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed min-h-[60px] animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <Typewriter typeSpeed={50} deleteSpeed={30} pauseEnd={2000} pauseStart={500} data={[{ text: "Ruang tumbuh bagi generasi ", className: "" }, { text: "Unggul", className: "font-semibold text-white" }, { text: ", ", className: "" }, { text: "Kreatif", className: "font-semibold text-white" }, { text: ", dan ", className: "" }, { text: "Berakhlak Mulia", className: "font-semibold text-white" }, { text: " di era digital.", className: "" }]} />
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <button onClick={() => navigateTo('profil')} className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-orange-500/30 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">Jelajahi Profil <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></button>
          <button onClick={() => navigateTo('berita')} className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105">Lihat Berita</button>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50"><div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1"><div className="w-1 h-2 bg-white rounded-full"></div></div></div>
    </div>

    <div className="relative z-20 -mt-24 pb-12">
      <div className="container mx-auto px-6">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[{ icon: Users, val: '500+', label: 'Siswa Aktif', color: 'text-blue-500', bg: 'bg-blue-50' }, { icon: User, val: '45', label: 'Guru & Staff', color: 'text-orange-500', bg: 'bg-orange-50' }, { icon: BookOpen, val: '18', label: 'Ekstrakurikuler', color: 'text-purple-500', bg: 'bg-purple-50' }, { icon: Award, val: 'A', label: 'Akreditasi', color: 'text-emerald-500', bg: 'bg-emerald-50' }].map((stat, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 flex flex-col items-center text-center group">
                 <div className={`w-16 h-16 ${stat.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}><stat.icon size={32} className={stat.color} /></div>
                 <h3 className="text-3xl font-extrabold text-slate-800 mb-1">{stat.val}</h3>
                 <p className="text-slate-500 font-medium">{stat.label}</p>
              </div>
            ))}
         </div>
      </div>
    </div>

    <div className="py-12 bg-white">
      <div className="py-12 bg-white">
  <div className="container mx-auto px-6">
    <div className="flex flex-col md:flex-row items-center gap-12">
      
      {/* UPDATE: Lebar kolom dikurangi (4/12) dan ditambah max-w-xs agar lebih kecil */}
      <div className="md:w-4/12 w-full max-w-xs relative group perspective-1000 mx-auto md:mx-0">
         <div className="absolute -inset-4 bg-orange-100 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition duration-500"></div>
         <div className="relative transform transition-all duration-500 rotate-2 group-hover:rotate-0 shadow-2xl rounded-2xl overflow-hidden border-4 border-white">
            <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Kepala Sekolah" className="w-full h-auto object-cover" />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <h4 className="text-lg font-bold">Drs. H. Mulyadi, M.Pd</h4>
                <p className="text-orange-300 text-xs">Kepala Sekolah</p>
            </div>
         </div>
      </div>

      {/* UPDATE: Lebar kolom teks diperbesar (8/12) */}
      <div className="md:w-8/12 w-full text-center md:text-left">
        <span className="inline-block py-1 px-3 rounded-md bg-orange-100 text-orange-600 text-xs font-bold tracking-wider uppercase mb-4">Kata Sambutan</span>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 leading-tight">Membangun Karakter,<br/>Mengukir Prestasi.</h2>
        <div className="prose prose-lg text-slate-600 mb-8 mx-auto md:mx-0">
            <p className="mb-4">"Assalamu’alaikum Warahmatullahi Wabarakatuh. Selamat datang di portal digital kami. Kami berkomitmen untuk tidak hanya mengejar keunggulan akademik, tetapi juga menanamkan nilai-nilai luhur."</p>
            <p>Mari bersinergi untuk kemajuan bersama.</p>
        </div>
        <button onClick={() => navigateTo('profil')} className="px-8 py-3 bg-slate-800 text-white rounded-full font-medium shadow-lg hover:bg-slate-900 transition inline-flex items-center gap-2">Baca Selengkapnya <ChevronRight size={16} /></button>
      </div>

    </div>
  </div>
</div>
    </div>

    <div className="py-12 container mx-auto px-6">
       {gallery && gallery.length > 0 && (
         <div className="animate-fade-in-up">
            <div className="text-center mb-8"><h3 className="text-2xl font-bold text-slate-800">Sekilas Kegiatan</h3><p className="text-slate-500 text-sm">Dokumentasi aktivitas terbaru di lingkungan sekolah.</p></div>
            <Carousel images={gallery} />
         </div>
       )}
    </div>
    
    <div className="py-24 bg-stone-50 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16"><h2 className="text-4xl font-bold text-slate-800 mb-4">Kabar Terbaru</h2><p className="text-slate-500 max-w-2xl mx-auto">Ikuti perkembangan terkini sekolah.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? <p className="col-span-3 text-center text-slate-400">Memuat...</p> : news.length === 0 ? <div className="col-span-3 text-center py-12 bg-white rounded-2xl shadow-sm border border-stone-100"><p className="text-slate-400">Belum ada berita yang dipublish.</p></div> : news.slice(0, 3).map((item, index) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden card-3d-hover shadow-lg border border-slate-100 group flex flex-col h-full" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="h-56 overflow-hidden relative"><div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition z-10"></div><img src={item.imageUrl || "https://placehold.co/600x400/e2e8f0/475569?text=News"} alt={item.title} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700 ease-out" /><div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1"><Calendar size={12} className="text-orange-500" /> {item.date}</div></div>
                <div className="p-8 flex-1 flex flex-col"><h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-orange-600 transition leading-snug">{item.title}</h3><p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed" dangerouslySetInnerHTML={{__html: item.content?.replace(/<[^>]+>/g, '')}}></p><button onClick={() => navigateTo('berita')} className="text-orange-600 font-bold text-sm hover:text-orange-700 self-start flex items-center gap-1 group-btn">Baca Selengkapnya <ArrowRight size={16} className="transform group-btn-hover:translate-x-1 transition" /></button></div>
              </div>
          ))}
        </div>
      </div>
    </div>

    <div className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="space-y-6">
                <div className="bg-stone-50 p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:-translate-y-1 transition duration-300"><div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0"><MapPin size={24} /></div><div><h3 className="font-bold text-lg text-slate-800 mb-1">Alamat</h3><p className="text-slate-600 text-sm leading-relaxed">Jl. Pendidikan No. 1, Koto Kampar Hulu, Riau</p></div></div>
                <div className="bg-stone-50 p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:-translate-y-1 transition duration-300"><div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0"><Phone size={24} /></div><div><h3 className="font-bold text-lg text-slate-800 mb-1">Telepon</h3><p className="text-slate-600 text-sm">(0761) 123456</p></div></div>
            </div>
            <div className="lg:col-span-2 bg-stone-50 p-2 rounded-3xl shadow-lg border border-slate-200"><div className="w-full h-[300px] bg-slate-200 rounded-2xl overflow-hidden relative"><iframe title="Google Maps" src="https://maps.google.com/maps?q=SMAN+2+Koto+Kampar+Hulu&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy"></iframe></div></div>
        </div>
      </div>
    </div>
  </div>
);
export default Home;