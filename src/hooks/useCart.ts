import { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface UseCartReturn {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (meal: { id: string; name: string; price: number; image: string; category: string }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  toggleCart: () => void;
}

export const useCart = (): UseCartReturn => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('richelieu_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('richelieu_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (meal: { id: string; name: string; price: number; image: string; category: string }) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === meal.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === meal.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevItems, { ...meal, quantity: 1 }];
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    toggleCart,
  };
};