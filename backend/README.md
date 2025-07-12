# ReWear Backend API

A Node.js/Express backend API for the ReWear application with MongoDB database, JWT authentication, and comprehensive user and item management.

## Features

- 🔐 **JWT Authentication & Authorization**
- 👥 **User Management** (Regular users & Admin users)
- 👕 **Clothing Item Management** with approval system
- 🛡️ **Security Features** (Rate limiting, CORS, Helmet)
- 📊 **MongoDB Database** with Mongoose ODM
- ✅ **Input Validation** with express-validator
- 🔄 **RESTful API** design

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env` (if exists)
   - Update the MongoDB connection string in `.env`:
   ```
   MONGODB_URI=mongodb+srv://rewear:rewear@cluster0.foqvvqe.mongodb.net/rewear?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Initialize Database**
   ```bash
   node scripts/initDb.js
   ```
   This creates the initial admin and test users.

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update user profile | Private |
| PUT | `/api/auth/change-password` | Change password | Private |
| GET | `/api/auth/users` | Get all users | Admin |
| PUT | `/api/auth/users/:id` | Update user by admin | Admin |
| DELETE | `/api/auth/users/:id` | Delete user by admin | Admin |

### Items

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/items` | Get all items with filters | Public |
| GET | `/api/items/featured` | Get featured items | Public |
| GET | `/api/items/:id` | Get single item | Public |
| POST | `/api/items` | Create new item | Private |
| PUT | `/api/items/:id` | Update item | Private |
| DELETE | `/api/items/:id` | Delete item | Private |
| GET | `/api/items/my-items` | Get user's items | Private |
| GET | `/api/items/pending` | Get pending items | Admin |
| PUT | `/api/items/:id/approve` | Approve item | Admin |
| PUT | `/api/items/:id/reject` | Reject item | Admin |

## Database Models

### User Model
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  name: String (required),
  avatar: String,
  points: Number (default: 100),
  isAdmin: Boolean (default: false),
  location: String,
  bio: String,
  totalSwaps: Number (default: 0),
  rating: Number (default: 5.0),
  isVerified: Boolean (default: false),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### ClothingItem Model
```javascript
{
  title: String (required),
  description: String (required),
  images: [String] (required),
  category: String (required),
  type: String (required),
  size: String (required),
  condition: String (required),
  tags: [String],
  uploaderId: ObjectId (ref: User),
  uploaderName: String (required),
  uploaderAvatar: String,
  pointValue: Number (required),
  isAvailable: Boolean (default: true),
  isFeatured: Boolean (default: false),
  status: String (enum: ['pending', 'approved', 'rejected']),
  views: Number (default: 0),
  likes: Number (default: 0),
  brand: String,
  originalPrice: Number,
  approvedBy: ObjectId (ref: User),
  approvedAt: Date,
  rejectionReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication

### JWT Token Format
```
Authorization: Bearer <token>
```

### Token Payload
```javascript
{
  id: "user_id",
  email: "user@example.com",
  isAdmin: false,
  iat: 1234567890,
  exp: 1234567890
}
```

## Default Users

After running the initialization script, these users are created:

### Admin User
- **Email**: admin@rewear.com
- **Password**: admin123456
- **Role**: Admin
- **Points**: 1000

### Test User
- **Email**: user@rewear.com
- **Password**: user123456
- **Role**: Regular User
- **Points**: 250

## Environment Variables

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://rewear:rewear@cluster0.foqvvqe.mongodb.net/rewear?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevents abuse
- **CORS Protection**: Configured for frontend
- **Input Validation**: All inputs validated
- **Helmet**: Security headers
- **Error Handling**: Comprehensive error management

## Development

### Scripts
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests (if configured)
```

### File Structure
```
backend/
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   └── itemController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   └── ClothingItem.js
├── routes/
│   ├── auth.js
│   └── items.js
├── scripts/
│   └── initDb.js
├── .env
├── package.json
├── server.js
└── README.md
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if any)
  ]
}
```

## Testing the API

### Health Check
```bash
curl http://localhost:5000/health
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@rewear.com",
    "password": "admin123456"
  }'
```

## Frontend Integration

The frontend should be configured to:
1. Send requests to `http://localhost:5000/api`
2. Include JWT token in Authorization header
3. Handle API responses and errors appropriately

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT_SECRET
3. Configure proper CORS origins
4. Set up MongoDB Atlas production cluster
5. Use environment variables for all sensitive data
6. Set up proper logging and monitoring

## License

MIT License 