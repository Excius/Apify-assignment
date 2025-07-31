# ActorHub - Apify Actor Management Interface

A modern, full-stack web application for managing and running Apify actors with a beautiful user interface built with React and a Node.js backend.

![ActorHub Banner](https://via.placeholder.com/800x200/4F46E5/FFFFFF?text=ActorHub+-+Apify+Actor+Management)

## ✨ Features

- **🔐 API Key Authentication** - Secure login with Apify API key validation
- **🎭 Actor Management** - Browse and select from available Apify actors
- **📝 Dynamic Forms** - Auto-generated forms based on actor input schemas
- **⚡ Real-time Monitoring** - Live status updates for running actors
- **📊 Results Display** - Beautiful JSON visualization of actor outputs
- **🎨 Modern UI/UX** - Responsive design with gradient themes and animations
- **🔄 Auto-refresh** - Automatic polling for run status updates
- **❌ Error Handling** - Comprehensive error states and user feedback

## 🛠 Tech Stack

### Frontend

- **React 19** - Modern React with hooks and context
- **Vite** - Fast build tool and dev server
- **React Router Dom** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React JSON Schema Form (@rjsf/core)** - Dynamic form generation
- **Axios** - HTTP client for API requests

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Axios** - HTTP client for Apify API calls
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Apify API Key** - Get one from [Apify Console](https://console.apify.com/account#/integrations)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd assignment
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=3000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## 🏃‍♂️ Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3000`

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### Production Build

To build the frontend for production:

```bash
cd frontend
npm run build
npm run preview
```

## 📁 Project Structure

```
assignment/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── actorController.js    # Actor-related API logic
│   │   │   └── authController.js     # Authentication logic
│   │   ├── middleware/
│   │   │   └── index.js              # CORS and middleware setup
│   │   ├── routes/
│   │   │   ├── actorRoutes.js        # Actor endpoints
│   │   │   └── authRoutes.js         # Auth endpoints
│   │   ├── utils/
│   │   │   └── axios.js              # Axios configuration
│   │   └── index.js                  # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navigation.jsx        # Navigation bar component
│   │   ├── context/
│   │   │   └── ApiContext.jsx        # API key context management
│   │   ├── pages/
│   │   │   ├── Home.jsx              # API key input page
│   │   │   ├── Actors.jsx            # Actor selection page
│   │   │   ├── ActorForm.jsx         # Actor run configuration
│   │   │   └── RunStatus.jsx         # Run monitoring page
│   │   ├── utils/
│   │   │   └── axios.js              # Axios configuration
│   │   ├── App.css                   # Custom form styles
│   │   ├── App.jsx                   # Main app component
│   │   └── main.jsx                  # React entry point
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `GET /api/auth/validate-key` - Validate Apify API key

### Actors

- `GET /api/actors` - List available actors
- `GET /api/actors/:id/schema` - Get actor input schema
- `POST /api/actors/:id/run` - Start actor run

## 🎭 Testing Actor

For testing purposes, I recommend using one of these popular Apify actors:

### **Web Scraper** (`apify/web-scraper`)

- **Purpose**: Scrapes data from websites using CSS selectors
- **Test URL**: `https://www.apify.com/`
- **Why chosen**: Simple to configure, reliable results, good for demonstration

### **Google Search Results Scraper** (`apify/google-search-scraper`)

- **Purpose**: Extracts Google search results
- **Test Query**: "web scraping"
- **Why chosen**: Fast execution, structured data output

### **Social Media Scraper** (Various)

- Great for demonstrating different input schemas
- Shows variety in actor capabilities

## 🏗 Design Choices & Assumptions

### Frontend Architecture

1. **Context API for State Management**

   - Used React Context for API key management
   - Centralized authentication state across components
   - Simple and effective for this application size

2. **React JSON Schema Form Integration**

   - Dynamic form generation from actor schemas
   - Custom styling to match design system
   - Handles various input types automatically

3. **Direct API Integration**
   - Frontend makes direct calls to Apify API for real-time data
   - Backend serves as a proxy for initial validation
   - Reduces latency for status polling

### Backend Architecture

1. **Express.js with Modular Structure**

   - Controllers, routes, and middleware separation
   - Easy to maintain and extend
   - RESTful API design

2. **Proxy Pattern**
   - Backend acts as a secure proxy to Apify API
   - Handles authentication validation
   - Could be extended for rate limiting, caching

### UI/UX Design

1. **Gradient Theme**

   - Blue to purple gradients for modern look
   - Consistent color scheme across all components
   - Professional and trustworthy appearance

2. **Loading States**

   - Skeleton loading for better perceived performance
   - Animated spinners for real-time feedback
   - Clear progress indicators

3. **Error Handling**
   - Comprehensive error states
   - User-friendly error messages
   - Graceful degradation

### Assumptions Made

1. **API Key Security**

   - API keys stored in browser memory only
   - No persistent storage for security
   - Users need to re-enter on refresh

2. **Actor Compatibility**

   - Assumes actors follow standard Apify schema format
   - Transforms non-standard properties (prefill, editor)
   - Handles missing or invalid schemas gracefully

3. **Polling Strategy**
   - 5-second intervals for status updates
   - Direct Apify API calls for real-time data
   - Automatic cleanup on component unmount

## 👥 User Flow

### 1. **Authentication Flow**

```
Home Page → Enter API Key → Validation → Redirect to Actors
```

### 2. **Actor Selection Flow**

```
Actors Page → Browse Available Actors → Click to Select → Configure Actor
```

### 3. **Actor Execution Flow**

```
Actor Form → Fill Parameters → Submit → Redirect to Run Status
```

### 4. **Monitoring Flow**

```
Run Status → Real-time Polling → View Results → Success/Error State
```

## 🎯 Key Features Demonstrated

1. **Real-time Data Flow**

   - API key validation
   - Actor schema fetching
   - Live run monitoring
   - Results retrieval

2. **Dynamic UI Generation**

   - Forms generated from JSON schemas
   - Responsive design patterns
   - Loading and error states

3. **Professional UX**
   - Smooth animations and transitions
   - Intuitive navigation flow
   - Clear visual feedback

## 🔧 Development Notes

### Running in Development

1. **Backend Hot Reload**: Uses `nodemon` for automatic restarts
2. **Frontend Hot Reload**: Vite provides instant updates
3. **CORS Configuration**: Properly configured for development

### Production Considerations

1. **Environment Variables**: Configure for production environment
2. **Build Optimization**: Vite provides optimized production builds
3. **Security**: Consider implementing rate limiting and request validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

---

**Built with ❤️ using React, Node.js, and the Apify Platform**
