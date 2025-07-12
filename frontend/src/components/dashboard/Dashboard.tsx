import React from 'react';
import { User as UserIcon, Package, ShoppingBag, Star, TrendingUp, History } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockItems } from '../../data/mockItems';

interface DashboardProps {
  onPageChange: (page: string) => void;
}

export function Dashboard({ onPageChange }: DashboardProps) {
  const { user } = useAuth();
  const userItems = mockItems.filter(item => item.uploaderId === user?.id);
  const purchases: Array<{ id: string; images: string[]; title: string; pointValue: number; }> = []; // TODO: Replace with real purchases

  // Example stats (replace with real data as needed)
  const stats = [
    ...(!user || user.isAdmin ? [] : [{
      label: 'Total Points',
      value: user.points,
      icon: <Star className="h-6 w-6 text-emerald-600" />, 
      iconBg: 'bg-emerald-100',
      valueClass: 'text-emerald-600',
    }]),
    {
      label: 'Items Listed',
      value: userItems.length,
      icon: <Package className="h-6 w-6 text-blue-600" />, 
      iconBg: 'bg-blue-100',
      valueClass: 'text-blue-600',
    },
    {
      label: 'Successful Swaps',
      value: 3, // TODO: Replace with real data
      icon: <TrendingUp className="h-6 w-6 text-purple-600" />, 
      iconBg: 'bg-purple-100',
      valueClass: 'text-purple-600',
    },
    {
      label: 'Pending Requests',
      value: 2, // TODO: Replace with real data
      icon: <History className="h-6 w-6 text-orange-600" />, 
      iconBg: 'bg-orange-100',
      valueClass: 'text-orange-600',
    },
  ];

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
    <div className="min-h-screen bg-gray-50 py-10 flex justify-center">
      <div className="w-full max-w-4xl space-y-10">
        {/* Profile summary */}
        <div className="bg-white rounded-2xl shadow p-8 flex items-center space-x-8">
          <div className="bg-emerald-100 rounded-full w-24 h-24 flex items-center justify-center">
            <UserIcon className="h-12 w-12 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <div className="text-2xl font-bold text-gray-900">{user.name}</div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isAdmin ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>{user.isAdmin ? 'Admin' : 'User'}</span>
            </div>
            <div className="text-gray-500 mb-1">{user.email}</div>
            {user && !user.isAdmin && (
              <div className="text-gray-400 text-sm">Points: <span className="font-bold text-emerald-600">{user.points}</span></div>
            )}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm mb-1">{stat.label}</div>
                <div className={`text-2xl font-bold ${stat.valueClass}`}>{stat.value}</div>
              </div>
              <div className={`rounded-full p-3 ${stat.iconBg}`}>{stat.icon}</div>
            </div>
          ))}
        </div>

        {/* My Listings */}
        <div>
          <div className="text-lg font-bold text-gray-900 mb-4">My Listings</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {userItems.length === 0 ? (
              <div className="col-span-2 md:col-span-4 text-center text-gray-400 bg-white rounded-xl p-8 shadow">
                <Package className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                No listings yet
              </div>
            ) : (
              userItems.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                  <img src={item.images[0]} alt={item.title} className="w-20 h-20 object-cover rounded mb-2 border border-gray-200" />
                  <div className="text-gray-900 font-medium text-center mb-1 truncate w-full">{item.title}</div>
                  <div className="text-xs text-gray-500 mb-1">{item.pointValue} pts</div>
                  <div className="text-xs text-gray-400">{item.status}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Purchases */}
        <div>
          <div className="text-lg font-bold text-gray-900 mb-4">My Purchases</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {purchases.length === 0 ? (
              <div className="col-span-2 md:col-span-4 text-center text-gray-400 bg-white rounded-xl p-8 shadow">
                <ShoppingBag className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                No purchases yet
              </div>
            ) : (
              purchases.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                  <img src={item.images[0]} alt={item.title} className="w-20 h-20 object-cover rounded mb-2 border border-gray-200" />
                  <div className="text-gray-900 font-medium text-center mb-1 truncate w-full">{item.title}</div>
                  <div className="text-xs text-gray-500 mb-1">{item.pointValue} pts</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
