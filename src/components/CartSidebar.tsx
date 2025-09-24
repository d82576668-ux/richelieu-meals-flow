import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import { useState } from "react";

export const CartSidebar = () => {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart, isOpen, toggleCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите в систему для оформления заказа',
        variant: 'destructive',
      });
      return;
    }

    if (user && user.balance < totalPrice) {
      toast({
        title: 'Недостаточно средств',
        description: `На балансе ${user.balance}₽, а заказ стоит ${totalPrice}₽`,
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Clear cart and show success
    clearCart();
    
    toast({
      title: 'Заказ оформлен!',
      description: `Заказ на сумму ${totalPrice}₽ принят в обработку`,
    });
    
    toggleCart();
    setIsProcessing(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="glassmorphism border-l w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <span>Корзина</span>
            {totalItems > 0 && (
              <Badge className="bg-gradient-primary text-primary-foreground">
                {totalItems}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full pt-6">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/50" />
                <div>
                  <p className="text-lg font-medium text-foreground">Корзина пуста</p>
                  <p className="text-sm text-muted-foreground">Добавьте блюда из каталога</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 space-y-4 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="glassmorphism p-4 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full glassmorphism flex items-center justify-center hover:bg-muted/50 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full glassmorphism flex items-center justify-center hover:bg-muted/50 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-muted-foreground">
                            {item.price}₽ × {item.quantity}
                          </span>
                          <span className="font-semibold text-foreground">
                            {item.price * item.quantity}₽
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-glass-border pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Итого:</span>
                  <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                    {totalPrice}₽
                  </span>
                </div>

                {isAuthenticated && user && (
                  <div className="glassmorphism p-3 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Ваш баланс:</span>
                      <span className={`font-medium ${
                        user.balance >= totalPrice ? 'text-success' : 'text-destructive'
                      }`}>
                        {user.balance}₽
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <AnimatedButton
                    variant="primary"
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={isProcessing || !isAuthenticated}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Обработка...' : 'Оформить заказ'}
                  </AnimatedButton>
                  
                  {items.length > 0 && (
                    <AnimatedButton
                      variant="glass"
                      className="w-full"
                      onClick={clearCart}
                      disabled={isProcessing}
                    >
                      Очистить корзину
                    </AnimatedButton>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};