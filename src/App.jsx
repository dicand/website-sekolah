import React, { useState, useEffect } from 'react';
import { signInAnonymously, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { auth, db, appId } from './config/firebase';

// Styles
import './styles/index.css';

// Layouts
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';

// Pages
import Home from './pages/public/Home';
import Profil from './pages/public/Profil';
import Berita from './pages/public/Berita';
import Galeri from './pages/public/Galeri';
import Kalender from './pages/public/Kalender';
import Ekstrakurikuler from './pages/public/Ekstrakurikuler';
import Layanan from './pages/public/Layanan';
import Kontak from './pages/public/Kontak';
import Login from './pages/public/Login';
import AdminDashboard from './pages/admin/Dashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  
  const [news, setNews] = useState([]);
  const [gallery, setGallery] = useState([]); 
  const [teachers, setTeachers] = useState([]); 
  const [events, setEvents] = useState([]); 
  
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pendingScrollId, setPendingScrollId] = useState(null);

  useEffect(() => {
    if (!window.history.state) window.history.replaceState({ view: 'home', scrollId: null }, '', '#home');
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
        setPendingScrollId(event.state.scrollId || null);
        setMobileMenuOpen(false);
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser && !currentUser.isAnonymous && currentUser.email) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
            if (!currentUser) await signInAnonymously(auth).catch(e => console.error(e));
        }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
     if(!db) return;
     
     const newsRef = query(collection(db, 'artifacts', appId, 'public', 'data', 'news'));
     const unsubNews = onSnapshot(newsRef, (snapshot) => {
       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
       setNews(data);
       setLoading(false);
     });

     const galleryRef = query(collection(db, 'artifacts', appId, 'public', 'data', 'gallery'));
     const unsubGallery = onSnapshot(galleryRef, (snapshot) => {
       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
       setGallery(data);
     });

     const teacherRef = query(collection(db, 'artifacts', appId, 'public', 'data', 'teachers'));
     const unsubTeachers = onSnapshot(teacherRef, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => a.name.localeCompare(b.name));
        setTeachers(data);
     });

     const eventRef = query(collection(db, 'artifacts', appId, 'public', 'data', 'events'));
     const unsubEvents = onSnapshot(eventRef, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(data);
     });

     return () => { unsubNews(); unsubGallery(); unsubTeachers(); unsubEvents(); };
  }, []);

  useEffect(() => {
    if (currentView === 'profil' && pendingScrollId) {
        setTimeout(() => {
            const element = document.getElementById(pendingScrollId);
            if (element) {
                const headerOffset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                setPendingScrollId(null);
            }
        }, 300);
    }
  }, [currentView, pendingScrollId]);

  const navigateTo = (view, scrollId = null) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setPendingScrollId(scrollId);
    if (view !== 'admin' && !scrollId) window.scrollTo({ top: 0, behavior: 'smooth' });

    const urlHash = scrollId ? `#${view}/${scrollId}` : `#${view}`;
    if (window.history.state?.view !== view || window.history.state?.scrollId !== scrollId) {
        window.history.pushState({ view, scrollId }, '', urlHash);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        navigateTo('admin');
    } catch (error) {
        alert("Login Gagal. Cek email/password.");
    }
  };

  const handleLogout = async () => {
    try {
        await signOut(auth);
        setIsAdmin(false);
        navigateTo('home');
    } catch (error) { console.error(error); }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-stone-50 selection:bg-orange-200 selection:text-orange-900">
      
      {currentView !== 'admin' && currentView !== 'login' && (
        <Navbar 
          currentView={currentView}
          navigateTo={navigateTo}
          isAdmin={isAdmin}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          scrolled={scrolled}
        />
      )}
      
      <main className="flex-grow">
        {currentView === 'home' && <Home navigateTo={navigateTo} news={news} loading={loading} gallery={gallery} />}
        {currentView === 'profil' && <Profil navigateTo={navigateTo} teachers={teachers} />}
        {currentView === 'berita' && <Berita news={news} loading={loading} />}
        {currentView === 'kalender' && <Kalender events={events} loading={loading} />}
        {currentView === 'ekskul' && <Ekstrakurikuler />}
        {currentView === 'galeri' && <Galeri gallery={gallery} loading={loading} />}
        {currentView === 'layanan' && <Layanan />}
        {currentView === 'kontak' && <Kontak />}
        
        {currentView === 'login' && <Login navigateTo={navigateTo} handleLogin={handleLogin} />}
        
        {currentView === 'admin' && isAdmin && (
          <AdminDashboard 
            news={news} 
            gallery={gallery} 
            teachers={teachers} 
            events={events} 
            loading={loading}
            handleLogout={handleLogout}
            user={user}
          />
        )}
        
        {currentView === 'admin' && !isAdmin && (
            <div className="text-center py-40">
              <p className="text-xl font-bold text-slate-800">Akses Ditolak.</p>
              <button onClick={() => navigateTo('login')} className="text-orange-600 font-bold underline mt-4">Login</button>
            </div>
        )}
      </main>

      {currentView !== 'admin' && currentView !== 'login' && <Footer navigateTo={navigateTo} />}
    </div>
  );
}