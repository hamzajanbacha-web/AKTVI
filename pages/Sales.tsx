
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ShoppingBag, ChevronRight, MessageCircle, Star, Plus, Edit, X, Save, Search } from 'lucide-react';
import PhotoModule from '../components/PhotoModule';

interface SalesProps {
  products: Product[];
  onBuy: (product: Product) => void;
  isAdmin?: boolean;
  onAddProduct?: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct?: (product: Product) => void;
}

const Sales: React.FC<SalesProps> = ({ products, onBuy, isAdmin, onAddProduct, onUpdateProduct }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const WHATSAPP_NUMBER = '03155241756';

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  const handleWhatsAppBuy = (product: Product) => {
    const message = `Hello, I am interested in buying: ${product.name} (${product.price}). Please share details.`;
    const url = `https://wa.me/92${WHATSAPP_NUMBER.slice(1)}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleSaveProduct = () => {
    if (!editingProduct?.name || !editingProduct?.price) {
      alert("Name and Price are required.");
      return;
    }
    if (editingProduct.id && onUpdateProduct) {
      onUpdateProduct(editingProduct as Product);
    } else if (onAddProduct) {
      onAddProduct(editingProduct as Omit<Product, 'id'>);
    }
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sales Hero */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-teal-900 mb-4 tracking-tight">Akbar Khan Collections</h1>
          <p className="text-xl text-teal-600 font-urdu mb-8">
            ہم قدر پہنچاتے ہیں، ہر فروخت ایک طالبہ کے مستقبل کی کفالت کرتی ہے
          </p>
          <div className="bg-teal-50 inline-block px-8 py-4 rounded-3xl border border-teal-100">
             <p className="text-sm font-bold text-teal-800 uppercase tracking-widest flex items-center gap-2">
               <Star className="w-4 h-4 fill-teal-800" />
               We deliver value. Each sale sponsors a student's future.
               <Star className="w-4 h-4 fill-teal-800" />
             </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {['All', 'Bridal', 'Casual', 'Formal'].map(cat => (
              <button 
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${categoryFilter === cat ? 'bg-teal-900 text-white shadow-md' : 'bg-white text-teal-900 border border-teal-100 hover:bg-teal-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search collections..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm"
            />
          </div>
        </div>
        {isAdmin && (
          <div className="flex justify-end mb-8">
            <button 
              onClick={() => setEditingProduct({ name: '', price: '', image: '', slogan: '', description: '', stockStatus: 'Available', isFeatured: false, category: 'Casual' })}
              className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" /> Add Sales
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500 cursor-pointer relative"
              onClick={() => setSelectedProduct(product)}
            >
              {isAdmin && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setEditingProduct(product); }}
                  className="absolute top-4 right-4 z-10 p-2 bg-white text-teal-600 rounded-full shadow-lg hover:bg-teal-50 transition-all"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={product.image || 'https://picsum.photos/seed/product/400/400'} 
                  alt={product.name} 
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${product.stockStatus === 'Out of Stock' ? 'grayscale opacity-50' : ''}`}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button className="bg-white text-teal-900 px-6 py-3 rounded-full font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                     View Details
                   </button>
                </div>
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isFeatured && <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">Featured</span>}
                  {product.stockStatus === 'Out of Stock' ? (
                    <span className="bg-rose-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">Out of Stock</span>
                  ) : (
                    <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">New Arrival</span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <p className="text-teal-600 font-serif text-sm italic mb-2">"{product.slogan}"</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                   <span className="text-xl font-bold text-teal-900">{product.price}</span>
                   <button 
                    onClick={(e) => { e.stopPropagation(); handleWhatsAppBuy(product); }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-green-100 text-sm"
                   >
                     <MessageCircle className="w-4 h-4" /> Buy Now
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
           <div className="relative bg-white max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2">
                 <div className="h-64 md:h-full bg-gray-100 min-h-[300px]">
                   <img src={selectedProduct.image || 'https://picsum.photos/seed/product/800/800'} alt={selectedProduct.name} className="w-full h-full object-cover" />
                 </div>
                 <div className="p-8 md:p-12 relative">
                   <button 
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
                    aria-label="Close modal"
                   >
                     <X className="w-5 h-5 text-gray-600" />
                   </button>
                   <span className="text-teal-600 font-bold uppercase tracking-widest text-xs mb-4 block">Fashion & Bridal</span>
                   <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h2>
                   <p className="text-teal-600 font-urdu text-lg mb-6 leading-relaxed">"{selectedProduct.slogan}"</p>
                   <p className="text-gray-600 mb-8 leading-relaxed">
                     {selectedProduct.description} Each piece is meticulously crafted by our expert designers at AK Institute, ensuring premium quality and contemporary style.
                   </p>
                   <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Price Tag</p>
                        <p className="text-3xl font-bold text-teal-900">{selectedProduct.price}</p>
                      </div>
                      <button 
                        onClick={() => handleWhatsAppBuy(selectedProduct)}
                        className="flex items-center gap-2 px-10 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all shadow-xl shadow-green-100"
                      >
                        <MessageCircle className="w-6 h-6" /> Order on WhatsApp
                      </button>
                   </div>
                   <p className="mt-8 text-[10px] text-center text-gray-400 font-medium">
                     By purchasing this, you provide 1 month of full scholarship to a student.
                   </p>
                 </div>
              </div>
           </div>
        </div>
      )}
      {/* Product Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingProduct(null)}></div>
          <div className="relative bg-white max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl animate-scaleIn max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-teal-900">{editingProduct.id ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
                <PhotoModule initialPhoto={editingProduct.image || ''} onPhotoSaved={(photo) => setEditingProduct({ ...editingProduct, image: photo })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none" value={editingProduct.name || ''} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Price (e.g., Rs. 5000)</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none" value={editingProduct.price || ''} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Slogan / Short Quote</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none" value={editingProduct.slogan || ''} onChange={(e) => setEditingProduct({ ...editingProduct, slogan: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none min-h-[100px]" value={editingProduct.description || ''} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white" value={editingProduct.category || 'Casual'} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}>
                    <option value="Bridal">Bridal</option>
                    <option value="Casual">Casual</option>
                    <option value="Formal">Formal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stock Status</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white" value={editingProduct.stockStatus || 'Available'} onChange={(e) => setEditingProduct({ ...editingProduct, stockStatus: e.target.value as 'Available' | 'Out of Stock' })}>
                    <option value="Available">Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-8 md:col-span-2">
                  <input type="checkbox" id="isFeatured" className="w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500" checked={editingProduct.isFeatured || false} onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })} />
                  <label htmlFor="isFeatured" className="text-sm font-bold text-gray-700 cursor-pointer">Feature this product</label>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
              <button onClick={() => setEditingProduct(null)} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleSaveProduct} className="px-8 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors flex items-center gap-2 shadow-lg"><Save className="w-5 h-5" /> Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
