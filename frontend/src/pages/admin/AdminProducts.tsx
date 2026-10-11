import React, { useEffect, useState } from 'react';
import { Plus, Search, Trash2, Edit, Upload, Check, AlertCircle } from 'lucide-react';
import { Product, Category } from '../../types';
import { api } from '../../services/api';
import { formatPrice } from '../../utils/formatters';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  // Create Product Modal
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [editProd, setEditProd] = useState({
    name: '',
    sku: '',
    category_id: 1,
    price: 0,
    compare_at_price: 0,
    fabric: '',
    care_instructions: '',
    colors: '',
    sizes: '',
    stock_quantity: 0,
    is_featured: false,
    is_new_arrival: false,
    description: '',
    image_url: '',
  });

  const [newProd, setNewProd] = useState({
    name: '',
    sku: '',
    category_id: 1,
    price: 1499,
    compare_at_price: 1999,
    fabric: 'Pure Cotton',
    care_instructions: 'Hand wash cold',
    colors: 'Maroon, Wine, Mustard',
    sizes: 'M, L, XL, XXL',
    stock_quantity: 20,
    is_featured: false,
    is_new_arrival: true,
    description: '',
    image_url: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        api.getProducts({ limit: 100 }),
        api.getCategories()
      ]);
      setProducts(prodsRes.items);
      setCategories(catsRes);
      if (catsRes.length > 0) {
        setNewProd((p) => ({ ...p, category_id: catsRes[0].id }));
      }
    } catch (e) {
      console.error('Error loading admin products', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await api.uploadAdminImage(file);
      setNewProd((prev) => ({ ...prev, image_url: res.url }));
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const slug = newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const colorsArr = newProd.colors.split(',').map((c) => c.trim()).filter(Boolean);
      const sizesArr = newProd.sizes.split(',').map((s) => s.trim()).filter(Boolean);

      const payload = {
        name: newProd.name,
        slug,
        sku: newProd.sku || `DDF-PRD-${Date.now().toString().slice(-4)}`,
        category_id: Number(newProd.category_id),
        price: Number(newProd.price),
        compare_at_price: newProd.compare_at_price ? Number(newProd.compare_at_price) : null,
        fabric: newProd.fabric,
        care_instructions: newProd.care_instructions,
        colors: colorsArr,
        sizes: sizesArr,
        stock_quantity: Number(newProd.stock_quantity),
        is_featured: newProd.is_featured,
        is_new_arrival: newProd.is_new_arrival,
        is_active: true,
        tags: ['new', 'boutique'],
        description: newProd.description,
        images: newProd.image_url ? [{ image_url: newProd.image_url, is_primary: true, display_order: 0 }] : []
      };

      await api.createAdminProduct(payload);
      setShowModal(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to deactivate this product?')) return;
    try {
      await api.deleteAdminProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setEditProd({
      name: p.name,
      sku: p.sku,
      category_id: p.category_id,
      price: p.price,
      compare_at_price: p.compare_at_price || 0,
      fabric: p.fabric || '',
      care_instructions: p.care_instructions || '',
      colors: (p.colors || []).join(', '),
      sizes: (p.sizes || []).join(', '),
      stock_quantity: p.stock_quantity,
      is_featured: p.is_featured,
      is_new_arrival: p.is_new_arrival,
      description: p.description || '',
      image_url: p.images?.[0]?.image_url || '',
    });
    setShowEditModal(true);
  };

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await api.uploadAdminImage(file);
      setEditProd((prev) => ({ ...prev, image_url: res.url }));
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSubmitting(true);
    try {
      const colorsArr = editProd.colors.split(',').map((c) => c.trim()).filter(Boolean);
      const sizesArr = editProd.sizes.split(',').map((s) => s.trim()).filter(Boolean);

      const payload = {
        name: editProd.name,
        category_id: Number(editProd.category_id),
        price: Number(editProd.price),
        compare_at_price: editProd.compare_at_price ? Number(editProd.compare_at_price) : null,
        fabric: editProd.fabric,
        care_instructions: editProd.care_instructions,
        colors: colorsArr,
        sizes: sizesArr,
        stock_quantity: Number(editProd.stock_quantity),
        is_featured: editProd.is_featured,
        is_new_arrival: editProd.is_new_arrival,
        description: editProd.description,
        images: editProd.image_url ? [{ image_url: editProd.image_url, is_primary: true, display_order: 0 }] : []
      };

      await api.updateAdminProduct(editingProduct.id, payload);
      setShowEditModal(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = !selectedCat || String(p.category_id) === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-[#282323]">Products Catalogue</h1>
          <p className="text-xs text-[#716963] mt-0.5">
            Manage your boutique inventory, prices, and high-resolution images.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary py-3 px-5 text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#C6A15B]/30 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 px-3 py-2 pl-9 text-xs focus:outline-none"
          />
          <Search size={14} className="absolute left-3 top-3 text-[#A69A90]" />
        </div>
        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="bg-white border border-[#C6A15B]/40 px-3 py-2 text-xs focus:outline-none"
        >
          <option value="">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#C6A15B]/30 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-[#716963]">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF3E8] border-b border-[#C6A15B]/20 text-[#651D32] uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Garment</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Flags</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => {
                  const img = p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
                  return (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={img} alt={p.name} className="w-12 aspect-[3/4] object-cover border border-[#C6A15B]/20 flex-shrink-0" />
                          <div className="max-w-xs">
                            <p className="font-medium text-[#282323] truncate">{p.name}</p>
                            <p className="text-[10px] text-[#A69A90]">{p.fabric}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#716963]">{p.sku}</td>
                      <td className="py-3 px-4 text-[#716963]">{p.category?.name || 'Category'}</td>
                      <td className="py-3 px-4 font-semibold text-[#282323]">{formatPrice(p.price)}</td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${p.stock_quantity <= 5 ? 'text-red-600' : 'text-green-700'}`}>
                          {p.stock_quantity} in stock
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {p.is_featured && <span className="bg-[#FAF3E8] text-[#651D32] px-1.5 py-0.5 text-[9px] uppercase font-bold">Featured</span>}
                          {p.is_new_arrival && <span className="bg-green-50 text-green-700 px-1.5 py-0.5 text-[9px] uppercase font-bold">New</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openEditModal(p)}
                          className="text-[#651D32] hover:text-[#3B1020] p-1 mr-2"
                          title="Edit Product"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-[#A69A90] hover:text-red-700 p-1"
                          title="Deactivate Product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE PRODUCT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-white border border-[#C6A15B]/50 w-full max-w-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="font-serif text-xl font-bold text-[#651D32] border-b border-[#C6A15B]/20 pb-3">
              Add New Boutique Product
            </h2>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#282323] font-medium mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    placeholder="e.g. Kanchipuram Soft Silk Saree"
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                  />
                </div>
                <div>
                  <label className="block text-[#282323] font-medium mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={newProd.sku}
                    onChange={(e) => setNewProd({ ...newProd, sku: e.target.value })}
                    placeholder="e.g. DDF-SAR-101"
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                  />
                </div>
                <div>
                  <label className="block text-[#282323] font-medium mb-1">Category *</label>
                  <select
                    value={newProd.category_id}
                    onChange={(e) => setNewProd({ ...newProd, category_id: Number(e.target.value) })}
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#282323] font-medium mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                  />
                </div>
                <div>
                  <label className="block text-[#282323] font-medium mb-1">Compare at Price (Optional)</label>
                  <input
                    type="number"
                    value={newProd.compare_at_price}
                    onChange={(e) => setNewProd({ ...newProd, compare_at_price: Number(e.target.value) })}
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                  />
                </div>
                <div>
                  <label className="block text-[#282323] font-medium mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={newProd.stock_quantity}
                    onChange={(e) => setNewProd({ ...newProd, stock_quantity: Number(e.target.value) })}
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                  />
                </div>
                <div>
                  <label className="block text-[#282323] font-medium mb-1">Fabric Specification</label>
                  <input
                    type="text"
                    value={newProd.fabric}
                    onChange={(e) => setNewProd({ ...newProd, fabric: e.target.value })}
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                  />
                </div>
                <div>
                  <label className="block text-[#282323] font-medium mb-1">Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={newProd.sizes}
                    onChange={(e) => setNewProd({ ...newProd, sizes: e.target.value })}
                    placeholder="S, M, L, XL, Free Size"
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#282323] font-medium mb-1">Colors (comma-separated)</label>
                  <input
                    type="text"
                    value={newProd.colors}
                    onChange={(e) => setNewProd({ ...newProd, colors: e.target.value })}
                    placeholder="Burgundy, Gold, Peacock Blue"
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                  />
                </div>

                {/* Image Upload / URL */}
                <div className="sm:col-span-2 space-y-2 bg-[#FAF3E8] p-4 border border-[#C6A15B]/30">
                  <label className="block text-[#651D32] font-semibold">Product Photograph</label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-xs"
                    />
                    {uploadingImage && <span className="text-xs text-[#651D32]">Uploading...</span>}
                  </div>
                  <div className="text-[10px] text-[#716963]">Or enter direct image URL:</div>
                  <input
                    type="url"
                    value={newProd.image_url}
                    onChange={(e) => setNewProd({ ...newProd, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border border-[#C6A15B]/40 p-2 text-xs"
                  />
                  {newProd.image_url && (
                    <div className="w-16 aspect-[3/4] border overflow-hidden mt-1">
                      <img src={newProd.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#282323] font-medium mb-1">Product Description</label>
                  <textarea
                    rows={3}
                    value={newProd.description}
                    onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProd.is_new_arrival}
                      onChange={(e) => setNewProd({ ...newProd, is_new_arrival: e.target.checked })}
                    />
                    <span>Mark as New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProd.is_featured}
                      onChange={(e) => setNewProd({ ...newProd, is_featured: e.target.checked })}
                    />
                    <span>Feature on Storefront</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary py-2.5 px-5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary py-2.5 px-6"
                >
                  {isSubmitting ? 'Saving...' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-white border border-[#C6A15B]/50 w-full max-w-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#C6A15B]/20 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C6A15B]">Edit Product</span>
                <h2 className="font-serif text-xl font-bold text-[#651D32]">
                  {editingProduct.name} ({editingProduct.sku})
                </h2>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[#282323] font-medium mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={editProd.name}
                    onChange={(e) => setEditProd({ ...editProd, name: e.target.value })}
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                  />
                </div>
                <div>
                  <label className="block text-[#282323] font-medium mb-1">Category *</label>
                  <select
                    value={editProd.category_id}
                    onChange={(e) => setEditProd({ ...editProd, category_id: Number(e.target.value) })}
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#282323] font-medium mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={editProd.price}
                    onChange={(e) => setEditProd({ ...editProd, price: Number(e.target.value) })}
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                  />
                </div>
                <div>
                  <label className="block text-[#282323] font-medium mb-1">Compare at Price</label>
                  <input
                    type="number"
                    value={editProd.compare_at_price}
                    onChange={(e) => setEditProd({ ...editProd, compare_at_price: Number(e.target.value) })}
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                  />
                </div>
                <div>
                  <label className="block text-[#282323] font-medium mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={editProd.stock_quantity}
                    onChange={(e) => setEditProd({ ...editProd, stock_quantity: Number(e.target.value) })}
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                  />
                </div>
                <div>
                  <label className="block text-[#282323] font-medium mb-1">Fabric Specification</label>
                  <input
                    type="text"
                    value={editProd.fabric}
                    onChange={(e) => setEditProd({ ...editProd, fabric: e.target.value })}
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                  />
                </div>
                <div>
                  <label className="block text-[#282323] font-medium mb-1">Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={editProd.sizes}
                    onChange={(e) => setEditProd({ ...editProd, sizes: e.target.value })}
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#282323] font-medium mb-1">Colors (comma-separated)</label>
                  <input
                    type="text"
                    value={editProd.colors}
                    onChange={(e) => setEditProd({ ...editProd, colors: e.target.value })}
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#282323] font-medium mb-1">Product Image URL or Upload</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="/images/products/... or upload below"
                      value={editProd.image_url}
                      onChange={(e) => setEditProd({ ...editProd, image_url: e.target.value })}
                      className="flex-1 bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                    />
                    <label className="btn-secondary py-2 px-3 cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                      <Upload size={13} />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleEditImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                  {editProd.image_url && (
                    <div className="mt-2 flex items-center gap-3">
                      <img src={editProd.image_url} alt="Preview" className="w-12 h-16 object-cover border border-[#C6A15B]/30" />
                      <span className="text-[11px] text-green-700 font-medium">Image attached</span>
                    </div>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#282323] font-medium mb-1">Product Description</label>
                  <textarea
                    rows={3}
                    value={editProd.description}
                    onChange={(e) => setEditProd({ ...editProd, description: e.target.value })}
                    className="w-full bg-[#FFF9F1]/50 border border-[#C6A15B]/40 p-2"
                  />
                </div>
                <div className="sm:col-span-2 flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editProd.is_new_arrival}
                      onChange={(e) => setEditProd({ ...editProd, is_new_arrival: e.target.checked })}
                    />
                    <span>New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editProd.is_featured}
                      onChange={(e) => setEditProd({ ...editProd, is_featured: e.target.checked })}
                    />
                    <span>Featured on Storefront</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary py-2.5 px-5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary py-2.5 px-6"
                >
                  {isSubmitting ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
