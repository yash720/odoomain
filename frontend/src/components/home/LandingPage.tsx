import React from 'react';
import { ArrowRight, Recycle, Users, Star, TrendingUp } from 'lucide-react';
import { FeaturedItems } from './FeaturedItems';
import { useAuth } from '../../contexts/AuthContext';

interface LandingPageProps {
  onAuthClick: () => void;
  onPageChange: (page: string) => void;
}

export function LandingPage({ onAuthClick, onPageChange }: LandingPageProps) {
  const { user } = useAuth();
  const handleStartSwapping = () => {
    onPageChange('browse');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Give Fashion a{' '}
              <span className="text-emerald-600 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Second Life
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join the sustainable fashion revolution. Exchange, swap, and discover pre-loved clothing
              while earning points and reducing textile waste.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={handleStartSwapping}
                className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span>Start Swapping</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => onPageChange('browse')}
                className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-200 flex items-center space-x-2"
              >
                <span>Browse Items</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">10,000+</div>
                <div className="text-gray-600">Items Exchanged</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">5,000+</div>
                <div className="text-gray-600">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">75%</div>
                <div className="text-gray-600">Waste Reduced</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">4.9★</div>
                <div className="text-gray-600">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <FeaturedItems onItemClick={(id) => onPageChange(`item-${id}`)} />

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose ReWear?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes sustainable fashion accessible, rewarding, and fun for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-emerald-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:bg-emerald-200 transition-colors">
                <Recycle className="h-8 w-8 text-emerald-600 mx-auto mt-1" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Eco-Friendly</h3>
              <p className="text-gray-600">
                Reduce textile waste and carbon footprint by giving clothes a second life.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-blue-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <Users className="h-8 w-8 text-blue-600 mx-auto mt-1" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600">
                Connect with like-minded fashion enthusiasts in your area.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-yellow-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:bg-yellow-200 transition-colors">
                <Star className="h-8 w-8 text-yellow-600 mx-auto mt-1" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Point System</h3>
              <p className="text-gray-600">
                Earn points for each exchange and redeem them for premium items.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-purple-100 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mt-1" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Assured</h3>
              <p className="text-gray-600">
                All items are moderated to ensure quality and appropriate content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Wardrobe?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of users who are already making a difference through sustainable fashion.
          </p>
          <button
            onClick={handleStartSwapping}
            className="bg-white text-emerald-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
}