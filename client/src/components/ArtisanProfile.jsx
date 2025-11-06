import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const ArtisanProfile = ({ slug: propSlug }) => {
  const params = useParams();
  const slug = propSlug || params.slug || params.id;
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/auth/slug/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch artisan');
        return res.json();
      })
      .then((data) => {
        setArtisan(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow border border-[#deb887]">
      <header className="flex items-center gap-4 mb-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-2xl">{artisan.username?.[0]?.toUpperCase()}</div>
        <div>
          <h2 className="text-2xl font-bold text-[#7c3f00]">{artisan.username}</h2>
          <p className="text-sm text-gray-600">{artisan.email} • {artisan.phone || '-'}</p>
          <p className="text-xs text-gray-500 mt-1">Profile: {window.location.href}</p>
        </div>
      </header>
      <section>
        <h3 className="font-semibold text-[#7c3f00]">About</h3>
        <p className="mt-2 text-gray-700">This is the artisan public profile. You can add more details like bio, craft type, portfolio etc.</p>
      </section>
    </div>
  );
};

export default ArtisanProfile;
