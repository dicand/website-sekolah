import React, { useState } from 'react';
import { Search, User, Calendar, X, ArrowRight } from 'lucide-react';
import { SEO } from '../../components/common/SEO';

const Berita = ({ news, loading }) => {
  const [selectedNews, setSelectedNews] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="bg-stone-50 min-h-screen pt-20 md:pt-24 pb-12 animate-fade-in-up">
      <SEO title="Berita" description="Berita terbaru dari SMAN 2 Koto Kampar Hulu." />
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 md:mb-12 border-b border-slate-200 pb-4 md:pb-6 gap-4">
           <div className="w-full md:w-auto">
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 mb-1 md:mb-2">Papan Informasi</h2>
              <p className="text-slate-500 text-xs md:text-base">Berita, artikel, dan pengumuman sekolah.</p>
           </div>
           <div className="w-full md:w-64 relative">
             <input 
                type="text" 
                placeholder="Cari berita..." 
                className="pl-9 pr-4 py-2 md:py-2.5 rounded-lg md:rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 text-xs md:text-sm w-full bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Search className="absolute left-3 top-2.5 md:top-3 text-slate-400" size={14} />
           </div>
        </div>

        {/* News Grid - 2 Kolom di Mobile */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
           {loading ? (
             <div className="col-span-full py-20 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-4 border-orange-200 border-t-orange-500"></div>
             </div>
           ) : filteredNews.length === 0 ? (
             <div className="col-span-full text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-slate-300">
                <p className="text-slate-400 text-sm">Tidak ada berita yang ditemukan.</p>
             </div>
           ) : (
             filteredNews.slice(0, visibleCount).map((item, idx) => (
                <article 
                    key={item.id} 
                    className="bg-white rounded-lg md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-slate-100" 
                    style={{animationDelay: `${idx * 0.05}s`}}
                >
                  {/* Image: Pendek di mobile (h-32) agar muat 2 kolom */}
                  <div className="h-32 md:h-60 bg-slate-200 overflow-hidden relative cursor-pointer" onClick={() => setSelectedNews(item)}>
                    <img 
                        loading="lazy" 
                        src={item.imageUrl || "https://placehold.co/600x400/e2e8f0/475569?text=News"} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-in-out" 
                    />
                    {/* Badge Tanggal: Sangat kecil di mobile */}
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/90 backdrop-blur-md px-1.5 py-0.5 md:px-2.5 md:py-1 rounded md:rounded-lg text-[8px] md:text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
                        <Calendar size={10} className="text-orange-500"/> {item.date}
                    </div>
                  </div>

                  {/* Content: Padding kecil (p-3) */}
                  <div className="p-3 md:p-6 flex-1 flex flex-col">
                    {/* Judul: Ukuran text-sm di mobile */}
                    <h3 
                        onClick={() => setSelectedNews(item)} 
                        className="text-sm md:text-xl font-bold text-slate-800 mb-2 md:mb-3 group-hover:text-orange-600 transition cursor-pointer leading-tight md:leading-snug line-clamp-2 md:line-clamp-2"
                    >
                        {item.title}
                    </h3>
                    
                    {/* Deskripsi: HIDDEN di mobile agar tampilan 2 kolom rapi */}
                    <div 
                        className="hidden md:block text-slate-500 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed" 
                        dangerouslySetInnerHTML={{__html: item.content?.replace(/<[^>]+>/g, '')}}
                    ></div>
                    
                    {/* Footer Card */}
                    <div className="mt-auto flex justify-between items-center pt-2 md:pt-4 border-t border-slate-100">
                        <button onClick={() => setSelectedNews(item)} className="text-orange-600 font-bold text-[10px] md:text-sm hover:underline flex items-center gap-1">
                            Baca <ArrowRight size={12} className="hidden md:block"/>
                        </button>
                        <span className="text-slate-400 text-[10px] md:text-xs flex items-center gap-1 truncate max-w-[80px] md:max-w-none">
                            <User size={10} className="md:w-3 md:h-3"/> {item.author || 'Admin'}
                        </span>
                    </div>
                  </div>
                </article>
             ))
           )}
        </div>
        
        {!loading && visibleCount < filteredNews.length && (
            <div className="text-center mt-8 md:mt-12">
                <button onClick={handleLoadMore} className="bg-white border border-slate-200 text-slate-600 font-bold py-2 px-6 md:py-2.5 rounded-full shadow-sm hover:bg-slate-50 hover:text-orange-600 transition-all text-xs md:text-sm">
                    Muat Lebih Banyak
                </button>
            </div>
        )}
      </div>

      {/* Modal Detail Berita (Tetap Sama) */}
      {selectedNews && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up" onClick={() => setSelectedNews(null)}>
          <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-3xl h-[85vh] md:max-h-[90vh] overflow-y-auto custom-scrollbar relative flex flex-col" onClick={e => e.stopPropagation()}>
            
            <button onClick={() => setSelectedNews(null)} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition z-20 backdrop-blur-sm">
              <X size={20} />
            </button>
            
            <div className="relative shrink-0 h-56 md:h-80 w-full">
               <img loading="lazy" src={selectedNews.imageUrl || "https://placehold.co/600x400/e2e8f0/475569?text=News"} alt={selectedNews.title} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
               <div className="absolute bottom-0 left-0 w-full p-6">
                  <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-[10px] md:text-xs font-bold mb-2 inline-block shadow-sm uppercase tracking-wide">{selectedNews.category || 'Umum'}</span>
                  <h2 className="text-xl md:text-3xl font-bold text-white leading-tight drop-shadow-md">{selectedNews.title}</h2>
               </div>
            </div>

            <div className="p-6 md:p-10 bg-white">
               <div className="flex items-center gap-4 text-xs md:text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-1.5"><Calendar size={14} className="text-orange-500"/> {selectedNews.date}</div>
                  <div className="flex items-center gap-1.5"><User size={14} className="text-orange-500"/> {selectedNews.author || 'Admin'}</div>
               </div>
               
               <div className="prose prose-slate prose-sm md:prose-base max-w-none text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{__html: selectedNews.content}}></div>
               
               <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                  <button onClick={() => setSelectedNews(null)} className="w-full md:w-auto px-8 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition font-bold text-sm">Tutup Berita</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Berita;