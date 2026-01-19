import React from 'react';
import { SEO } from '../../components/common/SEO';

const Login = ({ navigateTo, handleLogin }) => (
  <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 pt-20">
    <SEO title="Login Admin" description="Halaman login administrator website sekolah." />
    <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-red-500"></div>
      <div className="text-center mb-10">
         <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-slate-100 mx-auto mb-6 shadow-xl p-2">
            <img src="https://cdn-icons-png.flaticon.com/512/3281/3281329.png" alt="Logo" className="w-full h-full object-contain" />
         </div>
         <h2 className="text-3xl font-extrabold text-slate-800">Selamat Datang</h2>
         <p className="text-slate-400 mt-2">Silakan login untuk mengakses dashboard admin.</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-6">
        <div><label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label><input type="email" name="email" placeholder="admin@sekolah.id" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" required /></div>
        <div><label className="block text-sm font-bold text-slate-700 mb-2">Password</label><input type="password" name="password" placeholder="••••••••" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition" required /></div>
        <button type="submit" className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-900 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">Masuk Dashboard</button>
      </form>
      <div className="mt-8 text-center"><button onClick={() => navigateTo('home')} className="text-sm text-slate-500 hover:text-orange-600 font-medium transition">← Kembali ke Beranda</button></div>
    </div>
  </div>
);
export default Login;