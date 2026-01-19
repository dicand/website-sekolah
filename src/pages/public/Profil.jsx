import React from 'react';
import { Clock, Award, Users, GraduationCap, Monitor, BookOpen, Beaker, Star, Coffee, HeartPulse, ImageIcon } from 'lucide-react';
import { SEO } from '../../components/common/SEO';

const Profil = ({ navigateTo, teachers }) => (
  <div className="bg-stone-50 min-h-screen pt-24 pb-12 animate-fade-in-up">
    <SEO title="Profil Sekolah" description="Profil lengkap SMAN 2 Koto Kampar Hulu." />
    <div className="container mx-auto px-6">
      <div className="text-center max-w-3xl mx-auto mb-16">
         <span className="text-orange-500 font-bold tracking-widest text-sm uppercase">Tentang Kami</span>
         <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mt-2 mb-6">Mengenal Lebih Dekat</h2>
         <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Sambutan Kepala Sekolah */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100" id="sambutan">
           <div className="bg-slate-800 p-1"></div>
           <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3 flex-shrink-0">
                 <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-slate-50">
                    <img loading="lazy"
                      src="https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                      alt="Kepala Sekolah" 
                      className="w-full h-auto object-cover"
                    />
                 </div>
                 <div className="text-center mt-4">
                    <h4 className="font-bold text-slate-800 text-lg">Drs. H. Mulyadi, M.Pd</h4>
                    <p className="text-orange-600 text-sm font-medium">Kepala Sekolah</p>
                 </div>
              </div>
              <div className="flex-1">
                 <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-8 bg-orange-500 rounded-full"></span> Sambutan Kepala Sekolah
                 </h3>
                 <div className="prose prose-slate text-slate-600 leading-relaxed space-y-4">
                    <p>"Assalamu’alaikum Warahmatullahi Wabarakatuh.</p>
                    <p>Puji syukur kita panjatkan kehadirat Allah SWT atas segala limpahan rahmat dan karunia-Nya. Selamat datang di website resmi SMAN 2 Koto Kampar Hulu. Website ini hadir sebagai wujud komitmen kami dalam keterbukaan informasi publik dan sebagai sarana komunikasi antara sekolah dengan masyarakat luas.</p>
                    <p>Di era digital 4.0 ini, penguasaan teknologi informasi sangatlah penting. Kami bertekad untuk terus meningkatkan mutu pendidikan yang tidak hanya unggul dalam akademik, tetapi juga membentuk karakter peserta didik yang berakhlak mulia, disiplin, dan cinta tanah air."</p>
                    <p className="font-bold text-slate-800 mt-4">Wassalamu’alaikum Warahmatullahi Wabarakatuh.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Sejarah Singkat */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100" id="sejarah">
           <div className="bg-blue-600 p-1"></div>
           <div className="p-10">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600"><Clock size={24} /></div>
                 <h3 className="text-3xl font-bold text-slate-800">Sejarah Singkat</h3>
              </div>
              <div className="prose prose-slate text-slate-600 max-w-none">
                 <p>SMAN 2 Koto Kampar Hulu berdiri pada tahun 2005 sebagai respon atas tingginya minat masyarakat Koto Kampar Hulu terhadap pendidikan menengah atas. Awalnya, sekolah ini menumpang di gedung SMPN 1 sebelum akhirnya memiliki gedung sendiri pada tahun 2007 di lahan seluas 2 hektar yang merupakan hibah dari tokoh masyarakat setempat.</p>
              </div>
           </div>
        </div>

        {/* Visi Misi */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100" id="visimisi">
           <div className="bg-orange-500 p-1"></div>
           <div className="p-10">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600"><Award size={24} /></div>
                 <h3 className="text-3xl font-bold text-slate-800">Visi & Misi</h3>
              </div>
              <div className="space-y-8">
                 <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100 relative">
                    <div className="absolute -top-3 -left-3 text-6xl text-orange-200 opacity-50 font-serif">"</div>
                    <h4 className="font-bold text-slate-800 text-lg mb-3">Visi Sekolah</h4>
                    <p className="text-xl text-slate-600 italic font-serif leading-relaxed">"Terwujudnya Peserta Didik yang Beriman, Cerdas, Terampil, Mandiri, dan Berwawasan Lingkungan."</p>
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2"><span className="w-2 h-6 bg-orange-500 rounded-full"></span> Misi Utama</h4>
                    <ul className="grid gap-4">
                       {['Meningkatkan keimanan dan ketaqwaan kepada Tuhan Yang Maha Esa.', 'Melaksanakan pembelajaran dan bimbingan secara efektif dan efisien berbasis teknologi.', 'Menumbuhkan semangat keunggulan secara intensif kepada seluruh warga sekolah.', 'Mendorong dan membantu setiap siswa untuk mengenali potensi dirinya.'].map((misi, i) => (
                          <li key={i} className="flex gap-4 items-start p-4 hover:bg-slate-50 rounded-xl transition cursor-default">
                             <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i+1}</div>
                             <span className="text-slate-600 leading-relaxed">{misi}</span>
                          </li>
                       ))}
                    </ul>
                 </div>
              </div>
           </div>
        </div>

        {/* Guru & Staf */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100" id="guru">
           <div className="bg-indigo-600 p-1"></div>
           <div className="p-10">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600"><GraduationCap size={24} /></div>
                 <h3 className="text-3xl font-bold text-slate-800">Guru & Staf</h3>
              </div>
              
              {!teachers || teachers.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <p className="text-slate-500">Data guru belum ditambahkan.</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {teachers.map((teacher) => (
                          <div key={teacher.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                              <div className="h-64 overflow-hidden relative bg-slate-100">
                                  <img loading="lazy"
                                    src={teacher.imageUrl || "https://placehold.co/400x400/e2e8f0/475569?text=Guru"} 
                                    alt={teacher.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                              </div>
                              <div className="p-5">
                                  <h4 className="font-bold text-lg text-slate-800 mb-1">{teacher.name}</h4>
                                  <p className="text-indigo-600 text-sm font-medium mb-2">{teacher.position}</p>
                                  {teacher.nip && <p className="text-slate-400 text-xs">NIP. {teacher.nip}</p>}
                              </div>
                          </div>
                      ))}
                  </div>
              )}
           </div>
        </div>

        {/* Fasilitas */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100" id="fasilitas">
           <div className="bg-purple-600 p-1"></div>
           <div className="p-10">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600"><ImageIcon size={24} /></div>
                 <h3 className="text-3xl font-bold text-slate-800">Fasilitas Sekolah</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[
                    { name: "Ruang Kelas AC", desc: "Kelas nyaman dilengkapi pendingin ruangan dan proyektor.", icon: <Monitor className="text-blue-500" /> },
                    { name: "Laboratorium Komputer", desc: "40 Unit komputer terbaru dengan akses internet cepat.", icon: <Monitor className="text-purple-500" /> },
                    { name: "Perpustakaan Digital", desc: "Koleksi buku lengkap dan akses e-book.", icon: <BookOpen className="text-orange-500" /> },
                    { name: "Laboratorium IPA", desc: "Fasilitas lengkap untuk praktikum Fisika, Kimia, Biologi.", icon: <Beaker className="text-green-500" /> },
                    { name: "Musholla", desc: "Tempat ibadah yang bersih dan nyaman.", icon: <Star className="text-yellow-500" /> },
                    { name: "Kantin Sehat", desc: "Menyediakan makanan higienis dan bergizi.", icon: <Coffee className="text-red-500" /> },
                    { name: "UKS", desc: "Unit Kesehatan Sekolah dengan perlengkapan P3K lengkap.", icon: <HeartPulse className="text-pink-500" /> }
                 ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition border border-slate-100 hover:border-slate-200">
                       <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-100">{item.icon}</div>
                       <div>
                          <h4 className="font-bold text-slate-800">{item.name}</h4>
                          <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  </div>
);
export default Profil;