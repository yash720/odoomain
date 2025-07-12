import React, { useState } from 'react';
import { 
  Shield, Users, Package, AlertTriangle, Check, X, Search, 
  TrendingUp, Flag, Trash2, Award, Zap, Eye, Ban, 
  UserCheck, Clock, BarChart3, Star, Filter, ChevronDown,
  MessageSquare, Image, Calendar, Target
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockItems, mockNotifications } from '../../data/mockItems';
import axios from 'axios';

interface AdminPanelProps {
  onPageChange: (page: string) => void;
}

export function AdminPanel({ onPageChange }: AdminPanelProps) {
  const { user } = useAuth();
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('rewear_token');
        const response = await axios.get('http://localhost:5000/api/items/pending', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setPendingItems(response.data.data.items || []);
      } catch (err: any) {
        setError('Failed to fetch pending items');
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleApprove = async (itemId: string) => {
    try {
      const token = localStorage.getItem('rewear_token');
      await axios.put(`http://localhost:5000/api/items/${itemId}/approve`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setPendingItems(items => items.filter(item => item._id !== itemId));
    } catch {
      alert('Failed to approve item');
    }
  };

  const handleReject = async (itemId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      const token = localStorage.getItem('rewear_token');
      await axios.put(`http://localhost:5000/api/items/${itemId}/reject`, { reason }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setPendingItems(items => items.filter(item => item._id !== itemId));
    } catch {
      alert('Failed to reject item');
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const token = localStorage.getItem('rewear_token');
      await axios.delete(`http://localhost:5000/api/items/${itemId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setPendingItems(items => items.filter(item => item._id !== itemId));
    } catch {
      alert('Failed to delete item');
    }
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <button
            onClick={() => onPageChange('home')}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Moderate and approve/reject item listings</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold mb-4">Pending Item Listings</h2>
          {loading && <div className="text-gray-500">Loading...</div>}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {pendingItems.length === 0 && !loading && (
            <div className="text-gray-500">No pending items to review.</div>
          )}
          <div className="space-y-8">
            {pendingItems.map(item => (
              <div key={item._id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:space-x-6 bg-gray-50">
                <div className="flex-shrink-0 flex flex-row md:flex-col gap-2 mb-4 md:mb-0">
                  {item.images && item.images.length > 0 ? (
                    item.images.slice(0, 2).map((img: string, idx: number) => (
                      <img key={idx} src={img} alt="item" className="w-24 h-24 object-cover rounded-lg border" />
                    ))
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-700 mb-2">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs">{item.category}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{item.size}</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">{item.condition}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">By: {item.uploaderName}</div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleApprove(item._id)} className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 flex items-center gap-1">
                      <Check className="h-4 w-4" /> Approve
                      </button>
                    <button onClick={() => handleReject(item._id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-1">
                      <X className="h-4 w-4" /> Reject
                      </button>
                    <button onClick={() => handleDelete(item._id)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 flex items-center gap-1">
                      <Trash2 className="h-4 w-4" /> Delete
                </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}