import { useState, useEffect } from 'react';
import { query } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

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
  appliedPromoCode: string | null;
  discount: number;
  addItem: (meal: { id: string; name: string; price: number; image: string; category: string }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  toggleCart: () => void;
  applyPromoCode: (code: string) => Promise<{ success: boolean; discount: number; error?: string }>;
  checkout: (userId: string) => Promise<{ success: boolean; error?: string }>;
}

export const useCart = (): UseCartReturn => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const { toast } = useToast();

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

  useEffect(() => {
    localStorage.setItem('richelieu_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (meal: { id: string; name: string; price: number; image: string; category: string }) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === meal.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...meal, quantity: 1 }];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromoCode(null);
    setDiscount(0);
  };

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const applyPromoCode = async (code: string): Promise<{ success: boolean; discount: number; error?: string }> => {
    try {
      const { rows } = await query(
        'SELECT discount_percent FROM promo_codes WHERE code = $1 AND is_active = TRUE AND (valid_until IS NULL OR valid_until > CURRENT_TIMESTAMP)',
        [code]
      );
      if (rows.length === 0) {
        return { success: false, discount: 0, error: 'Недействительный или истекший промокод' };
      }
      setAppliedPromoCode(code);
      const discountPercent = rows[0].discount_percent;
      setDiscount(discountPercent);
      return { success: true, discount: discountPercent };
    } catch (error) {
      console.error('Apply promo code error:', error);
      return { success: false, discount: 0, error: 'Ошибка при применении промокода' };
    }
  };

  const checkout = async (userId: string): Promise<{ success: boolean; error?: string }> => {
    if (items.length === 0) {
      return { success: false, error: 'Корзина пуста' };
    }

    try {
      const totalPriceWithDiscount = totalPrice * (1 - discount / 100);

      // Проверяем баланс пользователя
      const { rows: userRows } = await query('SELECT balance FROM users WHERE id = $1', [userId]);
      if (userRows.length === 0 || parseFloat(userRows[0].balance) < totalPriceWithDiscount) {
        return { success: false, error: 'Недостаточно средств на балансе' };
      }

      // Создаем заказ
      const { rows: orderRows } = await query(
        'INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, $3) RETURNING id',
        [userId, totalPriceWithDiscount, 'pending']
      );
      const orderId = orderRows[0].id;

      // Сохраняем элементы заказа
      for (const item of items) {
        await query(
          'INSERT INTO order_items (order_id, meal_id, name, price, quantity, image, category) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [orderId, item.id, item.name, item.price, item.quantity, item.image, item.category]
        );
      }

      // Обновляем баланс пользователя
      await query('UPDATE users SET balance = balance - $1 WHERE id = $2', [totalPriceWithDiscount, userId]);

      // Записываем транзакцию
      await query(
        'INSERT INTO balance_transactions (user_id, amount, transaction_type, description) VALUES ($1, $2, $3, $4)',
        [userId, -totalPriceWithDiscount, 'purchase', `Заказ #${orderId}`]
      );

      clearCart();
      return { success: true };
    } catch (error) {
      console.error('Checkout error:', error);
      return { success: false, error: 'Ошибка при оформлении заказа' };
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    items,
    totalItems,
    totalPrice,
    appliedPromoCode,
    discount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    toggleCart,
    applyPromoCode,
    checkout,
  };
};
