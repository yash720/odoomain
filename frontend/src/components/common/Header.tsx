import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Search, User, ShoppingBag, Shirt, Bell, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockNotifications } from '../../data/mockItems';

interface HeaderProps {
  onAuthClick: () => void;
  onPageChange: (page: string) => void;
  currentPage: string;
}

export function Header({ onAuthClick, onPageChange, currentPage }: HeaderProps) {
  const { user, logout } = useAuth();
  // If admin, do not render the header at all
  if (user && user.isAdmin) return null;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notifications if clicking outside
  useEffect(() => {
    if (!isNotificationOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationOpen]);

  const unreadNotifications = user ? mockNotifications.filter(n => n.userId === user.id && !n.isRead) : [];

  const handleLogout = () => {
    logout();
    onPageChange('home');
    setIsUserMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onPageChange(`browse?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onPageChange('home')}
          >
            <div className="bg-emerald-600 p-2 rounded-xl">
              <Shirt className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">ReWear</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onPageChange('browse')}
              className={`text-gray-600 hover:text-emerald-600 transition-colors ${
                currentPage === 'browse' ? 'text-emerald-600 font-semibold' : ''
              }`}
            >
              Browse Items
            </button>
            {user && (
              <>
                <button
                  onClick={() => onPageChange('dashboard')}
                  className={`text-gray-600 hover:text-emerald-600 transition-colors ${
                    currentPage === 'dashboard' ? 'text-emerald-600 font-semibold' : ''
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => onPageChange('add-item')}
                  className={`text-gray-600 hover:text-emerald-600 transition-colors ${
                    currentPage === 'add-item' ? 'text-emerald-600 font-semibold' : ''
                  }`}
                >
                  List Item
                </button>
                <button
                  onClick={() => onPageChange('my-swaps')}
                  className={`text-gray-600 hover:text-emerald-600 transition-colors ${
                    currentPage === 'my-swaps' ? 'text-emerald-600 font-semibold' : ''
                  }`}
                >
                  My Swaps
                </button>
                {user.isAdmin && (
                  <button
                    onClick={() => onPageChange('admin')}
                    className={`text-gray-600 hover:text-emerald-600 transition-colors ${
                      currentPage === 'admin' ? 'text-emerald-600 font-semibold' : ''
                    }`}
                  >
                    Admin
                  </button>
                )}
              </>
            )}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search items..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-64"
              />
            </form>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    <Bell className="h-6 w-6" />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadNotifications.length}
                      </span>
                    )}
                  </button>

                  {isNotificationOpen && (
                    <div ref={notificationRef} className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <button
                        onClick={() => setIsNotificationOpen(false)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        aria-label="Close notifications"
                      >
                        <X className="h-5 w-5" />
                      </button>
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {mockNotifications.filter(n => n.userId === user.id).length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            No notifications yet
                          </div>
                        ) : (
                          mockNotifications
                            .filter(n => n.userId === user.id)
                            .slice(0, 5)
                            .map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                  !notification.isRead ? 'bg-blue-50' : ''
                                }`}
                              >
                                <p className="font-medium text-sm text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {notification.createdAt.toLocaleDateString()}
                                </p>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Favorites */}
                <button
                  onClick={() => onPageChange('favorites')}
                  className="p-2 text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  <Heart className="h-6 w-6" />
                </button>

                {/* User Profile */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    <div className="bg-emerald-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="hidden sm:block font-medium">{user.name}</span>
                    {/* Points display removed from header as per user request */}
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <button
                        onClick={() => {
                          onPageChange('profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Profile Settings
                      </button>
                      <button
                        onClick={() => {
                          onPageChange('dashboard');
                          setIsUserMenuOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          onPageChange('my-swaps');
                          setIsUserMenuOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        My Swaps
                      </button>
                      <button
                        onClick={() => {
                          onPageChange('favorites');
                          setIsUserMenuOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Favorites
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-emerald-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search items..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </form>
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    onPageChange('browse');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-2 py-2 text-gray-600 hover:text-emerald-600"
                >
                  Browse Items
                </button>
                {user && (
                  <>
                    <button
                      onClick={() => {
                        onPageChange('dashboard');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-2 py-2 text-gray-600 hover:text-emerald-600"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        onPageChange('add-item');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-2 py-2 text-gray-600 hover:text-emerald-600"
                    >
                      List Item
                    </button>
                    <button
                      onClick={() => {
                        onPageChange('my-swaps');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-2 py-2 text-gray-600 hover:text-emerald-600"
                    >
                      My Swaps
                    </button>
                    <button
                      onClick={() => {
                        onPageChange('favorites');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-2 py-2 text-gray-600 hover:text-emerald-600"
                    >
                      Favorites
                    </button>
                    {user.isAdmin && (
                      <button
                        onClick={() => {
                          onPageChange('admin');
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-2 py-2 text-gray-600 hover:text-emerald-600"
                      >
                        Admin
                      </button>
                    )}
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}