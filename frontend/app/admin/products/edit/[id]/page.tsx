'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UploadCloud, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import { Button } from '@/components/ui/Button';
import { PageSpinner, Spinner } from '@/components/ui/Spinner';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
}

interface UploadedImage {
  url: string;
  publicId: string;
}

interface ProductDetail {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  categoryId?: string | null;
  sizes: string[];
  colors: string[];
  featured: boolean;
  images: UploadedImage[];
}

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  stock: string;
  categoryId: string;
  sizes: string[];
  colors: string[];
  featured: boolean;
  images: UploadedImage[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLOR_OPTIONS = [
  'Black', 'White', 'Red', 'Blue', 'Green',
  'Yellow', 'Pink', 'Orange', 'Purple', 'Brown',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toggleArrayItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

function productToFormState(p: ProductDetail): ProductFormState {
  return {
    name: p.name,
    description: p.description,
    price: String(p.price),
    discountPrice: p.discountPrice != null ? String(p.discountPrice) : '',
    stock: String(p.stock),
    categoryId: p.categoryId ?? '',
    sizes: p.sizes ?? [],
    colors: p.colors ?? [],
    featured: p.featured,
    images: p.images ?? [],
  };
}

// ─── Shared field styles ──────────────────────────────────────────────────────

const inputCls =
  'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params.id;
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProductFormState | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Fetch product
  const { data: product, isLoading: loadingProduct, isError } = useQuery<ProductDetail>({
    queryKey: ['admin-product', productId],
    queryFn: () => api.get(`/admin/products/${productId}`).then((r) => r.data),
    enabled: Boolean(productId),
  });

  // Populate form once product is loaded
  useEffect(() => {
    if (product) setForm(productToFormState(product));
  }, [product]);

  // Fetch categories
  const { data: categories = [], isLoading: loadingCategories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data),
    staleTime: 5 * 60_000,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.put(`/admin/products/${productId}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-product', productId] });
      toast.success('Product updated successfully!');
      router.push('/admin/products');
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to update product.';
      toast.error(msg);
    },
  });

  // ── Handlers ──────────────────────────────────────────────────────────────

  function setField<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append('images', file));
      const { data } = await api.post<UploadedImage[]>('/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) =>
        prev ? { ...prev, images: [...prev.images, ...data] } : prev
      );
      toast.success(`${data.length} image${data.length !== 1 ? 's' : ''} uploaded.`);
    } catch {
      toast.error('Image upload failed.');
    } finally {
      setUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function removeImage(publicId: string) {
    setForm((prev) =>
      prev
        ? { ...prev, images: prev.images.filter((img) => img.publicId !== publicId) }
        : prev
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;

    if (!form.name.trim()) return toast.error('Product name is required.');
    if (!form.description.trim()) return toast.error('Description is required.');
    if (!form.price || isNaN(Number(form.price))) return toast.error('Valid price is required.');
    if (!form.stock || isNaN(Number(form.stock))) return toast.error('Valid stock is required.');

    updateMutation.mutate({
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      stock: Number(form.stock),
      categoryId: form.categoryId || undefined,
      sizes: form.sizes,
      colors: form.colors,
      featured: form.featured,
      images: form.images,
    });
  }

  // ── Loading / error states ─────────────────────────────────────────────────

  if (loadingProduct || !form) return <PageSpinner />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <p className="text-gray-500">Failed to load product.</p>
        <Button variant="outline" onClick={() => router.push('/admin/products')}>
          Back to Products
        </Button>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-sm text-gray-500 mt-0.5 truncate max-w-sm">
          Editing: <span className="font-medium text-gray-700">{product?.name}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Basic Information</h2>

          <div>
            <label className={labelCls}>Product Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              className={inputCls}
              required
            />
          </div>

          <div>
            <label className={labelCls}>Description <span className="text-red-500">*</span></label>
            <textarea
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              rows={4}
              className={inputCls}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Price (₹) <span className="text-red-500">*</span></label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) => setField('price', e.target.value)}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Discount Price (₹)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.discountPrice}
                onChange={(e) => setField('discountPrice', e.target.value)}
                placeholder="Optional"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Stock <span className="text-red-500">*</span></label>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => setField('stock', e.target.value)}
                className={inputCls}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Category</label>
            {loadingCategories ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Spinner size="sm" /> Loading categories…
              </div>
            ) : (
              <select
                value={form.categoryId}
                onChange={(e) => setField('categoryId', e.target.value)}
                className={inputCls}
              >
                <option value="">— Select category —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Variants</h2>

          <div>
            <label className={labelCls}>Sizes</label>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => setField('sizes', toggleArrayItem(form.sizes, size))}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                    form.sizes.includes(size)
                      ? 'bg-yellow-400 border-yellow-400 text-gray-900 font-semibold'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Colors</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setField('colors', toggleArrayItem(form.colors, color))}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                    form.colors.includes(color)
                      ? 'bg-yellow-400 border-yellow-400 text-gray-900 font-semibold'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Images</h2>

          {/* Existing images */}
          {form.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {form.images.map((img) => (
                <div key={img.publicId} className="relative group">
                  <img
                    src={img.url}
                    alt="product"
                    className="h-20 w-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(img.publicId)}
                    className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    <X className="h-3.5 w-3.5 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload zone */}
          <div
            onClick={() => !uploadingImages && fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-yellow-400 transition-colors"
          >
            {uploadingImages ? (
              <>
                <Spinner size="md" />
                <p className="text-sm text-gray-500">Uploading…</p>
              </>
            ) : (
              <>
                <UploadCloud className="h-7 w-7 text-gray-400" />
                <p className="text-sm text-gray-500">Click to add more images</p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageUpload(e.target.files)}
          />
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setField('featured', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 accent-yellow-400"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Featured Product</p>
              <p className="text-xs text-gray-400">Show this product in featured sections</p>
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pb-6">
          <Button
            type="submit"
            loading={updateMutation.isPending}
            disabled={uploadingImages}
          >
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/products')}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
