import React from 'react';
import { Product } from '@ar-vto/shared';

interface ProductSelectorProps {
  products: Product[];
  selectedProductId: string;
  onSelect: (productId: string) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProductId,
  onSelect,
}) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
      {products.map((product) => {
        const isSelected = product.id === selectedProductId;
        return (
          <button
            key={product.id}
            onClick={() => onSelect(product.id)}
            className={`flex-shrink-0 w-28 p-3 rounded-xl border text-left transition-all duration-200 ${
              isSelected
                ? 'bg-rose-500/10 border-rose-500 shadow-md text-white'
                : 'bg-slate-900/50 border-white/10 hover:bg-slate-900/80 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: product.color || '#475569' }}
              />
              <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                {product.brand ? product.brand.split(' ')[0] : 'AR'}
              </span>
            </div>
            <div className="text-xs font-medium truncate leading-tight">{product.name}</div>
            <div className="text-[10px] text-rose-400 font-bold mt-1">{product.price}</div>
          </button>
        );
      })}
    </div>
  );
};
