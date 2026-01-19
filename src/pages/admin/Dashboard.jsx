import React, { useState, useRef, useEffect } from 'react';
import { 
  collection, addDoc, deleteDoc, doc, serverTimestamp 
} from 'firebase/firestore';
import { 
  LayoutDashboard, PlusCircle, Image as ImageIcon, GraduationCap, Calendar, 
  LogOut, Menu, User, FileText, Trash2, Save, UploadCloud, Link as LinkIcon, 
  X, ChevronRight, Send, Home 
} from 'lucide-react';

// Pastikan path import ini benar sesuai struktur folder Anda
import { db, appId, CLOUDINARY_CONFIG } from '../../config/firebase'; 

const Dashboard = ({ 
  news = [], 
  gallery = [], 
  teachers = [], 
  events = [], 
  handleLogout, 
  user 
}) => {
  const [activeTab, setActiveTab] = useState('list');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [greeting, setGreeting] = useState('Selamat Datang');

  // --- STATE FORM ---
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Kegiatan');
  const [author, setAuthor] = useState('Admin');
  const [previewMode, setPreviewMode] = useState(false);
  const [newsUploadMode, setNewsUploadMode] = useState(false); 
  
  // Gallery & Teachers State
  const [galleryImage, setGalleryImage] = useState('');
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryUploadMode, setGalleryUploadMode] = useState(false); 
  
  const [teacherName, setTeacherName] = useState('');
  const [teacherNip, setTeacherNip] = useState('');
  const [teacherPosition, setTeacherPosition] = useState('');
  const [teacherImage, setTeacherImage] = useState('');
  const [teacherUploadMode, setTeacherUploadMode] = useState(false);

  // --- STATE AGENDA (DIPERBARUI) ---
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventCategory, setEventCategory] = useState('Kegiatan'); // Default

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false); 
  const contentRef = useRef(null);

  // Efek Waktu Sapaan
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setGreeting('Selamat Pagi');
    else if (hour < 15) setGreeting('Selamat Siang');
    else if (hour < 18) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');
  }, []);

  // --- SAFE UPLOAD FUNCTION ---
  const handleFileUpload = async (e, setUrl) => {
    const file = e.target.files[0];
    if (!file) return;

    const cloudName = CLOUDINARY_CONFIG?.cloudName;
    const uploadPreset = CLOUDINARY_CONFIG?.uploadPreset;

    if (!cloudName || !uploadPreset) {
        alert("Config Cloudinary belum dipasang! Menggunakan link manual saja.");
        return;
    }

    setIsUploading(true);
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: "POST", body: formData }
        );

        if (!response.ok) throw new Error("Gagal upload");
        const data = await response.json();
        if (data.secure_url) setUrl(data.secure_url);
        
    } catch (error) {
        console.warn("Upload Error:", error);
        if (file.size > 500 * 1024) {
          alert("Gagal upload & File terlalu besar (>500KB).");
        } else {
            const reader = new FileReader();
            reader.onload = (e) => setUrl(e.target.result);
            reader.readAsDataURL(file);
        }
    } finally {
        setIsUploading(false);
    }
  };

  // --- CRUD FUNCTIONS ---
  const handleAddNews = async () => {
    if(!title) return alert("Judul wajib diisi");
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'news'), {
        title, content, imageUrl: imageUrl || "https://placehold.co/600x400/e2e8f0/475569?text=Berita",
        category, author, date: new Date().toLocaleDateString('id-ID'), createdAt: serverTimestamp()
      });
      resetForm(); setActiveTab('list'); alert('Berita Terbit!');
    } catch (e) { alert('Error: ' + e.message); } finally { setIsSubmitting(false); }
  };

  const handleAddGallery = async () => {
    if(!galleryImage) return alert("Gambar wajib ada");
    setIsSubmitting(true);
    try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'gallery'), {
          imageUrl: galleryImage, caption: galleryCaption, date: new Date().toLocaleDateString('id-ID'), createdAt: serverTimestamp()
        });
        setGalleryImage(''); setGalleryCaption(''); alert('Foto ditambahkan!');
    } catch (e) { alert('Error: ' + e.message); } finally { setIsSubmitting(false); }
  };

  const handleAddTeacher = async () => {
    if(!teacherName) return alert("Nama wajib diisi");
    setIsSubmitting(true);
    try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'teachers'), {
          name: teacherName, nip: teacherNip, position: teacherPosition, imageUrl: teacherImage, createdAt: serverTimestamp()
        });
        setTeacherName(''); setTeacherNip(''); setTeacherPosition(''); setTeacherImage(''); alert('Guru ditambahkan!');
    } catch (e) { alert('Error: ' + e.message); } finally { setIsSubmitting(false); }
  };

  const handleAddEvent = async () => {
    if(!eventTitle) return alert("Judul agenda wajib diisi");
    if(!eventDate) return alert("Tanggal wajib diisi");
    
    setIsSubmitting(true);
    try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'events'), {
            title: eventTitle, 
            date: eventDate, 
            category: eventCategory, // Menyimpan kategori yang dipilih
            createdAt: serverTimestamp()
        });
        setEventTitle(''); setEventDate(''); 
        alert('Agenda tersimpan!');
    } catch (e) { 
        alert('Error: ' + e.message); 
    } finally { 
        setIsSubmitting(false); 
    }
  };

  const handleDelete = async (collectionName, id) => {
      if (confirm('Hapus data ini selamanya?')) {
          await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', collectionName, id));
      }
  };

  const resetForm = () => { setTitle(''); setContent(''); setImageUrl(''); setCategory('Kegiatan'); setPreviewMode(false); setNewsUploadMode(false); };
  const insertFormat = (tag) => setContent(prev => prev + `<${tag}>teks...</${tag}> `);
  const handleMenuClick = (tab) => { setActiveTab(tab); setSidebarOpen(false); };

  // Helper untuk Warna Kategori Agenda
  const getEventColor = (cat) => {
      switch(cat) {
          case 'Libur': return 'bg-red-500 shadow-red-500/30';
          case 'Ujian': return 'bg-yellow-500 shadow-yellow-500/30';
          case 'Rapor': return 'bg-blue-500 shadow-blue-500/30';
          case 'Rapat': return 'bg-purple-500 shadow-purple-500/30';
          default: return 'bg-green-500 shadow-green-500/30';
      }
  };

  // --- RENDER ---
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white shadow-2xl transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex items-center justify-between border-b border-slate-800">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold">A</div>
                <span className="font-bold text-lg tracking-wide">Admin Panel</span>
             </div>
             <button onClick={() => setSidebarOpen(false)} className="md:hidden"><X size={24}/></button>
          </div>
          
          <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-180px)]">
             <div className="text-xs font-bold text-slate-500 uppercase px-4 mb-2">Menu Utama</div>
             {[
               { id: 'list', label: 'Dashboard', icon: LayoutDashboard },
               { id: 'editor', label: 'Tulis Berita', icon: PlusCircle },
               { id: 'gallery', label: 'Galeri Foto', icon: ImageIcon },
               { id: 'teachers', label: 'Data Guru', icon: GraduationCap },
               { id: 'agenda', label: 'Agenda', icon: Calendar },
             ].map(item => (
                <button key={item.id} onClick={() => handleMenuClick(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                   <item.icon size={20}/> <span className="font-medium">{item.label}</span>
                   {activeTab === item.id && <ChevronRight size={16} className="ml-auto opacity-70"/>}
                </button>
             ))}
             <div className="pt-4 mt-4 border-t border-slate-800">
                <button onClick={() => window.location.hash = '#home'} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white">
                    <Home size={20}/> <span>Lihat Website</span>
                </button>
             </div>
          </nav>
          
          <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-800 bg-slate-900">
             <div className="flex items-center gap-3 mb-3 px-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-orange-500 border border-slate-700"><User size={16}/></div>
                <div className="overflow-hidden">
                    <p className="text-xs text-slate-300 font-bold truncate">{greeting}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user?.email || 'admin@sekolah.id'}</p>
                </div>
             </div>
             <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition"><LogOut size={16}/> Logout</button>
          </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full bg-stone-50">
         {/* HEADER */}
         <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
             <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-slate-600 rounded-lg hover:bg-slate-100"><Menu size={24} /></button>
                <h2 className="text-lg md:text-xl font-bold text-slate-800 capitalize">{activeTab === 'list' ? 'Dashboard Overview' : activeTab}</h2>
             </div>
             <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
             </div>
         </header>

         {/* CONTENT AREA */}
         <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
             
             {/* LIST TAB */}
             {activeTab === 'list' && (
                <div className="space-y-6 max-w-6xl mx-auto">
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                        {[
                           { label: 'Berita', val: news?.length || 0, color: 'bg-blue-50 text-blue-600', icon: FileText },
                           { label: 'Foto', val: gallery?.length || 0, color: 'bg-purple-50 text-purple-600', icon: ImageIcon },
                           { label: 'Guru', val: teachers?.length || 0, color: 'bg-green-50 text-green-600', icon: GraduationCap },
                           { label: 'Agenda', val: events?.length || 0, color: 'bg-orange-50 text-orange-600', icon: Calendar },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                                <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.color} rounded-xl flex items-center justify-center mb-3`}><stat.icon size={20}/></div>
                                <h3 className="text-2xl font-bold text-slate-800">{stat.val}</h3>
                                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
             )}

             {/* EDITOR TAB */}
             {activeTab === 'editor' && (
                 <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 pb-20">
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                        <div className="p-2 border-b bg-slate-50 flex gap-2">
                             <button onClick={() => setPreviewMode(false)} className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${!previewMode ? 'bg-white shadow text-orange-600' : 'text-slate-500'}`}>Editor</button>
                             <button onClick={() => setPreviewMode(true)} className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${previewMode ? 'bg-white shadow text-orange-600' : 'text-slate-500'}`}>Preview</button>
                        </div>
                        {!previewMode ? (
                        <div className="p-6 space-y-4 flex-1">
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-lg font-bold" placeholder="Judul Berita..." />
                            <div className="flex gap-4">
                                <select value={category} onChange={e => setCategory(e.target.value)} className="w-1/2 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"><option>Kegiatan</option><option>Prestasi</option><option>Pengumuman</option></select>
                                <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-1/2 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm" placeholder="Penulis" />
                            </div>
                            <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[400px]">
                                <div className="bg-slate-50 border-b p-2 flex gap-1"><button onClick={() => insertFormat('b')} className="p-2 hover:bg-white rounded font-bold text-xs">B</button><button onClick={() => insertFormat('i')} className="p-2 hover:bg-white rounded italic text-xs">I</button></div>
                                <textarea ref={contentRef} value={content} onChange={e => setContent(e.target.value)} className="w-full flex-1 p-4 outline-none resize-none text-sm leading-relaxed" placeholder="Tulis konten..."></textarea>
                            </div>
                        </div>
                        ) : (
                        <div className="p-8 bg-white min-h-[500px] overflow-y-auto">
                            <h1 className="text-3xl font-bold mb-4">{title}</h1>
                            {imageUrl && <img src={imageUrl} className="w-full h-64 object-cover rounded-xl mb-6"/>}
                            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{__html: content}}></div>
                        </div>
                        )}
                    </div>
                    <div className="w-full lg:w-80 space-y-4">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-sm mb-4">Gambar Utama</h3>
                            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg mb-3">
                                <button onClick={() => setNewsUploadMode(false)} className={`flex-1 py-1.5 rounded text-xs font-bold ${!newsUploadMode ? 'bg-white shadow' : 'text-slate-500'}`}>Link</button>
                                <button onClick={() => setNewsUploadMode(true)} className={`flex-1 py-1.5 rounded text-xs font-bold ${newsUploadMode ? 'bg-white shadow' : 'text-slate-500'}`}>Upload</button>
                            </div>
                            {newsUploadMode ? (
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center relative cursor-pointer hover:bg-slate-50 transition">
                                    <input type="file" onChange={(e) => handleFileUpload(e, setImageUrl)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    {isUploading ? <span className="text-orange-500 text-xs font-bold">Mengupload...</span> : <UploadCloud className="mx-auto text-slate-400 mb-1"/>}
                                    <p className="text-xs text-slate-400">Klik untuk upload</p>
                                </div>
                            ) : (
                                <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xs" placeholder="https://..." />
                            )}
                            {imageUrl && <div className="mt-3 relative"><img src={imageUrl} className="w-full h-32 object-cover rounded-lg bg-slate-100"/><button onClick={()=>setImageUrl('')} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X size={12}/></button></div>}
                        </div>
                        <button onClick={handleAddNews} disabled={isSubmitting} className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2">{isSubmitting ? 'Memproses...' : <><Send size={16}/> Terbitkan</>}</button>
                    </div>
                 </div>
             )}

             {/* GALLERY TAB */}
             {activeTab === 'gallery' && (
                 <div className="max-w-5xl mx-auto space-y-6 pb-12">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-bold text-lg mb-4">Upload Foto</h3>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 space-y-3">
                                <div className="flex gap-2">
                                     <button onClick={() => setGalleryUploadMode(false)} className={`px-3 py-1 rounded text-xs border ${!galleryUploadMode ? 'bg-slate-800 text-white' : 'bg-white'}`}>Link</button>
                                     <button onClick={() => setGalleryUploadMode(true)} className={`px-3 py-1 rounded text-xs border ${galleryUploadMode ? 'bg-slate-800 text-white' : 'bg-white'}`}>Upload</button>
                                </div>
                                {galleryUploadMode ? (
                                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center relative cursor-pointer">
                                        <input type="file" onChange={(e) => handleFileUpload(e, setGalleryImage)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <p className="text-xs text-slate-500">{isUploading ? 'Loading...' : 'Pilih Gambar'}</p>
                                    </div>
                                ) : (
                                    <input type="text" value={galleryImage} onChange={e => setGalleryImage(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="https://..." />
                                )}
                                <input type="text" value={galleryCaption} onChange={e => setGalleryCaption(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Caption Foto" />
                                <button onClick={handleAddGallery} disabled={!galleryImage || isSubmitting} className="w-full py-2 bg-slate-900 text-white font-bold rounded-lg">Simpan</button>
                            </div>
                            <div className="w-full md:w-40 aspect-square bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border">
                                {galleryImage ? <img src={galleryImage} className="w-full h-full object-cover"/> : <span className="text-xs text-slate-400">Preview</span>}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {gallery && gallery.map(item => (
                            <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 border hover:shadow-lg transition">
                                <img src={item.imageUrl} className="w-full h-full object-cover"/>
                                <button onClick={() => handleDelete('gallery', item.id)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition"><Trash2 size={12}/></button>
                                <div className="absolute bottom-0 w-full bg-black/60 p-2 text-white text-[10px] truncate">{item.caption}</div>
                            </div>
                        ))}
                    </div>
                 </div>
             )}

             {/* TEACHERS TAB */}
             {activeTab === 'teachers' && (
                <div className="max-w-4xl mx-auto space-y-6 pb-12">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-bold mb-4">Tambah Guru</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <input type="text" value={teacherName} onChange={e => setTeacherName(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Nama Lengkap" />
                                <input type="text" value={teacherPosition} onChange={e => setTeacherPosition(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Jabatan" />
                                <input type="text" value={teacherImage} onChange={e => setTeacherImage(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="URL Foto" />
                                <button onClick={handleAddTeacher} className="w-full py-2 bg-slate-900 text-white font-bold rounded-lg">Simpan Data</button>
                            </div>
                            <div className="flex justify-center items-center bg-slate-50 rounded-xl border border-dashed">
                                {teacherImage ? <img src={teacherImage} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"/> : <User className="text-slate-300" size={48}/>}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {teachers && teachers.map(t => (
                            <div key={t.id} className="flex items-center gap-3 p-3 bg-white border rounded-xl shadow-sm">
                                <img src={t.imageUrl} className="w-12 h-12 rounded-full object-cover bg-slate-200"/>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm truncate">{t.name}</h4>
                                    <p className="text-xs text-orange-600 font-bold">{t.position}</p>
                                </div>
                                <button onClick={() => handleDelete('teachers', t.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>
                </div>
             )}

             {/* --- TAB 5: AGENDA (UPDATED) --- */}
             {activeTab === 'agenda' && (
                <div className="max-w-4xl mx-auto space-y-6 pb-12">
                     <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-bold mb-4 text-lg">Tambah Agenda / Kalender</h3>
                        <div className="grid md:grid-cols-4 gap-4 items-end">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Nama Kegiatan</label>
                                <input type="text" value={eventTitle} onChange={e => setEventTitle(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm" placeholder="Contoh: Ujian Akhir Semester"/>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Tanggal</label>
                                <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm"/>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Kategori</label>
                                <select value={eventCategory} onChange={e => setEventCategory(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-sm">
                                    <option value="Kegiatan">Kegiatan Sekolah</option>
                                    <option value="Ujian">Ujian / Tes</option>
                                    <option value="Libur">Libur / Cuti</option>
                                    <option value="Rapor">Pembagian Rapor</option>
                                    <option value="Rapat">Rapat Guru</option>
                                </select>
                            </div>

                            <button onClick={handleAddEvent} className="md:col-span-4 w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition shadow-lg mt-2 flex justify-center items-center gap-2">
                                {isSubmitting ? 'Menyimpan...' : <><Save size={18}/> Simpan Agenda</>}
                            </button>
                        </div>
                     </div>
                     
                     <div className="space-y-3">
                        {events && events.map((ev, i) => (
                             <div key={ev.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:translate-x-1 transition duration-300">
                                 <div className="flex items-center gap-4">
                                     <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white font-bold shadow-md ${getEventColor(ev.category)}`}>
                                         <span className="text-xl leading-none">{new Date(ev.date).getDate()}</span>
                                         <span className="text-[10px] uppercase opacity-80">{new Date(ev.date).toLocaleString('default', { month: 'short' })}</span>
                                     </div>
                                     <div>
                                         <h4 className="font-bold text-slate-800">{ev.title}</h4>
                                         <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 mr-2">{ev.category}</span>
                                         <span className="text-xs text-slate-400">{new Date(ev.date).getFullYear()}</span>
                                     </div>
                                 </div>
                                 <button onClick={() => handleDelete('events', ev.id)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-300 hover:bg-red-50 hover:text-red-500 transition"><Trash2 size={16}/></button>
                             </div>
                        ))}
                        {events.length === 0 && <div className="text-center py-10 text-slate-400">Belum ada agenda terjadwal.</div>}
                     </div>
                </div>
             )}
         </div>
      </main>
    </div>
  );
};

export default Dashboard;