import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/Header';
import { CartSidebar } from '@/components/CartSidebar';
import { AuthModal } from '@/components/AuthModal';
import { Profile } from '@/pages/Profile';
import { Catalog } from '@/pages/Catalog'; // Предполагается, что этот компонент уже существует
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const App = () => {
  const { user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const handleAuthAction = (action: 'login' | 'register' | 'logout') => {
    if (action === 'logout') {
      logout();
    } else {
      setAuthModalTab(action);
      setAuthModalOpen(true);
    }
  };

  return (
    <BrowserRouter>
      <Header user={user} onAuthAction={handleAuthAction} />
      <CartSidebar />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};
