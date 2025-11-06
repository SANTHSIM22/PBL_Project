import React from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import SuperadminUsers from './components/SuperadminUsers';
import ArtisanProfile from './components/ArtisanProfile';
import DashboardRouter from './components/DashboardRouter';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Orders from './components/Orders';

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <header className="mb-10 text-center">
        <div className="inline-block p-2 rounded-full bg-gradient-to-br from-[#deb887] to-white shadow border-2 border-[#a0522d] mb-4">
          <svg width="56" height="56" viewBox="0 0 60 60" fill="none" className="mx-auto">
            <circle cx="30" cy="30" r="26" stroke="#a0522d" strokeWidth="2.5" fill="#fff8f3" />
            <path d="M20 40 Q30 20 40 40" stroke="#deb887" strokeWidth="2" fill="none" />
            <circle cx="30" cy="30" r="4" fill="#a0522d" />
          </svg>
        </div>
        <h1 className="text-5xl font-extrabold text-[#7c3f00] drop-shadow font-serif tracking-wide">Artisan Connect Platform</h1>
        <p className="mt-4 text-xl text-[#a0522d] font-medium max-w-2xl mx-auto">
          Bridging local artisans and customers through culture, craft, and community.
        </p>
      </header>
      <nav className="flex gap-8 mb-14">
        <Link to="/login" className="px-8 py-3 rounded-full bg-gradient-to-r from-[#deb887] to-[#a0522d] text-[#4e2e0e] font-bold border border-[#deb887] text-lg shadow hover:from-[#a0522d] hover:to-[#deb887] hover:text-white hover:border-[#a0522d] transition-all duration-200">Login</Link>
        <Link to="/signup" className="px-8 py-3 rounded-full bg-gradient-to-r from-[#deb887] to-[#a0522d] text-[#4e2e0e] font-bold border border-[#deb887] text-lg shadow hover:from-[#a0522d] hover:to-[#deb887] hover:text-white hover:border-[#a0522d] transition-all duration-200">Sign Up</Link>
        <a href="/explore" className="px-8 py-3 rounded-full bg-gradient-to-r from-[#deb887] to-[#a0522d] text-[#4e2e0e] font-bold border border-[#deb887] text-lg shadow hover:from-[#a0522d] hover:to-[#deb887] hover:text-white hover:border-[#a0522d] transition-all duration-200">Explore Crafts</a>
      </nav>
      <section className="bg-white/90 rounded-2xl shadow-xl p-10 max-w-3xl text-center border-2 border-[#deb887]">
        <h2 className="text-3xl font-bold text-[#7c3f00] mb-6 font-serif tracking-wide">Why Artisan Connect?</h2>
        <ul className="list-disc list-inside text-lg text-[#7c3f00] space-y-2">
          <li>Discover authentic handmade crafts from across regions</li>
          <li>Support local artisans and preserve cultural heritage</li>
          <li>Multilingual, accessible, and inclusive platform</li>
          <li>Secure payments and transparent order tracking</li>
        </ul>
      </section>
      <footer className="mt-20 text-[#a0522d] text-base opacity-90 font-serif tracking-wide">
        <span className="inline-block border-t-2 border-[#deb887] w-24 mb-2"></span><br />
        &copy; {new Date().getFullYear()} Artisan Connect. All rights reserved.
      </footer>
    </div>
  );
}



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard/:id" element={<DashboardRouter />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Orders />} />
      {/* Optional: direct route for superadmin users view */}
      <Route path="/superadmin/users" element={<SuperadminUsers />} />
      <Route path="/dashboard/:role/:slug" element={<ArtisanProfile />} />
    </Routes>
  );
}

export default App;
