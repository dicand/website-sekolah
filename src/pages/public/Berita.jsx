import React, { useState } from 'react';
import { Search, User, Calendar, X } from 'lucide-react';
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
    <div className="bg-stone-50 min-h-screen pt-24 pb-12 animate-fade-in-up">
      <SEO title="Berita" description="Berita terbaru dari SMAN 2 Koto Kampar Hulu." />
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
        
        {!loading && visibleCount < filteredNews.length && (
            <div className="text-center mt-12">
                <button onClick={handleLoadMore} className="bg-white border border-slate-200 text-slate-600 font-bold py-3 px-8 rounded-full shadow-sm hover:bg-slate-50 hover:text-orange-600 transition-all transform hover:-translate-y-1">
                    Muat Lebih Banyak Berita
                </button>
            </div>
        )}
      </div>

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
export default Berita;