import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, loginSuperadmin } from '../api';

const roles = [
  { value: 'artisan', label: 'Artisan' },
  { value: 'customer', label: 'Customer' },
  { value: 'admin', label: 'Admin' },
];

export default function Login() {
  const [form, setForm] = useState({ emailOrUsername: '', password: '', role: 'artisan' });
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
      let data = { ...form };
      if (form.role === 'admin') {
        // For admin, use superadmin endpoint
        const res = await loginSuperadmin({ username: form.emailOrUsername, password: form.password });
        if (res.token) {
          localStorage.setItem('user', JSON.stringify({ username: res.user.username, role: res.user.role }));
          localStorage.setItem('token', res.token);
          navigate('/dashboard/admin');
        } else {
          setError(res.error || 'Login failed');
        }
      } else {
        // For artisan/customer
        const res = await loginUser({ emailOrUsername: form.emailOrUsername, password: form.password });
        if (res.token) {
          // Only allow login if selected role matches user's registered role
          const expectedRole = res.user.role === 'seller' ? 'artisan' : 'customer';
          if (form.role !== expectedRole) {
            setError('Role mismatch: Please select the correct role for your account.');
            return;
          }
          localStorage.setItem('user', JSON.stringify(res.user));
          localStorage.setItem('token', res.token);
          // If the user has a slug, navigate to their personalized dashboard URL (applies to both artisans and customers)
          if (res.user.slug) {
            navigate(`/dashboard/${res.user.slug}`);
          } else {
            navigate(`/dashboard/${expectedRole}`);
          }
        } else {
          setError(res.error || 'Login failed');
        }
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-[#deb887]">
        <h2 className="text-2xl font-bold text-[#7c3f00] mb-6 text-center font-serif">Login</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-[#7c3f00]">Role</label>
          <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#deb887]">
            {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-[#7c3f00]">Email or Username</label>
          <input name="emailOrUsername" type="text" value={form.emailOrUsername} onChange={handleChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#deb887]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-[#7c3f00]">Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#deb887]" />
        </div>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <button type="submit" disabled={loading} className="w-full py-2 rounded bg-gradient-to-r from-[#deb887] to-[#a0522d] text-white font-bold shadow hover:from-[#a0522d] hover:to-[#deb887] transition-all duration-200">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
