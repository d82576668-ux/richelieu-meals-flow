import { useState } from 'react';
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Wallet, 
  History, 
  CreditCard, 
  Gift, 
  Settings, 
  PlusCircle,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

const mockOrders = [
  {
    id: '1',
    date: '2024-01-15',
    items: ['Борщ с говядиной', 'Салат Цезарь'],
    total: 330,
    status: 'completed',
  },
  {
    id: '2', 
    date: '2024-01-12',
    items: ['Куриная котлета с пюре'],
    total: 220,
    status: 'completed',
  },
  {
    id: '3',
    date: '2024-01-10',
    items: ['Омлет с сыром', 'Паста Карбонара'],
    total: 370,
    status: 'cancelled',
  },
];

const mockPromocodes = [
  {
    id: '1',
    code: 'STUDENT10',
    discount: 10,
    type: 'percentage',
    validUntil: '2024-02-15',
    used: false,
  },
  {
    id: '2',
    code: 'FREESOUP',
    discount: 180,
    type: 'fixed',
    validUntil: '2024-01-25',
    used: true,
  },
];

export const Profile = () => {
  const { user, updateBalance } = useAuth();
  const { toast } = useToast();
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Неверная сумма',
        description: 'Введите корректную сумму для пополнения',
        variant: 'destructive',
      });
      return;
    }

    if (amount > 5000) {
      toast({
        title: 'Превышен лимит',
        description: 'Максимальная сумма пополнения: 5000₽',
        variant: 'destructive',
      });
      return;
    }

    setIsTopUpLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateBalance(amount);
    setTopUpAmount('');
    
    toast({
      title: 'Баланс пополнен!',
      description: `Счет пополнен на ${amount}₽`,
    });
    
    setIsTopUpLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Выполнен';
      case 'pending':
        return 'В обработке';
      case 'cancelled':
        return 'Отменен';
      default:
        return 'Неизвестно';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <LiquidGlassCard className="text-center max-w-md">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Войдите в систему</h2>
          <p className="text-muted-foreground">
            Для просмотра профиля необходимо авторизоваться
          </p>
        </LiquidGlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Профиль
          </h1>
          <p className="text-muted-foreground">
            Управляйте своим аккаунтом и следите за заказами
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <LiquidGlassCard variant="hover" className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
              <p className="text-muted-foreground mb-2">{user.email}</p>
              <Badge className="mb-4 bg-gradient-secondary text-secondary-foreground">
                Класс {user.class}
              </Badge>
              
              <div className="glassmorphism p-4 rounded-xl mb-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Wallet className="w-5 h-5 text-accent" />
                  <span className="text-sm text-muted-foreground">Баланс</span>
                </div>
                <div className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                  {user.balance}₽
                </div>
              </div>

              <AnimatedButton variant="glass" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Редактировать профиль
              </AnimatedButton>
            </LiquidGlassCard>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Up Balance */}
            <LiquidGlassCard>
              <div className="flex items-center space-x-2 mb-4">
                <PlusCircle className="w-5 h-5 text-success" />
                <h3 className="text-lg font-semibold">Пополнить баланс</h3>
              </div>
              
              <div className="flex space-x-3">
                <div className="flex-1">
                  <Label htmlFor="topup" className="sr-only">Сумма пополнения</Label>
                  <Input
                    id="topup"
                    type="number"
                    placeholder="Введите сумму"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="glassmorphism"
                    min="1"
                    max="5000"
                  />
                </div>
                <AnimatedButton
                  variant="accent"
                  onClick={handleTopUp}
                  disabled={isTopUpLoading || !topUpAmount}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isTopUpLoading ? 'Обработка...' : 'Пополнить'}
                </AnimatedButton>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">
                Минимум: 1₽, Максимум: 5000₽
              </p>
            </LiquidGlassCard>

            {/* Order History */}
            <LiquidGlassCard>
              <div className="flex items-center space-x-2 mb-4">
                <History className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">История заказов</h3>
              </div>
              
              <div className="space-y-3">
                {mockOrders.map((order) => (
                  <div key={order.id} className="glassmorphism p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className="text-sm font-medium">
                          Заказ #{order.id}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                      <span className="font-semibold">{order.total}₽</span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-1">
                      {new Date(order.date).toLocaleDateString('ru-RU')}
                    </div>
                    
                    <div className="text-sm">
                      {order.items.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </LiquidGlassCard>

            {/* Available Promocodes */}
            <LiquidGlassCard>
              <div className="flex items-center space-x-2 mb-4">
                <Gift className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold">Промокоды</h3>
              </div>
              
              <div className="space-y-3">
                {mockPromocodes.map((promo) => (
                  <div key={promo.id} className={`glassmorphism p-4 rounded-lg ${
                    promo.used ? 'opacity-50' : ''
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <code className="bg-gradient-primary bg-clip-text text-transparent font-mono font-bold">
                        {promo.code}
                      </code>
                      <Badge variant={promo.used ? 'secondary' : 'default'}>
                        {promo.used ? 'Использован' : 'Доступен'}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Скидка: {promo.type === 'percentage' ? `${promo.discount}%` : `${promo.discount}₽`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Действует до: {new Date(promo.validUntil).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                ))}
              </div>
            </LiquidGlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};