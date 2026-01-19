import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { SEO } from '../../components/common/SEO';

const Galeri = ({ gallery, loading }) => {
  const [visibleCount, setVisibleCount] = useState(8);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  return (
    <div className="bg-stone-50 min-h-screen pt-24 pb-12 animate-fade-in-up">
      <SEO title="Galeri Foto" description="Koleksi foto kegiatan dan dokumentasi SMAN 2 Koto Kampar Hulu." />
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
export default Galeri;