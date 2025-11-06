import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LeftNav from './LeftNav';
import SuperadminUsers from './SuperadminUsers';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import Orders from './Orders';
import Cart from './Cart';


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState('home');
  const navigate = useNavigate();
  const params = useParams();
  const role = params.role || params.id || params.slug;
  
  // Determine initial tab based on role
  const [activeTab, setActiveTab] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role === 'seller') return 'overview';
      if (userData.role === 'buyer') return 'browse';
    }
    return 'overview';
  });

  useEffect(() => {
    // Try to get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!user) return null;

  if (role === 'admin' && user.role === 'superadmin') {
    const onMenuSelect = (key) => {
      if (key === 'logout') return handleLogout();
      setMenu(key);
    };

    return (
      <div className="min-h-screen flex bg-amber-50">
        <LeftNav onMenuSelect={onMenuSelect} active={menu} />
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#7c3f00]">Superadmin Dashboard</h1>
              <p className="text-sm text-gray-600">Signed in as <span className="font-medium">{user.username || user.email}</span></p>
            </div>
            <div>
              <button onClick={handleLogout} className="px-4 py-2 rounded bg-gradient-to-r from-[#a0522d] to-[#deb887] text-white font-semibold shadow">
                Logout
              </button>
            </div>
          </header>

          <main className="p-8">
            {menu === 'home' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-lg shadow border border-[#deb887]">
                  <h3 className="font-bold text-lg text-[#7c3f00]">Overview</h3>
                  <p className="mt-2 text-sm text-gray-700">Quick stats and recent activity will appear here.</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow border border-[#deb887]">
                  <h3 className="font-bold text-lg text-[#7c3f00]">User Management</h3>
                  <p className="mt-2 text-sm text-gray-700">Verify artisans and manage user accounts.</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow border border-[#deb887]">
                  <h3 className="font-bold text-lg text-[#7c3f00]">Reports</h3>
                  <p className="mt-2 text-sm text-gray-700">View analytics and platform health.</p>
                </div>
              </div>
            )}

            {menu === 'users' && <SuperadminUsers />}

            {menu === 'products' && <ProductList userRole={user.role} userId={user.id} />}

            {menu === 'orders' && <Orders />}

            {menu === 'reports' && (
              <div className="p-6 bg-white rounded-lg shadow border border-[#deb887]">
                <h3 className="font-bold text-lg text-[#7c3f00]">Reports</h3>
                <p className="mt-2 text-sm text-gray-700">Reports and analytics coming soon.</p>
              </div>
            )}

            {menu === 'settings' && (
              <div className="p-6 bg-white rounded-lg shadow border border-[#deb887]">
                <h3 className="font-bold text-lg text-[#7c3f00]">Settings</h3>
                <p className="mt-2 text-sm text-gray-700">Platform settings and configuration.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  // Artisan Dashboard with proper layout
  if ((role === 'artisan' && user.role === 'seller') || (user.role === 'seller' && role === user.slug)) {
    return (
      <div className="min-h-screen flex flex-col bg-amber-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#7c3f00]">Artisan Dashboard</h1>
            <p className="text-sm text-gray-600">Signed in as <span className="font-medium">{user.username || user.email}</span></p>
          </div>
          <div>
            <button onClick={handleLogout} className="px-4 py-2 rounded bg-gradient-to-r from-[#a0522d] to-[#deb887] text-white font-semibold shadow">
              Logout
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'overview' ? 'border-[#7c3f00] text-[#7c3f00]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('add-product')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'add-product' ? 'border-[#7c3f00] text-[#7c3f00]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Add Product
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'products' ? 'border-[#7c3f00] text-[#7c3f00]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'orders' ? 'border-[#7c3f00] text-[#7c3f00]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Orders
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-lg shadow border border-[#deb887]">
                <h3 className="font-bold text-lg text-[#7c3f00]">Crafts & Portfolio</h3>
                <p className="mt-2 text-sm text-gray-700">Manage your handmade crafts and showcase your portfolio to customers.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow border border-[#deb887]">
                <h3 className="font-bold text-lg text-[#7c3f00]">Orders</h3>
                <p className="mt-2 text-sm text-gray-700">View and fulfill customer orders for your products.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow border border-[#deb887]">
                <h3 className="font-bold text-lg text-[#7c3f00]">Earnings</h3>
                <p className="mt-2 text-sm text-gray-700">Track your sales and earnings from craft sales.</p>
              </div>
            </div>
          )}

          {activeTab === 'add-product' && (
            <div className="max-w-2xl">
              <ProductForm onSuccess={() => { setActiveTab('products'); window.location.reload(); }} />
            </div>
          )}

          {activeTab === 'products' && (
            <ProductList userRole={user.role} userId={user.id} />
          )}

          {activeTab === 'orders' && (
            <Orders />
          )}
        </main>
      </div>
    );
  }

  // Customer Dashboard with proper layout
  if ((role === 'customer' && user.role === 'buyer') || (user.role === 'buyer' && role === user.slug)) {
    return (
      <div className="min-h-screen flex flex-col bg-amber-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#7c3f00]">Customer Dashboard</h1>
            <p className="text-sm text-gray-600">Signed in as <span className="font-medium">{user.username || user.email}</span></p>
          </div>
          <div>
            <button onClick={handleLogout} className="px-4 py-2 rounded bg-gradient-to-r from-[#a0522d] to-[#deb887] text-white font-semibold shadow">
              Logout
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 flex gap-6">
            <button
              onClick={() => setActiveTab('browse')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'browse' ? 'border-[#7c3f00] text-[#7c3f00]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Browse Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'orders' ? 'border-[#7c3f00] text-[#7c3f00]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Orders
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'cart' ? 'border-[#7c3f00] text-[#7c3f00]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Cart
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'wishlist' ? 'border-[#7c3f00] text-[#7c3f00]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Wishlist
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'browse' && (
            <ProductList userRole={user.role} userId={user.id} />
          )}

          {activeTab === 'orders' && (
            <Orders />
          )}

          {activeTab === 'cart' && (
            <Cart />
          )}

          {activeTab === 'wishlist' && (
            <div className="p-6 bg-white rounded-lg shadow border border-[#deb887]">
              <h3 className="font-bold text-lg text-[#7c3f00] mb-4">My Wishlist</h3>
              <p className="text-sm text-gray-700">Save your favorite products here for later.</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Fallback for access denied
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg border border-[#deb887] text-center">
        <div className="text-lg text-red-600">Access denied or unknown role.</div>
        <button onClick={handleLogout} className="mt-8 px-6 py-2 rounded bg-gradient-to-r from-[#a0522d] to-[#deb887] text-white font-bold shadow hover:from-[#deb887] hover:to-[#a0522d] transition-all duration-200">
          Logout
        </button>
      </div>
    </div>
  );
}
