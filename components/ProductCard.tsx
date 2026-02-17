
import React from 'react';
import { Product } from '../types';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuy }) => {
  return (
    <div className="flex-shrink-0 w-72 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-64 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
        />
      </div>
      <div className="p-4">
        <span className="text-teal-600 font-urdu text-xs mb-1 block">{product.slogan}</span>
        <h4 className="text-base font-bold text-gray-800">{product.name}</h4>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-teal-800">{product.price}</span>
          <button 
            onClick={() => onBuy(product)}
            className="p-2 bg-teal-50 text-teal-600 rounded-full hover:bg-teal-600 hover:text-white transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
