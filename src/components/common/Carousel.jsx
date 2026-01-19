import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slides = images ? images.slice(0, 5) : [];

  useEffect(() => {
    if (isPaused || slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [slides.length, isPaused]);

  const goToSlide = (index) => setCurrentIndex(index);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  if (slides.length === 0) return null;

  const getSlideStyles = (index) => {
    const len = slides.length;
    const prev = (currentIndex - 1 + len) % len;
    const next = (currentIndex + 1) % len;
    let baseClass = "absolute top-0 w-[65%] md:w-[45%] h-full transition-all duration-500 ease-in-out rounded-xl overflow-hidden shadow-lg border border-slate-100";
    
    if (index === currentIndex) return `${baseClass} left-1/2 -translate-x-1/2 z-20 scale-100 opacity-100 blur-0 ring-2 ring-white/80`;
    else if (index === prev) return `${baseClass} left-0 transform -translate-x-[5%] z-10 scale-90 opacity-60 blur-[1px] cursor-pointer hover:opacity-80`;
    else if (index === next) return `${baseClass} right-0 transform translate-x-[5%] z-10 scale-90 opacity-60 blur-[1px] cursor-pointer hover:opacity-80`;
    else return `${baseClass} left-1/2 -translate-x-1/2 scale-50 opacity-0 z-0`;
  };

  return (
    <div className="relative w-full h-[180px] md:h-[300px] flex items-center justify-center overflow-hidden my-6" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="w-full h-full relative max-w-5xl mx-auto px-2">
        {slides.map((slide, index) => (
          <div key={index} className={getSlideStyles(index)} onClick={() => { if (index !== currentIndex) setCurrentIndex(index); }}>
            <img src={slide.imageUrl} alt="Galeri" className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 transition-opacity duration-300 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-white text-xs md:text-sm font-bold line-clamp-1">{slide.caption || "Dokumentasi"}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={prevSlide} className="absolute left-1 md:left-4 z-30 bg-white/30 hover:bg-white backdrop-blur-md text-white hover:text-orange-600 p-1.5 rounded-full shadow-md transition-all"><ChevronLeft size={18} /></button>
      <button onClick={nextSlide} className="absolute right-1 md:right-4 z-30 bg-white/30 hover:bg-white backdrop-blur-md text-white hover:text-orange-600 p-1.5 rounded-full shadow-md transition-all"><ChevronRight size={18} /></button>
    </div>
  );
};
export default Carousel;