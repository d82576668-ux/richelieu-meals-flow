import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MealCard } from '@/components/MealCard';
import { AuthModal } from '@/components/AuthModal';
import { LiquidGlassCard } from '@/components/ui/liquid-glass-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Star, TrendingUp, ChefHat } from 'lucide-react';

// Mock data for meals
const mockMeals = [
  {
    id: '1',
    name: 'Борщ с говядиной',
    description: 'Традиционный украинский борщ с мягкой говядиной, свежей капустой и сметаной',
    price: 180,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    category: 'Супы',
    available: true,
    rating: 4.8,
    prepTime: '15 мин',
    popularity: 47,
  },
  {
    id: '2',
    name: 'Куриная котлета с пюре',
    description: 'Сочная котлета из куриного филе с нежным картофельным пюре и овощным салатом',
    price: 220,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    category: 'Горячие блюда',
    available: true,
    rating: 4.6,
    prepTime: '10 мин',
    popularity: 63,
  },
  {
    id: '3',
    name: 'Салат Цезарь',
    description: 'Классический салат с курицей, листьями салата, сыром пармезан и соусом Цезарь',
    price: 150,
    image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400&h=300&fit=crop',
    category: 'Салаты',
    available: true,
    rating: 4.4,
    prepTime: '5 мин',
    popularity: 31,
  },
  {
    id: '4',
    name: 'Паста Карбонара',
    description: 'Итальянская паста с беконом, яйцом, сыром пармезан и черным перцем',
    price: 250,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
    category: 'Горячие блюда',
    available: false,
    rating: 4.9,
    prepTime: '12 мин',
    popularity: 89,
  },
  {
    id: '5',
    name: 'Омлет с сыром',
    description: 'Воздушный омлет с плавленым сыром и свежей зеленью',
    price: 120,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    category: 'Завтраки',
    available: true,
    rating: 4.3,
    prepTime: '8 мин',
    popularity: 25,
  },
  {
    id: '6',
    name: 'Рыбные палочки',
    description: 'Хрустящие рыбные палочки с картофелем фри и тартарным соусом',
    price: 200,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    category: 'Горячие блюда',
    available: true,
    rating: 4.2,
    prepTime: '7 мин',
    popularity: 38,
  },
];

const categories = ['Все', 'Супы', 'Горячие блюда', 'Салаты', 'Завтраки'];

export const Home = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; defaultTab: 'login' | 'register' }>({
    isOpen: false,
    defaultTab: 'login',
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);

  // Filter meals based on search and category
  const filteredMeals = mockMeals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || meal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAuthAction = (action: 'login' | 'register' | 'logout') => {
    if (action === 'logout') {
      // Handle logout directly through useAuth
      return;
    }
    
    setAuthModal({
      isOpen: true,
      defaultTab: action,
    });
  };

  const handleAddToCart = async (mealId: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите в систему для заказа блюд',
        variant: 'destructive',
      });
      setAuthModal({ isOpen: true, defaultTab: 'login' });
      return;
    }

    setCart(prev => [...prev, mealId]);
    toast({
      title: 'Добавлено в корзину!',
      description: 'Блюдо успешно добавлено в вашу корзину',
    });
  };

  const handleToggleFavorite = (mealId: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите в систему для добавления в избранное',
        variant: 'destructive',
      });
      return;
    }

    setFavorites(prev => 
      prev.includes(mealId) 
        ? prev.filter(id => id !== mealId)
        : [...prev, mealId]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header user={user} onAuthAction={handleAuthAction} />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Richelieu Lyceum
              </span>
              <br />
              <span className="text-3xl md:text-4xl text-foreground font-light">
                School Lunch System
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Современная система заказа школьных обедов с удобным интерфейсом, 
              промокодами и безопасными платежами
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AnimatedButton 
                  variant="primary" 
                  size="lg"
                  onClick={() => setAuthModal({ isOpen: true, defaultTab: 'register' })}
                >
                  Начать работу
                </AnimatedButton>
                <AnimatedButton 
                  variant="glass" 
                  size="lg"
                  onClick={() => setAuthModal({ isOpen: true, defaultTab: 'login' })}
                >
                  Войти в систему
                </AnimatedButton>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LiquidGlassCard variant="hover" className="text-center">
              <ChefHat className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold text-foreground mb-2">20+</h3>
              <p className="text-muted-foreground">Блюд в меню</p>
            </LiquidGlassCard>
            
            <LiquidGlassCard variant="hover" className="text-center">
              <Star className="w-12 h-12 mx-auto mb-4 text-accent" />
              <h3 className="text-2xl font-bold text-foreground mb-2">4.7</h3>
              <p className="text-muted-foreground">Средняя оценка</p>
            </LiquidGlassCard>
            
            <LiquidGlassCard variant="hover" className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-success" />
              <h3 className="text-2xl font-bold text-foreground mb-2">500+</h3>
              <p className="text-muted-foreground">Довольных учеников</p>
            </LiquidGlassCard>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Каталог блюд
            </h2>
            <p className="text-muted-foreground text-lg">
              Выберите любимые блюда из нашего разнообразного меню
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Поиск блюд..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glassmorphism"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    selectedCategory === category 
                      ? 'bg-gradient-primary text-primary-foreground' 
                      : 'glassmorphism hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Meals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeals.map((meal, index) => (
              <div
                key={meal.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-fade-in"
              >
                <MealCard
                  meal={meal}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favorites.includes(meal.id)}
                />
              </div>
            ))}
          </div>

          {filteredMeals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Блюда не найдены. Попробуйте изменить поисковый запрос или фильтры.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        defaultTab={authModal.defaultTab}
      />
    </div>
  );
};