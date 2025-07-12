import React, { useState } from 'react';
import { ArrowLeft, Heart, Grid, List } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ItemCard } from '../browse/ItemCard';
import { mockItems } from '../../data/mockItems';

interface FavoritesPageProps {
  onBack: () => void;
  onPageChange: (page: string) => void;
}

export function FavoritesPage({ onBack, onPageChange }: FavoritesPageProps) {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock favorites - in a real app, this would come from user data
  const favoriteItemIds = ['1', '2', '4']; // Mock favorite item IDs
  const favoriteItems = mockItems.filter(item => favoriteItemIds.includes(item.id));

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <button
            onClick={() => onPageChange('auth')}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
              <Heart className="h-8 w-8 text-red-500 fill-current" />
              <span>My Favorites</span>
            </h1>
            <p className="text-gray-600">
              {favoriteItems.length} saved {favoriteItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {favoriteItems.length > 0 && (
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              {/* View Mode Toggle */}
              <div className="flex bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${
                    viewMode === 'grid' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${
                    viewMode === 'list' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Favorites Content */}
        {favoriteItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-4">No favorites yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start browsing items and click the heart icon to save your favorites. 
              They'll appear here for easy access later.
            </p>
            <button
              onClick={() => onPageChange('browse')}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Browse Items
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-6'
          }>
            {favoriteItems.map((item) => (
              <div key={item.id} className="relative group">
                <ItemCard
                  item={item}
                  onClick={() => onPageChange(`item-${item.id}`)}
                  viewMode={viewMode}
                />
                {/* Remove from favorites button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert('Removed from favorites!');
                  }}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                >
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {favoriteItems.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => onPageChange('browse')}
                className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4 text-center hover:bg-emerald-100 transition-colors"
              >
                <Grid className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-medium text-emerald-600">Browse More Items</p>
              </button>
              <button
                onClick={() => onPageChange('add-item')}
                className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center hover:bg-blue-100 transition-colors"
              >
                <Heart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-blue-600">List Your Items</p>
              </button>
              <button
                onClick={() => onPageChange('my-swaps')}
                className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center hover:bg-purple-100 transition-colors"
              >
                <List className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="font-medium text-purple-600">View My Swaps</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}