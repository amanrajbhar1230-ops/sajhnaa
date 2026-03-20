# Firestore Database Schema — Shivani Jewellery

## Collections

### `products`
```
{
  id: string (auto-generated),
  name: string,
  category: string (Necklaces | Earrings | Rings | Bracelets | Anklets | Bridal),
  subcategory: string,
  price: number,
  salePrice: number | null,
  description: string,
  material: string,
  color: string,
  occasion: string (Bridal | Party | Casual | Daily Wear),
  images: string[] (URLs from Firebase Storage),
  badge: string | null (new | sale | trending),
  stock: number,
  rating: number,
  reviews: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `orders`
```
{
  id: string (SJ-XXXXXXXX-XXXX format),
  userId: string (Firebase Auth UID),
  items: [{ id, name, price, image, qty }],
  address: { fullName, phone, email, address, city, state, pincode },
  payment: string (cod | upi | card),
  subtotal: number,
  discount: number,
  shipping: number,
  total: number,
  status: string (pending | packed | shipped | delivered | cancelled),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `users`
```
{
  uid: string (Firebase Auth UID),
  name: string,
  email: string,
  photoURL: string | null,
  role: string (customer | admin),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `reviews`
```
{
  id: string (auto),
  productId: string,
  userId: string,
  userName: string,
  rating: number (1-5),
  text: string,
  createdAt: timestamp
}
```

### `banners`
```
{
  id: string (auto),
  title: string,
  subtitle: string,
  imageUrl: string,
  linkUrl: string,
  position: string (hero | mid | bottom),
  isActive: boolean,
  order: number,
  createdAt: timestamp
}
```

### `coupons`
```
{
  code: string,
  type: string (percent | flat),
  value: number,
  minOrder: number,
  isActive: boolean,
  expiresAt: timestamp
}
```
