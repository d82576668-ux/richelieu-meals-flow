import { AnimatedButton } from "@/components/ui/animated-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { User, Menu, X, Wallet } from "lucide-react";

interface HeaderProps {
  user?: {
    name: string;
    balance: number;
    avatar?: string;
  };
  onAuthAction: (action: 'login' | 'register' | 'logout') => void;
}

export const Header = ({ user, onAuthAction }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-glass-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">RL</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Richelieu Lyceum
              </h1>
              <p className="text-xs text-muted-foreground">School Lunch System</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#catalog" className="text-foreground hover:text-primary transition-colors">
              Каталог
            </a>
            <a href="#profile" className="text-foreground hover:text-primary transition-colors">
              Профиль
            </a>
            <a href="#history" className="text-foreground hover:text-primary transition-colors">
              История
            </a>
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Balance */}
                <div className="glassmorphism px-3 py-2 rounded-lg flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">{user.balance} ₽</span>
                </div>
                
                {/* User Avatar */}
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                </div>
                
                <AnimatedButton 
                  variant="glass" 
                  size="sm"
                  onClick={() => onAuthAction('logout')}
                >
                  Выход
                </AnimatedButton>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <AnimatedButton 
                  variant="glass" 
                  size="sm"
                  onClick={() => onAuthAction('login')}
                >
                  Вход
                </AnimatedButton>
                <AnimatedButton 
                  variant="primary" 
                  size="sm"
                  onClick={() => onAuthAction('register')}
                >
                  Регистрация
                </AnimatedButton>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-glass-border">
            <div className="flex flex-col space-y-3">
              <a 
                href="#catalog" 
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Каталог
              </a>
              <a 
                href="#profile" 
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Профиль
              </a>
              <a 
                href="#history" 
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                История
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};