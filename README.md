## Setup

### Quick Start

**Option 1: With Torrent Support (Recommended)**
```bash
# Windows
start-with-torrents.bat

# Linux/Mac
chmod +x start-with-torrents.sh
./start-with-torrents.sh
```

**Option 2: Manual Setup**
1. Copy `.env.local.example` to `.env.local` and set `TMDB_API_KEY` and `NEXT_PUBLIC_BASE_URL`.
2. Install dependencies: `npm install`.
3. Start backend: `npm run torrent:start` (in separate terminal)
4. Start frontend: `npm run dev`.

Notes:
- Requires Node.js 18+.
- Images are served from TMDB and placeholder domains configured in `next.config.mjs`.
- Torrent functionality requires backend server on port 3001.

### Environment

Create `.env.local` in the project root:

```
TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For production, update the base URL to your domain.

### 🚀 Deploy to Render.com

1. **Connect Repository**
   - Go to [Render.com](https://render.com) and create a new Web Service
   - Connect your GitHub repository
   - Set service name: `nushcenume-movies`

2. **Configure Build**
   - **Runtime:** Node.js
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Port:** `10000` (Render will auto-detect)

3. **Environment Variables**
   Add these in Render dashboard:
   ```
   NODE_ENV=production
   TMDB_API_KEY=your_tmdb_api_key_here
   NEXT_PUBLIC_WEBTORRENT_BACKEND_URL=https://your-backend-url
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your app will be available at `https://your-app-name.onrender.com`

**Note:** If using torrent features, deploy the backend separately or use the start scripts for local development.

## 🚀 Phase 1 Features Implemented

NushCeNume now includes these production-ready features:

### ✅ Image Optimization
- Next.js Image component throughout
- Responsive sizing and lazy loading
- Optimized quality settings

### ✅ Enhanced Error Handling
- Error boundary for React errors
- Loading spinners and states
- Retry functionality
- Offline page

### ✅ Mobile Optimizations
- Touch-friendly targets (44x44px)
- No input zoom issues
- Smooth scrolling
- Touch feedback

### ✅ SEO Optimization
- Comprehensive meta tags
- Open Graph & Twitter Cards
- Dynamic sitemap (`/sitemap.xml`)
- Robots.txt configuration
- Schema.org structured data

### ✅ PWA Features
- Install to home screen
- Offline support
- Service worker caching
- Web app manifest
- App shortcuts

### ✅ Torrent Integration
- Real torrent search via torrent-search-api
- Multiple providers (1337x, ThePirateBay, Rarbg)
- WebTorrent streaming backend
- Direct in-browser streaming
- Quality filtering (4K, 1080p, 720p, 480p)
- Seeder/leecher information

## 📚 Documentation

- **[TORRENT_SEARCH_SETUP.md](TORRENT_SEARCH_SETUP.md)** - Torrent integration setup & usage
- **[PHASE_1_SUMMARY.md](PHASE_1_SUMMARY.md)** - Quick overview of improvements
- **[PHASE_1_IMPLEMENTATION.md](PHASE_1_IMPLEMENTATION.md)** - Detailed implementation guide
- **[QUICK_SETUP_GUIDE.md](QUICK_SETUP_GUIDE.md)** - 5-minute setup guide
- **[IMPROVEMENT_SUGGESTIONS.md](IMPROVEMENT_SUGGESTIONS.md)** - Full roadmap

## 🧪 Testing PWA Features

PWA features require production mode:

```bash
npm run build
npm start
```

Then test:
- Install prompt in Chrome/Edge
- Offline mode (DevTools > Network > Offline)
- Home screen installation
- Service worker caching

**Important:** Create PWA icons before deploying! See `public/icons/README.md`

## 🎬 Torrent Streaming

This app includes a WebTorrent backend for direct in-browser streaming:

### Features
- **Real Torrent Search**: Search across multiple providers (1337x, ThePirateBay, Rarbg)
- **Direct Streaming**: Stream torrents directly in the browser
- **Quality Options**: Filter by 4K, 1080p, 720p, 480p
- **Peer Info**: View seeders, leechers, and file sizes
- **Multiple Providers**: Fallback to ensure results

### Starting the Backend

```bash
# Install backend dependencies
npm run torrent:install

# Start backend (port 3001)
npm run torrent:start
```

### Architecture
```
Frontend (Next.js, port 3000)
    ↓
Backend (WebTorrent, port 3001)
    ↓
torrent-search-api (Multiple Providers)
    ↓
BitTorrent Network
```

### Environment Variables

**Backend** (`backend webtorrent/.env`):
```bash
PORT=3001
MAX_CONNECTIONS=55
DOWNLOAD_LIMIT=0  # KB/s, 0 = unlimited
UPLOAD_LIMIT=0    # KB/s, 0 = unlimited
CLEANUP_INTERVAL_HOURS=24
```

**Frontend** (`.env.local`):
```bash
NEXT_PUBLIC_WEBTORRENT_BACKEND_URL=http://localhost:3001
```

See **[TORRENT_SEARCH_SETUP.md](TORRENT_SEARCH_SETUP.md)** for complete setup guide.