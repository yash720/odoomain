# ReWear - Clothing Swap Platform

A full-stack application for swapping clothing items with a points-based system.


Deployement link-odoofrontend.vercel.app,https://odoobackend-fdgh.onrender.com

## Project Structure

```
rewear-main/
├── backend/          # Node.js/Express backend
├── frontend/         # React/TypeScript frontend
├── render.yaml       # Render deployment configuration
├── package.json      # Root package.json for deployment
└── README.md         # This file
```

## Backend Deployment (Render)

### 1. Environment Variables

Set these environment variables in your Render dashboard:

- `NODE_ENV`: `production`
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT tokens
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

### 2. Deploy to Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use the following settings:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (uses root)

### 3. CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (development)
- Your frontend domain (set in production)

## Frontend Deployment

### 1. Environment Configuration

Update `frontend/.env.production` with your backend URL:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### 2. Build and Deploy

```bash
cd frontend
npm install
npm run build
```

Deploy the `dist` folder to your preferred hosting platform:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

## Local Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Items
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get specific item
- `POST /api/items` - Create new item
- `GET /api/items/pending` - Get pending items (admin)
- `PUT /api/items/:id/approve` - Approve item (admin)
- `PUT /api/items/:id/reject` - Reject item (admin)
- `DELETE /api/items/:id` - Delete item (admin)

### Swaps
- `POST /api/swaps/request` - Request swap
- `PUT /api/swaps/:id/accept` - Accept swap
- `PUT /api/swaps/:id/reject` - Reject swap

## Features

- User authentication with JWT
- Role-based access (user/admin)
- Image upload with Cloudinary
- Points-based item valuation
- Admin panel for item moderation
- Real-time item browsing and filtering
- Swap request system
- Responsive design with Tailwind CSS

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage
- Multer for file uploads
- Express-validator for validation

### Frontend
- React 18
- TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls

## Troubleshooting

### Common Issues

1. **Render Deployment Error**: Ensure you're using the correct build and start commands
2. **CORS Errors**: Check that your backend allows requests from your frontend domain
3. **Environment Variables**: Verify all required environment variables are set in Render
4. **MongoDB Connection**: Ensure your MongoDB URI is correct and accessible

### Debug Mode

To enable debug logging in the frontend:
```javascript
localStorage.setItem('debug', 'true');
```
