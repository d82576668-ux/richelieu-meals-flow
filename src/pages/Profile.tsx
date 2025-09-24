import { useAuth } from '@/hooks/useAuth';
import { query } from '@/lib/db';
import { useEffect, useState } from 'react';
import { BalanceTopUp } from '@/components/BalanceTopUp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  description: string;
  created_at: string;
}

export const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchTransactions = async () => {
        try {
          const { rows } = await query(
            'SELECT * FROM balance_transactions WHERE user_id = $1 ORDER BY created_at DESC',
            [user.id]
          );
          setTransactions(rows);
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      };
      fetchTransactions();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) {
    return <div className="text-center py-10">Пожалуйста, войдите в систему</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="glassmorphism mb-6">
        <CardHeader>
          <CardTitle>Профиль</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p><strong>Имя:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Класс:</strong> {user.class}</p>
            <p><strong>Баланс:</strong> {user.balance}₽</p>
            <BalanceTopUp />
          </div>
        </CardContent>
      </Card>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>История транзакций</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground">Нет транзакций</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Описание</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{format(new Date(transaction.created_at), 'dd.MM.yyyy HH:mm')}</TableCell>
                    <TableCell>
                      {transaction.transaction_type === 'deposit' ? 'Пополнение' : 'Покупка'}
                    </TableCell>
                    <TableCell
                      className={transaction.amount >= 0 ? 'text-success' : 'text-destructive'}
                    >
                      {transaction.amount >= 0 ? '+' : ''}{transaction.amount}₽
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
