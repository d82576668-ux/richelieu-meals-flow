import { useState } from 'react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Wallet } from 'lucide-react';

export const BalanceTopUp = () => {
  const { updateBalance, user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTopUp = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: 'Ошибка',
        description: 'Введите корректную сумму',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      await updateBalance(parsedAmount, `Пополнение баланса на ${parsedAmount}₽`);
      toast({
        title: 'Успех',
        description: `Баланс пополнен на ${parsedAmount}₽`,
      });
      setAmount('');
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось пополнить баланс',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glassmorphism p-4 rounded-xl space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Пополнение баланса</h3>
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          placeholder="Введите сумму (₽)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="glassmorphism"
          disabled={isProcessing}
        />
        <AnimatedButton
          variant="primary"
          onClick={handleTopUp}
          disabled={isProcessing || !amount}
        >
          <Wallet className="w-4 h-4 mr-2" />
          {isProcessing ? 'Обработка...' : 'Пополнить'}
        </AnimatedButton>
      </div>
      {user && (
        <p className="text-sm text-muted-foreground">
          Текущий баланс: <span className="font-medium text-success">{user.balance}₽</span>
        </p>
      )}
    </div>
  );
};
