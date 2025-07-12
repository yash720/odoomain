import React, { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, Package, MessageCircle, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockSwapRequests } from '../../data/mockItems';

interface MySwapsPageProps {
  onBack: () => void;
  onPageChange: (page: string) => void;
}

// Toast component
function Toast({ message, onClose }: { message: string, onClose: () => void }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-4 animate-fade-in">
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white font-bold">×</button>
    </div>
  );
}

export function MySwapsPage({ onBack, onPageChange }: MySwapsPageProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing' | 'completed'>('incoming');
  const [toast, setToast] = useState<string | null>(null);

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

  // Filter swap requests based on user
  const incomingRequests = mockSwapRequests.filter(req => 
    // Requests for items owned by current user
    req.itemId && req.status === 'pending'
  );

  const outgoingRequests = mockSwapRequests.filter(req => 
    req.requesterId === user.id && req.status === 'pending'
  );

  const completedSwaps = mockSwapRequests.filter(req => 
    (req.requesterId === user.id || req.itemId) && req.status === 'completed'
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'completed':
        return <Star className="h-5 w-5 text-emerald-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    setToast(`Swap request ${requestId} accepted!`);
  };

  const handleRejectRequest = (requestId: string) => {
    setToast(`Swap request ${requestId} rejected!`);
  };

  const renderSwapCard = (swap: any, isIncoming: boolean = false) => (
    <div key={swap.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon(swap.status)}
          <div>
            <h3 className="font-semibold text-gray-900">
              {swap.type === 'swap' ? 'Item Swap' : 'Point Redemption'}
            </h3>
            <p className="text-sm text-gray-600">
              {isIncoming ? `From ${swap.requesterName}` : `To item owner`}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
          swap.status === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-emerald-100 text-emerald-800'
        }`}>
          {swap.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* Requested Item */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Requested Item</h4>
          <div className="flex items-center space-x-3">
            <img
              src={swap.itemImage}
              alt={swap.itemTitle}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <p className="font-medium text-gray-900">{swap.itemTitle}</p>
              <p className="text-sm text-gray-600">
                {swap.type === 'points' ? `${swap.pointsOffered} points` : 'Item swap'}
              </p>
            </div>
          </div>
        </div>

        {/* Offered Item */}
        {swap.type === 'swap' && swap.offeredItemTitle && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Offered Item</h4>
            <div className="flex items-center space-x-3">
              <img
                src={swap.offeredItemImage}
                alt={swap.offeredItemTitle}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <p className="font-medium text-gray-900">{swap.offeredItemTitle}</p>
                <p className="text-sm text-gray-600">In exchange</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message */}
      {swap.message && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-2">
            <MessageCircle className="h-4 w-4 text-gray-500 mt-1" />
            <div>
              <p className="text-sm text-gray-700">{swap.message}</p>
              {swap.responseMessage && (
                <div className="mt-2 pl-4 border-l-2 border-emerald-200">
                  <p className="text-sm text-emerald-700">{swap.responseMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {isIncoming && swap.status === 'pending' && (
        <div className="flex space-x-3">
          <button
            onClick={() => handleAcceptRequest(swap.id)}
            className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => handleRejectRequest(swap.id)}
            className="flex-1 border border-red-300 text-red-600 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            Decline
          </button>
        </div>
      )}

      <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
        <span>{new Date(swap.createdAt).toLocaleDateString()}</span>
        {swap.status === 'completed' && (
          <button className="text-emerald-600 hover:text-emerald-700 font-medium">
            Rate Experience
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Swaps</h1>
          <p className="text-gray-600">Manage your ongoing and completed exchanges</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Incoming Requests</p>
                <p className="text-2xl font-bold text-orange-600">{incomingRequests.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Outgoing Requests</p>
                <p className="text-2xl font-bold text-blue-600">{outgoingRequests.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed Swaps</p>
                <p className="text-2xl font-bold text-emerald-600">{completedSwaps.length}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8 border border-gray-100">
          <div className="flex">
            <button
              onClick={() => setActiveTab('incoming')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'incoming'
                  ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Incoming ({incomingRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('outgoing')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'outgoing'
                  ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Outgoing ({outgoingRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'completed'
                  ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed ({completedSwaps.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'incoming' && (
            <>
              {incomingRequests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No incoming requests</h3>
                  <p className="text-gray-600">When someone wants to swap with your items, they'll appear here.</p>
                </div>
              ) : (
                incomingRequests.map(swap => renderSwapCard(swap, true))
              )}
            </>
          )}

          {activeTab === 'outgoing' && (
            <>
              {outgoingRequests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No outgoing requests</h3>
                  <p className="text-gray-600 mb-6">Start browsing items to make your first swap request!</p>
                  <button
                    onClick={() => onPageChange('browse')}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Browse Items
                  </button>
                </div>
              ) : (
                outgoingRequests.map(swap => renderSwapCard(swap))
              )}
            </>
          )}

          {activeTab === 'completed' && (
            <>
              {completedSwaps.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No completed swaps yet</h3>
                  <p className="text-gray-600">Your completed exchanges will be shown here.</p>
                </div>
              ) : (
                completedSwaps.map(swap => renderSwapCard(swap))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}