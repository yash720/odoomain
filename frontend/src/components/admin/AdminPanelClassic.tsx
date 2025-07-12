import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'Active' },
];

const mockListings = [
  { id: 1, title: 'Summer Dress', user: 'John Doe', category: 'Dresses', status: 'Pending', description: 'Beautiful floral summer dress perfect for warm weather occasions.' },
  { id: 2, title: 'Leather Jacket', user: 'Jane Smith', category: 'Outerwear', status: 'Approved', description: 'Classic black leather jacket in great condition' },
  { id: 3, title: 'Vintage Jeans', user: 'Bob Johnson', category: 'Bottoms', status: 'Rejected', description: 'High-waisted vintage jeans with authentic distressed look' },
  { id: 4, title: 'Designer Bag', user: 'Alice Brown', category: 'Accessories', status: 'Pending', description: 'Luxury designer handbag with minimal signs of wear' },
];

const mockOrders = [];

export function AdminPanelClassic({ onPageChange }: { onPageChange: (page: string) => void }) {
  const { user } = useAuth();
  const [tab, setTab] = useState<'users' | 'orders' | 'listings'>('users');

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div style={{ background: '#f4f4f4', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: '#181c2f', color: '#fff', padding: '24px 0', textAlign: 'center', borderBottom: '2px solid #222' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Admin Panel</h1>
        <p style={{ margin: '8px 0 0', fontSize: '1.1rem', color: '#b0b0b0' }}>
          Moderate and approve/reject item listings. Remove inappropriate or spam items. Lightweight admin panel for oversight.
        </p>
      </div>
      <div style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 32 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
          <button onClick={() => setTab('users')} style={{ padding: '10px 24px', borderRadius: 6, border: 'none', background: tab === 'users' ? '#181c2f' : '#eee', color: tab === 'users' ? '#fff' : '#222', fontWeight: 'bold', cursor: 'pointer' }}>Manage Users</button>
          <button onClick={() => setTab('orders')} style={{ padding: '10px 24px', borderRadius: 6, border: 'none', background: tab === 'orders' ? '#181c2f' : '#eee', color: tab === 'orders' ? '#fff' : '#222', fontWeight: 'bold', cursor: 'pointer' }}>Manage Orders</button>
          <button onClick={() => setTab('listings')} style={{ padding: '10px 24px', borderRadius: 6, border: 'none', background: tab === 'listings' ? '#181c2f' : '#eee', color: tab === 'listings' ? '#fff' : '#222', fontWeight: 'bold', cursor: 'pointer' }}>Manage Listings</button>
        </div>
        {tab === 'users' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 16 }}>Manage Users</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {mockUsers.map(u => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', background: '#fafafa', borderRadius: 6, padding: 20, border: '1px solid #e0e0e0' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginRight: 20 }}> 
                    <span role="img" aria-label="user">👤</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: 18 }}>{u.name}</div>
                    <div style={{ color: '#666', fontSize: 15 }}>{u.email}</div>
                    <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 12px', borderRadius: 12, background: u.status === 'Active' ? '#181c2f' : '#bbb', color: '#fff', fontSize: 13 }}>{u.status}</span>
                  </div>
                  <button style={{ marginRight: 10, background: '#fff', border: '1px solid #181c2f', color: '#181c2f', borderRadius: 5, padding: '6px 16px', fontWeight: 'bold', cursor: 'pointer' }}>Edit</button>
                  <button style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 16px', fontWeight: 'bold', cursor: 'pointer' }}>Suspend</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'orders' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 16 }}>Manage Orders</h2>
            <div style={{ color: '#888', fontSize: 16 }}>No orders to display.</div>
          </div>
        )}
        {tab === 'listings' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 16 }}>Manage Listings</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {mockListings.map(l => (
                <div key={l.id} style={{ background: '#fafafa', borderRadius: 6, padding: 20, border: '1px solid #e0e0e0', marginBottom: 0 }}>
                  <div style={{ fontWeight: 'bold', fontSize: 18 }}>{l.title}</div>
                  <div style={{ color: '#666', fontSize: 15, marginBottom: 6 }}>{l.description}</div>
                  <div style={{ fontSize: 14, color: '#333', marginBottom: 8 }}>
                    <b>User:</b> {l.user} &nbsp; <b>Category:</b> {l.category}
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {l.status === 'Pending' && <span style={{ background: '#e1b800', color: '#fff', borderRadius: 12, padding: '2px 12px', fontSize: 13 }}>Pending</span>}
                    {l.status === 'Approved' && <span style={{ background: '#27ae60', color: '#fff', borderRadius: 12, padding: '2px 12px', fontSize: 13 }}>Approved</span>}
                    {l.status === 'Rejected' && <span style={{ background: '#e74c3c', color: '#fff', borderRadius: 12, padding: '2px 12px', fontSize: 13 }}>Rejected</span>}
                    <button style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 16px', fontWeight: 'bold', cursor: 'pointer' }}>Accept</button>
                    <button style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 16px', fontWeight: 'bold', cursor: 'pointer' }}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 