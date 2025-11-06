import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';

const SuperadminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `${API_BASE_URL}/api/auth/superadmin/users`;
    fetch(url, { credentials: 'include' })
      .then(async (res) => {
        const text = await res.text();
        // If server returned HTML (like index.html), short-circuit with a helpful error
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        try {
          return JSON.parse(text);
        } catch (e) {
          throw new Error('Invalid JSON response from server (received HTML or plain text)');
        }
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-8 text-lg font-semibold text-gray-600">Loading users...</div>;
  if (error) return <div className="text-center text-red-600 font-semibold py-8">Error: {error}</div>;

  return (
    <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border border-[#deb887] p-6 mt-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#7c3f00] font-serif mb-1 tracking-wide">Users</h2>
          <p className="text-[#a0522d] text-sm">Superadmin can view all registered artisans and customers (passwords hidden)</p>
        </div>
        <div className="text-sm text-gray-700">Total users: <span className="font-semibold">{users.length}</span></div>
      </header>

      {/* split into two columns on medium+ screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Artisans (sellers) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#7c3f00]">Artisans</h3>
            <div className="text-sm text-gray-600">{users.filter(u => u.role === 'seller').length} total</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-700">
                  <th className="py-2 px-3">Username</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Phone</th>
                  <th className="py-2 px-3">Profile</th>
                  <th className="py-2 px-3">Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.role === 'seller').map(user => (
                  <ArtisanRow key={user._id} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customers (buyers) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#7c3f00]">Customers</h3>
            <div className="text-sm text-gray-600">{users.filter(u => u.role === 'buyer').length} total</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-700">
                  <th className="py-2 px-3">Username</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Phone</th>
                  <th className="py-2 px-3">Profile</th>
                  <th className="py-2 px-3">Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.role === 'buyer').map(user => (
                  <CustomerRow key={user._id} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuperadminUsers;

// Sub-component for artisan row to encapsulate copy/open logic
function ArtisanRow({ user }) {
  const [copied, setCopied] = React.useState(false);
  const profileUrl = `${window.location.origin}/dashboard/${user.slug || ''}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // fallback
      const el = document.createElement('textarea');
      el.value = profileUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <tr className="border-t hover:bg-amber-50">
      <td className="py-2 px-3">{user.username}</td>
      <td className="py-2 px-3">{user.email}</td>
      <td className="py-2 px-3">{user.phone || '-'}</td>
      <td className="py-2 px-3">
        <div className="flex items-center gap-2">
          <a href={profileUrl} target="_blank" rel="noreferrer" className="text-sm px-2 py-1 bg-amber-100 rounded text-[#7c3f00]">Open</a>
          <button onClick={handleCopy} className="text-sm px-2 py-1 bg-gray-100 rounded">{copied ? 'Copied!' : 'Copy'}</button>
        </div>
      </td>
      <td className="py-2 px-3">{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</td>
    </tr>
  );
}

function CustomerRow({ user }) {
  const [copied, setCopied] = React.useState(false);
  const profileUrl = `${window.location.origin}/dashboard/${user.slug || ''}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      const el = document.createElement('textarea');
      el.value = profileUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <tr className="border-t hover:bg-amber-50">
      <td className="py-2 px-3">{user.username}</td>
      <td className="py-2 px-3">{user.email}</td>
      <td className="py-2 px-3">{user.phone || '-'}</td>
      <td className="py-2 px-3">
        <div className="flex items-center gap-2">
          <a href={`${window.location.origin}/dashboard/${user.slug || ''}`} target="_blank" rel="noreferrer" className="text-sm px-2 py-1 bg-amber-100 rounded text-[#7c3f00]">Open</a>
          <button onClick={handleCopy} className="text-sm px-2 py-1 bg-gray-100 rounded">{copied ? 'Copied!' : 'Copy'}</button>
        </div>
      </td>
      <td className="py-2 px-3">{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</td>
    </tr>
  );
}
