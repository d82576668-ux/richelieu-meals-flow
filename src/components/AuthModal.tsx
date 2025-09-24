import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail, Lock, User, GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) => {
  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(defaultTab);

  const [loginForm, setLoginForm] = useState({
    email: 'alex@richelieu.edu',
    password: 'demo123',
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    class: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(loginForm.email, loginForm.password);
    
    if (result.success) {
      toast({
        title: 'Успешно!',
        description: 'Добро пожаловать в систему Ришельевского лицея',
      });
      onClose();
    } else {
      toast({
        title: 'Ошибка входа',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Пароли не совпадают',
        variant: 'destructive',
      });
      return;
    }

    const result = await register({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
      class: registerForm.class,
    });

    if (result.success) {
      toast({
        title: 'Регистрация успешна!',
        description: 'Добро пожаловать в систему Ришельевского лицея',
      });
      onClose();
    } else {
      toast({
        title: 'Ошибка регистрации',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphism max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Richelieu Lyceum
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2 glassmorphism">
            <TabsTrigger value="login" className="text-sm">Вход</TabsTrigger>
            <TabsTrigger value="register" className="text-sm">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="alex@richelieu.edu"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 glassmorphism"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="demo123"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 glassmorphism"
                    required
                  />
                </div>
              </div>

              <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
                <strong>Демо аккаунты:</strong><br />
                alex@richelieu.edu / demo123<br />
                maria@richelieu.edu / demo123<br />
                admin@richelieu.edu / demo123
              </div>

              <AnimatedButton
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Вход...
                  </>
                ) : (
                  'Войти'
                )}
              </AnimatedButton>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 mt-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Имя</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Введите ваше имя"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10 glassmorphism"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="class" className="text-foreground">Класс</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="class"
                    type="text"
                    placeholder="10А, 11Б, etc."
                    value={registerForm.class}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, class: e.target.value }))}
                    className="pl-10 glassmorphism"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="your.email@richelieu.edu"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 glassmorphism"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password" className="text-foreground">Пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Минимум 6 символов"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 glassmorphism"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-foreground">Подтвердите пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Повторите пароль"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pl-10 glassmorphism"
                    required
                  />
                </div>
              </div>

              <AnimatedButton
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Регистрация...
                  </>
                ) : (
                  'Зарегистрироваться'
                )}
              </AnimatedButton>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};