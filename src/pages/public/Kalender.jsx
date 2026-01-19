import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Circle } from 'lucide-react';
import { SEO } from '../../components/common/SEO';

const Kalender = ({ events, loading }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth); 
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const monthEvents = events.filter(e => {
    const eDate = new Date(e.date);
    return eDate.getMonth() === currentMonth && eDate.getFullYear() === currentYear;
  });

  const getEventForDay = (day) => monthEvents.filter(e => new Date(e.date).getDate() === day);

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
      <SEO title="Agenda Akademik" description="Kalender akademik sekolah." />
      
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-800">Kalender Akademik</h2>
            <p className="text-slate-500 text-xs mt-1">Jadwal kegiatan sekolah tahun ajaran aktif.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
            
            {/* --- Bagian Kiri: Kalender Mini --- */}
            <div className="w-full md:w-5/12 bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                {/* Header Bulan */}
                <div className="bg-white p-4 flex justify-between items-center border-b border-slate-100">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded-full transition"><ChevronLeft size={18} className="text-slate-600" /></button>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{monthNames[currentMonth]} {currentYear}</h3>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded-full transition"><ChevronRight size={18} className="text-slate-600" /></button>
                </div>

                <div className="p-4">
                    {/* Nama Hari */}
                    <div className="grid grid-cols-7 mb-2 text-center">
                        {['Mn','Sn','Sl','Rb','Km','Jm','Sb'].map(d => (
                            <div key={d} className="text-[10px] font-bold text-slate-400">{d}</div>
                        ))}
                    </div>
                    
                    {/* Grid Tanggal */}
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square"></div>
                        ))}
                        
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dayEvents = getEventForDay(day);
                            const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();
                            
                            return (
                                <div key={day} className={`aspect-square rounded-lg flex flex-col items-center justify-center relative cursor-default group transition-colors ${isToday ? 'bg-orange-500 text-white shadow-md' : 'hover:bg-slate-50 text-slate-700'}`}>
                                    <span className="text-xs font-medium z-10">{day}</span>
                                    
                                    {/* Indikator Titik (Dots) */}
                                    {dayEvents.length > 0 && (
                                        <div className="flex gap-0.5 mt-0.5">
                                            {dayEvents.slice(0, 3).map((ev, idx) => (
                                                <div key={idx} className={`w-1 h-1 rounded-full ${isToday ? 'bg-white' : getCategoryColor(ev.category)}`}></div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend Kecil */}
                    <div className="flex flex-wrap justify-center gap-2 mt-4 pt-3 border-t border-slate-50 text-[10px] text-slate-500">
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Kegiatan</div>
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>Ujian</div>
                        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Libur</div>
                    </div>
                </div>
            </div>

            {/* --- Bagian Kanan: List Agenda --- */}
            <div className="w-full md:w-7/12">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 min-h-[300px]">
                    <h4 className="font-bold text-base text-slate-800 mb-4 flex items-center gap-2">
                        <Calendar size={18} className="text-orange-500"/> Agenda Bulan Ini
                    </h4>
                    
                    <div className="space-y-3">
                        {monthEvents.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-slate-400 text-sm">Tidak ada agenda pada bulan {monthNames[currentMonth]}.</p>
                            </div>
                        ) : (
                            monthEvents.sort((a,b) => new Date(a.date) - new Date(b.date)).map(item => (
                                <div key={item.id} className="flex gap-3 items-start p-3 hover:bg-slate-50 rounded-xl transition border border-slate-50 hover:border-slate-100">
                                    <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center text-white font-bold shrink-0 shadow-sm ${getCategoryColor(item.category)}`}>
                                        <span className="text-sm">{new Date(item.date).getDate()}</span>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-800 text-sm">{item.title}</h5>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">{item.category}</span>
                                            <span className="text-[10px] text-slate-400">{new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long' })}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            
        </div>
      </div>
    </div>
  );
};
export default Kalender;