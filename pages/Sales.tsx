
import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingBag, ChevronRight, MessageCircle, Star } from 'lucide-react';

interface SalesProps {
  products: Product[];
  onBuy: (product: Product) => void;
}

const Sales: React.FC<SalesProps> = ({ products, onBuy }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const WHATSAPP_NUMBER = '03155241756';

  const handleWhatsAppBuy = (product: Product) => {
    const message = `Hello, I am interested in buying: ${product.name} (${product.price}). Please share details.`;
    const url = `https://wa.me/92${WHATSAPP_NUMBER.slice(1)}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
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

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map(product => (
            <div 
              key={product.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500 cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="relative h-96 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button className="bg-white text-teal-900 px-6 py-3 rounded-full font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                     View Details
                   </button>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">New Arrival</span>
                </div>
              </div>
              <div className="p-8">
                <p className="text-teal-600 font-serif text-sm italic mb-2">"{product.slogan}"</p>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-50">
                   <span className="text-2xl font-bold text-teal-900">{product.price}</span>
                   <button 
                    onClick={(e) => { e.stopPropagation(); handleWhatsAppBuy(product); }}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-green-100"
                   >
                     <MessageCircle className="w-5 h-5" /> Buy Now
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
           <div className="relative bg-white max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl animate-scaleIn">
              <div className="grid grid-cols-1 md:grid-cols-2">
                 <div className="h-[400px] md:h-full bg-gray-100">
                   <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                 </div>
                 <div className="p-8 md:p-12">
                   <button 
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                   >
                     <ChevronRight className="w-5 h-5" />
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
    </div>
  );
};

export default Sales;
