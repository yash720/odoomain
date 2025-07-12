import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, MapPin } from 'lucide-react';
import { mockItems } from '../../data/mockItems';

interface FeaturedItemsProps {
  onItemClick: (id: string) => void;
}

export function FeaturedItems({ onItemClick }: FeaturedItemsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredItems = mockItems.filter(item => item.isFeatured);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featuredItems.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
  };

  if (featuredItems.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Items</h2>
          <p className="text-xl text-gray-600">
            Discover amazing pieces from our community
          </p>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {featuredItems.map((item) => (
                <div key={item.id} className="w-full flex-shrink-0">
                  <div className="relative h-96 sm:h-[500px] bg-gradient-to-br from-emerald-100 to-teal-100">
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl w-full">
                        {/* Item Image */}
                        <div className="order-2 lg:order-1">
                          <div className="relative group">
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-full h-80 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                            />
                            <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-emerald-600">
                              {item.pointValue} Points
                            </div>
                          </div>
                        </div>

                        {/* Item Details */}
                        <div className="order-1 lg:order-2 text-center lg:text-left">
                          <div className="inline-flex items-center space-x-1 text-yellow-500 mb-4">
                            <Star className="h-5 w-5 fill-current" />
                            <span className="text-gray-700 font-medium">Featured Item</span>
                          </div>
                          
                          <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            {item.title}
                          </h3>
                          
                          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            {item.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
                            {item.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center space-x-4 mb-6 justify-center lg:justify-start">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm">by {item.uploaderName}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Size: {item.size} • {item.condition}
                            </div>
                          </div>

                          <button
                            onClick={() => onItemClick(item.id)}
                            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transform hover:scale-105 transition-all duration-200"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 z-10"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 z-10"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {featuredItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}