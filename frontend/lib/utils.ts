export const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

export const getImageUrl = (path: string) => {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${path}`;
};

export const getDiscountPercent = (price: number, discountPrice: number) =>
  Math.round(((price - discountPrice) / price) * 100);

export const truncate = (str: string, n: number) =>
  str.length > n ? str.slice(0, n) + '...' : str;

export const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(' ');
