import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export const getCart = async (): Promise<CartItem[]> => {
  try {
    const data = await AsyncStorage.getItem('user_cart');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveCart = async (cart: CartItem[]) => {
  try {
    await AsyncStorage.setItem('user_cart', JSON.stringify(cart));
    DeviceEventEmitter.emit('cart_updated');
  } catch (e) {
    // ignore
  }
};

export const addToCart = async (product: { id: string | number; name: string; price: number; image?: string }) => {
  const cart = await getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || '',
      quantity: 1
    });
  }
  await saveCart(cart);
};

export const removeFromCart = async (productId: string | number) => {
  const cart = await getCart();
  const filtered = cart.filter(item => item.id !== productId);
  await saveCart(filtered);
};

export const updateQuantity = async (productId: string | number, quantity: number) => {
  const cart = await getCart();
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
  await saveCart(cart);
};

export const clearCart = async () => {
  await saveCart([]);
};
