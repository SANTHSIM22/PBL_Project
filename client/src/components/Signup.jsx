import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';

const roles = [
  { value: 'artisan', label: 'Artisan' },
  { value: 'customer', label: 'Customer' },
];

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '', role: 'artisan' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
    
      let backendRole = form.role === 'artisan' ? 'seller' : 'buyer';
      const payload = { ...form, role: backendRole };
      const res = await registerUser(payload);
      if (res.token) {
        navigate('/');
      } else {
        setError(res.error || 'Signup failed');
      }
    } catch (err) {
      setError('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-[#deb887]">
        <h2 className="text-2xl font-bold text-[#7c3f00] mb-6 text-center font-serif">Sign Up</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-[#7c3f00]">Role</label>
          <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#deb887]">
            {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-[#7c3f00]">Username</label>
          <input name="username" type="text" value={form.username} onChange={handleChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#deb887]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-[#7c3f00]">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#deb887]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-[#7c3f00]">Phone Number</label>
          <input name="phone" type="tel" value={form.phone} onChange={handleChange} required pattern="[0-9]{10,15}" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#deb887]" placeholder="e.g. 9876543210" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-[#7c3f00]">Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#deb887]" />
        </div>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <button type="submit" disabled={loading} className="w-full py-2 rounded bg-gradient-to-r from-[#deb887] to-[#a0522d] text-white font-bold shadow hover:from-[#a0522d] hover:to-[#deb887] transition-all duration-200">
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
