import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ShoppingCart, Heart, Clock, Users } from "lucide-react";

interface MealCardProps {
  meal: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    available: boolean;
    rating?: number;
    prepTime?: string;
    popularity?: number;
  };
  onAddToCart: (mealId: string) => void;
  onToggleFavorite?: (mealId: string) => void;
  isFavorite?: boolean;
}

export const MealCard = ({ meal, onAddToCart, onToggleFavorite, isFavorite }: MealCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    await onAddToCart(meal.id);
    setIsLoading(false);
  };

  return (
    <LiquidGlassCard 
      variant="hover" 
      className="group overflow-hidden animate-fade-in"
      style={{ 
        animationDelay: `${Math.random() * 0.3}s` 
      }}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        <Badge 
          className="absolute top-3 left-3 bg-gradient-primary text-primary-foreground border-0"
        >
          {meal.category}
        </Badge>

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(meal.id)}
            className="absolute top-3 right-3 p-2 rounded-full glassmorphism hover:scale-110 transition-all duration-300"
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'text-red-500 fill-red-500' : 'text-foreground'
              }`} 
            />
          </button>
        )}

        {/* Quick Info Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {meal.rating && (
            <div className="flex items-center space-x-1 glassmorphism px-2 py-1 rounded-full">
              <span className="text-xs text-accent">★</span>
              <span className="text-xs text-foreground">{meal.rating}</span>
            </div>
          )}
          
          {meal.prepTime && (
            <div className="flex items-center space-x-1 glassmorphism px-2 py-1 rounded-full">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-foreground">{meal.prepTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {meal.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {meal.description}
          </p>
        </div>

        {/* Stats */}
        {meal.popularity && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>Заказали: {meal.popularity} чел.</span>
          </div>
        )}

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              {meal.price}
            </span>
            <span className="text-sm text-muted-foreground">₽</span>
          </div>

          <AnimatedButton
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={!meal.available || isLoading}
            className="flex items-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isLoading ? 'Добавление...' : 'В корзину'}</span>
          </AnimatedButton>
        </div>

        {/* Availability Status */}
        {!meal.available && (
          <div className="text-center pt-2">
            <Badge variant="destructive" className="bg-destructive/20 text-destructive border-destructive/30">
              Нет в наличии
            </Badge>
          </div>
        )}
      </div>
    </LiquidGlassCard>
  );
};