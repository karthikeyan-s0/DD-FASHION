import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-[#C6A15B]/20 p-3 animate-pulse">
      <div className="aspect-[3/4] bg-[#F7EFE4] mb-3" />
      <div className="h-3 bg-[#F7EFE4] w-1/3 mb-2" />
      <div className="h-4 bg-[#F7EFE4] w-3/4 mb-3" />
      <div className="h-4 bg-[#F7EFE4] w-1/4" />
    </div>
  );
};

export const CategorySkeleton: React.FC = () => {
  return (
    <div className="aspect-[3/4] bg-[#F7EFE4] animate-pulse relative border border-[#C6A15B]/20">
      <div className="absolute inset-x-4 bottom-4 h-12 bg-white/60" />
    </div>
  );
};
