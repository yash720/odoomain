import { ClothingItem, SwapRequest, Notification } from '../types';

export const mockItems: ClothingItem[] = [
  {
    id: '1',
    title: 'Vintage Denim Jacket',
    description: 'Classic blue denim jacket from the 90s. Perfect condition with minimal wear. Great for layering and adds a vintage touch to any outfit. Made from 100% cotton denim with authentic vintage wash.',
    images: [
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'outerwear',
    type: 'jacket',
    size: 'M',
    condition: 'good',
    tags: ['vintage', 'denim', 'casual', '90s'],
    uploaderId: '2',
    uploaderName: 'Sarah Johnson',
    pointValue: 45,
    isAvailable: true,
    isFeatured: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    status: 'approved',
    views: 156,
    likes: 23,
    brand: 'Levi\'s',
    originalPrice: 89
  },
  {
    id: '2',
    title: 'Elegant Black Dress',
    description: 'Sophisticated little black dress perfect for evening events. Made from high-quality fabric with a flattering A-line silhouette. Features a subtle shimmer that catches the light beautifully.',
    images: [
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'dresses',
    type: 'evening',
    size: 'S',
    condition: 'like-new',
    tags: ['elegant', 'formal', 'black', 'evening'],
    uploaderId: '3',
    uploaderName: 'Emma Wilson',
    pointValue: 60,
    isAvailable: true,
    isFeatured: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    status: 'approved',
    views: 89,
    likes: 15,
    brand: 'Zara',
    originalPrice: 120
  },
  {
    id: '3',
    title: 'Cozy Wool Sweater',
    description: 'Hand-knitted wool sweater in cream color. Super soft and warm, perfect for cold weather. Unique cable knit pattern adds texture and style.',
    images: [
      'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'tops',
    type: 'sweater',
    size: 'L',
    condition: 'good',
    tags: ['wool', 'cozy', 'winter', 'handmade'],
    uploaderId: '4',
    uploaderName: 'Michael Chen',
    pointValue: 35,
    isAvailable: true,
    isFeatured: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    status: 'approved',
    views: 67,
    likes: 8,
    brand: 'H&M',
    originalPrice: 45
  },
  {
    id: '4',
    title: 'Designer Silk Scarf',
    description: 'Luxurious silk scarf with beautiful floral pattern. Can be worn as an accessory or head wrap. Adds elegance to any outfit.',
    images: [
      'https://images.pexels.com/photos/6463348/pexels-photo-6463348.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'accessories',
    type: 'scarf',
    size: 'one-size',
    condition: 'new',
    tags: ['silk', 'luxury', 'floral', 'accessory'],
    uploaderId: '2',
    uploaderName: 'Sarah Johnson',
    pointValue: 25,
    isAvailable: true,
    isFeatured: true,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    status: 'approved',
    views: 134,
    likes: 19,
    brand: 'Hermès',
    originalPrice: 350
  },
  {
    id: '5',
    title: 'Casual Blue Jeans',
    description: 'Comfortable straight-leg jeans in classic blue wash. Great for everyday wear with a relaxed fit.',
    images: [
      'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'bottoms',
    type: 'jeans',
    size: '32',
    condition: 'good',
    tags: ['casual', 'denim', 'everyday', 'comfortable'],
    uploaderId: '5',
    uploaderName: 'Alex Rodriguez',
    pointValue: 30,
    isAvailable: true,
    isFeatured: false,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    status: 'approved',
    views: 45,
    likes: 6,
    brand: 'Gap',
    originalPrice: 60
  },
  {
    id: '6',
    title: 'Athletic Running Shoes',
    description: 'High-performance running shoes with excellent cushioning. Barely used, perfect for fitness enthusiasts.',
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'shoes',
    type: 'athletic',
    size: '9',
    condition: 'like-new',
    tags: ['athletic', 'running', 'sports', 'comfortable'],
    uploaderId: '6',
    uploaderName: 'Jessica Lee',
    pointValue: 55,
    isAvailable: true,
    isFeatured: false,
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28'),
    status: 'approved',
    views: 78,
    likes: 12,
    brand: 'Nike',
    originalPrice: 130
  },
  {
    id: '7',
    title: 'Pending Review Item',
    description: 'This item is currently under review by our moderation team.',
    images: [
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'tops',
    type: 'shirt',
    size: 'M',
    condition: 'good',
    tags: ['pending', 'review'],
    uploaderId: '2',
    uploaderName: 'Sarah Johnson',
    pointValue: 20,
    isAvailable: false,
    isFeatured: false,
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30'),
    status: 'pending',
    views: 0,
    likes: 0,
    brand: 'Uniqlo',
    originalPrice: 25
  }
];

export const mockSwapRequests: SwapRequest[] = [
  {
    id: '1',
    requesterId: '3',
    requesterName: 'Emma Wilson',
    itemId: '1',
    itemTitle: 'Vintage Denim Jacket',
    itemImage: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
    offeredItemId: '2',
    offeredItemTitle: 'Elegant Black Dress',
    offeredItemImage: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'pending',
    message: 'Hi! I love your vintage denim jacket. Would you be interested in swapping for my black dress?',
    createdAt: new Date('2024-01-29'),
    updatedAt: new Date('2024-01-29'),
    type: 'swap'
  },
  {
    id: '2',
    requesterId: '4',
    requesterName: 'Michael Chen',
    itemId: '4',
    itemTitle: 'Designer Silk Scarf',
    itemImage: 'https://images.pexels.com/photos/6463348/pexels-photo-6463348.jpeg?auto=compress&cs=tinysrgb&w=800',
    pointsOffered: 25,
    status: 'accepted',
    message: 'I\'d like to redeem this scarf with my points.',
    responseMessage: 'Great! I\'ll arrange the exchange.',
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-29'),
    type: 'points'
  },
  {
    id: '3',
    requesterId: '2',
    requesterName: 'Sarah Johnson',
    itemId: '6',
    itemTitle: 'Athletic Running Shoes',
    itemImage: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
    offeredItemId: '1',
    offeredItemTitle: 'Vintage Denim Jacket',
    offeredItemImage: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'completed',
    message: 'Would you like to swap your running shoes for my denim jacket?',
    responseMessage: 'Perfect! Let\'s do it.',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25'),
    type: 'swap'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '2',
    type: 'swap_request',
    title: 'New Swap Request',
    message: 'Emma Wilson wants to swap for your Vintage Denim Jacket',
    isRead: false,
    createdAt: new Date('2024-01-29'),
    relatedId: '1'
  },
  {
    id: '2',
    userId: '2',
    type: 'item_approved',
    title: 'Item Approved',
    message: 'Your Designer Silk Scarf has been approved and is now live!',
    isRead: true,
    createdAt: new Date('2024-01-22'),
    relatedId: '4'
  },
  {
    id: '3',
    userId: '2',
    type: 'points_earned',
    title: 'Points Earned',
    message: 'You earned 45 points from your completed swap!',
    isRead: true,
    createdAt: new Date('2024-01-25'),
  }
];