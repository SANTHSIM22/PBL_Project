import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const ProductForm = ({ product, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    madeBy: '',
    imageUrl: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        madeBy: product.madeBy || '',
        imageUrl: product.imageUrl || '',
        price: product.price || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = product 
        ? `${API_BASE_URL}/api/products/${product._id}`
        : `${API_BASE_URL}/api/products`;
      
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(form)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      if (onSuccess) onSuccess(data);
      
      // Reset form if creating new product
      if (!product) {
        setForm({ name: '', madeBy: '', imageUrl: '', price: '' });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-[#deb887]">
      <h3 className="text-xl font-bold text-[#7c3f00] mb-4">
        {product ? 'Edit Product' : 'Add New Product'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-[#7c3f00]">Product Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#deb887]"
            placeholder="e.g., Handwoven Basket"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#7c3f00]">Made By</label>
          <input
            type="text"
            name="madeBy"
            value={form.madeBy}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#deb887]"
            placeholder="e.g., Artisan Name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#7c3f00]">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#deb887]"
            placeholder="e.g., 999.00"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#7c3f00]">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#deb887]"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {form.imageUrl && (
          <div className="mt-2">
            <img 
              src={form.imageUrl} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded border"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        )}

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded bg-gradient-to-r from-[#deb887] to-[#a0522d] text-white font-bold shadow hover:from-[#a0522d] hover:to-[#deb887] transition-all duration-200"
          >
            {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
