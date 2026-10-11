import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Layers } from 'lucide-react';
import { Category } from '../../types';
import { api } from '../../services/api';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [newCat, setNewCat] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    display_order: 1,
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (e) {
      console.error('Failed to load categories', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = newCat.slug.trim() || newCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await api.createCategory?.({ ...newCat, slug });
      setShowModal(false);
      await loadCategories();
    } catch (err: any) {
      alert(err.message || 'Category creation failed');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-[#282323]">Store Categories ({categories.length})</h1>
          <p className="text-xs text-[#716963] mt-0.5">
            Organize traditional outfits, nighties, bridal wear, and fashion accessories.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="bg-white border border-[#C6A15B]/30 p-4 shadow-sm flex gap-4 items-center">
            {c.image_url && (
              <img src={c.image_url} alt={c.name} className="w-16 aspect-[3/4] object-cover border border-[#C6A15B]/20 flex-shrink-0" />
            )}
            <div className="flex-1">
              <h3 className="font-serif text-sm font-semibold text-[#282323]">{c.name}</h3>
              <p className="text-[10px] text-[#A69A90] font-mono mt-0.5">slug: {c.slug}</p>
              <p className="text-xs text-[#716963] line-clamp-2 mt-1">{c.description}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
