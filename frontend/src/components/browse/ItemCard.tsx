import React from 'react';
import { Star, MapPin, Calendar } from 'lucide-react';
import { ClothingItem } from '../../types';

interface ItemCardProps {
  item: ClothingItem;
  onClick: () => void;
  viewMode?: 'grid' | 'list';
}

export function ItemCard({ item, onClick, viewMode = 'grid' }: ItemCardProps) {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'like-new':
        return 'bg-blue-100 text-blue-800';
      case 'good':
        return 'bg-yellow-100 text-yellow-800';
      case 'fair':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 hover:border-emerald-200 p-6"
      >
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="relative">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full sm:w-48 h-48 object-cover rounded-lg"
            />
            <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
              {item.pointValue} pts
            </div>
            {item.isFeatured && (
              <div className="absolute top-3 right-3 bg-yellow-500 text-white p-1 rounded-full">
                <Star className="h-4 w-4 fill-current" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-900 truncate">
                {item.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
                {item.condition}
              </span>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">
              {item.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{item.uploaderName}</span>
                </span>
                <span>Size: {item.size}</span>
              </div>
              <span className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 hover:border-emerald-200 overflow-hidden group"
    >
      <div className="relative">
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
          {item.pointValue} pts
        </div>
        {item.isFeatured && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-white p-1 rounded-full">
            <Star className="h-4 w-4 fill-current" />
          </div>
        )}
        <div className={`absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
          {item.condition}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
          {item.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{item.uploaderName}</span>
          </span>
          <span>Size: {item.size}</span>
        </div>
      </div>
    </div>
  );
}