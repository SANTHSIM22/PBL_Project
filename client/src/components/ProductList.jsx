import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import ProductForm from './ProductForm';

const ProductList = ({ userRole, userId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch products');
      
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      setAddingToCart(productId);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add to cart');
      }

      alert('Product added to cart!');
    } catch (err) {
      alert(err.message);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete product');
      }

      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditSuccess = (updatedProduct) => {
    setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
    setEditingProduct(null);
  };

  const canEdit = (product) => {
    // Admin can edit any product, artisan can edit their own
    return userRole === 'superadmin' || product.artisanId?._id === userId;
  };

  if (loading) return <div className="text-center py-8">Loading products...</div>;
  if (error) return <div className="text-red-600 text-center py-8">Error: {error}</div>;

  if (editingProduct) {
    return (
      <ProductForm
        product={editingProduct}
        onSuccess={handleEditSuccess}
        onCancel={() => setEditingProduct(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-[#7c3f00]">All Products</h3>
        <div className="text-sm text-gray-600">{products.length} products</div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No products yet. {userRole === 'seller' && 'Add your first product above!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
              <div className="p-4">
                <h4 className="text-lg font-bold text-[#7c3f00] mb-2">{product.name}</h4>
                <p className="text-sm text-gray-600 mb-1">Made by: {product.madeBy}</p>
                <p className="text-xl font-bold text-[#a0522d] mb-2">₹{product.price}</p>
                <p className="text-xs text-gray-500 mb-3">
                  By {product.artisanId?.username || 'Unknown'}
                </p>

                <div className="flex gap-2 flex-wrap">
                  {userRole === 'buyer' && (
                    <>
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        disabled={addingToCart === product._id}
                        className="px-4 py-2 rounded bg-[#8b7355] text-white text-sm font-semibold hover:bg-[#6d5942] disabled:bg-gray-400"
                      >
                        {addingToCart === product._id ? 'Adding...' : 'Add to Cart'}
                      </button>
                      <button className="px-4 py-2 rounded bg-gradient-to-r from-[#deb887] to-[#a0522d] text-white text-sm font-semibold hover:from-[#a0522d] hover:to-[#deb887]">
                        Buy Now
                      </button>
                    </>
                  )}

                  {canEdit(product) && (
                    <>
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="px-4 py-2 rounded bg-blue-100 text-blue-700 text-sm font-semibold hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="px-4 py-2 rounded bg-red-100 text-red-700 text-sm font-semibold hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
