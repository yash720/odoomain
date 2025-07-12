import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/common/Header';
import { LandingPage } from './components/home/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { BrowsePage } from './components/browse/BrowsePage';
import { ItemDetailPage } from './components/item/ItemDetailPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { AddItemPage } from './components/add-item/AddItemPage';
import { AdminPanel } from './components/admin/AdminPanel';
import { MySwapsPage } from './components/swaps/MySwapsPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { FavoritesPage } from './components/favorites/FavoritesPage';
import { AdminPanelClassic } from './components/admin/AdminPanelClassic';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const { user, isLoading } = useAuth();

  // Force admin to admin panel as soon as detected
  useEffect(() => {
    if (user && user.isAdmin) {
      setCurrentPage('admin');
    }
  }, [user]);

  const handlePageChange = (page: string) => {
    // Define protected pages that require authentication
    const protectedPages = ['dashboard', 'profile', 'admin', 'add-item', 'my-swaps', 'favorites'];
    
    // If user is not authenticated and trying to access a protected page
    if (!user && protectedPages.includes(page)) {
      setPreviousPage(page);
      setShowAuthModal(true);
      return;
    }
    
    setCurrentPage(page);
    setShowAuthModal(false);
  };

  const handleAuthClick = () => {
    // Store the current page before showing auth modal
    setPreviousPage(currentPage);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    // If the previous page was a protected page, redirect to that page
    // Otherwise, redirect to landing page
    const protectedPages = ['dashboard', 'profile', 'admin', 'add-item', 'my-swaps', 'favorites'];
    if (previousPage && protectedPages.includes(previousPage)) {
      setCurrentPage(previousPage);
    } else {
      setCurrentPage('home');
    }
    setPreviousPage(null);
  };

  const renderPage = () => {
    // Handle item detail pages
    if (currentPage.startsWith('item-')) {
      const itemId = currentPage.replace('item-', '');
      return (
        <ItemDetailPage 
          itemId={itemId} 
          onBack={() => setCurrentPage('browse')}
          onPageChange={handlePageChange}
        />
      );
    }

    // Handle browse page with search
    if (currentPage.startsWith('browse')) {
      return (
        <BrowsePage 
          onItemClick={(id) => setCurrentPage(`item-${id}`)}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return (
          <LandingPage 
            onAuthClick={handleAuthClick}
            onPageChange={handlePageChange}
          />
        );
      case 'browse':
        return (
          <BrowsePage 
            onItemClick={(id) => setCurrentPage(`item-${id}`)}
          />
        );
      case 'dashboard':
        if (user && user.isAdmin) return <AdminPanelClassic onPageChange={handlePageChange} />;
        return <Dashboard onPageChange={handlePageChange} />;
      case 'add-item':
        if (user && user.isAdmin) return <AdminPanelClassic onPageChange={handlePageChange} />;
        return (
          <AddItemPage 
            onBack={() => setCurrentPage('dashboard')}
            onPageChange={handlePageChange}
          />
        );
      case 'admin':
        if (user && user.isAdmin) return <AdminPanelClassic onPageChange={handlePageChange} />;
        return <AdminPanel onPageChange={handlePageChange} />;
      case 'my-swaps':
        if (user && user.isAdmin) return <AdminPanelClassic onPageChange={handlePageChange} />;
        return (
          <MySwapsPage 
            onBack={() => setCurrentPage('dashboard')}
            onPageChange={handlePageChange}
          />
        );
      case 'profile':
        if (user && user.isAdmin) return <AdminPanelClassic onPageChange={handlePageChange} />;
        return (
          <ProfilePage 
            onBack={() => setCurrentPage('dashboard')}
            onPageChange={handlePageChange}
          />
        );
      case 'favorites':
        if (user && user.isAdmin) return <AdminPanelClassic onPageChange={handlePageChange} />;
        return (
          <FavoritesPage 
            onBack={() => setCurrentPage('dashboard')}
            onPageChange={handlePageChange}
          />
        );
      default:
        return (
          <LandingPage 
            onAuthClick={handleAuthClick}
            onPageChange={handlePageChange}
          />
        );
    }
  };

  // If loading, show loading
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  // If not logged in, show auth modal
  if (!user) {
    return (
      <AuthModal 
        isOpen={true} 
        onClose={() => {}} 
        onAuthSuccess={() => setCurrentPage('home')} 
      />
    );
  }

  // If admin, show ONLY the classic admin panel (no header, no user nav)
  if (user && user.isAdmin) {
    // Always force admin to see only the admin panel
    return <AdminPanelClassic onPageChange={() => {}} />;
  }

  // Otherwise, show the normal app for regular users
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onAuthClick={() => setShowAuthModal(true)}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
      />
      {renderPage()}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;