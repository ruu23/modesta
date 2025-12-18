# MODESTA Backend API

Backend server for MODESTA AI Styling Platform built with Node.js, Express, TypeScript, and MongoDB.

## Features

- 🔐 JWT Authentication
- 🤖 AI-Powered Styling Recommendations
- 📦 Product Management
- 👤 User Profiles & Preferences
- 🎨 Modest Fashion Focus
- 🔒 Secure & Scalable

## Installation

\\\ash
# Install dependencies
npm install

# Setup environment variables
# Copy .env file and add your keys

# Run development server
npm run dev
\\\

## API Endpoints

### Authentication
- POST /api/auth/register - Register user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get product by ID
- POST /api/products - Create product (Admin)
- PUT /api/products/:id - Update product (Admin)
- DELETE /api/products/:id - Delete product (Admin)

### AI Styling
- POST /api/ai/styling-recommendations - Get AI recommendations

### Users
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB/Mongoose
- JWT Authentication
- Claude AI (Anthropic)

## License

MIT
